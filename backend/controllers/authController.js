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

    let user = await User.findOne({ email });
    if (user) return res.json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken: token,
      isVerified: false,
    });

    await user.save();

    const verifyLink = `http://localhost:5000/api/auth/verify/${token}`;
    await sendEmail(
      email,
      "Verify your account",
      `Hi ${name},\n\nPlease verify your account by clicking this link: ${verifyLink}`
    );

    res.json({ success: true, message: "Verification email sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) return res.send("Invalid or expired token");

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    // redirect to frontend success page
    res.redirect("http://localhost:3000/verify-success");
  } catch (err) {
    console.error(err);
    res.send("Server error");
  }
};


