const ERROR_TYPE = 'error'
const INFO_TYPE = 'info'
const CONTACTS_TYPE = 'contacts'

chrome.runtime.onMessage.addListener(onMessage)

function onMessage(request, sender, sendResponse) {
  if (isInLandingPage()) {
    sendMessage({
      type: ERROR_TYPE,
      payload : 'Você precisa autenticar na página do WhatsApp Web.'
    })
    return
  }

  sendMessage({
    type: INFO_TYPE,
    payload : 'Aguarde, coletando números...'
  })

  boot()
}

let scrollHeight = null
let clientHeight = null

let currentHeight = 0
const contacts = new Set()

function boot() {
  const selector = '#pane-side'
  scrollHeight = document.querySelector(selector).scrollHeight
  clientHeight = document.querySelector(selector).clientHeight

  next()
}

function isInLandingPage() {
  return document.querySelector('.landing-wrapper')
}

function next() {
  collectContacts()
  computeNextContactViewSection()
  scrollContacts()

  if (hasNext()) {
    setTimeout(function () {
      next()
    }, 100)

    return
  }

  scrollTop()
  sendContactsToExtension()
}

function hasNext() {
  return currentHeight < scrollHeight
}

function scrollContacts() {
  document.querySelector('#pane-side').scrollTop = currentHeight
}

function scrollTop() {
  document.querySelector('#pane-side').scrollTop = 0
}

function computeNextContactViewSection() {
  currentHeight += clientHeight
}

function collectContacts() {
  const nodeList = document.querySelectorAll('span[title^="+55"]')

  Array.from(nodeList)
    .forEach((item) => {
      contacts.add(
        item.getAttribute('title')
          .replace('+55','')
          .replace(/[^\d]/g,'')
      )
    })
}

function sendContactsToExtension() {
  const contactsArray = []
  contacts.forEach(value => contactsArray.push(value))

  sendMessage({
    type: CONTACTS_TYPE,
    payload : contactsArray
  })
}

function sendMessage({ type, payload }) {
  chrome.runtime.sendMessage({ type, payload })
}
