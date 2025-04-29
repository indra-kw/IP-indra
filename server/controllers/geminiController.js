const { generateContent } = require("../helpers/gemini");

class GeminiController {
  static async generateAIContent(req, res, next) {
    try {
      const { prompt, model } = req.body;

      if (!prompt) {
        throw { name: "BadRequest", message: "Prompt is required" };
      }

      const response = await generateContent(prompt, { model });

      const { question } = req.query;
      res.status(200).json({
        message: `Aplikasi saya sebuah aplikasi tentang mobile legend,
      tolong response pertanyaan atau statement berikut: ${question}.
      jika pertanyaan atau statement diluar konteks mobile legend,
      jawab dengan "saya hanya bisa menjawab seputar mobile legend".
      Sertakan link referensi dari jawaban.`,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GeminiController;
