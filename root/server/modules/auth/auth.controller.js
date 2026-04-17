import User from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ======================= SIGNUP =======================
export const signup = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    if (!email || !password || !name || !username) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username: username.trim(),
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({ msg: "Signup successful" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ msg: "Server error during signup" });
  }
};

// ======================= LOGIN =======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.password) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
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
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server error during login" });
  }
};

// ======================= GOOGLE AUTH =======================
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();
    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        username:
          normalizedEmail.split("@")[0] +
          "_" +
          Math.random().toString(36).slice(2, 6),
        name,
        email: normalizedEmail,
        password: null,
        role: "user",
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: jwtToken,
      user,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ msg: "Google authentication failed" });
  }
};

// ======================= GET ME =======================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -otp -otpExpires");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Get Me Error:", err);
    res.status(500).json({ msg: "Server error fetching profile" });
  }
};

// ======================= SEND OTP =======================
export const sendForgotPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.json({
        msg: "If this email exists, an OTP has been sent.",
      });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"ialksng.me Security" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset your password",
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;background:#0b0b0c;font-family:Inter,system-ui;">
  <table width="100%" style="padding:40px 16px;background:#0b0b0c;">
    <tr><td align="center">
      <table style="max-width:560px;background:#111;border-radius:14px;border:1px solid #222;">
        
        <tr>
          <td style="padding:24px;border-bottom:1px solid #1e1e1e;">
            <strong style="color:#fff;">ialksng.me</strong>
          </td>
        </tr>

        <tr>
          <td style="padding:30px;">
            <h2 style="color:#fff;margin:0 0 10px;">Reset your password</h2>
            <p style="color:#aaa;font-size:14px;">
              Use the code below to continue:
            </p>

            <div style="text-align:center;margin:30px 0;">
              <div style="display:inline-block;background:#000;padding:16px 28px;border-radius:8px;
              font-size:28px;letter-spacing:8px;color:#fff;">
                ${otp}
              </div>
            </div>

            <p style="color:#777;font-size:13px;">
              Expires in 10 minutes.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:16px;text-align:center;border-top:1px solid #1e1e1e;">
            <span style="color:#555;font-size:12px;">
              © ${new Date().getFullYear()} ialksng.me
            </span>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
      `,
    });

    console.log("✅ Email sent:", info.response);

    res.json({ msg: "OTP sent successfully" });

  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ msg: "Failed to send email" });
  }
};

// ======================= RESET PASSWORD =======================
export const resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: "Password too short" });
    }

    const user = await User.findOne({
      email: normalizedEmail,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("Reset Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};