const fastify = require('fastify');
const cors = require('fastify-cors');
const db = require('./plugin/database');
const testRoute = require('./route/tempTestRoute');
const swaggerPg = require('./plugin/swagger');
const userRoute = require('./route/user');
const jobRoute = require('./route/job');

const authenticate = require('./plugin/authenticate');

const build = (opts = {}) => {
  const app = fastify(opts);

  // add cors
  app.register(cors, {
    origin: '*',
    methods: ['GET'],
  });

  // register plugins
  app.register(db);
  app.register(swaggerPg);
  app.register(authenticate);

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
