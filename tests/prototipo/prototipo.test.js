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

describe('Testes de Protótipo', () => {
  test('POST /prototipos - deve criar um protótipo com expositor válido', async () => {
    const expositor = await Expositor.create({
      nome: 'João',
      email: 'joao@email.com',
      instituicao: 'UFABC'
    });

    const res = await request(app).post('/prototipos').send({
      titulo: 'Robô Autônomo',
      descricao: 'Protótipo de robô com sensores',
      categoria: 'Robótica',
      expositorId: expositor.id
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('prototipo');
    expect(res.body.prototipo.titulo).toBe('Robô Autônomo');
  });

  test('GET /prototipos - deve listar todos os protótipos', async () => {
    const expositor = await Expositor.create({
      nome: 'Julia',
      email: 'julia@email.com',
      instituicao: 'PUC'
    });

    await Prototipo.create({
      titulo: 'App de Reciclagem',
      descricao: 'App para ensinar reciclagem',
      categoria: 'Software',
      expositorId: expositor.id
    });

    const res = await request(app).get('/prototipos');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /prototipos/:id - deve buscar protótipo por ID', async () => {
    const expositor = await Expositor.create({
      nome: 'Lucas',
      email: 'lucas@email.com',
      instituicao: 'IFSP'
    });

    const prototipo = await Prototipo.create({
      titulo: 'Drone Inteligente',
      descricao: 'Drone com IA embarcada',
      categoria: 'Robótica',
      expositorId: expositor.id
    });

    const res = await request(app).get(`/prototipos/${prototipo.id}`);
    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe('Drone Inteligente');
  });

  test('DELETE /prototipos/:id - deve remover um protótipo', async () => {
    const expositor = await Expositor.create({
      nome: 'Mateus',
      email: 'mateus@email.com',
      instituicao: 'USP'
    });

    const prototipo = await Prototipo.create({
      titulo: 'Casa Inteligente',
      descricao: 'Protótipo de automação',
      categoria: 'IoT',
      expositorId: expositor.id
    });

    const res = await request(app).delete(`/prototipos/${prototipo.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('msg', 'Protótipo removido com sucesso');
  });
});


