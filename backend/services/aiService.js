import OpenAI from "openai";

const generateInsights = async (analytics) => {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
You are the AI insight engine for LifeOS.

Analyze the following user's aggregated life data:

${JSON.stringify(analytics, null, 2)}

Generate useful, evidence-based personal insights.

Rules:
- Do not claim to predict the future.
- Do not invent missing data.
- Use only the provided statistics.
- Keep recommendations practical.
- Do not provide medical diagnosis.
- Return valid JSON only.

Return an array:

[
  {
    "type": "health | study | habit | goal | productivity | general",
    "title": "Short title",
    "insight": "Evidence-based observation",
    "recommendation": "Practical recommendation",
    "evidence": ["supporting statistic"]
  }
]

Generate 3 to 5 useful insights.
`;

  const response = await client.responses.create({
  model: "gpt-5.6-luna",
  input: prompt,
});

  try {
    return JSON.parse(response.output_text);
  } catch {
    throw new Error("AI returned invalid JSON");
  }
};

export default generateInsights;