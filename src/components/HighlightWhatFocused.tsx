import { CustomButton } from './common/Button'
import whatFocusedIcon from '../assets/whatFocused.svg'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'

declare global {
  interface Window {
    myExtensionKeyDownHandler?: (event: KeyboardEvent) => void
    myExtensionPreventDefaultClick?: (event: Event) => void
  }
}

export const HighlightWhatFocused = () => {
  const [showCurrentlyFocused, setCurrentlyFocused, iconClass] = useLocalStorage('WhatFocusedActive', false)

  const codeToExecute = function (showCurrentlyFocused: boolean) {
    if (!window.myExtensionKeyDownHandler) {
      window.myExtensionKeyDownHandler = () => {
        setTimeout(() => {
          console.clear()
          console.log('Current Focused Element:')
          console.log(document.activeElement)
        }, 0)
      }
    }

    const removeIndicators = () => {
      if (window.myExtensionKeyDownHandler) {
        document.body.removeEventListener('keydown', window.myExtensionKeyDownHandler)
      }
    }

    const highlightCurrentlyFocused = () => {
      if (window.myExtensionKeyDownHandler) {
        document.body.addEventListener('keydown', window.myExtensionKeyDownHandler)
      }
    }

    if (showCurrentlyFocused) {
      removeIndicators()
    } else {
      highlightCurrentlyFocused()
    }
  }

  const handleClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0]
      if (currentTab && currentTab.id) {
        const tabId = currentTab.id

        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            func: codeToExecute,
            args: [showCurrentlyFocused],
          },
          () => setCurrentlyFocused(!showCurrentlyFocused)
        )
      }
    })
  }

  return (
    <CustomButton onClick={handleClick} className={iconClass}>
      <img src={whatFocusedIcon} className="svg-icon" alt="What Focused?" /> What Focused?
    </CustomButton>
  )
}
