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
    ${teacherName ? `Target teacher: ${teacherName}.` : ""}
    ${className ? `Target class: ${className}.` : ""}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are LatePass, a helpful and witty AI assistant that generates excuses for students. Your excuses should be realistic, natural, and sometimes slightly funny, but never harmful, offensive, or illegal.",
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

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }
  
  return JSON.parse(text);
}
