import { GoogleGenerativeAI } from "@google/generative-ai";
import { buddyBotPrompt } from "../config/botPrompt.js"; // 🚀 Import your external prompt

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const handleChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: buddyBotPrompt // 🚀 Plug the imported prompt into the AI
        });

        const result = await model.generateContent(message);
        const responseText = result.response.text();

        res.status(200).json({ reply: responseText });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to fetch response from bot" });
    }
};