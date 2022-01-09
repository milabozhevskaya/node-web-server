module.exports = handleApi;

const path = process.env.ROOT_PATH || `http://localhost:3000/api/`;
const fs = require('fs');

async function handleApi(request, response) {
  const route = request.url.slice(5) || 'endpoints';
  const payload = await router[route]?.(response);
  logApiRequest(route, payload.length);
  response.end(payload);
}

function logApiRequest(route, length) {
  const record = `${new Date().toLocaleString('en-CA', {hourCycle: 'h24'})}\t${route}\tresponse length: ${length}\n`;
  fs.promises.appendFile('./logs/api.log', record);
}

const router = {
  reset() {
    global.count = 0;
    return 'reset count';
  },
  count() {
   return '' + global.count;
  },
  data() {
    return JSON.stringify(data);
    // getCryptoInfo().then(info => response.end(JSON.stringify(info)));
  },
  // async list(response) {
  //   response.end(JSON.stringify(await makeFileList()));
  // },
  listFiles() {
    return makeFileList().then(list => JSON.stringify(list));
  },
  uptime() {
    return process.uptime() * 1000 + '';
  },
  endpoints() {
    const routeMap = Object.keys(router).map(route => [route, {
      description: routeDescriptor[route],
      path: path + route
    }]);
    return JSON.stringify(Object.fromEntries(routeMap));
  },
  async serverLog() {
    const logStr = await fs.promises.readFile('./logs/server.log', 'utf-8');
    const logs = parseLog(logStr);
    return JSON.stringify(logs)
  },
  async apiLog() {
    const logStr = await fs.promises.readFile('./logs/api.log', 'utf-8');
    const logs = parseLog(logStr);
    return JSON.stringify(logs)
  },
  async errorLog() {
    const logStr = await fs.promises.readFile('./logs/error.log', 'utf-8');
    const logs = parseLog(logStr);
    return JSON.stringify(logs)
  },
};

function parseLog(text) {
  const lines = text.split('\n');
  const items = lines.map(line => line.split('\t'));
  const records = items.map(([dateTime, action, ...rest]) => ({
    dateTime,
    action,
    ...Object.fromEntries(rest.map(item => {
      const [key, value] = item.split(': ');
      return [key.toCamelCase(), value];
    }))
  }));
  return records;
}

String.prototype.toCamelCase = function toCamelCase() {
  const words = this.split(' ');
  return words.map((word, i) => i ? word.toCapitalCase() : word.toLowerCase()).join('');
}

String.prototype.toCapitalCase = function toCapitalCase() {
  return this[0].toUpperCase() + this.slice(1).toLowerCase();
}

const routeDescriptor = {
  reset: 'Reset visit counter',
  count: 'Get visite count',
  data: 'Get cryptocurrencies',
  listFiles: 'Get folder/files structure',
  uptime: 'Get total ms passed from server start',
  endpoints: 'Get list of available endpoints'
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
