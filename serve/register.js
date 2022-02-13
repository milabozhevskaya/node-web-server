const fs = require('fs');
const { validate } = require('./validate');
const { getUsers } = require('./getUsers');
const { genID } = require('./helpers/genID.js');

async function register(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  try {
    const { name, username, email, password } = JSON.parse(Buffer.concat(chunks).toString());
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