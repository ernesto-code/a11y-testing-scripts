import { CustomButton } from './common/Button'
import TableIcon from '../assets/tables.svg'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'

export const HighlightTable = () => {
  const [showTables, setTables, iconClass] = useLocalStorage('TablesActive', false)

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
            args: [showTables],
          },
          () => setTables(!showTables)
        )
      }
    })
  }

  return (
    <CustomButton disabled onClick={handleClick} className={`${iconClass} disabled`}>
      <img src={TableIcon} className="svg-icon" alt="Tables" /> Tables
    </CustomButton>
  )
}
