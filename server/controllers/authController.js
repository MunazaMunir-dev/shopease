const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

// ============================
// CREATE ACCESS TOKEN
// ============================

const createAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

// ============================
// CREATE REFRESH TOKEN
// ============================

const createRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ============================
// HASH REFRESH TOKEN
// ============================

const hashToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

// ============================
// REGISTER
// ============================

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ============================
// LOGIN
// ============================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Account lock check
    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(423).json({
        success: false,
        message: "Account temporarily locked. Try again later.",
      });
    }

    // Reset expired lock
    if (user.lockUntil && user.lockUntil <= new Date()) {
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(
          Date.now() + 15 * 60 * 1000
        );
      }

      await user.save();

      return res.status(401).json({
        success: false,
        message:
          user.failedLoginAttempts >= 5
            ? "Too many failed attempts. Account locked for 15 minutes."
            : "Invalid email or password",
      });
    }

    // Successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // Store ONLY hashed refresh token
    user.refreshTokenHash = hashToken(refreshToken);

    await user.save();

    // HttpOnly refresh cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ============================
// REFRESH TOKEN ROTATION
// ============================

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Compare hashed token
    const incomingHash = hashToken(token);

    if (incomingHash !== user.refreshTokenHash) {
      return res.status(401).json({
        success: false,
        message: "Refresh token rejected",
      });
    }

    // ROTATION: create a completely new refresh token
    const newRefreshToken = createRefreshToken(user);

    user.refreshTokenHash = hashToken(newRefreshToken);

    await user.save();

    const newAccessToken = createAccessToken(user);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

// ============================
// LOGOUT
// ============================

const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.REFRESH_TOKEN_SECRET
        );

        await User.findByIdAndUpdate(decoded.userId, {
          refreshTokenHash: null,
        });
      } catch (error) {
        // Token already invalid/expired
      }
    }

    res.clearCookie("refreshToken");

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
module.exports = {
  register,
  login,
  refreshToken,
  logout,
  createAccessToken,
  createRefreshToken,
  hashToken,
};