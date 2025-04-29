const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Default Gemini model
const MODEL_NAME = "gemini-1.5-pro";

// Function to generate content using Gemini AI
async function generateContent(prompt, options = {}) {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({
      model: options.model || MODEL_NAME,
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content with Gemini AI:", error);
    throw error;
  }
}

module.exports = {
  generateContent,
};
