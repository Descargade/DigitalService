export const MOCK_PROJECT = {
  clientName: "Carlos Martínez",
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
};
