document.body.append('I-m here');
const enteredNumber = document.querySelector('.number');

const btn = document.querySelector('button');
btn.addEventListener('click', () => {
  fetch('/api/reset');
  enteredNumber.innerHTML = '0';
})

setInterval(updateCountAsync, 1000);

function updateCount() {
  fetch('/api/count')
    .then((response) => response.text())
    .then((count) => enteredNumber.innerHTML = count);
}

async function updateCountAsync() {
  const response = await fetch('/api/count');
  const count = await response.text();
  enteredNumber.innerHTML = count;
}
// const answer = await promptAsync();
// console.log(answer);
function promptAsync() {
  const dialog = document.createElement('dialog');
  const button = document.createElement('button');
  button.innerText = 'Close';
  const input = document.createElement('input');
  dialog.append('Input number and press Enter', input, button);
  document.body.append(dialog);
  button.addEventListener('click', () => {
    dialog.close();
    dialog.remove();
  });
  console.log(dialog)
  dialog.show();
  return new Promise((resolve, reject) => {
    input.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        resolve(input.value);
        dialog.close();
        dialog.remove();
      }
    });
  });
}


window.getBtn = document.querySelector('#crypto');
getBtn.addEventListener('click', () => {
  fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log(data));
});

const list = document.querySelector('.list');

showFileList();

function showFileList() {
  getFileList().then(showList);
}
// async function showFileList() {
//   const fileList = await getFileList();
//   showList(fileList);
// }


function showList(arr, ul = list) {
  ul.replaceChildren(...arr.map(({name, children}) => {
    const li = document.createElement('li');
    if (!children) {
      li.append(name);
    } else {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      const list = document.createElement('ul');
      li.append(details);
      details.append(summary, list);
      showList(children, list);
      summary.append(name);
    }
    // li.innerHTML = !children ? name : `<details><summary>${name}</summary>dirContent</details>`;

    return li;
  }));
}

function getFileList() {
  return fetch('/api/list')
    .then(response => response.json());
}
// async function getFileList() {
//   const response = await fetch('/api/data');
//   return await response.json();
// }