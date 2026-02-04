import { CustomButton } from './common/Button'
import lineBreak from '../assets/lineBreak.svg'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'

export const HighlightLineBreaks = () => {
  const [showBr, setShowBr, iconClass] = useLocalStorage('lineBreak', false)

  const codeToExecute = function (showBr: boolean) {
    const elements = Array.from(document.querySelectorAll('br')).filter(isVisible)

    function isHidden(element: Element): boolean {
      const style = window.getComputedStyle(element)
      return style.display === 'none' || style.visibility === 'hidden'
    }

    function hasInaccessibleRole(element: Element): boolean {
      const role = element.getAttribute('role')
      return role === 'presentation' || role === 'none'
    }

    function isVisible(element: Element | null) {
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

    const highlightImageAltText = () => {
      elements.forEach((element) => {
        handleHighlighting(element, element.tagName, 'red', 'lineBreak')
        console.log(element)
      })

      console.log(`${elements.length} elements <br> were found on this page.`)
    }

    if (showBr) {
      chrome.runtime.sendMessage({ action: 'removeIndicators', type: 'lineBreak', place: 'beforebegin' })
    } else {
      highlightImageAltText()
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
            args: [showBr],
          },
          () => setShowBr(!showBr)
        )
      }
    })
  }

  return (
    <CustomButton onClick={handleClick} className={iconClass}>
      <img src={lineBreak} className="svg-icon" alt="Line Breaks" /> Line Breaks
    </CustomButton>
  )
}
