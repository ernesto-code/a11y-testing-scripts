import { CustomButton } from './common/Button'
import listItem from '../assets/listItem.svg'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'

export const HighlightListItems = () => {
  const [showListItems, setShowListItems, iconClass] = useLocalStorage('ListItemsActive', false)

  const codeToExecute = function (showListItems: boolean) {
    const ariaLists = Array.from(document.querySelectorAll("[role='list'], [role='listitem']")).filter(
      isVisible
    )
    const nativeLists = Array.from(
      document.querySelectorAll('ul:not([role="list"]), ol:not([role="list"]), li:not([role="listitem"])')
    ).filter(isVisible)
    // const nativeLists = document.querySelectorAll('ul, ol, li')
    const roleCounts: { [key: string]: number } = {}
    const colors = { aria: '#00F', native: 'red' }
    let ariaMarkCount = 0
    let nativeMarkCount = 0

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

        // element.setAttribute('data-a11y-highlighted', type)

        let size = label === 'LI' || label === 'aLI' ? '1px' : '2px'
        element.style.cssText += `outline: ${size} solid ${color} !important; outline-offset: -2px;`

        chrome.runtime.sendMessage({
          action: 'highlight',
          elementClass: uniqueClass,
          label: label,
          color: color,
          type: type,
          place: 'afterbegin',
        })
      }
    }

    const logElementCounts = () => {
      const elements = ariaMarkCount + nativeMarkCount
      console.log(`${elements} elements with role attribute were found on this page.`)
      Object.entries(roleCounts).forEach(([role, count]) => {
        console.log(`${role}: ${count} occurrences`)
      })
    }

    const highlightListItems = async () => {
      nativeLists.forEach((element: any) => {
        let role = element.getAttribute('role')
        if (role !== 'list' && role !== 'listitem') {
          let isListElement = element.tagName === 'UL' || element.tagName === 'OL'
          let color = isListElement ? colors.aria : colors.native
          handleHighlighting(element, element.tagName, color, 'listItems')
          if (isListElement) {
            console.log(element)
          }
          roleCounts[element.tagName] = (roleCounts[element.tagName] || 0) + 1
          nativeMarkCount++
        }
      })

      ariaLists.forEach((element: any) => {
        let role = element.getAttribute('role')
        let name = role === 'list' ? 'aL' : 'aLI'
        handleHighlighting(element, name, colors.aria, 'listItems')
        roleCounts[role] = (roleCounts[role] || 0) + 1
        if (name === 'aL') {
          console.log(element)
        }
        ariaMarkCount++
      })

      logElementCounts()
    }

    if (showListItems) {
      chrome.runtime.sendMessage({ action: 'removeIndicators', type: 'listItems', place: 'afterbegin' })
    } else {
      highlightListItems()
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
            args: [showListItems],
          },
          () => setShowListItems(!showListItems)
        )
      }
    })
  }

  return (
    <CustomButton onClick={handleClick} className={iconClass}>
      <img src={listItem} className="svg-icon" alt="Lists" /> Lists
    </CustomButton>
  )
}
