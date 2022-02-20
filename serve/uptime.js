function uptime() {
  return process.uptime() * 1000 + '';
}

module.exports = { uptime };