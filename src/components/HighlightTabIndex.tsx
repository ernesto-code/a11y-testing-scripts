import tabIndex from '../assets/tabIndex.svg'
import { CustomButton } from './common/Button'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'

export const HighlightTabIndex = () => {
  const [showTabIndexes, setShowTabIndexes, iconClass] = useLocalStorage('TabIndexActive', false)

  const codeToExecute = function (showTabIndexes: boolean) {
    function isHidden(element: Element): boolean {
      const style = window.getComputedStyle(element)
      return style.display === 'none' || style.visibility === 'hidden'
    }

    function hasInaccessibleRole(element: Element): boolean {
      const role = element.getAttribute('role')
      return role === 'presentation' || role === 'none'
    }

    function isVisible(element: Element | null): boolean {
      if (element !== null && hasInaccessibleRole(element)) {
        return false
      }

      while (element) {
        if (isHidden(element)) {
          return false
        }
        element = element.parentElement
      }

      return true
    }

    const handleHighlighting = (element: any, label: string, color: string, type: string) => {
      let uniqueClass = Array.from(element.classList).find((cl: any) => cl.startsWith('a11yToolkit-'))
      if (!uniqueClass) {
        uniqueClass = `a11yToolkit-${type}-${Math.random().toString(36).substring(2, 15)}`
        element.classList.add(uniqueClass)

        element.style.cssText += `outline: 2px solid ${color} !important; outline-offset: -2px !important;`

        chrome.runtime.sendMessage({
          action: 'highlight',
          elementClass: uniqueClass,
          label: label,
          color: color,
          type: type,
          place: 'beforebegin',
        })
      }
    }

    const highlightTabIndex = () => {
      const elements = Array.from(document.querySelectorAll('[tabindex]')).filter(isVisible)
      let valueTabIndex
      elements.forEach((element: any) => {
        valueTabIndex = element.getAttribute('tabindex') || 'unknown'

        const numericValueTabIndex = parseInt(valueTabIndex, 10)
        if (numericValueTabIndex >= 1) {
          valueTabIndex += '⚠️'
        }
        handleHighlighting(element, valueTabIndex, 'red', 'TabIndex')
      })
    }

    if (showTabIndexes) {
      chrome.runtime.sendMessage({ action: 'removeIndicators', type: 'TabIndex', place: 'beforebegin' })
    } else {
      highlightTabIndex()
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
            args: [showTabIndexes],
          },
          () => setShowTabIndexes(!showTabIndexes)
        )
      }
    })
  }

  return (
    <CustomButton onClick={handleClick} className={iconClass}>
      <img src={tabIndex} className="svg-icon" alt="Tabindex" /> Tabindex
    </CustomButton>
  )
}
