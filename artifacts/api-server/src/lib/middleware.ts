import type { Request, Response, NextFunction } from "express";
import { verifyAdminToken, verifyPortalToken } from "./auth";

export interface AuthRequest extends Request {
  adminUser?: { username: string };
  portalCode?: string;
}

function extractToken(req: Request): string | null {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const payload = verifyAdminToken(token);
  if (!payload) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  req.adminUser = payload;
  next();
}

export function requirePortal(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const payload = verifyPortalToken(token);
  if (!payload) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  req.portalCode = payload.code;
  next();
}

export function requirePortalOrAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const portal = verifyPortalToken(token);
  if (portal) {
    req.portalCode = portal.code;
    next();
    return;
  }
  const admin = verifyAdminToken(token);
  if (admin) {
    req.adminUser = admin;
    next();
    return;
  }
  res.status(401).json({ error: "Invalid or expired token" });
}
