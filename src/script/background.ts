chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;

  chrome.tabs.sendMessage(tab.id, {type: 'scan'})
});

chrome.runtime.onMessage.addListener(message => {
  if (message.type === 'openDownloader') {
    chrome.tabs.create({url: '/dist/downloader.html' })
  }
})
