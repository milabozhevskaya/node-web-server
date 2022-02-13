const genID = require('./helpers/genID.js');

const users = require('./db/users.json').map(user => ({ ...user, id: genID()}));

module.exports = users;