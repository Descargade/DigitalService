import { Router } from "express";
import { db } from "@workspace/db";
import { messagesTable, projectsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requirePortalOrAdmin, type AuthRequest } from "../lib/middleware";

const router = Router();

function nowLabel(): string {
  const d = new Date();
  const day = d.getDate();
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const month = months[d.getMonth()];
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} · ${h}:${m}`;
}

router.get("/messages/:code", requirePortalOrAdmin, async (req: AuthRequest, res) => {
  const code = req.params.code as string;

  const portalCode = req.portalCode;
  if (portalCode && portalCode !== code) {
    res.status(403).json({ error: "Acceso denegado" });
    return;
  }

  try {
    const msgs = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.projectCode, code));

    res.json(
      msgs.map((m) => ({
        id: m.id,
        from: m.fromRole,
        text: m.text,
        time: m.timeLabel,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Get messages error");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/messages/:code", requirePortalOrAdmin, async (req: AuthRequest, res) => {
  const code = req.params.code as string;
  const { text, fromRole } = req.body as { text?: string; fromRole?: string };

  const portalCode = req.portalCode;
  if (portalCode && portalCode !== code) {
    res.status(403).json({ error: "Acceso denegado" });
    return;
  }

  if (!text || typeof text !== "string" || !text.trim()) {
    res.status(400).json({ error: "Mensaje requerido" });
    return;
  }

  const role = fromRole === "agency" ? "agency" : "client";

  try {
    const project = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.code, code))
      .limit(1);

    if (!project[0]) {
      res.status(404).json({ error: "Proyecto no encontrado" });
      return;
    }

    const [inserted] = await db
      .insert(messagesTable)
      .values({
        projectCode: code,
        fromRole: role,
        text: text.trim(),
        timeLabel: nowLabel(),
      })
      .returning();

    res.status(201).json({
      id: inserted.id,
      from: inserted.fromRole,
      text: inserted.text,
      time: inserted.timeLabel,
    });
  } catch (err) {
    req.log.error({ err }, "Add message error");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
