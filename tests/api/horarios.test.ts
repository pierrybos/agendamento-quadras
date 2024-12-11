import { PrismaClient } from "@prisma/client";
import request from "supertest";
const mockData = require("../../__mocks__/@prisma/mockData");
import { Horario } from "../../types";

jest.mock("supertest");

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    horario: {
      findMany: jest.fn(() => Promise.resolve(mockData.horarios)),
      create: jest.fn(({ data }) => {
        const newId = mockData.horarios.length + 1;
        const newHorario = { id: newId, ...data };
        mockData.horarios.push(newHorario);
        return Promise.resolve(newHorario);
      }),
      update: jest.fn(({ data, where }) => {
        const horario = mockData.horarios.find(
          (h:Horario) => h.id === where.id);
        if (!horario) throw new Error("Horário não encontrado");
        Object.assign(horario, data);
        return Promise.resolve(horario);
      }),
      delete: jest.fn(({ where }) => {
        const index = mockData.horarios.findIndex(
          (h:Horario) => h.id === where.id);
        if (index === -1) throw new Error("Horário não encontrado");
        const [deleted] = mockData.horarios.splice(index, 1);
        return Promise.resolve(deleted);
      }),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();
const baseUrl = '/api';

describe("Horários API", () => {
  beforeEach(() => {
    mockData.horarios = [
      { id: 1, start: "2024-12-09T19:00:00Z", end: "2024-12-09T20:00:00Z", quadraId: 1 },
      { id: 2, start: "2024-12-09T20:00:00Z", end: "2024-12-09T21:00:00Z", quadraId: 2 },
    ];
  });

  it("Deve listar todos os horários", async () => {
    const response = await request(baseUrl).get("/horarios");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData.horarios);
  });

  it("Deve criar um novo horário", async () => {
    const newHorario = { start: "2024-12-10T19:00:00Z", end: "2024-12-10T20:00:00Z", quadraId: 1 };
    const response = await request(baseUrl).post("/horarios").send(newHorario);
    expect(response.status).toBe(201);
    expect(response.body.start).toBe(newHorario.start);
  });

  it("Deve atualizar um horário", async () => {
    const updatedHorario = { id: 1, start: "2024-12-10T20:00:00Z", end: "2024-12-10T21:00:00Z" };
    const response = await request(baseUrl).put(`/horarios/${updatedHorario.id}`).send(updatedHorario);
    expect(response.status).toBe(200);
    expect(response.body.start).toBe(updatedHorario.start);
  });

  it("Deve excluir um horário", async () => {
    const response = await request(baseUrl).delete(`/horarios/1`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Horário excluído com sucesso");
  });
});
