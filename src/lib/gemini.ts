import { GoogleGenAI, Type } from "@google/genai";
import { SoilData, AnalysisResult } from "@/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function extractSoilDataFromImage(base64Image: string): Promise<Partial<SoilData>> {
  const prompt = `
    You are an expert soil scientist and OCR specialist. Analyze this image of a soil test report, digital certificate, or a color-coded soil test strip.
    Your goal is to extract soil health parameters for agricultural analysis.

    Look for these specific fields and their variations:
    1. pH: The acidity/alkalinity level (typically 0-14).
    2. Nitrogen (N): Look for "Nitrogen", "N", "Nitrate", or "Available Nitrogen".
    3. Phosphorus (P): Look for "Phosphorus", "P", "Phosphate", or "Available P2O5".
    4. Potassium (K): Look for "Potassium", "K", "Potash", or "Available K2O".
    5. Moisture: Look for "Moisture content", "Water content (%)", or "Soil Humidity".

    Rules for Extraction:
    - Extract numerical values if clearly visible.
    - If values are provided as qualitative terms (e.g., "Low", "Medium", "High"), map them to these numerical defaults:
      - Nitrogen: Low=140, Medium=420, High=700 mg/kg
      - Phosphorus: Low=5, Medium=17, High=30 mg/kg
      - Potassium: Low=50, Medium=190, High=350 mg/kg
    - If the image is a soil test strip, compare the colors to standard soil testing color charts and estimate the closest numerical value.
    - If the unit is different (e.g. lbs/acre), convert it to mg/kg (approx 1 lb/acre = 1.12 mg/kg).
    - Return ONLY the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: "image/jpeg"
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ph: { type: Type.NUMBER, description: "Soil pH level (0-14)" },
            n: { type: Type.NUMBER, description: "Nitrogen content in mg/kg" },
            p: { type: Type.NUMBER, description: "Phosphorus content in mg/kg" },
            k: { type: Type.NUMBER, description: "Potassium content in mg/kg" },
            moisture: { type: Type.NUMBER, description: "Moisture content percentage" }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return {};
    return JSON.parse(text);
  } catch (error) {
    console.error("Image Extraction Error:", error);
    throw error;
  }
}

export async function analyzeSoil(data: SoilData): Promise<AnalysisResult> {
  const prompt = `
    You are an expert agronomist specializing in Indian agriculture and ICAR (Indian Council of Agricultural Research) guidelines.
    Analyze the following soil data for a smallholder farmer and provide crop recommendations, fertilizer schedules, and soil correction steps.
    
    Soil Data:
    - pH: ${data.ph} (Target: 6.0-7.5 for most crops)
    - Nitrogen (N): ${data.n} mg/kg (Low: <280, Medium: 280-560, High: >560)
    - Phosphorus (P): ${data.p} mg/kg (Low: <10, Medium: 10-25, High: >25)
    - Potassium (K): ${data.k} mg/kg (Low: <108, Medium: 108-280, High: >280)
    - Moisture: ${data.moisture}%
    - Location: ${data.location}
    - Season: ${data.season}
    - Water Availability: ${data.waterAvailability}
    - Preferred Crop: ${data.preferredCrop || "None"}
    
    The response must be in ${data.language}.
    
    Provide the output in JSON format matching the following schema:
    {
      "recommendations": [
        { "name": "string", "suitabilityScore": number (0-100), "reason": "string" }
      ],
      "fertilizerSchedule": [
        { "type": "string", "dosage": "string", "timing": "string" }
      ],
      "soilCorrections": [
        { "action": "string", "details": "string" }
      ],
      "advisory": "A simple, encouraging summary in plain language for the farmer."
    }
    
    Requirements:
    1. Provide exactly 3 crop recommendations.
    2. Fertilizer dosage should be specific (e.g., "50kg Urea per acre").
    3. Soil corrections should address pH imbalances or nutrient deficiencies.
    4. The advisory should be practical and easy to follow for a smallholder farmer.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  suitabilityScore: { type: Type.NUMBER },
                  reason: { type: Type.STRING }
                },
                required: ["name", "suitabilityScore", "reason"]
              }
            },
            fertilizerSchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  dosage: { type: Type.STRING },
                  timing: { type: Type.STRING }
                },
                required: ["type", "dosage", "timing"]
              }
            },
            soilCorrections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  action: { type: Type.STRING },
                  details: { type: Type.STRING }
                },
                required: ["action", "details"]
              }
            },
            advisory: { type: Type.STRING }
          },
          required: ["recommendations", "fertilizerSchedule", "soilCorrections", "advisory"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}

export async function chatWithAI(message: string, history: { role: 'user' | 'model', parts: string }[] = []): Promise<string> {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are AgriBot, a friendly and knowledgeable agricultural assistant. You help farmers with questions about soil health, crop management, fertilizers, and general farming practices in India. Keep your answers concise, practical, and encouraging. If asked about something non-agricultural, politely steer the conversation back to farming."
      },
      history: history.map(h => ({ 
        role: h.role, 
        parts: [{ text: h.parts }] 
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
}
