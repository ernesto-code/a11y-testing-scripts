import { CustomButton } from './common/Button'
import imageAltText from '../assets/imageAltText.svg'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'

export const HighlightImageAltText = () => {
  const [showImageAltText, setShowImageAltText, iconClass] = useLocalStorage('ImageAltTextActive', false)

  const codeToExecute = function (showImageAltText: boolean) {
    const colors = { aria: '#00F', native: 'red' }
    const elements = Array.from(document.querySelectorAll("img, [role='img']")).filter(isVisible)
    const roleCounts: { [key: string]: number } = {}

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

    const logElementCounts = () => {
      console.log(`${elements.length} elements IMG and RoleIMG were found on this page.`)
      Object.entries(roleCounts).forEach(([role, count]) => {
        console.log(`${role}: ${count} occurrences`)
      })
    }

    const highlightImageAltText = () => {
      elements.forEach((element) => {
        let alt
        let altLabel

        if (element.hasAttribute('alt')) {
          alt = element.getAttribute('alt') || 'null'
        } else {
          alt = 'No alt attr'
        }

        const ariaRole = element.getAttribute('role')
        if (ariaRole === 'img') {
          if (element.hasAttribute('aria-label')) {
            altLabel = element.getAttribute('aria-label') || 'null'
          } else {
            altLabel = 'No attr'
          }
          handleHighlighting(element, altLabel, colors.aria, 'ImageAltText')
          roleCounts['RoleIMG'] = (roleCounts['RoleIMG'] || 0) + 1
        }
        handleHighlighting(element, alt, colors.native, 'ImageAltText')
        if (element.tagName !== 'DIV' && element.tagName !== 'svg') {
          roleCounts[element.tagName] = (roleCounts[element.tagName] || 0) + 1
        }
        console.log(element)
      })

      logElementCounts()
    }

    if (showImageAltText) {
      chrome.runtime.sendMessage({ action: 'removeIndicators', type: 'ImageAltText', place: 'beforebegin' })
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
            args: [showImageAltText],
          },
          () => setShowImageAltText(!showImageAltText)
        )
      }
    })
  }

  return (
    <CustomButton onClick={handleClick} className={iconClass}>
      <img src={imageAltText} className="svg-icon" alt="Alt Text" /> Alt Text
    </CustomButton>
  )
}
