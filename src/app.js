const fastify = require('fastify');
const cors = require('fastify-cors');
const db = require('./plugin/database');
const testRoute = require('./route/tempTestRoute');
const userRoute = require('./route/user');
const jobRoute = require('./route/job');
const swaggerPg = require('./plugin/swagger');

const build = (opts = {}) => {
  const app = fastify(opts);

  app.register(cors);

  // register plugins

  app.register(db);
  app.register(swaggerPg);

  // register route

  app.register(testRoute, { prefix: 'api/v1/test' });
  app.register(userRoute, { prefix: 'api/v1/users' });
  app.register(jobRoute, { prefix: 'api/v1/jobs' });

  app.get('/', async (request, reply) => {
    reply.code(200).send({ hello: 'world! & alex-bish-kun' });
  });

  return app;
};

module.exports = build;
