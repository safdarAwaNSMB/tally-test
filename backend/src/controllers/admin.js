const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User Signup
module.exports.createAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    if (admin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    admin = new Admin({
      email,
      password,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save();

    // Generate JWT token
    const payload = {
      user: {
        id: admin._id,
      },
    };

    jwt.sign(payload, "159abr", (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// User Login
module.exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "User not exists!" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password!" });
    }

    const payload = {
      user: {
        id: admin._id,
      },
    };

    jwt.sign(payload, "159abr", (err, token) => {
      if (err) throw err;
      res.json({ token, user: admin });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
module.exports.getUser = async (req, res) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }
    console.log(token);
    // Verify the token
    const decoded = jwt.verify(token, "159abr");
    // Find the user by the decoded token information
    const user = await Admin.findById(decoded.user.id);
    // Extract the user ID from the request or token
    console.log(user);
    // // Fetch user data from the database
    // const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the user data as a response
    const userData = user;

    res.json(userData);
    console.log("verified user");
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.changePassword = async (req, res) => {
  try {
    let user = await Admin.findById(req.params.userId);
    // Generate a new random password
    const { newPassword } = req.body;

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save the new password to the user
    await user.save();

    res.status(200).send({
      status: true,
      message: "The Password is changed!",
      data: user,
    });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};
