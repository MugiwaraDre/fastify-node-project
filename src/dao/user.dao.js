const userRepository = (db) => {
  // get user by userId
  const getUserById = async (userId) => {
    try {
      const user = await db.one('select * from users where id = $1', [userId]);
      console.log(user);
      return user;
    } catch (error) {
      throw Error(`${userId} doesnt exist`);
    }
  };

  // save user in db
  const saveUser = async (user) => {
    try {
      const { id } = await db.one(
        'INSERT INTO users(first_name, middle_name, last_name, password, email) VALUES($1, $2, $3, $4, $5) RETURNING id',
        [
          user.firstName,
          user.middleName,
          user.lastName,
          user.password,
          user.email,
        ]
      );
      return id;
    } catch (error) {
      throw Error('Not valid user data - failed to save in db');
    }
  };

  return { getUserById, saveUser };
};

module.exports = userRepository;
