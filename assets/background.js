
chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
  const pattern = /web.whatsapp.com/g

  if (pattern.test(tab.url)) {
    chrome.browserAction.enable()

    return
  }

  chrome.browserAction.disable()
})



