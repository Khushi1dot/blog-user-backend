const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const catchAsync = require("../../utils/catch");
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isStrongPassword = (password) => /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

class AuthController {

  static signup=catchAsync( async (req, res) => {
  const { username, email, password, profilePic} = req.body;
 
  if (!username || !email || !password ) {
    return res.status(400).json({ message: "All fields are required" });
  }
 
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
 
  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters, include one uppercase letter, one number, and one special character",
    });
  }
 
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
 
      const user = new User({
      username, email,
        password: hashedPassword,
        profilePic,
      });
 
      await user.save();
      res.send({ success: true, user,message: "User registered successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

  static login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    
    const token = jwt.sign(
      {
        userId: user._id,
        user_: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePic: user.profilePic,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...others } = user._doc;

    // Return token + user in response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: others,
    });
  });


 static update = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { username, email, password, bio } = req.body;

  const updateFields = {};

  if (username) updateFields.username = username;
  if (email) updateFields.email = email;
  if (bio) updateFields.bio = bio;

  // If a new profile picture was uploaded
  if (req.body.profilePic) {
  updateFields.profilePic = req.body.profilePic;
}

  // If a new password is provided, hash and add it
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updateFields.password = await bcrypt.hash(password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true }
  );

  // Remove password from the returned object
  // const { password: _, ...userWithoutPassword } = updatedUser._doc;

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: updatedUser,
  });
});

  static getCurrentUser = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  });

 

  static deleteUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  });
}

module.exports = AuthController;
