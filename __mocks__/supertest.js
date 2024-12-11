const mockData = require("./@prisma/mockData");

// Função para extrair o ID da URL
const getIdFromUrl = (url) => parseInt(url.split("/").pop(), 10);

// Mock do `supertest`
const mockSupertest = {
  get: jest.fn((url) =>
    Promise.resolve({
      status: 200,
      body: url === "/quadras"
        ? mockData.quadras
        : url === "/precos"
        ? mockData.precos
        : url === "/horarios"
        ? mockData.horarios
        : url === "/agendamentos"
        ? mockData.agendamentos
        : { message: "Route not found" },
    })
  ),
  post: jest.fn((url) => ({
    send: jest.fn((body) => {
      switch (url) {
        case "/quadras":
          const newQuadra = { id: mockData.quadras.length + 1, ...body };
          mockData.quadras.push(newQuadra);
          return Promise.resolve({ status: 201, body: newQuadra });
        case "/precos":
          const newPreco = { id: mockData.precos.length + 1, ...body };
          mockData.precos.push(newPreco);
          return Promise.resolve({ status: 201, body: newPreco });
        case "/horarios":
          const newHorario = { id: mockData.horarios.length + 1, ...body };
          mockData.horarios.push(newHorario);
          return Promise.resolve({ status: 201, body: newHorario });
        case "/agendamentos":
          const newAgendamento = { id: mockData.agendamentos.length + 1, ...body };
          mockData.agendamentos.push(newAgendamento);
          return Promise.resolve({ status: 201, body: newAgendamento });
        default:
          return Promise.resolve({ status: 404, body: { message: "Route not found" } });
      }
    }),
  })),
  put: jest.fn((url) => ({
    send: jest.fn((body) => {
      const id = getIdFromUrl(url);
      let updated;
      switch (true) {
        case url.startsWith("/quadras"):
          updated = mockData.quadras.find((q) => q.id === id);
          break;
        case url.startsWith("/precos"):
          updated = mockData.precos.find((p) => p.id === id);
          break;
        case url.startsWith("/horarios"):
          updated = mockData.horarios.find((h) => h.id === id);
          break;
        case url.startsWith("/agendamentos"):
          updated = mockData.agendamentos.find((h) => h.id === id);
          break;
      }
      if (!updated) {
        return Promise.resolve({ status: 404, body: { message: "Not found" } });
      }
      Object.assign(updated, body);
      return Promise.resolve({ status: 200, body: updated });
    }),
  })),
  delete: jest.fn((url) => {
    const id = getIdFromUrl(url);
    let index;
    let message;
    switch (true) {
      case url.startsWith("/quadras"):
        message = "Quadra excluída com sucesso";
        index = mockData.quadras.findIndex((q) => q.id === id);
        break;
      case url.startsWith("/precos"):
        message = "Preço excluído com sucesso";
        index = mockData.precos.findIndex((p) => p.id === id);
        break;
      case url.startsWith("/horarios"):
        message = "Horário excluído com sucesso";
        index = mockData.horarios.findIndex((h) => h.id === id);
        break;
      case url.startsWith("/agendamentos"):
        message = "Agendamento removido com sucesso";
        index = mockData.agendamentos.findIndex((h) => h.id === id);
        mockData.agendamentos[index].isActive = false;
        break;
    }
    if (index === -1) {
      return Promise.resolve({ status: 404, body: { message: "Not found" } });
    }
    mockData.quadras.splice(index, 1);
    return Promise.resolve({ status: 200, body: { message } });
  }),
};

// Mock do próprio `supertest`
module.exports = jest.fn(() => mockSupertest);
