const UserService = require('../../src/service/user.service');
const UserRepository = require('../../src/dao/user.dao');

const getUserByIdDao = jest.fn();
const saveUser = jest.fn();

jest.mock('../../src/dao/user.dao');

describe('User service', () => {
  beforeAll(() => {
    UserRepository.mockImplementation(() => ({
      getUserById: getUserByIdDao,
      saveUser,
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
      first_name: 'peter',
      middle_name: 'middlename',
      last_name: 'smith',
      password: 'password',
      email: 'email',
      created_at: '2022-01-04 15:54:34.627536+00',
      updated_at: '2022-01-04 15:54:34.627536+00',
      version: '1',
    });

    const user = await getUserById('uuid');

    expect(user).toEqual({
      id: 'uuid',
      username: 'peter middlename smith',
      email: 'email',
      createdAt: '2022-01-04',
      updatedAt: '2022-01-04',
      version: '1',
    });
  });

  it('should return user with correct username when user exist', async () => {
    const { getUserById } = UserService({});
    getUserByIdDao.mockReturnValueOnce({
      id: 'uuid',
      first_name: 'peter',
      password: 'password',
      email: 'email',
      created_at: '2022-01-04 15:54:34.627536+00',
      updated_at: '2022-01-04 15:54:34.627536+00',
      version: '1',
    });

    const user = await getUserById('uuid');

    expect(user).toEqual({
      id: 'uuid',
      username: 'peter',
      email: 'email',
      createdAt: '2022-01-04',
      updatedAt: '2022-01-04',
      version: '1',
    });
  });
});
