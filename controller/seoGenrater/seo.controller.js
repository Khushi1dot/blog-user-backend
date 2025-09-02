const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);

class SeoController {
  static async generateSEOSuggestions(req, res) {
    const { content } = req.body;
    if (!content)
      return res.status(400).json({ error: "No content provided." });

    const prompt = `
You are an SEO assistant. Based on the blog content below, generate:
1. A smart, catchy, SEO-optimized title.
2. A list of 5-7 relevant SEO tags.

Content:
${content}

Format:
Title: <title>
Tags: <comma-separated-tags>
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const output =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const titleMatch = output.match(/Title:\s*(.*)/);
    const tagsMatch = output.match(/Tags:\s*(.*)/);

    res.json({
      title: titleMatch ? titleMatch[1].trim() : "",
      tags: tagsMatch ? tagsMatch[1].split(",").map((t) => t.trim()) : [],
    });
  }

  static async generateBlog(req, res) {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Write a short blog post (150-200 words) on: "${topic}"`;

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const blogText =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    res.json({ blog: blogText });
  }
}

module.exports = SeoController;
