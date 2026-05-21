import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import {
  projectsTable,
  paymentsTable,
  messagesTable,
  filesTable,
  adminUsersTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

const MOCK_PROJECTS = [
  {
    code: "BARBER-2026",
    clientName: "Carlos Martínez",
    clientInitials: "CM",
    projectName: "Landing Page El Punto",
    projectType: "Landing Page Barbería",
    startDate: "10 Mayo 2026",
    deliveryDate: "17 Mayo 2026",
    status: "En desarrollo",
    progress: 55,
    currentStage: 2,
    price: 65000,
    extras: ["Sistema de turnos", "Confirmación automática"],
    features: ["Diseño responsive", "Sistema de turnos online", "Confirmación automática por WhatsApp", "Galería de fotos", "SEO básico", "Formulario de contacto"],
    payments: [
      { label: "Anticipo (50%)", amount: 32500, paid: true, date: "10 Mayo 2026" },
      { label: "Saldo final (50%)", amount: 32500, paid: false, date: "Al entregar" },
    ],
    messages: [
      { fromRole: "agency", text: "Hola Carlos! Te damos la bienvenida al portal de 2bleA. Ya arrancamos con la etapa de diseño de tu landing.", timeLabel: "10 May · 09:15" },
      { fromRole: "client", text: "Perfecto! ¿Cuándo van a tener algo para ver?", timeLabel: "10 May · 10:02" },
      { fromRole: "agency", text: "Mañana a la tarde te enviamos los primeros mockups del diseño. Cualquier cambio lo coordinamos por acá.", timeLabel: "10 May · 10:05" },
      { fromRole: "client", text: "¿El sistema de turnos va a tener notificaciones por WhatsApp?", timeLabel: "11 May · 11:20" },
      { fromRole: "agency", text: "Sí! La confirmación automática incluye notificaciones por WhatsApp tanto para vos como para el cliente que reserva el turno.", timeLabel: "11 May · 11:35" },
      { fromRole: "agency", text: "Ya terminamos el diseño y pasamos a desarrollo. Estimamos entrega en 3-4 días hábiles.", timeLabel: "13 May · 14:10" },
    ],
    files: [
      { name: "logo_elpunto.png", fileType: "image", size: "142 KB", status: "received", date: "10 May 2026", fromRole: "client", preview: "logo" },
      { name: "fotos_barberia.zip", fileType: "document", size: "8.4 MB", status: "received", date: "10 May 2026", fromRole: "client" },
      { name: "mockup_home.png", fileType: "image", size: "1.1 MB", status: "received", date: "12 May 2026", fromRole: "agency", preview: "mockup" },
      { name: "mockup_turnos.png", fileType: "image", size: "980 KB", status: "received", date: "12 May 2026", fromRole: "agency", preview: "turnos" },
      { name: "textos_web.docx", fileType: "document", size: "34 KB", status: "pending", date: "Pendiente", fromRole: "client" },
    ],
  },
  {
    code: "STORE-2026",
    clientName: "Valentina López",
    clientInitials: "VL",
    projectName: "Zafiro Store",
    projectType: "E-commerce Indumentaria",
    startDate: "5 Mayo 2026",
    deliveryDate: "26 Mayo 2026",
    status: "En diseño",
    progress: 25,
    currentStage: 1,
    price: 130000,
    extras: ["Mercado Pago", "Panel de administración"],
    features: ["Catálogo de productos", "Carrito de compras", "Integración Mercado Pago", "Panel de administración", "SEO avanzado", "Diseño responsive", "Filtros por categoría y talle"],
    payments: [
      { label: "Anticipo (40%)", amount: 52000, paid: true, date: "5 Mayo 2026" },
      { label: "Cuota intermedia (30%)", amount: 39000, paid: false, date: "15 Mayo 2026" },
      { label: "Saldo final (30%)", amount: 39000, paid: false, date: "Al entregar" },
    ],
    messages: [
      { fromRole: "agency", text: "Hola Valentina! Bienvenida al portal de seguimiento de tu e-commerce. Arrancamos esta semana con la arquitectura y el diseño.", timeLabel: "5 May · 10:00" },
      { fromRole: "client", text: "Excelente! ¿Van a poder usar los colores de mi marca? Tengo el manual de marca listo.", timeLabel: "5 May · 10:30" },
      { fromRole: "agency", text: "Por supuesto, mandanos el manual y lo integramos desde el primer mockup. También necesitamos el catálogo de productos inicial.", timeLabel: "5 May · 10:45" },
      { fromRole: "client", text: "Ya lo subo por acá. Son unas 40 prendas para empezar.", timeLabel: "6 May · 09:15" },
      { fromRole: "agency", text: "Perfecto. Estamos armando los wireframes de la home y la página de producto. En 3 días tenés los primeros diseños para revisar.", timeLabel: "7 May · 14:00" },
    ],
    files: [
      { name: "manual_marca_zafiro.pdf", fileType: "document", size: "3.2 MB", status: "received", date: "6 May 2026", fromRole: "client" },
      { name: "catalogo_inicial.xlsx", fileType: "document", size: "245 KB", status: "received", date: "6 May 2026", fromRole: "client" },
      { name: "wireframe_home.png", fileType: "image", size: "780 KB", status: "received", date: "8 May 2026", fromRole: "agency", preview: "mockup" },
      { name: "fotos_productos.zip", fileType: "document", size: "22 MB", status: "pending", date: "Pendiente", fromRole: "client" },
    ],
  },
  {
    code: "FITNESS-2026",
    clientName: "Rodrigo Bernal",
    clientInitials: "RB",
    projectName: "Olympus Fitness",
    projectType: "Sitio Web Centro de Fitness",
    startDate: "28 Abril 2026",
    deliveryDate: "14 Mayo 2026",
    status: "En revisión",
    progress: 80,
    currentStage: 3,
    price: 85000,
    extras: ["Reserva de clases", "Integración Instagram"],
    features: ["Diseño responsive premium", "Sistema de reserva de clases", "Galería y videos de instalaciones", "Integración Instagram feed", "Precios y planes", "SEO local avanzado", "Formulario de contacto y WhatsApp"],
    payments: [
      { label: "Anticipo (50%)", amount: 42500, paid: true, date: "28 Abril 2026" },
      { label: "Saldo final (50%)", amount: 42500, paid: false, date: "Al entregar" },
    ],
    messages: [
      { fromRole: "agency", text: "Hola Rodrigo! Ya tenemos el sitio casi listo. Entramos en la fase de revisión final esta semana.", timeLabel: "28 Abr · 09:00" },
      { fromRole: "client", text: "Genial! ¿Puedo ver algo ya?", timeLabel: "28 Abr · 09:20" },
      { fromRole: "agency", text: "Sí, te pasamos el link de previsualización en las próximas horas. Anotá todo lo que quieras ajustar.", timeLabel: "28 Abr · 09:35" },
      { fromRole: "client", text: "Vi el diseño, está muy bueno! Solo cambiaría el color del botón de reservas a naranja como el logo.", timeLabel: "2 May · 16:00" },
      { fromRole: "agency", text: "Listo, actualizamos el botón. También ajustamos el espaciado en mobile que estaba un poco justo.", timeLabel: "3 May · 11:00" },
      { fromRole: "agency", text: "Ya subimos los últimos cambios. Revisá y avisanos si quedó todo bien para coordinar la entrega final.", timeLabel: "13 May · 10:30" },
    ],
    files: [
      { name: "logo_olympus.svg", fileType: "image", size: "48 KB", status: "received", date: "29 Abr 2026", fromRole: "client", preview: "logo" },
      { name: "fotos_gym.zip", fileType: "document", size: "34 MB", status: "received", date: "29 Abr 2026", fromRole: "client" },
      { name: "preview_home.png", fileType: "image", size: "2.1 MB", status: "received", date: "3 May 2026", fromRole: "agency", preview: "mockup" },
      { name: "preview_clases.png", fileType: "image", size: "1.8 MB", status: "received", date: "3 May 2026", fromRole: "agency", preview: "turnos" },
      { name: "preview_mobile.png", fileType: "image", size: "890 KB", status: "received", date: "5 May 2026", fromRole: "agency", preview: "logo" },
    ],
  },
];

export async function seedDatabase(): Promise<void> {
  try {
    const existing = await db.select().from(adminUsersTable).limit(1);
    if (existing.length === 0) {
      const passwordHash = await bcrypt.hash("2blea2026", 12);
      await db.insert(adminUsersTable).values({ username: "admin", passwordHash });
      logger.info("Seeded admin user");
    }

    const existingProjects = await db.select().from(projectsTable).limit(1);
    if (existingProjects.length === 0) {
      for (const project of MOCK_PROJECTS) {
        const { payments, messages, files, ...projectData } = project;

        await db.insert(projectsTable).values(projectData);

        if (payments.length > 0) {
          await db.insert(paymentsTable).values(
            payments.map((p) => ({ ...p, projectCode: project.code }))
          );
        }

        if (messages.length > 0) {
          await db.insert(messagesTable).values(
            messages.map((m) => ({ ...m, projectCode: project.code }))
          );
        }

        if (files.length > 0) {
          await db.insert(filesTable).values(
            files.map((f) => ({ ...f, projectCode: project.code }))
          );
        }
      }
      logger.info("Seeded mock projects");
    }
  } catch (err) {
    logger.error({ err }, "Database seed failed");
  }
}

export async function migrateSchema(): Promise<void> {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code TEXT NOT NULL UNIQUE,
        client_name TEXT NOT NULL,
        client_initials TEXT NOT NULL,
        project_name TEXT NOT NULL,
        project_type TEXT NOT NULL,
        start_date TEXT NOT NULL,
        delivery_date TEXT NOT NULL,
        status TEXT NOT NULL,
        progress INTEGER NOT NULL DEFAULT 0,
        current_stage INTEGER NOT NULL DEFAULT 0,
        price INTEGER NOT NULL,
        extras JSONB NOT NULL DEFAULT '[]',
        features JSONB NOT NULL DEFAULT '[]',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_code TEXT NOT NULL,
        label TEXT NOT NULL,
        amount INTEGER NOT NULL,
        paid BOOLEAN NOT NULL DEFAULT FALSE,
        date TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_code TEXT NOT NULL,
        from_role TEXT NOT NULL,
        text TEXT NOT NULL,
        time_label TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS files (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_code TEXT NOT NULL,
        name TEXT NOT NULL,
        file_type TEXT NOT NULL,
        size TEXT NOT NULL,
        status TEXT NOT NULL,
        date TEXT NOT NULL,
        from_role TEXT NOT NULL,
        preview TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    logger.info("Schema migration complete");
  } catch (err) {
    logger.error({ err }, "Schema migration failed");
    throw err;
  }
}
