const UserService = require('../../src/service/user.service');
const UserRepository = require('../../src/dao/user.dao');

const getUserByIdDao = jest.fn();
const saveUser = jest.fn();
const getUserByEmailIdDao = jest.fn();

jest.mock('../../src/dao/user.dao');

describe('User service', () => {
  beforeAll(() => {
    UserRepository.mockImplementation(() => ({
      getUserById: getUserByIdDao,
      saveUser,
      getUserByEmailId: getUserByEmailIdDao,
    }));
  });

  it('should save user when user data is valid', async () => {
    const { createUser } = UserService({});
    saveUser.mockReturnValueOnce('user_uuid');
    const user = {
      firstName: 'dre',
      lastName: 'dev',
      password: 'password',
      email: 'email',
    };

    const userId = await createUser(user);

    expect(userId).toEqual('user_uuid');
    expect(saveUser).toHaveBeenCalledWith(user);
  });

  it('should return user when userId exist', async () => {
    const { getUserById } = UserService({});
    getUserByIdDao.mockReturnValueOnce({
      id: 'uuid',
      first_name: 'dre',
      middle_name: 'middlename',
      last_name: 'dev',
      password: 'password',
      email: 'email',
      created_at: '2022-01-04 15:54:34.627536+00',
      updated_at: '2022-01-04 15:54:34.627536+00',
      version: '1',
    });

    const user = await getUserById('uuid');

    expect(user).toEqual({
      id: 'uuid',
      username: 'dre middlename dev',
      email: 'email',
      createdAt: '04/01/2022',
      updatedAt: '04/01/2022',
      version: '1',
    });
  });

  it('should return user with correct username when user exist', async () => {
    const { getUserById } = UserService({});
    getUserByIdDao.mockReturnValueOnce({
      id: 'uuid',
      first_name: 'dre',
      password: 'password',
      email: 'email',
      created_at: '2022-01-04 15:54:34.627536+00',
      updated_at: '2022-01-04 15:54:34.627536+00',
      version: '1',
    });

    const user = await getUserById('uuid');

    expect(user).toEqual({
      id: 'uuid',
      username: 'dre',
      email: 'email',
      createdAt: '04/01/2022',
      updatedAt: '04/01/2022',
      version: '1',
    });
  });

  it('should return user when password valid', async () => {
    const { getUserByEmailId } = UserService({});
    getUserByEmailIdDao.mockReturnValueOnce({
      id: 'uuid',
      first_name: 'dre',
      password: 'password',
      email: 'email@gmail.com',
      created_at: '2022-01-04 15:54:34.627536+00',
      updated_at: '2022-01-04 15:54:34.627536+00',
      version: '1',
    });

    const user = await getUserByEmailId('email@gmail.com', 'password');

    expect(user).toEqual({
      id: 'uuid',
      username: 'dre',
      email: 'email@gmail.com',
      createdAt: '04/01/2022',
      updatedAt: '04/01/2022',
      version: '1',
    });
  });
});
