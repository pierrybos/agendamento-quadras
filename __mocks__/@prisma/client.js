const mockData = require("./mockData"); // Certifique-se de usar o mesmo padrão

const mockPrisma = {
  quadra: {
    findMany: jest.fn(() => Promise.resolve(mockData.quadras)),
    create: jest.fn((data) => {
      const newId = mockData.quadras.length + 1;
      const newQuadra = { id: newId, ...data.data };
      mockData.quadras.push(newQuadra);
      return Promise.resolve(newQuadra);
    }),
    delete: jest.fn(({ where }) => {
      const index = mockData.quadras.findIndex((q) => q.id === where.id);
      if (index === -1) throw new Error("Quadra não encontrada");
      const deleted = mockData.quadras.splice(index, 1);
      return Promise.resolve(deleted[0]);
    }),
  },
  preco: {
    findMany: jest.fn(() => Promise.resolve(mockData.precos)),
    create: jest.fn((data) => {
      const newId = mockData.precos.length + 1;
      const newPreco = { id: newId, ...data.data };
      mockData.precos.push(newPreco);
      return Promise.resolve(newPreco);
    }),
    delete: jest.fn(({ where }) => {
      const index = mockData.precos.findIndex((p) => p.id === where.id);
      if (index === -1) throw new Error("Preço não encontrado");
      const deleted = mockData.precos.splice(index, 1);
      return Promise.resolve(deleted[0]);
    }),
  },
  horario: {
    findMany: jest.fn(() => Promise.resolve(mockData.horarios)),
    create: jest.fn((data) => {
      const newId = mockData.horarios.length + 1;
      const newHorario = { id: newId, ...data.data };
      mockData.horarios.push(newHorario);
      return Promise.resolve(newHorario);
    }),
    delete: jest.fn(({ where }) => {
      const index = mockData.horarios.findIndex((h) => h.id === where.id);
      if (index === -1) throw new Error("Horário não encontrado");
      const deleted = mockData.horarios.splice(index, 1);
      return Promise.resolve(deleted[0]);
    }),
  },
  agendamento: {
      findMany: jest.fn(() => Promise.resolve(mockData.agendamentos)),
      create: jest.fn(({ data }) => {
        const newId = mockData.agendamentos.length + 1;
        const newAgendamento = { id: newId, ...data };
        mockData.agendamentos.push(newAgendamento);
        return Promise.resolve(newAgendamento);
      }),
      update: jest.fn(({ data, where }) => {
        const agendamento = mockData.agendamentos.find(
          (a) => a.id === where.id
        );
        if (!agendamento) throw new Error("Agendamento não encontrado");
        Object.assign(agendamento, data);
        return Promise.resolve(agendamento);
      }),
      delete: jest.fn(({ where }) => {
        const index = mockData.agendamentos.findIndex((a) => a.id === where.id);
        if (index === -1) throw new Error("Agendamento não encontrado");
        const [deleted] = mockData.agendamentos.splice(index, 1);
        return Promise.resolve(deleted);
      }),
    },
};

module.exports = {
  PrismaClient: jest.fn(() => mockPrisma),
};
