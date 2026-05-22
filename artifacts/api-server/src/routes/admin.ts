import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { adminUsersTable, projectsTable, paymentsTable, messagesTable, filesTable } from "@workspace/db";
import { eq, like, desc } from "drizzle-orm";
import { signAdminToken } from "../lib/auth";
import { requireAdmin, type AuthRequest } from "../lib/middleware";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function formatDateEs(d: Date): string {
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

function toSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")[0]
    .slice(0, 10);
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3);
}

async function generateUniqueCode(clientName: string): Promise<string> {
  const year = new Date().getFullYear();
  const base = `${toSlug(clientName)}-${year}`;

  const existing = await db
    .select({ code: projectsTable.code })
    .from(projectsTable)
    .where(like(projectsTable.code, `${base}%`))
    .orderBy(desc(projectsTable.createdAt));

  if (existing.length === 0) return base;

  const suffixes = existing
    .map((r) => r.code.replace(`${base}`, ""))
    .map((s) => (s === "" ? 1 : parseInt(s.replace(/^-/, ""), 10)))
    .filter((n) => !isNaN(n));

  const max = Math.max(...suffixes);
  return `${base}-${max + 1}`;
}

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
      from: m.fromRole,
      text: m.text,
      time: m.timeLabel,
    })),
    files: files.map((f) => ({
      id: f.id,
      name: f.name,
      type: f.fileType,
      size: f.size,
      status: f.status,
      date: f.date,
      from: f.fromRole,
      preview: f.preview ?? undefined,
    })),
  };
}

router.post("/admin/auth", async (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    res.status(400).json({ error: "Usuario y contraseña requeridos" });
    return;
  }

  try {
    const users = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.username, username.trim()))
      .limit(1);

    if (!users[0]) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    const valid = await bcrypt.compare(password, users[0].passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    const token = signAdminToken(users[0].username);
    res.json({ token, username: users[0].username });
  } catch (err) {
    req.log.error({ err }, "Admin auth error");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/admin/projects", requireAdmin, async (req: AuthRequest, res) => {
  const { clientName, projectName, projectType, deliveryDate } = req.body as {
    clientName?: string;
    projectName?: string;
    projectType?: string;
    deliveryDate?: string;
  };

  if (!clientName?.trim() || !projectName?.trim() || !projectType?.trim() || !deliveryDate?.trim()) {
    res.status(400).json({ error: "Todos los campos son requeridos" });
    return;
  }

  try {
    const code = await generateUniqueCode(clientName.trim());
    const clientInitials = getInitials(clientName.trim());
    const today = formatDateEs(new Date());

    await db.insert(projectsTable).values({
      code,
      clientName: clientName.trim(),
      clientInitials,
      projectName: projectName.trim(),
      projectType: projectType.trim(),
      startDate: today,
      deliveryDate: deliveryDate.trim(),
      status: "En desarrollo",
      progress: 0,
      currentStage: 1,
      price: 0,
      extras: [],
      features: [],
    });

    const created = await buildProjectResponse(code);
    res.status(201).json(created);
  } catch (err) {
    req.log.error({ err }, "Admin create project error");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/admin/projects", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const projects = await db.select().from(projectsTable);
    const full = await Promise.all(projects.map((p) => buildProjectResponse(p.code)));
    res.json(full.filter(Boolean));
  } catch (err) {
    req.log.error({ err }, "Admin list projects error");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/admin/projects/:code", requireAdmin, async (req: AuthRequest, res) => {
  const code = req.params.code as string;
  const { progress, currentStage, status, deliveryDate, payments } = req.body as {
    progress?: number;
    currentStage?: number;
    status?: string;
    deliveryDate?: string;
    payments?: Array<{ label: string; amount: number; paid: boolean; date: string }>;
  };

  try {
    const existing = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.code, code))
      .limit(1);

    if (!existing[0]) {
      res.status(404).json({ error: "Proyecto no encontrado" });
      return;
    }

    const updateData: Partial<typeof projectsTable.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (progress !== undefined) updateData.progress = progress;
    if (currentStage !== undefined) updateData.currentStage = currentStage;
    if (status !== undefined) updateData.status = status;
    if (deliveryDate !== undefined) updateData.deliveryDate = deliveryDate;

    await db.update(projectsTable).set(updateData).where(eq(projectsTable.code, code));

    if (payments !== undefined) {
      await db.delete(paymentsTable).where(eq(paymentsTable.projectCode, code));
      if (payments.length > 0) {
        await db.insert(paymentsTable).values(
          payments.map((p) => ({ ...p, projectCode: code }))
        );
      }
    }

    const updated = await buildProjectResponse(code);
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Admin update project error");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
