export interface Quadra {
  id: number;
  name: string;
  location: string;
  description?: string;
    isActive: boolean; // Exclusão lógica
  createdAt: string;
}

export interface Preco {
  id: number;
  duration: number;
  type: string;
  value: number;
  quadraId: number;
    isActive: boolean; // Exclusão lógica
  createdAt: string;
}

export interface Horario {
  id: number;
  start: string;
  end: string;
  quadraId: number;
    isActive: boolean; // Exclusão lógica
  createdAt: string;
}

export interface Agendamento {
  id: number;
  userId: number;
  quadraId: number;
  horarioId: number;
  status: "pending" | "confirmed" | "cancelled";
  totalValue: number;
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: "pix" | "credit_card" | "cash";
  paymentReference?: string | null;
  isActive: boolean; // Exclusão lógica
  createdAt: string;
}
