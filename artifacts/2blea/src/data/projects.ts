export interface ProjectMessage {
  id: number;
  from: "client" | "agency";
  text: string;
  time: string;
  read?: boolean;
}

export interface ProjectFile {
  id: number;
  name: string;
  type: "image" | "document";
  size: string;
  status: "received" | "pending";
  date: string;
  from: "client" | "agency";
  preview?: string;
}

export interface Payment {
  label: string;
  amount: number;
  paid: boolean;
  date: string;
}

export interface ProjectData {
  code: string;
  clientName: string;
  clientInitials: string;
  projectName: string;
  projectType: string;
  startDate: string;
  deliveryDate: string;
  status: string;
  progress: number;
  currentStage: number;
  price: number;
  extras: string[];
  features: string[];
  payments: Payment[];
  messages: ProjectMessage[];
  files: ProjectFile[];
}

export const PROJECTS: Record<string, ProjectData> = {
  "BARBER-2026": {
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
    features: [
      "Diseño responsive",
      "Sistema de turnos online",
      "Confirmación automática por WhatsApp",
      "Galería de fotos",
      "SEO básico",
      "Formulario de contacto",
    ],
    payments: [
      { label: "Anticipo (50%)", amount: 32500, paid: true, date: "10 Mayo 2026" },
      { label: "Saldo final (50%)", amount: 32500, paid: false, date: "Al entregar" },
    ],
    messages: [
      { id: 1, from: "agency", text: "Hola Carlos! Te damos la bienvenida al portal de 2bleA. Ya arrancamos con la etapa de diseño de tu landing.", time: "10 May · 09:15", read: true },
      { id: 2, from: "client", text: "Perfecto! ¿Cuándo van a tener algo para ver?", time: "10 May · 10:02", read: true },
      { id: 3, from: "agency", text: "Mañana a la tarde te enviamos los primeros mockups del diseño. Cualquier cambio lo coordinamos por acá.", time: "10 May · 10:05", read: true },
      { id: 4, from: "client", text: "¿El sistema de turnos va a tener notificaciones por WhatsApp?", time: "11 May · 11:20", read: true },
      { id: 5, from: "agency", text: "Sí! La confirmación automática incluye notificaciones por WhatsApp tanto para vos como para el cliente que reserva el turno.", time: "11 May · 11:35", read: true },
      { id: 6, from: "agency", text: "Ya terminamos el diseño y pasamos a desarrollo. Estimamos entrega en 3-4 días hábiles.", time: "13 May · 14:10", read: true },
    ],
    files: [
      { id: 1, name: "logo_elpunto.png", type: "image", size: "142 KB", status: "received", date: "10 May 2026", from: "client", preview: "logo" },
      { id: 2, name: "fotos_barberia.zip", type: "document", size: "8.4 MB", status: "received", date: "10 May 2026", from: "client" },
      { id: 3, name: "mockup_home.png", type: "image", size: "1.1 MB", status: "received", date: "12 May 2026", from: "agency", preview: "mockup" },
      { id: 4, name: "mockup_turnos.png", type: "image", size: "980 KB", status: "received", date: "12 May 2026", from: "agency", preview: "turnos" },
      { id: 5, name: "textos_web.docx", type: "document", size: "34 KB", status: "pending", date: "Pendiente", from: "client" },
    ],
  },

  "STORE-2026": {
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
    features: [
      "Catálogo de productos",
      "Carrito de compras",
      "Integración Mercado Pago",
      "Panel de administración",
      "SEO avanzado",
      "Diseño responsive",
      "Filtros por categoría y talle",
    ],
    payments: [
      { label: "Anticipo (40%)", amount: 52000, paid: true, date: "5 Mayo 2026" },
      { label: "Cuota intermedia (30%)", amount: 39000, paid: false, date: "15 Mayo 2026" },
      { label: "Saldo final (30%)", amount: 39000, paid: false, date: "Al entregar" },
    ],
    messages: [
      { id: 1, from: "agency", text: "Hola Valentina! Bienvenida al portal de seguimiento de tu e-commerce. Arrancamos esta semana con la arquitectura y el diseño.", time: "5 May · 10:00", read: true },
      { id: 2, from: "client", text: "Excelente! ¿Van a poder usar los colores de mi marca? Tengo el manual de marca listo.", time: "5 May · 10:30", read: true },
      { id: 3, from: "agency", text: "Por supuesto, mandanos el manual y lo integramos desde el primer mockup. También necesitamos el catálogo de productos inicial.", time: "5 May · 10:45", read: true },
      { id: 4, from: "client", text: "Ya lo subo por acá. Son unas 40 prendas para empezar.", time: "6 May · 09:15", read: true },
      { id: 5, from: "agency", text: "Perfecto. Estamos armando los wireframes de la home y la página de producto. En 3 días tenés los primeros diseños para revisar.", time: "7 May · 14:00", read: true },
    ],
    files: [
      { id: 1, name: "manual_marca_zafiro.pdf", type: "document", size: "3.2 MB", status: "received", date: "6 May 2026", from: "client" },
      { id: 2, name: "catalogo_inicial.xlsx", type: "document", size: "245 KB", status: "received", date: "6 May 2026", from: "client" },
      { id: 3, name: "wireframe_home.png", type: "image", size: "780 KB", status: "received", date: "8 May 2026", from: "agency", preview: "mockup" },
      { id: 4, name: "fotos_productos.zip", type: "document", size: "22 MB", status: "pending", date: "Pendiente", from: "client" },
    ],
  },

  "FITNESS-2026": {
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
    features: [
      "Diseño responsive premium",
      "Sistema de reserva de clases",
      "Galería y videos de instalaciones",
      "Integración Instagram feed",
      "Precios y planes",
      "SEO local avanzado",
      "Formulario de contacto y WhatsApp",
    ],
    payments: [
      { label: "Anticipo (50%)", amount: 42500, paid: true, date: "28 Abril 2026" },
      { label: "Saldo final (50%)", amount: 42500, paid: false, date: "Al entregar" },
    ],
    messages: [
      { id: 1, from: "agency", text: "Hola Rodrigo! Ya tenemos el sitio casi listo. Entramos en la fase de revisión final esta semana.", time: "28 Abr · 09:00", read: true },
      { id: 2, from: "client", text: "Genial! ¿Puedo ver algo ya?", time: "28 Abr · 09:20", read: true },
      { id: 3, from: "agency", text: "Sí, te pasamos el link de previsualización en las próximas horas. Anotá todo lo que quieras ajustar.", time: "28 Abr · 09:35", read: true },
      { id: 4, from: "client", text: "Vi el diseño, está muy bueno! Solo cambiaría el color del botón de reservas a naranja como el logo.", time: "2 May · 16:00", read: true },
      { id: 5, from: "agency", text: "Listo, actualizamos el botón. También ajustamos el espaciado en mobile que estaba un poco justo.", time: "3 May · 11:00", read: true },
      { id: 6, from: "agency", text: "Ya subimos los últimos cambios. Revisá y avisanos si quedó todo bien para coordinar la entrega final.", time: "13 May · 10:30", read: true },
    ],
    files: [
      { id: 1, name: "logo_olympus.svg", type: "image", size: "48 KB", status: "received", date: "29 Abr 2026", from: "client", preview: "logo" },
      { id: 2, name: "fotos_gym.zip", type: "document", size: "34 MB", status: "received", date: "29 Abr 2026", from: "client" },
      { id: 3, name: "preview_home.png", type: "image", size: "2.1 MB", status: "received", date: "3 May 2026", from: "agency", preview: "mockup" },
      { id: 4, name: "preview_clases.png", type: "image", size: "1.8 MB", status: "received", date: "3 May 2026", from: "agency", preview: "turnos" },
      { id: 5, name: "preview_mobile.png", type: "image", size: "890 KB", status: "received", date: "5 May 2026", from: "agency", preview: "logo" },
    ],
  },
};

export const VALID_CODES = Object.keys(PROJECTS);
