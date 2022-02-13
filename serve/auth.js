const { getUsers } = require('./getUsers');
const { storeAuthTS } = require('./storeAuthTS');
const { genID } = require('./helpers/genID.js');
const { genToken } = require('./helpers/genToken');
const { hash } = require('./helpers/crypto');

async function auth(request, response) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  try {
    const body = JSON.parse(Buffer.concat(chunks).toString());
    const user = getUsers().find((user) => user.username === body.username);
    if (!user || !await hash.verify(body.password, user.pwdHash)) return { success: false };
    const token = genToken();
    const start = Date.now();
    sessions.push({id: genID(), userId: user.id, token, start, expire: start + 1 * 60e3});
    storeAuthTS({ [user.username]: start });
    response.setHeader('set-cookie', 'nws_info_token=' + token);
    return { success: true, token };
  } catch (error) {
    return { errors: ['JSON data only'] };
  }
}

module.exports = { auth };