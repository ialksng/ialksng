import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔹 SIGNUP
export const signup = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ msg: "Signup successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // 🚨 Prevent password login for users who signed up via Google
    if (!user.password) {
      return res.status(400).json({ msg: "Please login with Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 GOOGLE AUTH (LOGIN + SIGNUP)
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    // ✅ Verify the Google ID token sent from the frontend
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    // 🔍 Find or create the user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: email.split("@")[0] + Math.floor(Math.random() * 1000),
        name,
        email,
        avatar: picture,
        password: null, // Indicates a Google-only account
        role: "user"
      });
    }

    // 🔐 Generate backend JWT for session management
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || picture
      }
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ msg: "Google authentication failed" });
  }
};

// 🔹 GET CURRENT USER (Session Verification)
// This is critical for the 'initAuth' call in your AuthContext.jsx
export const getMe = async (req, res) => {
  try {
    // req.user is populated by the 'protect' middleware
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};