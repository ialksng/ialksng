import Newsletter from './newsletter.model.js';
import nodemailer from 'nodemailer';

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

export const sendNewsletter = async (req, res) => {
  const { subject, content } = req.body;

  try {
    const subscribers = await Newsletter.find();
    if (subscribers.length === 0) {
      return res.status(400).json({ msg: "No active subscribers found." });
    }

    const emails = subscribers.map(sub => sub.email);

    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, 
      bcc: emails, 
      subject: subject,
      html: content 
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ msg: `Successfully sent to ${emails.length} subscribers!` });
  } catch (err) {
    console.error("Newsletter send error:", err);
    res.status(500).json({ msg: "Failed to send newsletter." });
  }
};