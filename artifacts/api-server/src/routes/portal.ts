import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable, paymentsTable, messagesTable, filesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signPortalToken } from "../lib/auth";
import { requirePortal, type AuthRequest } from "../lib/middleware";

const router = Router();

async function buildProjectResponse(code: string) {
  const project = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.code, code))
    .limit(1);

  if (!project[0]) return null;

  const [payments, messages, files] = await Promise.all([
    db.select().from(paymentsTable).where(eq(paymentsTable.projectCode, code)),
    db.select().from(messagesTable).where(eq(messagesTable.projectCode, code)),
    db.select().from(filesTable).where(eq(filesTable.projectCode, code)),
  ]);

  return {
    ...project[0],
    payments: payments.map((p) => ({
      label: p.label,
      amount: p.amount,
      paid: p.paid,
      date: p.date,
    })),
    messages: messages.map((m) => ({
      id: m.id,
      from: m.fromRole as "client" | "agency",
      text: m.text,
      time: m.timeLabel,
    })),
    files: files.map((f) => ({
      id: f.id,
      name: f.name,
      type: f.fileType as "image" | "document",
      size: f.size,
      status: f.status as "received" | "pending",
      date: f.date,
      from: f.fromRole as "client" | "agency",
      preview: f.preview ?? undefined,
    })),
  };
}

router.post("/portal/auth", async (req, res) => {
  const { code } = req.body as { code?: string };

  if (!code || typeof code !== "string") {
    res.status(400).json({ error: "Código requerido" });
    return;
  }

  const normalized = code.trim().toUpperCase();

  try {
    const project = await buildProjectResponse(normalized);
    if (!project) {
      res.status(401).json({ error: "Código inválido. Verificá que sea correcto." });
      return;
    }

    const token = signPortalToken(normalized);
    res.json({ token, project });
  } catch (err) {
    req.log.error({ err }, "Portal auth error");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/portal/me", requirePortal, async (req: AuthRequest, res) => {
  const code = req.portalCode!;

  try {
    const project = await buildProjectResponse(code);
    if (!project) {
      res.status(404).json({ error: "Proyecto no encontrado" });
      return;
    }
    res.json(project);
  } catch (err) {
    req.log.error({ err }, "Portal me error");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
