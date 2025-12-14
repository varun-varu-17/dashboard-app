import { User } from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* REGISTER */
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      throw new ApiError(400, "All fields required");

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) throw new ApiError(409, "User already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    const safeUser = await User.findById(user._id).select("-password -refreshToken");

    res.status(201).json(new ApiResponse(201, safeUser, "Registered successfully"));
  } catch (err) {
    next(err);
  }
};

/* LOGIN */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new ApiError(400, "All fields required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(401, "Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ApiError(401, "Invalid credentials");

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.json(new ApiResponse(200, { username: user.username }, "Login success"));
  } catch (err) {
    next(err);
  }
};

/* LOGOUT */
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json(new ApiResponse(200, null, "Logged out"));
};
