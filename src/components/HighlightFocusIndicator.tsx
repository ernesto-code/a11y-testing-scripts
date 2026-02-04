import { CustomButton } from './common/Button'
import focusIndicatorIcon from '../assets/focusIndicator.svg'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'

export const HighlightFocusIndicator = () => {
  const [showFocusIndicator, setFocusIndicator, iconClass] = useLocalStorage('FocusIndicatorActive', false)

  const codeToExecute = function (showFocusIndicator: boolean) {
    const styleElementId = 'a11yToolkit-focusIndicator-style'

    const removeIndicators = () => {
      const existingStyleElement = document.getElementById(styleElementId)
      if (existingStyleElement) {
        document.head.removeChild(existingStyleElement)
      }
    }

    const highlightFocusIndicator = () => {
      const existingStyleElement = document.getElementById(styleElementId)
      if (existingStyleElement) {
        return
      }

      const styleElement = document.createElement('style')
      styleElement.id = styleElementId
      styleElement.innerHTML = ` a:focus, *:focus {
                                box-shadow: rgb(0 255 255) 0px 0px 0px 8px !important;
                                outline: rgb(255, 0, 0) solid 4px !important;
                                outline-offset: 1px !important;
                                border-radius: 2px !important;
                            }`

      document.head.appendChild(styleElement)
    }

    if (showFocusIndicator) {
      removeIndicators()
    } else {
      highlightFocusIndicator()
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
            args: [showFocusIndicator],
          },
          () => setFocusIndicator(!showFocusIndicator)
        )
      }
    })
  }

  return (
    <CustomButton onClick={handleClick} className={iconClass}>
      <img src={focusIndicatorIcon} className="svg-icon" alt="Focus Indicator" /> Focus Indicator
    </CustomButton>
  )
}
