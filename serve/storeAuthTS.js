const fs = require('fs');

async function storeAuthTS(obj) {
  const path = './serve/db/lastAuthTimestamps.json';
  const registry = JSON.parse(await fs.promises.readFile(path).catch(() => '{}'));
  fs.promises.writeFile(path, JSON.stringify({...registry, ...obj}, null, 2));
}

module.exports = { storeAuthTS };