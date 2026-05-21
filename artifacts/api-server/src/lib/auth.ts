import jwt from "jsonwebtoken";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

export function signPortalToken(code: string): string {
  return jwt.sign({ type: "portal", code }, getSecret(), { expiresIn: "30d" });
}

export function signAdminToken(username: string): string {
  return jwt.sign({ type: "admin", username }, getSecret(), { expiresIn: "24h" });
}

export function verifyPortalToken(token: string): { code: string } | null {
  try {
    const payload = jwt.verify(token, getSecret()) as { type: string; code: string };
    if (payload.type !== "portal") return null;
    return { code: payload.code };
  } catch {
    return null;
  }
}

export function verifyAdminToken(token: string): { username: string } | null {
  try {
    const payload = jwt.verify(token, getSecret()) as { type: string; username: string };
    if (payload.type !== "admin") return null;
    return { username: payload.username };
  } catch {
    return null;
  }
}
