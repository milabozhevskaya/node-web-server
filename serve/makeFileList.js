const fs = require('fs');

async function makeFileList(path = '.', options) {
  const dirContent = await fs.promises.readdir(path, { withFileTypes: true });
  const promises = dirContent.map(async (item) => {
    const children = item.isFile() || item.name.startsWith('.') ? null : await makeFileList(`${path}/${item.name}`, options);
    const dirEnt = { name: item.name, children };
    if (options.size && item.isFile()) {
      const { size } = await fs.promises.stat(`${path}/${item.name}`);
      dirEnt.size = size;
    }
    if (options.lineCount && item.isFile()) {
      const content = await fs.promises.readFile(`${path}/${item.name}`, 'utf-8');
      dirEnt.lineCount = content.split('\n').length;
    }
    return dirEnt;
  });
  return Promise.all(promises);
  // return Promise.all((await fs.promises.readdir(path, { withFileTypes: true })).map(async (item) => ({name: item.name, children: item.isFile() ? null : await makeFileList(`${path}/${item.name}`)})));
}

module.exports = { makeFileList };