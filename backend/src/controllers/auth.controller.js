import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { sendVerificationEmail } from "../services/email.service.js";


export const signup = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
    } = req.body;

    // Validate required fields
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Check passwords
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingEmail) {
      return res.status(409).json({
        message: "Email is already registered.",
      });
    }

    // Check username
    const existingUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUsername) {
      return res.status(409).json({
        message: "Username is already taken.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Code expires in 10 minutes
    const verificationExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Create user
    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        verificationCode,
        verificationExpires,
      },
    });

    // Send email
    await sendVerificationEmail(
      email,
      verificationCode
    );

    return res.status(201).json({
      message: "Verification code sent to your email.",
      email,
    });

  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Something went wrong during signup.",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Validate input
    if (!email || !code) {
      return res.status(400).json({
        message: "Email and verification code are required.",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified.",
      });
    }

    // Check verification code
    if (user.verificationCode !== code) {
      return res.status(400).json({
        message: "Invalid verification code.",
      });
    }

    // Check expiration
    if (
      !user.verificationExpires ||
      user.verificationExpires < new Date()
    ) {
      return res.status(400).json({
        message: "Verification code has expired.",
      });
    }

    // Verify user
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        isVerified: true,
        verificationCode: null,
        verificationExpires: null,
      },
    });

    return res.status(200).json({
      message: "Email verified successfully.",
    });

  } catch (error) {
    console.error("Verification error:", error);

    return res.status(500).json({
      message: "Something went wrong during email verification.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first.",
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

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
