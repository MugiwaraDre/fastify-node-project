const Fastify = require('fastify');
const userRoute = require('../../src/route/user');
const UserService = require('../../src/service/user.service');

jest.mock('../../src/service/user.service');

const createUser = jest.fn();
const getUserById = jest.fn();

UserService.mockImplementation(() => ({
  getUserById,
  createUser,
}));

let app;

describe('user route', () => {
  beforeAll(async () => {
    app = Fastify();
    app.register(userRoute, { prefix: 'api/v1/users' });

    await app.ready();
  });

  it('should return 201 when called with valid usert data', async () => {
    createUser.mockImplementation(() => 'uuid');

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        firstName: 'dre',
        password: 'password',
        email: 'email@gmail.com',
      },
    });

    expect(res.statusCode).toBe(201);
    expect(res.json().userId).toEqual('uuid');
  });

  it('should return 400 when user service throw error', async () => {
    createUser.mockImplementation(() => {
      throw Error('invalid data');
    });

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        firstName: 'dre',
        password: 'password',
        email: 'email@gmail.com',
      },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json().message).toEqual('invalid data');
  });
  it('should return 400 when email is not in correct format', async () => {
    createUser.mockImplementation(() => 'uuid');

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        firstName: 'dre',
        password: 'password',
        email: 'email',
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 when password and firstName is not present', async () => {
    createUser.mockImplementation(() => 'uuid');

    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/users',
      payload: {
        email: 'email@gmail.com',
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 200 when user exists', async () => {
    getUserById.mockImplementation(() => ({
      id: '686196f0-47b1-454b-9de4-bbca37d29403',
      username: 'dre',
      email: 'email@gmail.com',
      createdAt: '05/01/2022',
      updatedAt: '05/01/2022',
      version: 'fff21f8a-b717-4555-b673-cadc01306948',
    }));

    const res = await app.inject({
      url: 'api/v1/users/686196f0-47b1-454b-9de4-bbca37d29403',
      payload: {
        email: 'email@gmail.com',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      id: '686196f0-47b1-454b-9de4-bbca37d29403',
      username: 'dre',
      email: 'email@gmail.com',
      createdAt: '05/01/2022',
      updatedAt: '05/01/2022',
      version: 'fff21f8a-b717-4555-b673-cadc01306948',
    });
  });

  it('should return 400 when user userId is not valid uuid', async () => {
    getUserById.mockImplementation(() => ({
      id: '686196f0-47b1-454b-9de4-bbca37d29403',
      username: 'dre',
      email: 'email@gmail.com',
      createdAt: '05/01/2022',
      updatedAt: '05/01/2022',
      version: 'fff21f8a-b717-4555-b673-cadc01306948',
    }));

    const res = await app.inject({
      url: 'api/v1/users/some-invalid-uuid',
      payload: {
        email: 'email@gmail.com',
      },
    });

    expect(res.statusCode).toBe(400);
  });
});
