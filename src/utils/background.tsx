import { removeIndicators } from './removeIndicators.utils'
import { highlightElement } from './highlightElement.utils'

chrome.runtime.onMessage.addListener((message, sender) => {
  console.log('🚀  message:', message)
  if (sender.tab?.id != null) {
    if (message && message.action === 'removeIndicators') {
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        func: removeIndicators,
        args: [message.type],
      })
    } else if (message && message.action === 'highlight') {
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        func: highlightElement,
        args: [message.elementClass, message.label, message.color, message.type],
      })
    }
  } else {
    console.error('Tab ID is undefined.')
  }
})
