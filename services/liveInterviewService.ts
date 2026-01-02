
import { GoogleGenAI, Type } from "@google/genai";
import { LiveFeedbackReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_ID = "gemini-3-flash-preview";

export const generateLiveFeedback = async (
  resumeText: string,
  difficulty: string,
  transcript: { role: 'user' | 'model', text: string }[]
): Promise<LiveFeedbackReport> => {
  
  const conversationText = transcript.map(t => 
    `${t.role === 'user' ? 'CANDIDATE' : 'INTERVIEWER'}: ${t.text}`
  ).join('\n\n');

  const systemInstruction = `
    You are a Senior Technical Hiring Manager at a top tech company.
    Analyze the interview transcript deeply.
    Generate a structured, professional feedback report.
    Be strict on scoring. 7/10 is passing.
    Ensure the JSON matches the schema exactly.
  `;

  const prompt = `
    DIFFICULTY LEVEL: ${difficulty}
    RESUME CONTEXT (Snippet): ${resumeText.slice(0, 1000)}...
    
    TRANSCRIPT:
    ${conversationText}

    Generate a detailed JSON report.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: "0-100 score" },
            summary: { type: Type.STRING },
            hiringRecommendation: { type: Type.STRING, enum: ["YES", "NO", "MAYBE"] },
            categoryScores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: "e.g. Technical, Communication, Problem Solving" },
                  score: { type: Type.INTEGER, description: "0-100" }
                },
                required: ["category", "score"]
              }
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            transcriptAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  candidateResponseSummary: { type: Type.STRING },
                  evaluation: { type: Type.STRING, enum: ["STRONG", "ADEQUATE", "WEAK", "FAIL"] },
                  feedback: { type: Type.STRING },
                  improvementTip: { type: Type.STRING },
                  score: { type: Type.INTEGER, description: "0-10" }
                },
                required: ["question", "candidateResponseSummary", "evaluation", "feedback", "improvementTip", "score"]
              }
            },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING, description: "e.g. Immediate, Short Term" },
                  tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["phase", "tasks"]
              }
            }
          },
          required: ["overallScore", "summary", "hiringRecommendation", "categoryScores", "strengths", "weaknesses", "transcriptAnalysis", "roadmap"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as LiveFeedbackReport;

  } catch (error) {
    console.error("Error generating live feedback report:", error);
    throw new Error("Failed to generate feedback report.");
  }
};
