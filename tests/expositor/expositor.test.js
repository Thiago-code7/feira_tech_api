const request = require('supertest');
const app = require('../../index');
const { sequelize } = require('../../config/configDB');
const Expositor = require('../../src/modules/expositor/models/expositorModel');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Limpa o banco antes dos testes
});

afterAll(async () => {
  await sequelize.close();
});

describe('Expositor API', () => {
  let expositorId;

  test('POST /expositores - criar expositor', async () => {
    const response = await request(app)
      .post('/expositores')
      .send({
        nome: 'Fulano',
        email: 'fulano@example.com',
        instituicao: 'Universidade X'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.expositor).toHaveProperty('id');
    expositorId = response.body.expositor.id;
  });

  test('GET /expositores - listar expositores', async () => {
    const response = await request(app).get('/expositores');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /expositores/:id - buscar expositor por id', async () => {
    const response = await request(app).get(`/expositores/${expositorId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', expositorId);
  });

  test('PUT /expositores/:id - atualizar expositor', async () => {
    const response = await request(app)
      .put(`/expositores/${expositorId}`)
      .send({
        nome: 'Fulano Atualizado',
        email: 'fulano_atualizado@example.com',
        instituicao: 'Universidade Y'
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.msg).toBe('Expositor atualizado com sucesso!');
  });

  test('DELETE /expositores/:id - deletar expositor', async () => {
    const response = await request(app).delete(`/expositores/${expositorId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.msg).toBe('Expositor removido com sucesso');
  });
});
