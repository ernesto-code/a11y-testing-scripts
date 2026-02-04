import { CustomButton } from './common/Button'
import liveRegionFinder from '../assets/liveRegionFinder.svg'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'

export const HighlightLiveRegionFinder = () => {
  const [showBr, setShowBr, iconClass] = useLocalStorage('liveRegionFinder', false)

  const codeToExecute = function (showBr: boolean) {
    const elements = Array.from(
      document.querySelectorAll(
        "[aria-live='assertive'], [aria-live='polite'], [role='alert'], [role='status']"
      )
    ).filter(isVisible)

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

        element.style.cssText += `outline: 2px solid ${color} !important;`

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
        const ariaLive = element.getAttribute('aria-live')
        const role = element.getAttribute('role')

        if (ariaLive === 'assertive' || ariaLive === 'polite') {
          handleHighlighting(element, `aria-live: ${ariaLive}`, 'red', 'LiveRegionFinder')
        }

        if (role === 'alert' || role === 'status') {
          handleHighlighting(element, `role: ${role}`, 'red', 'LiveRegionFinder')
        }

        console.log(element)
      })

      console.log(
        `${elements.length} elements with role alert, status or aria-live attribute were found on this page.`
      )
    }

    if (showBr) {
      chrome.runtime.sendMessage({
        action: 'removeIndicators',
        type: 'LiveRegionFinder',
        place: 'beforebegin',
      })
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
      <img src={liveRegionFinder} className="svg-icon" alt="Live Regions" /> Live Regions
    </CustomButton>
  )
}
