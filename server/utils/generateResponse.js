const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateResponse = async (messages) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages,
    });

    const responseString = response.text || "";
    return responseString;
  } catch (err) {
    if (err.status === 429) {
      // Extract retry delay from API error
      const waitSeconds =
        err.error?.details?.[2]?.retryDelay?.replace("s", "") || 20;
      console.log(`⏳ Rate limited. Waiting ${waitSeconds}s before retry...`);

      await new Promise((res) => setTimeout(res, waitSeconds * 1000));

      return await generateResponse(messages); // retry again
    }

    throw err;
  }
};

module.exports = generateResponse;
