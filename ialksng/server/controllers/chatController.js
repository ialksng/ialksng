import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client using your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const handleChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Initialize the Gemini 1.5 Flash model (extremely fast and free)
        // We also pass the system instructions here so it knows its role
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "You are a helpful assistant for Alok Singh's portfolio and product website. Answer questions politely and concisely."
        });

        // Call the Gemini API
        const result = await model.generateContent(message);
        const responseText = result.response.text();

        res.status(200).json({ reply: responseText });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to fetch response from bot" });
    }
};