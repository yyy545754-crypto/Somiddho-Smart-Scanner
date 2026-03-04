
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeScannedContent(content: string, imageUrl?: string) {
  try {
    const prompt = `Analyze this content scanned from a QR code: "${content}". 
    Evaluate its safety and provide a helpful summary.
    If it's a URL, analyze its reputation, SSL status (if possible from URL), and potential risks.
    If it's text, summarize it.
    
    Return the response in JSON format with the following structure:
    {
      "summary": "A brief summary of the content",
      "trustScore": 0-100 (integer, 100 being most secure/trusted),
      "safetyPoints": ["Point 1", "Point 2", "Point 3"] (exactly 3 points)
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: imageUrl ? {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: imageUrl.split(',')[1] } },
          { text: prompt }
        ]
      } : prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            trustScore: { type: Type.INTEGER },
            safetyPoints: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["summary", "trustScore", "safetyPoints"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      summary: "Manual verification recommended. AI analysis unavailable.",
      trustScore: 50,
      safetyPoints: ["Analysis failed", "Check source manually", "Proceed with caution"]
    };
  }
}
