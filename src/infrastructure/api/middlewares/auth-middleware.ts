import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  userId?: string | JwtPayload;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access Denied, no token provided." });
  }

  try {
    const verified = jwt.verify(
      token.replace("Bearer ", ""),
      process?.env?.JWT_SECRET || ""
    ) as JwtPayload;
    req.userId = verified?.id;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};
