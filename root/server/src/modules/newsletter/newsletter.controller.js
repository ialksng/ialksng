import Newsletter from './newsletter.model.js';
import nodemailer from 'nodemailer';

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ msg: "Invalid email address." });
  }

  try {
    const existing = await Newsletter.findOne({ email });

    if (existing) {
      return res.status(400).json({ msg: "You are already subscribed!" });
    }

    await Newsletter.create({ email });

    res.status(201).json({
      msg: "Successfully subscribed to the newsletter! 🎉"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to subscribe. Please try again." });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch subscribers" });
  }
};

export const sendNewsletter = async (req, res) => {
  const { subject, content } = req.body;

  if (!subject || !content) {
    return res.status(400).json({ msg: "Subject and content are required." });
  }

  try {
    const subscribers = await Newsletter.find({ active: true });

    const validEmails = [];
    const invalidEmails = [];

    subscribers.forEach(sub => {
      if (isValidEmail(sub.email)) {
        validEmails.push(sub.email);
      } else {
        invalidEmails.push(sub);
      }
    });

    if (validEmails.length === 0) {
      return res.status(400).json({ msg: "No valid subscribers found." });
    }

    if (invalidEmails.length > 0) {
      const ids = invalidEmails.map(sub => sub._id);
      await Newsletter.deleteMany({ _id: { $in: ids } });
      console.log(`Removed ${ids.length} invalid emails`);
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"SmartSphere" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      bcc: validEmails,
      subject,
      html: content
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      msg: `Newsletter sent to ${validEmails.length} subscribers 🚀`
    });

  } catch (err) {
    console.error("Newsletter send error:", err);
    res.status(500).json({ msg: "Failed to send newsletter." });
  }
};