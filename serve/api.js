module.exports = handleApi;

// debugger;
const genID = require('./helpers/genID');
const { reset, count } = require('./countVisits');
const { makeFileList } = require('./makeFileList');
const { getUsers } = require('./getUsers');
const { uptime } = require('./uptime');
const { endpoints } = require('./endpoints');
const { register} = require('./register');
const { auth} = require('./auth');
const { logApiRequest } = require('./logger');
const { logRoutes } = require('./logRoutes');
const fs = require('fs');

const sessions = global.sessions = [];

async function handleApi(request, response) {
  const route = request.url.slice(5) || 'endpoints';
  let payload = await router[route]?.(request, response) ?? 'This api is not implemented';
  if (typeof payload === 'object') {
    payload = JSON.stringify(payload);
    response.setHeader('content-type', 'application/json; charset=utf-8');
  }
  logApiRequest(route, payload.length);
  response.end(payload);
}
const router = {
  reset,
  count,
  listFiles,
  uptime,
  endpoints: () => endpoints(router),
  users: getUsers,
  auth,
  register,
  ...logRoutes,
};

function listFiles() {
  return makeFileList('.', { size: true, lineCount: true});
}
