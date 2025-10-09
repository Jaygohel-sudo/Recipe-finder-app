import express from "express";
import {
  checkAuth,
  getSavedRecipes,
  login,
  logout,
  resetPassword,
  saveRecipe,
  signup,
  unsaveRecipe,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();
router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password/:token", resetPassword);

router.post("/recipes/save", saveRecipe);
router.post("/recipes/unsave", unsaveRecipe);
router.get("/saved-recipes/:userId", getSavedRecipes);

export default router;
