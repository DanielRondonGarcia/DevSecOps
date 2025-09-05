const request = require('supertest');
const express = require('express');
const { version } = require('../package.json');
const utils = require('../src/utils');

// Crear una instancia de la aplicación para pruebas
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'DevSecOps Pipeline Demo',
    version: version,
    security: 'Enhanced with automated security scanning'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.get('/ready', (req, res) => {
  res.json({ status: 'ready', timestamp: new Date().toISOString() });
});

app.get('/sum', (req, res) => {
  const { a, b } = req.query;
  const sum = utils.sum(Number(a), Number(b));
  res.json({ sum });
});

describe('DevSecOps API Endpoints', () => {
  describe('GET /', () => {
    it('should return application info with correct structure', async () => {
      const response = await request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message', 'DevSecOps Pipeline Demo');
      expect(response.body).toHaveProperty('version', version);
      expect(response.body).toHaveProperty('security', 'Enhanced with automated security scanning');
    });

    it('should return valid JSON structure', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(typeof response.body).toBe('object');
      expect(Object.keys(response.body)).toEqual(['message', 'version', 'security']);
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

  describe('Error handling', () => {
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
