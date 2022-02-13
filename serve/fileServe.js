module.exports = serveFile;

const fs = require('fs');
const { types, getExtension } = require('./helpers/fileTypes');

function serveFile(url, response) {
  if (url === '/') {
    url = '/index.html';
    global.count++;
  }

  try {
    let fileContent = fs.readFileSync('./public' + url);
    response.setHeader('Content-type', types[getExtension(url)]);
    if (url === '/index.html') {
      fileContent = fileContent.toString().replace('COUNT', count);
    }
    response.end(fileContent);
  } catch {
    response.statusCode = 404;
    response.end('404 Not found');
  }
}
