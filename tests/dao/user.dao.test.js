const Fastify = require('fastify');
const userRepository = require('../../src/dao/user.dao');
const dbPlugin = require('../../src/plugin/database');

let app;
describe('User Repository', () => {
  beforeAll(async () => {
    app = Fastify();
    app.register(dbPlugin);

    await app.ready();
  });

  it('should save user in db', async () => {
    const user = {
      firstName: 'dre',
      lastName: 'dev',
      password: 'password',
      email: 'email',
    };

    const { saveUser } = userRepository(app.db);

    const userId = await saveUser(user);

    expect(userId).toBeDefined();
  });

  it('should throw error when required field is not present', async () => {
    const user = {
      firstName: 'peter',
      lastName: 'smith',
    };

    const { saveUser } = userRepository(app.db);

    await expect(saveUser(user)).rejects.toThrow(
      Error('Not valid user data - failed to save in db')
    );
  });

  it('should return user id when userId exist in db', async () => {
    const user = {
      firstName: 'dre',
      lastName: 'dev',
      password: 'password',
      email: 'email',
    };

    const { saveUser, getUserById } = userRepository(app.db);

    const userId = await saveUser(user);
    console.log(userId);

    const dbuser = await getUserById(userId);

    expect(dbuser.first_name).toEqual('dre');
  });

  it('should thorw exception when user doesnt exist', async () => {
    const { getUserById } = userRepository(app.db);
    await expect(
      getUserById('b2552277-6967-4049-b27e-c758014ea1ff')
    ).rejects.toThrow('b2552277-6967-4049-b27e-c758014ea1ff doesnt exist');
  });
});
