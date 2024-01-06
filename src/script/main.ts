import { RedGifsScanner } from './scanners/RedGifsScanner'
import Scanner from './scanners/Scanner'

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'scan') {
    scanMedia();
  }
})

const scanMedia = async () => {
  const scanner = getScanner()
  if (!scanner) {
    return;
  }

  const media = await scanner.scan()
  await chrome.storage.local.set({ 'media': media })
  chrome.runtime.sendMessage({type: 'openDownloader'})
}

const getScanner = (): Scanner | undefined => {
  if (window.location.href.indexOf('redgifs.com') > -1) {
    return new RedGifsScanner()
  }
}
