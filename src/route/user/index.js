const UserService = require('../../service/user.service');
const {
  postRequestBody,
  postResponseBody,
  getResponseBody,
  getRequestParams,
} = require('./user.schema');

const userRoute = async (fastify) => {
  const { getUserById, createUser, getUserByEmailId } = UserService(fastify);
  fastify.get(
    '/:userId',
    { schema: { params: getRequestParams, response: getResponseBody } },
    async (request, reply) => {
      const { userId } = request.params;
      try {
        const user = await getUserById(userId);
        reply.code(200).send(user);
      } catch (error) {
        reply.code(400).send(error);
      }
    }
  );

  fastify.post('/login', async (request, reply) => {
    try {
      const { email, password } = request.body;

      const user = await getUserByEmailId(email, password);
      const token = fastify.jwt.sign(user);
      reply.code(200).send({ token: `Bearer ${token}` });
    } catch (error) {
      reply.code(401).send({
        message: error.message,
      });
    }
  });

  fastify.post(
    '/',
    { schema: { body: postRequestBody, response: postResponseBody } },
    async (request, reply) => {
      fastify.log.info('creating user');
      try {
        const userId = await createUser(request.body);
        fastify.log.info(`user created with ${userId}`);
        reply.code(201).send({ userId });
      } catch (error) {
        reply.code(400).send(error);
      }
    }
  );
};

module.exports = userRoute;
