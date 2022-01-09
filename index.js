process.on('uncaughtException', logError);
const port = process.env.PORT || 3000;
const http = require('http');
const fs = require('fs');
// const url = require('url');
const { createServer } = http;
// let urlRequest = url.parse(request.url, true);
let handleApi = require('./serve/api');
const serveFile = require('./serve/fileServe');

const server = createServer((request, response) => {
  if (request.url.startsWith('/api/')) {
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

function logServerStart() {
  const record = new Date().toLocaleString('en-CA', { hourCycle: 'h24' }) + '\tServer starts...\n';
  fs.promises.appendFile('./logs/server.log', record);
}

function logError(err) {
  const record = new Date().toLocaleString('en-CA', { hourCycle: 'h24' }) + `\t${err.name}\tmsg: ${err.message}\tat: ${err.stack.match(/[\\\/][^:\\\/]*:[:\d]*/)[0]}\n`;
  fs.promises.appendFile('./logs/error.log', record);
}