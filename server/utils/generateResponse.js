const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate AI response via Gemini API with retries
 * @param {string[]} messages
 * @param {number} retriesLeft
 * @returns {Promise<string>}
 */
const generateResponse = async (messages, retriesLeft = 3) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages,
    });

    // Extract the actual text content from Gemini response
    let responseText = null;
    if (
      response.candidates &&
      response.candidates[0] &&
      response.candidates[0].content &&
      response.candidates[0].content.parts &&
      response.candidates[0].content.parts[0]
    ) {
      responseText =
        response.candidates[0].content.parts[0].text || responseText;
    } else {
      throw new Error("No response found!");
    }

    return JSON.stringify({
      success: true,
      message: responseText,
    });
  } catch (error) {
    const status = error?.response?.status;
    const code = error?.response?.data?.error?.code || "UNKNOWN";
    const message =
      error?.response?.data?.error?.message ||
      error?.message ||
      "Something went wrong! Try again.";

    const retryableStatus = [429, 500, 503];
    const retryableCodes = [
      "RESOURCE_EXHAUSTED",
      "UNAVAILABLE",
      "INTERNAL",
      "DEADLINE_EXCEEDED",
    ];

    if (
      (retryableStatus.includes(status) || retryableCodes.includes(code)) &&
      retriesLeft > 0
    ) {
      await new Promise((res) => setTimeout(res, 1000 * (4 - retriesLeft)));
      return generateResponse(messages, retriesLeft - 1);
    }

    console.log("Error message: ", message);
    // Return error in consistent structure
    return JSON.stringify({
      success: false,
      error: message,
    });
  }
};

module.exports = generateResponse;
