const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/usersign");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "90d",
  });
};

// ✅ LOGIN API
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ status: "fail", message: "User not found" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ status: "fail", message: "Please verify your email first" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      status: "success",
      message: "Login successful",
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.registerUser = async (req, res) => {
  const { email } = req.body;

  // yahan apna user save karne ka logic hoga...

  const verificationLink = `http://localhost:3000/verify?token=${token}`;

  await sendEmail(
    email,
    "Verify your email",
    `<p>Click the link below to verify your email:</p>
     <a href="${verificationLink}">${verificationLink}</a>`
  );

  res.json({ success: true, message: "Verification email sent!" });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ status: "fail", message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // verification link
    const url = `http://localhost:5000/api/auth/verify-email?token=${token}`;

    // send email
    await sendEmail(user.email, "Verify your email", `Click here: ${url}`);

    // ✅ send simple JSON response
    res.status(201).json({
      status: "success",
      message: "User registered successfully, please check your email",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// Email Verify
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send("Invalid or missing token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).send("User not found");
    }

    if (user.isVerified) {
      return res.redirect("http://localhost:3000/login");
    }

    user.isVerified = true;
    await user.save();

    // ✅ Redirect to frontend success page
    return res.redirect("http://localhost:3000/verify-success");
  } catch (error) {
    console.error(error);
    return res.status(400).send("Invalid or expired token");
  }
};

// ✅ Forgot Password: send reset link
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: "fail", message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal whether user exists
      return res.json({ status: "success", message: "If that email exists, a reset link was sent" });
    }

    // Create short-lived JWT reset token
    const token = jwt.sign(
      { id: user._id, type: "reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Link points to your frontend to show reset form
    const resetUrl = `http://localhost:3000/?reset=true&token=${token}`;

    await sendEmail(
      user.email,
      "Reset your password",
      `Click the link to reset your password: ${resetUrl}`
    );

    return res.json({
      status: "success",
      message: "If that email exists, a reset link was sent",
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// ✅ Reset Password: verify token and update password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ status: "fail", message: "Token and new password are required" });
    }

    // Verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(400).json({ status: "fail", message: "Invalid or expired token" });
    }

    if (payload.type !== "reset") {
      return res.status(400).json({ status: "fail", message: "Invalid token type" });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(400).json({ status: "fail", message: "User not found" });
    }

    // Update password (assumes your User model hashes on save)
    user.password = password;
    await user.save();

    return res.json({ status: "success", message: "Password updated successfully. Please login." });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};



