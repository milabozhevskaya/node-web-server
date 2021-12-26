module.exports = handleApi;

const fs = require('fs');

async function handleApi(request, response) {
  const route = request.url.slice(5);
  const payload = await router[route]?.(response);
  requestLog.push({
    timestamp: Date.now(),
    route,
    responseSize: payload.length,
  })
  response.end(payload);
}

const requestLog = [
  // {timestamp, route, responseSize}
];

const router = {
  reset(response) {
    global.count = 0;
    return 'reset count';
  },
  count(response) {
   return '' + global.count;
  },
  data(response) {
    return JSON.stringify(data);
    // getCryptoInfo().then(info => response.end(JSON.stringify(info)));
  },
  // async list(response) {
  //   response.end(JSON.stringify(await makeFileList()));
  // },
  listFiles(response) {
    return makeFileList().then(list => JSON.stringify(list));
  },
  uptime(response) {
    return process.uptime() * 1000 + '';
  },
  endpoints(response) {
    const routeMap = Object.keys(router).map(route => [route, routeDescriptor[route]]);
    return JSON.stringify(Object.fromEntries(routeMap));
  }
};

const routeDescriptor = {
  reset: 'Reset visit counter',
  count: 'Get visite count',
  data: 'Get cryptocurrencies',
  listFiles: 'Get folder/files structure',
  uptime: 'Get total ms passed from server start',
  endPoints: 'Get list of available endpoints'
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
  const dirContent = await fs.promises.readdir(path, { withFileTypes: true });
  const promises = dirContent.map(async (item) => {
    const children = item.isFile() || item.name.startsWith('.') ? null : await makeFileList(`${path}/${item.name}`);
    return {name: item.name, children}
  });
  return Promise.all(promises);
  // return Promise.all((await fs.promises.readdir(path, { withFileTypes: true })).map(async (item) => ({name: item.name, children: item.isFile() ? null : await makeFileList(`${path}/${item.name}`)})));
}
