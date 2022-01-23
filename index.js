const { logServerStart, logError } = require('./serve/logger');
process.on('uncaughtException', logError).on('unhandledRejection', logError).on('warning', logError);

const port = process.env.PORT || 3000;
const http = require('http');
const fs = require('fs');
require('./serve/customMethods.js');
// const url = require('url');
const { createServer } = http;
// let urlRequest = url.parse(request.url, true);
let handleApi = require('./serve/api');
const serveFile = require('./serve/fileServe');

const server = createServer((request, response) => {
  if (request.url.match(/\/api(\/|$)/)) {
    handleApi(request, response);
    return;
  }

  serveFile(request.url, response);
});


server.listen(port, () => {
  console.log('server started at http://localhost:3000');
  logServerStart();
});

global.count = 0;

fs.watchFile('./serve/api.js', () => {
  const path = require.resolve('./serve/api');
  delete require.cache[path];
  try {
    handleApi = require('./serve/api');
  } catch (err) {
    logError(err);
  }
});

