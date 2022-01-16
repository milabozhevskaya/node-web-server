module.exports = { logApiRequest, logServerStart, logError, parseLog };

const fs = require('fs');

function logApiRequest(route, length) {
  const record = `${new Date().toLocaleString('en-CA', {hourCycle: 'h24'})}\t/${route}\tresponse length: ${length}\n`;
  fs.promises.appendFile('./logs/api.log', record);
}

function logServerStart() {
  const record = new Date().toLocaleString('en-CA', { hourCycle: 'h24' }) + '\tServer starts...\n';
  fs.promises.appendFile('./logs/server.log', record);
}

function logError(err) {
  const record = new Date().toLocaleString('en-CA', { hourCycle: 'h24' }) + `\t${err.name}\tmsg: ${err.message}\tat: ${err.stack.match(/[\\\/][^:\\\/]*:[:\d]*/)[0]}\n`;
  fs.promises.appendFile('./logs/error.log', record);
}

function parseLog(text) {
  const lines = text.trim().split('\n');
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
