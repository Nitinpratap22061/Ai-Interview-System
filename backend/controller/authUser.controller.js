const { UserModel } = require("../model/user");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BlackListModel } = require("../model/BlackList");

const RegisterdUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const registerUserName = await UserModel.findOne({ username });
    if (registerUserName) {
      return res
        .status(400)
        .send({ msg: "Username already exists! Try another one." });
    }

    const registerUserEmail = await UserModel.findOne({ email });
    if (registerUserEmail) {
      return res
        .status(409)
        .send({ msg: "Email already exists! Try another one." });
    }

    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res.status(500).json({ err });
      } else {
        const registerUser = new UserModel({ ...req.body, password: hash });
        await registerUser.save();
        return res
          .status(201)
          .json({ msg: "New User registered successfully!", registerUser });
      }
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existinguser = await UserModel.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ error: "User not found" });
    }

    bcrypt.compare(password, existinguser.password, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Password check failed" });
      }

      if (result) {
        const token = jwt.sign(
          { userId: existinguser._id },
          process.env.JWT_SECRET,   // ✅ use correct env variable
          { expiresIn: "1h" }       // optional expiry
        );

        return res.status(200).json({
          msg: "Login Success!",
          token,
          existinguser,
        });
      } else {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const GetSingleUserDATA = (req, res, next) => {
  res.status(200).json({ msg: "Get single user not implemented yet" });
};

const logOut = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const data = new BlackListModel({ token });
    await data.save();
    return res.status(200).json({ message: "Logged out successfully" });
  } else {
    return res.status(400).json({ message: "Logout failed" });
  }
};

module.exports = {
  RegisterdUser,
  loginUser,
  logOut,
};
