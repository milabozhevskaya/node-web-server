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


server.listen(port, () => console.log('server started at http://localhost:3000'));

global.count = 0;

fs.watchFile('./serve/api.js', () => {
  const path = require.resolve('./serve/api');
  delete require.cache[path];
  handleApi = require('./serve/api');
});