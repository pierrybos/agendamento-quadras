"use client";

import { useEffect, useState } from "react";

export default function ClienteAgendamento() {
  const [quadras, setQuadras] = useState([]);

  useEffect(() => {
    async function fetchQuadras() {
      const response = await fetch("/api/courts");
      const data = await response.json();
      setQuadras(data);
    }
    fetchQuadras();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Agendamento de Quadras</h1>
      <ul className="space-y-4">
        {quadras.map((quadra) => (
          <li key={quadra.id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">{quadra.name}</h2>
            <p className="text-sm text-gray-600">{quadra.location}</p>
            <p className="text-sm text-gray-600">{quadra.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}