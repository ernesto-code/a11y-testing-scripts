import { CustomButton } from './common/Button'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'
import headingIcon from '../assets/headings.svg'

export const HighlightHeadings = () => {
  const [showHeadings, setShowHeadings, iconClass] = useLocalStorage('HeadingsActive', false)

  const codeToExecute = function (showListItems: boolean) {
    const colors = { aria: '#00F', native: 'red' }
    // const pageHeadings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).filter(isVisible)
    // const ariaHeadings = Array.from(document.querySelectorAll("[role='heading']")).filter(isVisible)
    const allHeadings = Array.from(
      document.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]')
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

    const handleHighlighting = (element: HTMLElement, label: string, color: string, type: string) => {
      let uniqueClass = Array.from(element.classList).find((cl: any) => cl.startsWith('a11yToolkit-'))
      if (!uniqueClass) {
        uniqueClass = `a11yToolkit-${type}-${Math.random().toString(36).substring(2, 15)}`
        element.classList.add(uniqueClass)
      }

      chrome.runtime.sendMessage({
        action: 'highlight',
        elementClass: uniqueClass,
        label: label,
        color: color,
        type: type,
        place: 'afterbegin',
      })
    }

    const highlightHeadings = () => {
      allHeadings.forEach((element: any) => {
        let level
        let ariaLevel = element.getAttribute('aria-level')
        const isNativeHeading = element.tagName.startsWith('H')
        const hasAriaRole = element.getAttribute('role') === 'heading'

        if (!ariaLevel) {
          level = isNativeHeading ? element.tagName[element.tagName.length - 1] : '2'
        }

        if (ariaLevel || hasAriaRole) {
          handleHighlighting(element, `aH${ariaLevel ? ariaLevel : level}`, colors.aria, 'headings')
          element.style.cssText += `outline: 2px solid ${colors.aria} !important;`
        }
        if (isNativeHeading && (!ariaLevel || !hasAriaRole)) {
          handleHighlighting(element, element.tagName, colors.native, 'headings')
          if (!hasAriaRole && !ariaLevel) {
            element.style.cssText += `outline: 2px solid ${colors.native} !important;`
          }
        }
      })
    }

    // const highlightHeadings = () => {
    //   ariaHeadings.forEach((element: any) => {
    //     let ariaLevel = element.getAttribute('aria-level')
    //     if (!ariaLevel) {
    //       if (element.tagName.startsWith('H')) {
    //         ariaLevel = element.tagName[element.tagName.length - 1]
    //       } else {
    //         ariaLevel = 2
    //       }
    //     }

    //     handleHighlighting(element, `aH${ariaLevel}`, colors.aria, 'headings')
    //     element.style.cssText += `outline: 2px solid ${colors.aria} !important;`
    //   })

    //   pageHeadings.forEach((element: any) => {
    //     const hasAria = element.hasAttribute('role') && element.getAttribute('role') === 'heading'
    //     let ariaLevel = element.getAttribute('aria-level')
    //     if (ariaLevel) {
    //       handleHighlighting(element, `aH${ariaLevel}`, colors.aria, 'headings');
    //       element.style.cssText += `outline: 2px solid ${colors.aria} !important;`;
    //     }

    //     handleHighlighting(element, element.tagName, colors.native, 'headings')
    //     if (!hasAria && !ariaLevel) {
    //       element.style.cssText += `outline: 2px solid ${colors.native} !important;`
    //     }
    //   })
    // }

    if (showListItems) {
      chrome.runtime.sendMessage({ action: 'removeIndicators', type: 'headings', place: 'afterbegin' })
    } else {
      highlightHeadings()
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
            args: [showHeadings],
          },
          () => setShowHeadings(!showHeadings)
        )
      }
    })
  }

  return (
    <CustomButton onClick={handleClick} className={iconClass}>
      <img src={headingIcon} className="svg-icon" alt="Headings" /> Headings
    </CustomButton>
  )
}
