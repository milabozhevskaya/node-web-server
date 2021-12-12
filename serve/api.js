module.exports = handleApi;

const fs = require('fs');

function handleApi(request, response) {
  const route = request.url.slice(5);
  router[route]?.(response);
}

const router = {
  reset(response) {
    global.count = 0;
    response.end('reset count');
  },
  count(response) {
    response.end('' + global.count);
  },
  data(response) {
    response.end(JSON.stringify(data));
    // getCryptoInfo().then(info => response.end(JSON.stringify(info)));
  },
  // async list(response) {
  //   response.end(JSON.stringify(await makeFileList()));
  // },
  list(response) {
    makeFileList().then(list => response.end(JSON.stringify(list)));
  }
};

let count = 0;

let data = [];
getCryptoInfo().then(info => data = info);

async function getCryptoInfo() {
  const buff = await fs.promises.readFile('./serve/data.json');
  const data = JSON.parse(buff);
  
  return data.map(({ name, percent }) => ({ name, percent }));
}

async function makeFileList(path = '.') {
  console.log('start');
  const dirContent = await fs.promises.readdir(path, { withFileTypes: true });
  console.log(dirContent);
  const promises = dirContent.map(async (item) => {
    const children = item.isFile() ? null : await makeFileList(`${path}/${item.name}`);
    console.log(children);
    return {name: item.name, children}
  });
  return Promise.all(promises);
  // return Promise.all((await fs.promises.readdir(path, { withFileTypes: true })).map(async (item) => ({name: item.name, children: item.isFile() ? null : await makeFileList(`${path}/${item.name}`)})));
}
