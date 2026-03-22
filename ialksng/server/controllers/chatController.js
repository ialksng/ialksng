import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const handleChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // You can use "gpt-4" if you have access
            messages: [
                { role: "system", content: "You are a helpful assistant for Alok Singh's portfolio and product website. Answer questions politely and concisely." },
                { role: "user", content: message }
            ],
        });

        res.status(200).json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI API Error:", error);
        res.status(500).json({ error: "Failed to fetch response from bot" });
    }
};