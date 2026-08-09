import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { sendVerificationEmail } from "../services/email.service.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signup = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
    } = req.body;

    // ==========================================
    // REQUIRED FIELDS
    // ==========================================

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // ==========================================
    // TRIM USERNAME AND EMAIL
    // ==========================================

    const cleanUsername = username.trim();
    const cleanEmail = email.trim();

    // ==========================================
    // USERNAME VALIDATION
    // ==========================================

    if (cleanUsername.length < 3) {
      return res.status(400).json({
        message: "Username must be at least 3 characters.",
      });
    }

    if (cleanUsername.length > 20) {
      return res.status(400).json({
        message: "Username must not exceed 20 characters.",
      });
    }

    // ==========================================
    // EMAIL VALIDATION
    // ==========================================

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    // ==========================================
    // PASSWORD VALIDATION
    // ==========================================

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    if (password.length > 20) {
      return res.status(400).json({
        message: "Password must not exceed 20 characters.",
      });
    }

    // ==========================================
    // CONFIRM PASSWORD VALIDATION
    // ==========================================

    if (confirmPassword.length > 20) {
      return res.status(400).json({
        message: "Confirm password must not exceed 20 characters.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    // ==========================================
    // CHECK IF EMAIL ALREADY EXISTS
    // ==========================================

    const existingEmail = await prisma.user.findUnique({
      where: {
        email: cleanEmail,
      },
    });

    if (existingEmail) {
      return res.status(409).json({
        message: "Email is already registered.",
      });
    }

    // ==========================================
    // CHECK USERNAME
    // ==========================================

    const existingUsername = await prisma.user.findUnique({
      where: {
        username: cleanUsername,
      },
    });

    if (existingUsername) {
      return res.status(409).json({
        message: "Username is already taken.",
      });
    }

    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword = await bcrypt.hash(
      password,
      10,
    );

    // ==========================================
    // GENERATE VERIFICATION CODE
    // ==========================================

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // ==========================================
    // CODE EXPIRES IN 10 MINUTES
    // ==========================================

    const verificationExpires = new Date(
      Date.now() + 10 * 60 * 1000,
    );

    // ==========================================
    // CREATE USER
    // ==========================================

    await prisma.user.create({
      data: {
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        verificationCode,
        verificationExpires,
      },
    });

    // ==========================================
    // SEND VERIFICATION EMAIL
    // ==========================================

    await sendVerificationEmail(
      cleanEmail,
      verificationCode,
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      message: "Verification code sent to your email.",
      email: cleanEmail,
    });

  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Something went wrong during signup.",
    });
  }
};


// ======================================================
// VERIFY EMAIL
// ======================================================

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    // ==========================================
    // REQUIRED FIELDS
    // ==========================================

    if (!email || !code) {
      return res.status(400).json({
        message:
          "Email and verification code are required.",
      });
    }

    const cleanEmail = email.trim();

    // ==========================================
    // EMAIL VALIDATION
    // ==========================================

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    // ==========================================
    // CODE VALIDATION
    // ==========================================

    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({
        message:
          "Verification code must be exactly 6 digits.",
      });
    }

    // ==========================================
    // FIND USER
    // ==========================================

    const user = await prisma.user.findUnique({
      where: {
        email: cleanEmail,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // ==========================================
    // CHECK IF ALREADY VERIFIED
    // ==========================================

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified.",
      });
    }

    // ==========================================
    // CHECK VERIFICATION CODE
    // ==========================================

    if (user.verificationCode !== code) {
      return res.status(400).json({
        message: "Invalid verification code.",
      });
    }

    // ==========================================
    // CHECK EXPIRATION
    // ==========================================

    if (
      !user.verificationExpires ||
      user.verificationExpires < new Date()
    ) {
      return res.status(400).json({
        message: "Verification code has expired.",
      });
    }

    // ==========================================
    // VERIFY USER
    // ==========================================

    await prisma.user.update({
      where: {
        email: cleanEmail,
      },
      data: {
        isVerified: true,
        verificationCode: null,
        verificationExpires: null,
      },
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      message: "Email verified successfully.",
    });

  } catch (error) {
    console.error("Verification error:", error);

    return res.status(500).json({
      message:
        "Something went wrong during email verification.",
    });
  }
};


// ======================================================
// LOGIN
// ======================================================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ==========================================
    // REQUIRED FIELDS
    // ==========================================

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim();

    // ==========================================
    // EMAIL VALIDATION
    // ==========================================

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    // ==========================================
    // PASSWORD VALIDATION
    // ==========================================

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    if (password.length > 20) {
      return res.status(400).json({
        message: "Password must not exceed 20 characters.",
      });
    }

    // ==========================================
    // FIND USER
    // ==========================================

    const user = await prisma.user.findUnique({
      where: {
        email: cleanEmail,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // ==========================================
    // CHECK EMAIL VERIFICATION
    // ==========================================

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first.",
      });
    }

    // ==========================================
    // CHECK PASSWORD
    // ==========================================

    const passwordMatch = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // ==========================================
    // CREATE JWT
    // ==========================================

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        // TOKEN EXPIRES AFTER 1 HOUR
        expiresIn: "1h",
      },
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      message: "Login successful.",
      token,

      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong during login.",
    });
  }
};