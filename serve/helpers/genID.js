const genID = (() => {
  let count = 1;
  return () => count++;
})();

module.exports = { genID };