import {
  extractionSchema,
  type ExtractionResult,
} from "../validators/extraction.validator";
import groq from "./llm/groq";

export const extractDecisions = async (
  transcript: string,
): Promise<ExtractionResult["decisions"]> => {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content: `You are a decision extraction system.
Analyze the provided meeting transcript and extract only decisions that are explicitly stated or clearly agreed upon.
Return ONLY valid JSON.
The JSON must have this structure:
{
  "decisions": [
    {
      "title": "short decision title",
      "description": "clear description of the decision",
      "owner": "person responsible, if explicitly mentioned",
      "dueDate": "deadline, if explicitly mentioned",
      "confidence": 0.0
    }
  ]
}

Rules:
- Do not invent decisions.
- Do not infer decisions that were not explicitly agreed upon.
- Extract each distinct decision separately.
- Keep title concise.
- Keep description faithful to the transcript.
- Include owner only when the transcript identifies one.
- Include dueDate only when the transcript identifies one.
- confidence must be a number between 0 and 1.
- If there are no decisions, return {"decisions": []}.
- Return JSON only. Do not include markdown or explanations.
- dueDate must always be in YYYY-MM-DD format.
- Do not return natural-language dates such as "November 8th".
- If the transcript does not provide enough information to determine the exact date, return null.
- Never invent a year.
- Do not extract discussions, proposals, suggestions, evaluations, reviews, or action items that are intended to happen before a final decision.
- If participants agree to review, evaluate, investigate, or discuss something before deciding, do not extract that as a decision.
- A decision must represent a final or clearly agreed outcome, not an agreement to consider something later.
- If the transcript explicitly states that no decision has been made, do not extract a decision for that topic.`,
      },
      {
        role: "user",
        content: transcript,
      },
    ],
    response_format: {
      type: "json_object",
    },
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Groq returned an empty response");
  }

  let extracted: unknown;
  try {
    extracted = JSON.parse(content);
  } catch {
    throw new Error("Groq returned invalid JSON");
  }

  const validation = extractionSchema.safeParse(extracted);
  if (!validation.success) {
    console.error("Invalid extraction result:", validation.error.issues);
    throw new Error("Invalid extraction result");
  }

  return validation.data.decisions;
};
