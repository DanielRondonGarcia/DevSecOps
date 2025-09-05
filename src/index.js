const express = require('express');
const { version } = require('../package.json');
const utils = require('./utils');
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
