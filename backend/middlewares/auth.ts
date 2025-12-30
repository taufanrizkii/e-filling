import { Request, Response, NextFunction } from "express";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // session akan punya userId setelah login
  const s = req.session as any;

  if (!s?.userId) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  next();
};
