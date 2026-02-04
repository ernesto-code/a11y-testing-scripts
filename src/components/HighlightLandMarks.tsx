import landMarks from '../assets/landMarks.svg'
import { CustomButton } from './common/Button'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'

export const HighlightLandMarks = () => {
  const [showLandMarks, setShowLandMarks, iconClass] = useLocalStorage('LandMarksActive', false)

  const codeToExecute = function (showLandMarks: boolean) {
    const colors = { aria: '#00F', native: 'red' }
    const landmarksNative = [
      { selector: 'header', ariaEquivalent: 'banner' },
      { selector: 'nav', ariaEquivalent: 'navigation' },
      { selector: 'main', ariaEquivalent: 'main' },
      { selector: 'aside', ariaEquivalent: 'complementary' },
      { selector: 'section', ariaEquivalent: 'region' },
      { selector: 'footer', ariaEquivalent: 'contentinfo' },
    ]

    const landmarkRoles = [
      'banner', // Usually the site header container.
      'navigation', // For navigation areas.
      'main', // Main content of the page.
      'contentinfo', // Information about the main content (for example, the footer).
      'complementary', // Content that supports the main content but remains meaningful when separated.
      'region', // A section of content with a purposefully defined theme or topic
    ]

    let ariaLandmarkCount = 0
    let nativeLandmarkCount = 0
    let highlightedElements = new Set()

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

    const ariaLandMarks = () => {
      console.log('ARIA Landmark Roles in use:')
      landmarkRoles.forEach((role) => {
        const elements = Array.from(document.querySelectorAll(`[role="${role}"]`)).filter(isVisible)
        const formattedRole = 'a' + role.charAt(0).toUpperCase() + role.slice(1)

        elements.forEach((element: any) => {
          handleHighlighting(element, formattedRole, colors.aria, 'LandMarks') // store the label element
          highlightedElements.add(element)
          ariaLandmarkCount++
        })
        if (elements.length !== 0) {
          console.log(`${formattedRole}: ${elements.length} occurrences`)
        }
      })

      if (ariaLandmarkCount === 0) {
        console.log('No ARIA landmarks used in page')
      }
    }

    const nativeLandMarks = () => {
      console.log(' ')
      console.log('NATIVE Landmark Roles in use:')
      landmarksNative.forEach((item) => {
        let validLandmarkCount = 0
        const elements = Array.from(document.querySelectorAll(item.selector)).filter(isVisible)

        elements.forEach((element: any) => {
          if (!element.hasAttribute('role')) {
            if (!highlightedElements.has(element)) {
              handleHighlighting(element, item.selector, colors.native, 'LandMarks')
            }
            validLandmarkCount++
          }
        })

        nativeLandmarkCount += validLandmarkCount

        if (validLandmarkCount !== 0) {
          console.log(`${item.selector}: ${validLandmarkCount} occurrences`)
        }
      })

      if (nativeLandmarkCount === 0) {
        console.log('No NATIVE landmarks used in page')
      }

      // Check and display messages
      if (ariaLandmarkCount === 0 && nativeLandmarkCount === 0) {
        console.log(' ')
        console.log('NO LANDMARKS USED IN PAGE')
      }
    }

    if (showLandMarks) {
      chrome.runtime.sendMessage({ action: 'removeIndicators', type: 'LandMarks', place: 'beforebegin' })
    } else {
      ariaLandMarks()
      nativeLandMarks()
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
            args: [showLandMarks],
          },
          () => setShowLandMarks(!showLandMarks)
        )
      }
    })
  }
  return (
    <CustomButton onClick={handleClick} className={iconClass}>
      <img src={landMarks} className="svg-icon" alt="Landmarks" /> Landmarks
    </CustomButton>
  )
}
