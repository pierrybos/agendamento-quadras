import { PrismaClient } from "@prisma/client";
import request from "supertest";
const mockData = require("../../__mocks__/@prisma/mockData");
import { Quadra } from "../../types";

jest.mock("supertest");

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    quadra: {
      findMany: jest.fn(() => Promise.resolve(mockData.quadras)),
      create: jest.fn(({ data }) => {
        const newId = mockData.quadras.length + 1;
        const newQuadra = { id: newId, ...data };
        mockData.quadras.push(newQuadra);
        return Promise.resolve(newQuadra);
      }),
      update: jest.fn(({ data, where }) => {
        const quadra = mockData.quadras.find((q : Quadra) => q.id === where.id);
        if (!quadra) throw new Error("Quadra não encontrada");
        Object.assign(quadra, data);
        return Promise.resolve(quadra);
      }),
      delete: jest.fn(({ where }) => {
        const index = mockData.quadras.findIndex((q : Quadra) => q.id === where.id);
        if (index === -1) throw new Error("Quadra não encontrada");
        const [deleted] = mockData.quadras.splice(index, 1);
        return Promise.resolve(deleted);
      }),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();
const baseUrl = "/api";

describe("Quadras API", () => {
  beforeEach(() => {
    mockData.quadras = [
      { id: 1, name: "Quadra 1", location: "Rua A", description: "Quadra coberta" },
      { id: 2, name: "Quadra 2", location: "Rua B", description: "Quadra descoberta" },
    ];
  });

  it("Deve listar todas as quadras", async () => {
    const response = await request(baseUrl).get("/quadras");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData.quadras);
  });

  it("Deve criar uma nova quadra", async () => {
    const newQuadra = { name: "Quadra Nova", location: "Rua Nova", description: "Muito legal" };
    const response = await request(baseUrl).post("/quadras").send(newQuadra);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newQuadra.name);
  });

  it("Deve atualizar uma quadra", async () => {
    const updatedQuadra = { id: 1, name: "Quadra Atualizada", location: "Rua Atualizada" };
    const response = await request(baseUrl).put(`/quadras/${updatedQuadra.id}`).send(updatedQuadra);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedQuadra.name);
  });

  it("Deve excluir uma quadra", async () => {
    const response = await request(baseUrl).delete(`/quadras/1`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Quadra excluída com sucesso");
  });
});
