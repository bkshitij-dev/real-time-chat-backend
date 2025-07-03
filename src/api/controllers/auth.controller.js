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
    console.error("Signup error:", err.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  signupAgent,
};
