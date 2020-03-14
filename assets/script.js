const ERROR_TYPE = 'error'
const INFO_TYPE = 'info'
const CONTACTS_TYPE = 'contacts'

function onClick() {
  let params = {
    active: true,
    currentWindow: true
  }

  chrome.tabs.query(params, onGotTab)

  function onGotTab(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {})
  }
}

function copy() {
  document.querySelector('.contacts_container').select()
  document.execCommand('copy')
}

function onMessage({ type, payload}, sender, sendResponse) {
  switch (type) {
    case ERROR_TYPE:
      showErrorMessage(payload)
      break

    case CONTACTS_TYPE:
      showContacts(payload)
      break

    default:
      showInfoMessage(payload)
  }

}

function showErrorMessage(message) {
  showMessage(message, 'error_message')
}

function showInfoMessage(message) {
  showMessage(message, 'info_message')
}

function showMessage(message, styleClass) {
  const selector = document.querySelector('.message')
  selector.innerText = ''
  selector.classList.add(styleClass)
  selector.innerText = message
  selector.style.display = 'block'
}

function showContacts(contacts) {
  document.querySelector('.copy_btn').style.display = 'block'
  document.querySelector('.contacts_container').style.display = 'block'
  document.querySelector('.catch_btn').style.display = 'none'
  document.querySelector('.message').style.display = 'none'
  document.querySelector('.contacts_container').innerHTML = contacts.join(',')
}

chrome.runtime.onMessage.addListener(onMessage)

window.addEventListener('load', function() {
  document.querySelector('.catch_btn')
    .addEventListener('click', onClick)

  document.querySelector('.copy_btn')
    .addEventListener('click', copy)
})
