const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the user name"],
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already taken"],
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
    },
  },
  {
    timestamps: true,
  }
);

// static signup method
userSchema.statics.register = async function (userData, res) {
  const { username, email, password } = userData;
  // validation
  if (!username || !email || !password) {
    res.status(400);
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    res.status(400);
    throw Error("Email not valid");
  }
  if (!validator.isStrongPassword(password)) {
    res.status(400);
    throw Error("Password not strong enough");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    res.status(400);
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ username, email, password: hash });

  return user;
};

// static login method
userSchema.statics.login = async function ({ email, password }, res) {
  if (!email || !password) {
    res.status(400);
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    res.status(400);

    throw Error("Incorrect email");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(400);

    throw Error("Incorrect password");
  }

  return user;
};
module.exports = mongoose.model("User", userSchema);
