// Vercel serverless proxy for the Fermi Market Making static frontend.
//
// Required Vercel environment variables:
// - OPENAI_API_KEY: your OpenAI API key
// - OPENAI_MODEL: optional, defaults to gpt-4o-mini

const OPENAI_CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";

function buildPrompt(payload) {
  if (payload.action === "hint") {
    return {
      system: "You generate interview-practice hints for Fermi estimation. Never reveal the answer or true value. Return only JSON.",
      user: [
        "Create one concise decomposition hint for this Fermi question.",
        "Scenario: " + payload.scenario.title,
        "Question: " + payload.scenario.question,
        'Return JSON exactly like {"hint":"..."}'
      ].join("\n")
    };
  }

  return {
    system: [
      "You generate Fermi-estimation practice content for quant trading interviews.",
      "Return only JSON. Keep the true value numeric and plausible.",
      "The justification should be one sentence and mention the basis of the estimate, not a URL."
    ].join(" "),
    user: [
      "Confirm or refine this scenario for a make-a-market game.",
      "Title: " + payload.scenario.title,
      "Draft question: " + payload.scenario.prompt,
      "Fallback true value: " + payload.scenario.fallback,
      "Fallback basis: " + payload.scenario.basis,
      'Return JSON exactly like {"question":"... Please make a confidence interval of 95%.","trueValue":123,"trueLower":100,"trueUpper":150,"justification":"..."}'
    ].join("\n")
  };
}

async function callOpenAI(payload) {
  const prompt = buildPrompt(payload);
  const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: payload.action === "hint" ? 0.5 : 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error("OpenAI request failed: " + response.status + " " + detail.slice(0, 300));
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  return JSON.parse(content);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST." });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({ error: "OPENAI_API_KEY is not configured." });
    return;
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!payload || !["scenario", "hint"].includes(payload.action)) {
      res.status(400).json({ error: "Invalid action." });
      return;
    }

    const result = await callOpenAI(payload);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || "Proxy error." });
  }
}
