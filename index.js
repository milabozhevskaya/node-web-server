const http = require('http');
// const url = require('url');
const { createServer } = http;
// let urlRequest = url.parse(request.url, true);
const handleApi = require('./serve/api');
const serveFile = require('./serve/fileServe');

const server = createServer((request, response) => {
  if (request.url.startsWith('/api/')) {
    handleApi(request, response);
    return;
  }

  serveFile(request.url, response);
});

server.listen(3000, () => console.log('server started at http://localhost:3000'));

global.count = 0;