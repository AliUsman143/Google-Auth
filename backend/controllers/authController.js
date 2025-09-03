const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/usersign");
const sendEmail = require("../utils/sendEmail");

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




// const User = require('../models/usersign');
// const jwt = require('jsonwebtoken');

// const signToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN
//   });
// };

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'User already exists with this email'
//       });
//     }

//     // Create new user
//     const newUser = await User.create({
//       name,
//       email,
//       password
//     });

//     // Generate token
//     const token = signToken(newUser._id);

//     // Remove password from output
//     newUser.password = undefined;

//     res.status(201).json({
//       status: 'success',
//       token,
//       data: {
//         user: newUser
//       }
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: 'fail',
//       message: error.message
//     });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if email and password exist
//     if (!email || !password) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Please provide email and password'
//       });
//     }

//     // Check if user exists and password is correct
//     const user = await User.findOne({ email }).select('+password');
    
//     if (!user || !(await user.correctPassword(password, user.password))) {
//       return res.status(401).json({
//         status: 'fail',
//         message: 'Incorrect email or password'
//       });
//     }

//     // Generate token
//     const token = signToken(user._id);

//     // Remove password from output
//     user.password = undefined;

//     res.status(200).json({
//       status: 'success',
//       token,
//       data: {
//         user
//       }
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: 'fail',
//       message: error.message
//     });
//   }
// };