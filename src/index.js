const express = require('express');
const { version } = require('../package.json');
const utils = require('./utils');
const app = express();

// Disable X-Powered-By header for security
app.disable('x-powered-by');
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'DevSecOps Pipeline Demo',
    security: 'Enhanced with automated security scanning'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.get('/ready', (req, res) => {
  res.json({ status: 'ready', timestamp: new Date().toISOString() });
});

app.get('/version', (req, res) => {
  res.json({ version: version });
});

app.get('/sum', (req, res) => {
  const { a, b } = req.query;
  const sum = utils.sum(Number(a), Number(b));
  res.json({ sum });
});

app.get('/debug', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] ||
                   req.headers['x-real-ip'] ||
                   req.connection.remoteAddress ||
                   req.socket.remoteAddress ||
                   (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                   req.ip;

  const userAgent = req.headers['user-agent'] || 'Unknown';
  const timestamp = new Date().toISOString();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  res.json({
    debug: {
      client: {
        ip: clientIp,
        userAgent: userAgent,
        browser: parseBrowser(userAgent)
      },
      server: {
        timestamp: timestamp,
        timezone: timezone,
        uptime: process.uptime(),
        nodeVersion: process.version
      },
      request: {
        method: req.method,
        url: req.url,
        headers: req.headers,
        query: req.query
      }
    }
  });
});

// Helper function to parse browser info from user agent
function parseBrowser(userAgent) {
  if (!userAgent || typeof userAgent !== 'string' || userAgent.trim() === '') return 'Unknown';

  const ua = userAgent.toLowerCase();

  if (ua.includes('edg/')) return 'Edge';
  if (ua.includes('opr/') || ua.includes('opera')) return 'Opera';
  if (ua.includes('chrome') && !ua.includes('edg')) return 'Chrome';
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('safari') && !ua.includes('chrome') && !ua.includes('edg')) return 'Safari';

  return 'Other';
}

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
