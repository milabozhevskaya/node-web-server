const users = require('./users.js');

function getUsers() {
  return users;
}

module.exports = { getUsers };