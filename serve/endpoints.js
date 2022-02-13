const path = process.env.ROOT_PATH || `http://localhost:3000/api/`;

const routeDescriptor = {
  reset: 'Reset visit counter',
  count: 'Get visit count',
  data: 'Get cryptocurrencies',
  listFiles: 'Get folder/files structure',
  uptime: 'Get total ms passed from server start',
  endpoints: 'Get list of available endpoints',
  errorLog: 'Show the error history',
  serverLog: 'Show the server activity history',
  apiLog: 'Show the history of API requests',
  users: 'Get list of users',
  auth: 'Authorize and receive token',
};

function endpoints(router) {
  const routeMap = Object.keys(router).map(route => [route, {
    description: routeDescriptor[route],
    path: path + route
  }]);
  return Object.fromEntries(routeMap);
}

module.exports = { endpoints };