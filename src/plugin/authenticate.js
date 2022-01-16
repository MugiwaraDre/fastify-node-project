const fp = require('fastify-plugin');
const jwt = require('fastify-jwt');
require('dotenv').config();

module.exports = fp(async (fastify, options, next) => {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET,
  });

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      // extract jwt token from auth header
      // remove Bearer from front of token
      await request.jwtVerify();
    } catch (error) {
      reply.send(error);
    }
  });
  next();
});
