/** @typedef {import('./types').Quadra} Quadra */
/** @typedef {import('./types').Preco} Preco */
/** @typedef {import('./types').Horario} Horario */

/** @type {Quadra[]} */
const quadras = [
  { id: 1, name: "Quadra 1", location: "Local A", description: "Quadra coberta" },
  { id: 2, name: "Quadra 2", location: "Local B", description: "Quadra descoberta" },
];

/** @type {Preco[]} */
const precos = [
  { id: 1, duration: 1, type: "mensalista", value: 70.0, quadraId: 1 },
  { id: 2, duration: 2, type: "normal", value: 120.0, quadraId: 2 },
];

/** @type {Horario[]} */
const horarios = [
  { id: 1, start: "2024-12-09T19:00:00Z", end: "2024-12-09T20:00:00Z", quadraId: 1 },
  { id: 2, start: "2024-12-09T20:00:00Z", end: "2024-12-09T21:00:00Z", quadraId: 2 },
];

const agendamentos = [
  {
      id: 1,
      userId: 1,
      quadraId: 1,
      horarioId: 1,
      status: "pending",
      totalValue: 70.0,
      paymentStatus: "pending",
      paymentMethod: "pix",
      paymentReference: null,
      createdAt: "2024-12-09T10:00:00Z",
    },
    {
      id: 2,
      userId: 2,
      quadraId: 2,
      horarioId: 2,
      status: "confirmed",
      totalValue: 140.0,
      paymentStatus: "paid",
      paymentMethod: "pix",
      paymentReference: "PIX123",
      createdAt: "2024-12-09T11:00:00Z",
    },
];

const newAgendamento = {
  userId: 1,
  quadraId: 1,
  horarioId: 1,
  totalValue: 70.0,
};

module.exports = { quadras, precos, horarios, agendamentos, newAgendamento };
