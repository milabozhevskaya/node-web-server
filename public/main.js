document.body.append('I-m here');
const enteredNumber = document.querySelector('.number');

const btn = document.querySelector('button');
btn.addEventListener('click', () => {
  fetch('/api/reset');
  enteredNumber.innerHTML = '0';
})

setInterval(updateCountAsync, 60_000);

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

const visitStartTime = document.querySelector('.server-info__time');

showVisitStart();

function showVisitStart() {
  fetch('/api/uptime')
    .then((response) => response.text())
    .then((time) => visitStartTime.innerHTML = buildDate(time));
}

function buildDate(time) {
  const newDate = new Date(Date.now() - time);
  return newDate.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'medium' });
  // return `${month[mon - 1]} ${day}, ${+hour}:${sec}`;
}

window.getBtn = document.querySelector('#crypto');
getBtn.addEventListener('click', () => {
  fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log(data));
});

const list = document.querySelector('.list');
const apiList = document.querySelector('.api');

showFileList();

function showFileList() {
  getFileList().then(renderFileList);
}

showEndpointList();

function showEndpointList() {
  getEndpointList().then(renderEndpointList);
}
// async function showFileList() {
//   const fileList = await getFileList();
//   showList(fileList);
// }


function renderFileList(arr, ul = list) {
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
      renderFileList(children, list);
      summary.append(name);
    }
    // li.innerHTML = !children ? name : `<details><summary>${name}</summary>dirContent</details>`;

    return li;
  }));
}

function renderEndpointList(obj, dl = apiList) {
  dl.replaceChildren(...Object.entries(obj).flatMap(([route, descriptor]) => {
    const dt = document.createElement(`dt`);
    const dd = document.createElement(`dd`);
    dt.innerText = '/api/' + route;
    dd.innerText = descriptor.description;

    return [dt, dd];
  }));
}

function getFileList() {
  return fetch('/api/listFiles')
    .then(response => response.json());
}

function getEndpointList() {
  return fetch('/api/endpoints')
    .then(response => response.json());
}
// async function getFileList() {
//   const response = await fetch('/api/data');
//   return await response.json();
// }

const form = document.querySelector('.form');
form.addEventListener('submit', () => {});