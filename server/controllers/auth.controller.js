import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendResetSuccessEmail,
  sendVerificationEmail,
} from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  try {
    if (!email || !password || !firstName || !lastName) {
      throw new Error("all fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const user = new User({
      email,
      password: hashedPass,
      firstName,
      lastName,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24hours
    });

    await user.save();
    //jwt
    generateTokenAndSetCookie(res, user._id);
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifying email", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user doesn't exist" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 24 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "logged out successfully" });
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }
    //update password

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.email);
    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("error in resetPassword", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: false, user });
  } catch (error) {
    console.log("Error in chechAuth", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const saveRecipe = async (req, res) => {
  const { userId, recipeId } = req.body;

  if (!userId || !recipeId) {
    return res
      .status(400)
      .json({ message: "userId and recipeId are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // check if already saved
    const alreadySaved = user.savedRecipes.some((r) => r.recipeId === recipeId);
    if (alreadySaved) {
      return res.status(400).json({ message: "Already saved" });
    }

    // push recipe into array
    user.savedRecipes.push({ recipeId });
    await user.save();

    res
      .status(201)
      .json({ message: "Recipe saved", savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Could not save recipe", details: err.message });
  }
};

export const unsaveRecipe = async (req, res) => {
  const { userId, recipeId } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedRecipes: { recipeId } } },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Recipe unsaved", savedRecipes: user.savedRecipes });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Could not unsave recipe", details: err.message });
  }
};

export const getSavedRecipes = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("savedRecipes");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json({ error: "Could not get saved recipes" });
  }
};
