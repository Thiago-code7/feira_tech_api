const ExpositorModel = require('../src/modules/expositor/models/expositorModel');
const { sequelize } = require('../src/config/configDB');
const app = require('../index');
const request = require('supertest');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

afterEach(async () => {
  await ExpositorModel.truncate();
});

describe('Testes integração - Expositor POST', () => {
  test('Deve criar expositor corretamente', async () => {
    const res = await request(app).post('/expositores').send({ nome: 'João Silva', email: 'joao@example.com' });
    expect(res.status).toBe(201);
    expect(res.body.expositor).toHaveProperty('id');
    expect(res.body.expositor.nome).toBe('João Silva');
    expect(res.body.msg).toBe('Expositor cadastrado com sucesso!');
  });

  test('Deve falhar ao criar expositor sem nome ou email', async () => {
    const res1 = await request(app).post('/expositores').send({ email: 'joao@example.com' });
    expect(res1.status).toBe(400);
    expect(res1.body.msg).toBe('Campos obrigatórios não informados!');

    const res2 = await request(app).post('/expositores').send({ nome: 'João Silva' });
    expect(res2.status).toBe(400);
    expect(res2.body.msg).toBe('Campos obrigatórios não informados!');
  });
});

describe('Testes integração - Expositor GET listar', () => {
  test('Deve retornar array vazio se não houver expositores', async () => {
    const res = await request(app).get('/expositores');
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('Deve listar expositores', async () => {
    await request(app).post('/expositores').send({ nome: 'Ana', email: 'ana@example.com' });
    const res = await request(app).get('/expositores');
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('nome');
  });
});

describe('Testes integração - Expositor GET/:id', () => {
  test('Deve buscar expositor pelo ID', async () => {
    const resCreate = await request(app).post('/expositores').send({ nome: 'Carlos', email: 'carlos@example.com' });
    const id = resCreate.body.expositor.id;

    const res = await request(app).get(`/expositores/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('nome', 'Carlos');
  });

  test('Deve retornar 404 para expositor inexistente', async () => {
    const res = await request(app).get('/expositores/9999');
    expect(res.status).toBe(404);
    expect(res.body.msg).toBe('Expositor não encontrado');
  });
});

describe('Testes integração - Expositor PUT', () => {
  test('Deve atualizar expositor', async () => {
    const resCreate = await request(app).post('/expositores').send({ nome: 'Marcos', email: 'marcos@example.com' });
    const id = resCreate.body.expositor.id;

    const resUpdate = await request(app).put(`/expositores/${id}`).send({ nome: 'Marcos Silva', email: 'marcos.silva@example.com' });
    expect(resUpdate.status).toBe(201);
    expect(resUpdate.body.msg).toBe('Expositor atualizado com sucesso!');

    const resGet = await request(app).get(`/expositores/${id}`);
    expect(resGet.body.nome).toBe('Marcos Silva');
  });

  test('Deve retornar 404 ao atualizar expositor inexistente', async () => {
    const res = await request(app).put('/expositores/9999').send({ nome: 'Nome', email: 'email@example.com' });
    expect(res.status).toBe(404);
    expect(res.body.msg).toBe('Expositor não encontrado');
  });

  test('Deve retornar 400 ao atualizar com dados inválidos', async () => {
    const resCreate = await request(app).post('/expositores').send({ nome: 'Laura', email: 'laura@example.com' });
    const id = resCreate.body.expositor.id;

    const resUpdate = await request(app).put(`/expositores/${id}`).send({ nome: '', email: '' });
    expect(resUpdate.status).toBe(400);
    expect(resUpdate.body.msg).toBe('Campos obrigatórios não informados!');
  });
});

describe('Testes integração - Expositor DELETE', () => {
  test('Deve deletar expositor existente', async () => {
    const resCreate = await request(app).post('/expositores').send({ nome: 'Pedro', email: 'pedro@example.com' });
    const id = resCreate.body.expositor.id;

    const resDelete = await request(app).delete(`/expositores/${id}`);
    expect(resDelete.status).toBe(200);
    expect(resDelete.body.msg).toBe('Expositor removido com sucesso!');

    const resGet = await request(app).get(`/expositores/${id}`);
    expect(resGet.status).toBe(404);
  });

  test('Deve retornar 404 ao deletar expositor inexistente', async () => {
    const res = await request(app).delete('/expositores/9999');
    expect(res.status).toBe(404);
    expect(res.body.msg).toBe('Expositor não encontrado');
  });
});
