const request = require('supertest');
const app = require('../src/index');
const { version } = require('../package.json');

describe('DevSecOps API Endpoints', () => {
  describe('GET /', () => {
    it('should return application info with correct structure', async () => {
      const response = await request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'DevSecOps Pipeline Demo');
      expect(response.body).toHaveProperty('security', 'Enhanced with automated security scanning');
      expect(response.body).not.toHaveProperty('version');
    });

    it('should return valid JSON structure', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(typeof response.body).toBe('object');
      expect(Object.keys(response.body)).toEqual(['message', 'security']);
    });
  });

  describe('GET /version', () => {
    it('should return version information', async () => {
      const response = await request(app)
        .get('/version')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('version', version);
    });

    it('should return only version in response', async () => {
      const response = await request(app)
        .get('/version')
        .expect(200);

      expect(typeof response.body).toBe('object');
      expect(Object.keys(response.body)).toEqual(['version']);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('uptime');
      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should return consistent structure', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(Object.keys(response.body)).toEqual(['status', 'uptime']);
    });
  });

  describe('GET /ready', () => {
    it('should return readiness status with timestamp', async () => {
      const response = await request(app)
        .get('/ready')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('status', 'ready');
      expect(response.body).toHaveProperty('timestamp');

      // Verificar que el timestamp es una fecha válida en formato ISO
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.toISOString()).toBe(response.body.timestamp);
    });

    it('should return recent timestamp', async () => {
      const beforeRequest = new Date();
      const response = await request(app)
        .get('/ready')
        .expect(200);
      const afterRequest = new Date();

      const responseTimestamp = new Date(response.body.timestamp);
      expect(responseTimestamp.getTime()).toBeGreaterThanOrEqual(beforeRequest.getTime());
      expect(responseTimestamp.getTime()).toBeLessThanOrEqual(afterRequest.getTime());
    });

    it('should return consistent structure', async () => {
      const response = await request(app)
        .get('/ready')
        .expect(200);

      expect(Object.keys(response.body)).toEqual(['status', 'timestamp']);
    });
  });

  describe('GET /sum', () => {
    it('should return correct sum for positive numbers', async () => {
      const response = await request(app)
        .get('/sum?a=5&b=3')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('sum', 8);
    });

    it('should return correct sum for negative numbers', async () => {
      const response = await request(app)
        .get('/sum?a=-5&b=3')
        .expect(200);

      expect(response.body).toHaveProperty('sum', -2);
    });

    it('should return correct sum for decimal numbers', async () => {
      const response = await request(app)
        .get('/sum?a=2.5&b=1.5')
        .expect(200);

      expect(response.body).toHaveProperty('sum', 4);
    });

    it('should return correct sum for zero values', async () => {
      const response = await request(app)
        .get('/sum?a=0&b=0')
        .expect(200);

      expect(response.body).toHaveProperty('sum', 0);
    });

    it('should handle missing parameters gracefully', async () => {
        const response = await request(app)
          .get('/sum?a=5')
          .expect(200);

        expect(response.body).toHaveProperty('sum', null);
      });

      it('should handle non-numeric parameters', async () => {
        const response = await request(app)
          .get('/sum?a=abc&b=def')
          .expect(200);

        expect(response.body).toHaveProperty('sum', null);
      });

    it('should return consistent JSON structure', async () => {
      const response = await request(app)
        .get('/sum?a=1&b=2')
        .expect(200);

      expect(Object.keys(response.body)).toEqual(['sum']);
      expect(typeof response.body.sum).toBe('number');
    });
  });

  describe('GET /debug', () => {
    it('should return debug information with correct structure', async () => {
      const response = await request(app)
        .get('/debug')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('debug');
      expect(response.body.debug).toHaveProperty('client');
      expect(response.body.debug).toHaveProperty('server');
      expect(response.body.debug).toHaveProperty('request');
    });

    it('should return client information', async () => {
      const response = await request(app)
        .get('/debug')
        .expect(200);

      const { client } = response.body.debug;
      expect(client).toHaveProperty('ip');
      expect(client).toHaveProperty('userAgent');
      expect(client).toHaveProperty('browser');
    });

    it('should return server information', async () => {
      const response = await request(app)
        .get('/debug')
        .expect(200);

      const { server } = response.body.debug;
      expect(server).toHaveProperty('timestamp');
      expect(server).toHaveProperty('timezone');
      expect(server).toHaveProperty('uptime');
      expect(server).toHaveProperty('nodeVersion');
      expect(typeof server.uptime).toBe('number');
      expect(server.nodeVersion).toMatch(/^v\d+\.\d+\.\d+/);
    });

    it('should return request information', async () => {
      const response = await request(app)
        .get('/debug?test=value')
        .expect(200);

      const { request: reqInfo } = response.body.debug;
      expect(reqInfo).toHaveProperty('method', 'GET');
      expect(reqInfo).toHaveProperty('url', '/debug?test=value');
      expect(reqInfo).toHaveProperty('headers');
      expect(reqInfo).toHaveProperty('query');
      expect(reqInfo.query).toHaveProperty('test', 'value');
    });

    it('should parse Chrome browser correctly', async () => {
      const response = await request(app)
        .get('/debug')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
        .expect(200);

      const { client } = response.body.debug;
      expect(client.browser).toBe('Chrome');
    });

    it('should parse Firefox browser correctly', async () => {
      const response = await request(app)
        .get('/debug')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0')
        .expect(200);

      const { client } = response.body.debug;
      expect(client.browser).toBe('Firefox');
    });

    it('should parse Edge browser correctly', async () => {
      const response = await request(app)
        .get('/debug')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59')
        .expect(200);

      const { client } = response.body.debug;
      expect(client.browser).toBe('Edge');
    });

    it('should parse Safari browser correctly', async () => {
      const response = await request(app)
        .get('/debug')
        .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15')
        .expect(200);

      const { client } = response.body.debug;
      expect(client.browser).toBe('Safari');
    });

    it('should parse Opera browser correctly', async () => {
      const response = await request(app)
        .get('/debug')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 OPR/77.0.4054.277')
        .expect(200);

      const { client } = response.body.debug;
      expect(client.browser).toBe('Opera');
    });

    it('should handle unknown browser correctly', async () => {
      const response = await request(app)
        .get('/debug')
        .set('User-Agent', 'SomeUnknownBrowser/1.0')
        .expect(200);

      const { client } = response.body.debug;
      expect(client.browser).toBe('Other');
    });

    it('should handle empty user agent', async () => {
      const response = await request(app)
        .get('/debug')
        .set('User-Agent', '')
        .expect(200);

      const { client } = response.body.debug;
      // Empty user agent should return Unknown
      expect(['Unknown', 'Other']).toContain(client.browser);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoints', async () => {
      await request(app)
        .get('/non-existent')
        .expect(404);
    });

    it('should handle POST requests to GET endpoints gracefully', async () => {
      await request(app)
        .post('/')
        .expect(404);
    });
  });
});
