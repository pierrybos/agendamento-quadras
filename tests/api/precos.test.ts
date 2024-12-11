import { PrismaClient } from "@prisma/client";
import request from "supertest";
const mockData = require("../../__mocks__/@prisma/mockData");
import { Preco } from "../../types";

jest.mock("supertest");

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    preco: {
      findMany: jest.fn(() => Promise.resolve(mockData.precos)),
      create: jest.fn(({ data }) => {
        const newId = mockData.precos.length + 1;
        const newPreco = { id: newId, ...data };
        mockData.precos.push(newPreco);
        return Promise.resolve(newPreco);
      }),
      update: jest.fn(({ data, where }) => {
        const preco = mockData.precos.find((p:Preco) => p.id === where.id);
        if (!preco) throw new Error("Preço não encontrado");
        Object.assign(preco, data);
        return Promise.resolve(preco);
      }),
      delete: jest.fn(({ where }) => {
        const index = mockData.precos.findIndex((p:Preco) => p.id === where.id);
        if (index === -1) throw new Error("Preço não encontrado");
        const [deleted] = mockData.precos.splice(index, 1);
        return Promise.resolve(deleted);
      }),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();
const baseUrl = "/api";

describe("Preços API", () => {
  beforeEach(() => {
    mockData.precos = [
      { id: 1, duration: 1, type: "mensalista", value: 70.0 },
      { id: 2, duration: 2, type: "normal", value: 120.0 },
    ];
  });

  it("Deve listar todos os preços", async () => {
    const response = await request(baseUrl).get("/precos");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData.precos);
  });

  it("Deve criar um novo preço", async () => {
    const newPreco = { duration: 1, type: "normal", value: 80.0 };
    const response = await request(baseUrl).post("/precos").send(newPreco);
    expect(response.status).toBe(201);
    expect(response.body.type).toBe(newPreco.type);
  });

  it("Deve atualizar um preço", async () => {
    const updatedPreco = { id: 1, duration: 2, type: "mensalista", value: 140.0 };
    const response = await request(baseUrl).put(`/precos/${updatedPreco.id}`).send(updatedPreco);
    expect(response.status).toBe(200);
    expect(response.body.value).toBe(updatedPreco.value);
  });

  it("Deve excluir um preço", async () => {
    const response = await request(baseUrl).delete(`/precos/1`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Preço excluído com sucesso");
  });
});
