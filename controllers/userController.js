const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const createToken = (user) => {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECERT, {
    expiresIn: "15m",
  });
};

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.register({ username, email, password }, res);
  // create a token
  const token = createToken(user);
  res.status(200).json({ email, token });
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.login({ email, password }, res);
  // create a token
  const token = createToken(user);
  res.status(200).json({ username: user.username, email, token });
});

module.exports = { registerUser, loginUser };
