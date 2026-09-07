import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import User from "../models/User";
import bcrypt from "bcrypt";
import { config, email } from "zod";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const register = async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);
  if (result.success) {
    const user = await User.findOne({ email: result.data.email });
    if (user) {
      return res.status(409).json({
        message: "Email already registered!",
      });
    }
    const passwordHash = await bcrypt.hash(result.data.password, 10);
    const newUser = await User.create({
      name: result.data.name,
      email: result.data.email,
      passwordHash,
    });

    res.status(201).json({
      message: "Registration successfull!",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } else {
    res.status(400).json({
      message: "Invalid registration data.",
      error: result.error.issues,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid login data",
      });
    }

    const { email, password } = result.data;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      message: "Login successfull..",
      token,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
};
