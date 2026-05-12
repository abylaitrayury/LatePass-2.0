import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ExcuseOutput {
  formal: string;
  casual: string;
  convincing: string;
  beliefPercentage: number;
}

export async function generateExcuses(
  situation: string,
  teacherName?: string,
  className?: string
): Promise<ExcuseOutput> {
  const prompt = `
    Generate three types of excuses for a student in the following situation: "${situation}".
    ${teacherName ? `The teacher's name is ${teacherName}.` : ""}
    ${className ? `The class name is ${className}.` : ""}

    Requirements:
    1. Formal: Professional, polite, suitable for an email to a professor.
    2. Casual: Friendly, using slang/emojis, suitable for a text or quick message.
    3. Convincing: Detailed, realistic, hard to disprove, yet honest-sounding.
    4. Belief Percentage: A random-sounding but plausible percentage (e.g., 78) of how likely a teacher is to believe this.

    Return the result in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          formal: { type: Type.STRING },
          casual: { type: Type.STRING },
          convincing: { type: Type.STRING },
          beliefPercentage: { type: Type.NUMBER },
        },
        required: ["formal", "casual", "convincing", "beliefPercentage"],
      },
    },
  });

  return JSON.parse(response.text);
}
