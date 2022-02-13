const validator = {
  register({ name, username, email, password }) {
    return /^[A-Za-zА-Яа-яІіЇїЄєЁёҐґ ]{2,}$/.test(name) && /^\w{6,}$/.test(username) && /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) && /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(password);
  }
}

function validate(route) {
  return validator[route];
}

module.exports = { validate };