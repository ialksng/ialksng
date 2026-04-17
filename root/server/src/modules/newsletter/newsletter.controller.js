import Newsletter from './newsletter.model.js';

export const subscribe = async (req, res) => {
  const { email } = req.body;
  try {
    const existing = await Newsletter.findOne({ email });
    if (existing) return res.status(400).json({ msg: "You are already subscribed!" });

    await Newsletter.create({ email });
    res.status(201).json({ msg: "Successfully subscribed to the newsletter! 🎉" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to subscribe. Please try again." });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch subscribers" });
  }
};