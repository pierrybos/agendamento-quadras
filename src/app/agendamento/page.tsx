"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Price {
  id: number;
  type: string;
  duration: number;
  value: number;
}

interface QuadraPrice {
  id: number;
  price: Price;
}

interface Horario {
  id: number;
  start: string;
  end: string;
}

interface Quadra {
  id: number;
  name: string;
  location: string;
  description: string | null;
  empresa: {
    name: string;
  };
  prices: QuadraPrice[];
  horarios: Horario[];
}

export default function ClienteAgendamento() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [selectedQuadra, setSelectedQuadra] = useState<number | null>(null);
  const [selectedHorario, setSelectedHorario] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchQuadras() {
      try {
        const response = await fetch("/api/quadras");
        if (!response.ok) {
          throw new Error("Erro ao carregar quadras");
        }
        const data = await response.json();
        setQuadras(data);
      } catch (error) {
        setError("Erro ao carregar as quadras. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }
    fetchQuadras();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedQuadra || !selectedHorario || !selectedPrice) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quadraId: selectedQuadra,
          horarioId: selectedHorario,
          priceId: selectedPrice,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer agendamento");
      }

      const data = await response.json();
      router.push(`/agendamentos/${data.id}`);
    } catch (error) {
      setError("Erro ao fazer o agendamento. Tente novamente mais tarde.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  const selectedQuadraData = quadras.find((q) => q.id === selectedQuadra);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Agendamento de Quadras</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seleção de Quadra */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione a Quadra
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quadras.map((quadra) => (
              <div
                key={quadra.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedQuadra === quadra.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setSelectedQuadra(quadra.id)}
              >
                <h3 className="font-semibold">{quadra.name}</h3>
                <p className="text-sm text-gray-600">{quadra.location}</p>
                <p className="text-sm text-gray-500">{quadra.empresa.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Seleção de Horário */}
        {selectedQuadraData && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Horário
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {selectedQuadraData.horarios.map((horario) => (
                <button
                  key={horario.id}
                  type="button"
                  className={`p-2 text-sm border rounded-md ${
                    selectedHorario === horario.id
                      ? "bg-blue-500 text-white"
                      : "hover:border-blue-300"
                  }`}
                  onClick={() => setSelectedHorario(horario.id)}
                >
                  {new Date(horario.start).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {new Date(horario.end).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Seleção de Preço */}
        {selectedQuadraData && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Plano
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedQuadraData.prices.map(({ price }) => (
                <button
                  key={price.id}
                  type="button"
                  className={`p-4 border rounded-lg text-center ${
                    selectedPrice === price.id
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-blue-300"
                  }`}
                  onClick={() => setSelectedPrice(price.id)}
                >
                  <div className="font-semibold">
                    {price.type === "mensalista" ? "Mensalista" : "Normal"}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    R$ {price.value.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {price.duration}h de jogo
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Botão de Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!selectedQuadra || !selectedHorario || !selectedPrice}
          >
            Confirmar Agendamento
          </button>
        </div>
      </form>
    </div>
  );
}