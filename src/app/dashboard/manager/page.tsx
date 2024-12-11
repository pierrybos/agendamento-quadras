"use client";

import { useEffect, useState } from "react";

export default function ManagerDashboard() {
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
      <h1 className="text-2xl font-bold mb-4">Dashboard Gerente</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Nome</th>
            <th className="py-2 px-4">Localização</th>
            <th className="py-2 px-4">Descrição</th>
          </tr>
        </thead>
        <tbody>
          {quadras.map((quadra) => (
            <tr key={quadra.id} className="border-t">
              <td className="py-2 px-4">{quadra.id}</td>
              <td className="py-2 px-4">{quadra.name}</td>
              <td className="py-2 px-4">{quadra.location}</td>
              <td className="py-2 px-4">{quadra.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}