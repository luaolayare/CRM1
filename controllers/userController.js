const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const { generateToken } = require("../utils/generateJwt");

const User = require("../models/userModel");

// Registers a new user '/api/users'
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, telefono, password } = req.body;

  if (!name || !email || !telefono || !password) {
    res.status(400);
    throw new Error("Please include all data");
  }

  // Checks if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hashes password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Creates user
  const user = await User.create({
    name,
    email,
    telefono,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      telefono: user.telefono,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login an user '/api/users/login'
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Checks if user exists and if password is correct
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      telefono: user.telefono,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

// Gets current user (private) '/api/users/me'
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
  };

  res.status(200).json(user);
});

module.exports = { registerUser, loginUser, getCurrentUser };
