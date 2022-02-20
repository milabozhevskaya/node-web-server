const fs = require('fs');
const { validate } = require('./validate');
const { getUsers } = require('./getUsers');
const { genID } = require('./helpers/genID.js');
const { getBody } = require('./helpers/getBody');

async function register(request) {
  try {
    const { name, username, email, password } = await getBody(request);
    if (!name || !username || !email || !password || !validate('register')({ name, username, email, password })) {
      return { errors: ['Invalid data'] };
    }

    const isUsernameOccupied = getUsers.some((user) => user.username === username);
    const isEmailOccupied = getUsers.some((user) => user.email === email);
    if (isUsernameOccupied || isEmailOccupied) return { errors: [...isUsernameOccupied ? ['username is occupied'] : [], ...isEmailOccupied ? ['email is occupied'] : []] };
    const id = genID();
    const pwdHash = await hash(password);
    getUsers.push({
      id,
      name,
      username,
      email,
      pwdHash
    });
    fs.promises.writeFile('./serve/db/users.json', JSON.stringify(getUsers, null, 2));
    return { success: true, id };
  } catch (error) {
    return { errors: ['JSON data only'] };
  }
}

module.exports = { register };