const fs = require('fs');
const { parseLog } = require('./logger');

const logRoutes = {
  async serverLog() {
    const logStr = await fs.promises.readFile('./logs/server.log', 'utf-8');
    return parseLog(logStr);
  },
  async apiLog() {
    const logStr = await fs.promises.readFile('./logs/api.log', 'utf-8');
    return parseLog(logStr);
  },
  async errorLog() {
    const logStr = await fs.promises.readFile('./logs/error.log', 'utf-8').catch(() => '');
    return parseLog(logStr);
  },
};

module.exports = { logRoutes };