const distanceInWordsToNow = require('date-fns/distance_in_words_to_now');

window.initializeCountdown = function () {
  const nodes = document.getElementsByClassName('countdown');
  setInterval(() => {
    Array.from(nodes).forEach(node => {
      const time = parseInt(node.dataset.time)
      node.textContent = distanceInWordsToNow(time);
    })
  }, 1000)
}

window.setReloadTimeout = function (time) {
  setTimeout(() => {
    location.assign(location)
  }, time - Date.now())
}

function goToPollHandler(event) {
  event.preventDefault();
  const code = document.getElementById('code-input').value;
  document.location = `${location.origin}/poll/${code.toUpperCase()}`
}



function removeListItemHandler(event) {
  const element = event.target.parentNode;
  element.remove();
}

function addInitialOptionHandler(event) {
  event.preventDefault();

  const inputElement = document.getElementById('initial-option-input');
  const text = inputElement.value;
  inputElement.value = '';

  if (text.match(/^\s*$/)) return;

  const newElement = createFormListItem(text, 'poll-option')

  document.getElementById('initial-options-list')
    .insertAdjacentElement('beforeend', newElement);
  inputElement.focus();
}

function addOptionHandler(event) {
  event.preventDefault();

  const inputElement = document.getElementById('new-choice-input');
  const text = inputElement.value;
  inputElement.value = '';

  if (text.match(/^\s*$/)) return;

  const newElement = createFormListItem(text, 'poll-new-options')

  document.getElementById('new-choices-list')
    .insertAdjacentElement('beforeend', newElement);
  inputElement.focus();
}

window.vote = function (event, option) {
  const target = event.target;
  target.classList.add('hidden')

  const newElement = createFormListItem(option, 'votes');

  const formElement = document.getElementsByTagName('ol')[0];
  formElement.insertAdjacentElement('beforeend', newElement);

  const closeButton = newElement.getElementsByClassName('close')[0];
  closeButton.addEventListener('click', () => {
    newElement.remove();
    target.classList.remove('hidden');
  })

}

function createFormListItem(text, name) {
  const inputElement = document.createElement('input')
  inputElement.setAttribute('name', name);
  inputElement.setAttribute('value', text);
  inputElement.setAttribute('type', 'hidden');

  const closeButton = document.createElement('a')
  closeButton.setAttribute('class', 'close')
  closeButton.setAttribute('href', '#')
  closeButton.addEventListener('click', removeListItemHandler);

  const liElement = document.createElement('li');
  liElement.textContent = text;
  liElement.insertAdjacentElement('beforeend', inputElement)
  liElement.insertAdjacentElement('beforeend', closeButton)

  return liElement;
}

function addEventHandler(elementId, event, callback) {
  const element = document.getElementById(elementId)
  if (element) {
    element.addEventListener(event, callback);
  }
}

addEventHandler('add-option-button', 'click', addOptionHandler)
addEventHandler('initial-option-button', 'click', addInitialOptionHandler)

function enterKeyPressHandler(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    event.target.nextElementSibling.click();
  }
}

addEventHandler('new-choice-input', 'keypress', enterKeyPressHandler);
addEventHandler('initial-option-input', 'keypress', enterKeyPressHandler);

addEventHandler('code-form', 'submit', goToPollHandler);


/*****************
 * WebSockets connection
 ****************/


// window.makeWebSocketConnection = function (code) {
if (document.getElementById('new-choices-list')) {
  const code = location.pathname.match(/\/(\D\D\D\D)/)[1]
  const ws = new WebSocket('ws://localhost:8080', code);

  ws.addEventListener('open', () => {
    console.log('Websocket connection open')
  })

  ws.addEventListener('message', event => {
    function createListElement (text) {
      const listElement = document.createElement('li');
      listElement.innerText = text;
      return listElement;
    }
    console.log(event.data);
    const data = JSON.parse(event.data);
    const list = document.getElementById('current-choices-list');
    if (Array.isArray(data)) {
      data.forEach(choice => {
        const li = createListElement(choice);
        list.appendChild(li);
      })
    } else {
      list.appendChild(createListElement(data));
    }
  })

  window.addEventListener('beforeunload', () => {
    ws.close();
  })
  
}