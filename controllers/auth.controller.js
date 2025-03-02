import bcryptjs from "bcryptjs";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(errorHandler(400, "Email already in use"));

    // Hash password before saving
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    // Verify password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid credentials"));

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      return next(errorHandler(500, "JWT_SECRET is not defined"));
    }

    // Generate token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Token valid for 7 days
    });

    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only secure in production
        sameSite: "strict",
      })
      .status(200)
      .json(rest);

  } catch (error) {
    next(error);
  }
};

export const uploadImage = asyncHandler(async (req, res, next) => {
  // // check for the file size and send an error message
  // if (req.file.size > process.env.MAX_FILE_UPLOAD) {
  //   return res.status(400).send({
  //     message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
  //   });
  // }

  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`, // ✅ Corrected Path
  });
});

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password:pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {  
  try {
    res.clearCookie('access_token');
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};

