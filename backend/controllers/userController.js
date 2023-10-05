const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("express-async-handler");

const getAllUsers = asyncHandler(async (req, res) => {
 //console.log(req.query.search);
  const keyword = req.query.search
    ? {
      $or: [
        { username: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id}});
 //console.log(users);
  res.send(users)
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, pic } = req.body;
  if (!username || !email || !password) {
    res.status(400).send("Please Enter all the Fields");
  }
  const duplicateUser = await User.findOne({ email });
  if (duplicateUser) {
    res.status(400).send("User already exists");;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    pic,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // console.log(email,password)
  const user = await User.findOne({ email: email });

  if (!user) {
    res.status(401).json({ message: 'Invalid user' });
    return;
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (isPasswordValid) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid password' });;
  }
});

module.exports = { registerUser, loginUser, getAllUsers };
