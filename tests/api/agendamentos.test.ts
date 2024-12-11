import { PrismaClient } from "@prisma/client";
import request from "supertest";
import { Agendamento } from "../../types";
const mockData = require("../../__mocks__/@prisma/mockData");

jest.mock("supertest");

const prisma = new PrismaClient();
const baseUrl = "/api";

describe("Agendamentos API", () => {
  beforeEach(() => {
    mockData.agendamentos = [
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
  });

  it("Deve listar todos os agendamentos", async () => {
    const response = await request(baseUrl).get("/agendamentos");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData.agendamentos);
  });

  it("Deve criar um novo agendamento", async () => {
    const newAgendamento = {
      userId: 3,
      quadraId: 1,
      horarioId: 3,
      status: "pending",
      totalValue: 80.0,
      paymentStatus: "pending",
      paymentMethod: "pix",
    };

    const response = await request(baseUrl)
      .post("/agendamentos")
      .send(newAgendamento);
    expect(response.status).toBe(201);
    expect(response.body.userId).toBe(newAgendamento.userId);
  });

  it("Deve atualizar um agendamento", async () => {
    const updatedAgendamento = { id: 1, status: "confirmed" };

    const response = await request(baseUrl)
      .put(`/agendamentos/${updatedAgendamento.id}`)
      .send(updatedAgendamento);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(updatedAgendamento.status);
  });

  it("Deve excluir um agendamento", async () => {
    const response = await request(baseUrl).delete(`/agendamentos/1`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Agendamento removido com sucesso");


      // Verificar se isActive foi alterado
  const desativado = mockData.agendamentos.find((a:Agendamento) => a.id === 1);
  expect(desativado.isActive).toBe(false);
  });
});
