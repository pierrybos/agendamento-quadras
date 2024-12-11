"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    async function fetchEmpresas() {
      const response = await fetch("/api/empresa");
      const data = await response.json();
      setEmpresas(data);
    }
    fetchEmpresas();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Nome</th>
            <th className="py-2 px-4">Contato</th>
            <th className="py-2 px-4">Endereço</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((empresa) => (
            <tr key={empresa.id} className="border-t">
              <td className="py-2 px-4">{empresa.id}</td>
              <td className="py-2 px-4">{empresa.name}</td>
              <td className="py-2 px-4">{empresa.contact}</td>
              <td className="py-2 px-4">{empresa.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}