const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/user.model");

const signupAgent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Agent with this email already exists." });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      type: "agent",
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return res.status(201).json({
      message: "Agent created successfully.",
      user: userWithoutPassword,
    });

  } catch (err) {
    console.error("Signup error:", err);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "Email already exists." });
  }

  // Fallback: internal server error
  return res.status(500).json({ message: "Internal server error." });
  }
};

const loginAgent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email, type: "agent" }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id, type: user.type }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    const { _id, name } = user;
    res.json({ token, user: { _id, name, email } });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  signupAgent,
  loginAgent,
};
