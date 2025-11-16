import { GoogleGenAI } from "@google/genai";
const apikey = import.meta.env.VITE_API_KEY;

const ai = new GoogleGenAI({apiKey:apikey});

const generateResponse = async (message:string[]):Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: message,
  });

  console.log(response.text);
  const reponseString = response.text || 'Failed to response!';

  return reponseString;
}

export default generateResponse;