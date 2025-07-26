const request = require('supertest');
const app = require('../../index');
const { sequelize } = require('../../config/configDB');
const Prototipo = require('../../src/modules/prototipo/models/prototipoModel');
const Expositor = require('../../src/modules/expositor/models/expositorModel');

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Testes de Protótipos', () => {
  test('POST /prototipos - Criar protótipo com sucesso', async () => {
    const expositor = await Expositor.create({
      nome: 'Ana',
      email: 'ana@email.com',
      instituicao: 'USP'
    });

    const res = await request(app).post('/prototipos').send({
      titulo: 'Robô Voador',
      descricao: 'Protótipo de drone',
      categoria: 'Robótica',
      expositorId: expositor.id
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('msg', 'Protótipo cadastrado com sucesso');
    expect(res.body).toHaveProperty('prototipo');
    expect(res.body.prototipo.titulo).toBe('Robô Voador');
  });

  test('POST /prototipos - Título duplicado para mesmo expositor', async () => {
    const expositor = await Expositor.create({
      nome: 'Carlos',
      email: 'carlos@email.com',
      instituicao: 'UFSC'
    });

    await Prototipo.create({
      titulo: 'Drone X',
      descricao: 'Drone avançado',
      categoria: 'Robótica',
      expositorId: expositor.id
    });

    const res = await request(app).post('/prototipos').send({
      titulo: 'Drone X',
      descricao: 'Novo drone',
      categoria: 'Robótica',
      expositorId: expositor.id
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('msg', 'Protótipo com este título já cadastrado para este expositor');
  });

  test('POST /prototipos - Campos obrigatórios ausentes', async () => {
    const res = await request(app).post('/prototipos').send({
      titulo: '',
      descricao: '',
      categoria: '',
      expositorId: null
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('msg', 'Campos obrigatórios não informados');
  });

  test('GET /prototipos - Listar protótipos', async () => {
    const expositor = await Expositor.create({
      nome: 'Julia',
      email: 'julia@email.com',
      instituicao: 'PUC'
    });

    await Prototipo.bulkCreate([
      {
        titulo: 'App 1',
        descricao: 'App 1 descrição',
        categoria: 'Software',
        expositorId: expositor.id
      },
      {
        titulo: 'App 2',
        descricao: 'App 2 descrição',
        categoria: 'Software',
        expositorId: expositor.id
      }
    ]);

    const res = await request(app).get('/prototipos');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  test('GET /prototipos/:id - Buscar protótipo por ID existente', async () => {
    const expositor = await Expositor.create({
      nome: 'Lucas',
      email: 'lucas@email.com',
      instituicao: 'UFBA'
    });

    const prototipo = await Prototipo.create({
      titulo: 'Drone Inteligente',
      descricao: 'Drone com IA',
      categoria: 'Robótica',
      expositorId: expositor.id
    });

    const res = await request(app).get(`/prototipos/${prototipo.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('titulo', 'Drone Inteligente');
  });

  test('GET /expositores/:id/prototipos - Listar protótipos de um expositor', async () => {
    const expositor = await Expositor.create({
      nome: 'Mateus',
      email: 'mateus@email.com',
      instituicao: 'USP'
    });

    await Prototipo.bulkCreate([
      {
        titulo: 'Casa Inteligente',
        descricao: 'Automação residencial',
        categoria: 'IoT',
        expositorId: expositor.id
      },
      {
        titulo: 'Sensor de Movimento',
        descricao: 'Sensor para segurança',
        categoria: 'IoT',
        expositorId: expositor.id
      }
    ]);

    const res = await request(app).get(`/expositores/${expositor.id}/prototipos`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  test('GET /expositores/:id/prototipos - Expositor inexistente', async () => {
    const res = await request(app).get('/expositores/9999/prototipos');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('msg', 'Expositor não encontrado');
  });

  test('DELETE /prototipos/:id - Remover protótipo existente', async () => {
    const expositor = await Expositor.create({
      nome: 'Marcos',
      email: 'marcos@email.com',
      instituicao: 'UFPR'
    });

    const prototipo = await Prototipo.create({
      titulo: 'Carro Autônomo',
      descricao: 'Veículo inteligente',
      categoria: 'Robótica',
      expositorId: expositor.id
    });

    const res = await request(app).delete(`/prototipos/${prototipo.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('msg', 'Protótipo removido com sucesso');
  });

  test('PUT /prototipos/:id - Atualizar protótipo existente', async () => {
    const expositor = await Expositor.create({
      nome: 'Fernanda',
      email: 'fernanda@email.com',
      instituicao: 'UFPE'
    });

    const prototipo = await Prototipo.create({
      titulo: 'Braço Robótico',
      descricao: 'Protótipo de braço',
      categoria: 'Robótica',
      expositorId: expositor.id
    });

    const res = await request(app).put(`/prototipos/${prototipo.id}`).send({
      titulo: 'Braço Robótico Atualizado',
      descricao: 'Protótipo atualizado',
      categoria: 'Robótica',
      expositorId: expositor.id
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('msg', 'Protótipo atualizado com sucesso');
    expect(res.body.prototipo.titulo).toBe('Braço Robótico Atualizado');
  });
});
