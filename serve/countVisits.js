let totalCount = 0;

function reset() {
  totalCount = 0;
  return 'reset count';
}

function count() {
  return '' + ++totalCount;
}

module.exports = { reset, count };