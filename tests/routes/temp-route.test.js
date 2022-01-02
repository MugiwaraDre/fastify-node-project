const build = require('../../src/app');

let app;

describe('temp route', () => {
  beforeAll(() => {
    app = build();
  });

  afterAll(() => {
    app.close();
  });

  it('should return id when post route is called with valid data', async () => {
    const res = await app.inject({
      method: 'POST',
      url: 'api/v1/test',
      payload: {
        title: 'some title',
      },
    });

    expect(res.statusCode).toBe(201);
    expect(res.json().id).toBeDefined();
  });

  it('should return id and title when get is called at url', async () => {
    const res = await app.inject({
      url: 'api/v1/test',
    });

    expect(res.statusCode).toBe(200);
  });
});
