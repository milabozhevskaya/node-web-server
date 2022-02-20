const { getUsers } = require('./getUsers');
const { storeAuthTS } = require('./storeAuthTS');
const { genID } = require('./helpers/genID.js');
const { genToken } = require('./helpers/genToken');
const { hash } = require('./helpers/crypto');
const { getBody } = require('./helpers/getBody');

async function auth(request, response) {
  let body;
  try {
    body = await getBody(request);
  } catch (error) {
    return { errors: ['JSON data only'] };
  }
  const user = getUsers().find((user) => user.username === body.username);
  if (!user || !await hash.verify(body.password, user.pwdHash)) return { success: false };
  const token = genToken();
  const start = Date.now();
  sessions.push({ id: genID(), userId: user.id, token, start, expire: start + 1 * 60e3 });
  storeAuthTS({ [user.username]: start });
  response.setHeader('set-cookie', 'nws_info_token=' + token);
  return { success: true, token };
}

module.exports = { auth };