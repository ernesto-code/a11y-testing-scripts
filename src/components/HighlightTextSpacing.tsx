import { CustomButton } from './common/Button'
import TextSpacingIcon from '../assets/textSpacing.svg'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'

export const HighlightTextSpacing = () => {
  const [showTextSpacing, setTextSpacing, iconClass] = useLocalStorage('TextSpacingHActive', false)

  const codeToExecute = function (showTextSpacing: boolean) {
    const removeIndicators = () => {
      document.querySelectorAll('*').forEach((element: any) => {
        element.style.removeProperty('word-spacing')
        element.style.removeProperty('line-height')
        element.style.removeProperty('letter-spacing')
      })
    }

    const highlightTextSpacing = () => {
      document.querySelectorAll('*').forEach((element: any) => {
        element.style.setProperty('word-spacing', '0.16em', 'important')
        element.style.setProperty('line-height', '1.5', 'important')
        element.style.setProperty('letter-spacing', '0.12em', 'important')
      })
    }

    if (showTextSpacing) {
      removeIndicators()
    } else {
      highlightTextSpacing()
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
            args: [showTextSpacing],
          },
          () => setTextSpacing(!showTextSpacing)
        )
      }
    })
  }

  return (
    <CustomButton onClick={handleClick} className={iconClass}>
      <img src={TextSpacingIcon} className="svg-icon" alt="Spacing" /> Spacing
    </CustomButton>
  )
}
