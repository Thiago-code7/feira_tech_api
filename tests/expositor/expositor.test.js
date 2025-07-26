const request = require('supertest');
const app = require('../../index');
const { sequelize } = require('../../config/configDB');
const Expositor = require('../../src/modules/expositor/models/expositorModel');

beforeEach(async () => {
  await sequelize.sync({ force: true }); // limpa o banco antes de cada teste
});

afterAll(async () => {
  await sequelize.close();
});

describe('Testes de Expositores', () => {
  test('POST /expositores - Criar expositor com sucesso', async () => {
    const res = await request(app).post('/expositores').send({
      nome: 'Ana',
      email: 'ana@email.com',
      instituicao: 'USP'
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('msg', 'Expositor cadastrado com sucesso');
    expect(res.body).toHaveProperty('expositor');
    expect(res.body.expositor.email).toBe('ana@email.com');
  });

  test('POST /expositores - Email duplicado', async () => {
    await Expositor.create({
      nome: 'Carlos',
      email: 'carlos@email.com',
      instituicao: 'UFSC'
    });

    const res = await request(app).post('/expositores').send({
      nome: 'Carlos 2',
      email: 'carlos@email.com',
      instituicao: 'UFSC'
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('msg', 'Email já cadastrado');
  });

  test('POST /expositores - Campos obrigatórios ausentes', async () => {
    const res = await request(app).post('/expositores').send({
      nome: '',
      email: '',
      instituicao: ''
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('msg', 'Campos obrigatórios não informados');
  });

  test('GET /expositores - Listar expositores', async () => {
    await Expositor.bulkCreate([
      { nome: 'Maria', email: 'maria@email.com', instituicao: 'UFBA' },
      { nome: 'João', email: 'joao@email.com', instituicao: 'UFMG' },
    ]);

    const res = await request(app).get('/expositores');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  test('GET /expositores/:id - Buscar expositor por ID existente', async () => {
    const expositor = await Expositor.create({
      nome: 'Pedro',
      email: 'pedro@email.com',
      instituicao: 'PUC'
    });

    const res = await request(app).get(`/expositores/${expositor.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('email', 'pedro@email.com');
  });

  test('GET /expositores/:id - Buscar expositor por ID inexistente', async () => {
    const res = await request(app).get('/expositores/9999');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('msg', 'Expositor não encontrado');
  });

  test('DELETE /expositores/:id - Remover expositor existente', async () => {
    const expositor = await Expositor.create({
      nome: 'Lucas',
      email: 'lucas@email.com',
      instituicao: 'UFSC'
    });

    const res = await request(app).delete(`/expositores/${expositor.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('msg', 'Expositor removido com sucesso');
  });

  test('PUT /expositores/:id - Atualizar expositor existente', async () => {
    const expositor = await Expositor.create({
      nome: 'Renata',
      email: 'renata@email.com',
      instituicao: 'UnB'
    });

    const res = await request(app).put(`/expositores/${expositor.id}`).send({
      nome: 'Renata Silva',
      email: 'renata@email.com',
      instituicao: 'UnB'
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('msg', 'Expositor atualizado com sucesso');
    expect(res.body.expositor.nome).toBe('Renata Silva');
  });
});
