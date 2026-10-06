const express = require("express");
const passport = require("../config/passport");

const {
  register,
  login,
  refreshToken,
  logout,
  createAccessToken,
  createRefreshToken,
  hashToken,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

// ============================
// GOOGLE OAUTH
// ============================

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  async (req, res) => {
    try {
      const accessToken = createAccessToken(req.user);
      const refreshTokenValue = createRefreshToken(req.user);

      req.user.refreshTokenHash = hashToken(refreshTokenValue);
      await req.user.save();

      res.cookie("refreshToken", refreshTokenValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        message: "Google login successful",
        accessToken,
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },
      });
    } catch (error) {
      console.error("Google OAuth Error:", error);

      res.status(500).json({
        success: false,
        message: "Google login failed",
      });
    }
  }
);

module.exports = router;