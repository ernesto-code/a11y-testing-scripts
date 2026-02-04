import { CustomButton } from './common/Button'
import BtnLinksIcon from '../assets/btnLinks.svg'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'

export const HighlightBtnLinks = () => {
  const [showBtnLinks, setBtnLinks, iconClass] = useLocalStorage('BtnLinksActive', false)

  const codeToExecute = function (showTextSpacing: boolean) {
    if (showTextSpacing) {
    } else {
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
            args: [showBtnLinks],
          },
          () => setBtnLinks(!showBtnLinks)
        )
      }
    })
  }

  return (
    <CustomButton disabled onClick={handleClick} className={`${iconClass} disabled`}>
      <img src={BtnLinksIcon} className="svg-icon" alt="Btn Links" /> Btn Links
    </CustomButton>
  )
}
