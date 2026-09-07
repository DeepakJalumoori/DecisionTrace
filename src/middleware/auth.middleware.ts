import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header missing!",
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization format!",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      message: "JWT secret is not configured!",
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded !== "object" || !("userId" in decoded)) {
      return res.status(401).json({
        message: "Invalid token payload!",
      });
    }

    req.user = {
      userId: decoded.userId as string,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token!",
    });
  }
};
