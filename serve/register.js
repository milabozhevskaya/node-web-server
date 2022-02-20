const fs = require('fs');
const { validate } = require('./validate');
const { getUsers } = require('./getUsers');
const users = getUsers();
const { genID } = require('./helpers/genID.js');
const { getBody } = require('./helpers/getBody');
const { hash } = require('./helpers/crypto');

async function register(request) {
  const { name, username, email, password } = await getBody(request);
  try {
    if (!name || !username || !email || !password || !validate('register')({ name, username, email, password })) {
      return { errors: ['Invalid data'] };
    }
  } catch (error) {
    return { errors: ['JSON data only'] };
  }

  const isUsernameOccupied = users.some((user) => user.username === username);
  const isEmailOccupied = users.some((user) => user.email === email);
  if (isUsernameOccupied || isEmailOccupied) return { errors: [...isUsernameOccupied ? ['username is occupied'] : [], ...isEmailOccupied ? ['email is occupied'] : []] };
  const id = genID();
  const pwdHash = await hash(password);
  users.push({
    id,
    name,
    username,
    email,
    pwdHash
  });
  fs.promises.writeFile('./serve/db/users.json', JSON.stringify(users, null, 2));
  return { success: true, id };
}

module.exports = { register };