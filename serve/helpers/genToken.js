const { rnd } = require('./random.js');

function genToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  return Array.from(Array(4), () => Array.from(Array(10), () => chars[rnd(62)]).join('')).join('-');
}

module.exports = { genToken };