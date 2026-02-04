import ariaRoles from '../assets/ariaRoles.svg'
import { CustomButton } from './common/Button'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'

export const HighlightAriaRoles = () => {
  const [showAriaRoles, setShowAriaRoles, iconClass] = useLocalStorage('AriaRolesActive', false)

  const codeToExecute = function (showAriaRoles: boolean) {
    const colors = { aria: '#00F', native: 'red' }
    // const elements = document.querySelectorAll('[role]')
    const elements = Array.from(document.querySelectorAll('[role]')).filter(isVisible)
    const roleCounts: { [key: string]: number } = {}
    const validAriaRoles = [
      // Roles de widgets
      'button',
      'checkbox',
      'gridcell',
      'link',
      'menuitem',
      'menuitemcheckbox',
      'menuitemradio',
      'option',
      'progressbar',
      'radio',
      'scrollbar',
      'searchbox',
      'separator',
      'slider',
      'spinbutton',
      'switch',
      'tab',
      'tabpanel',
      'textbox',
      'treeitem',
      // Composite roles
      'combobox',
      'grid',
      'listbox',
      'menu',
      'menubar',
      'radiogroup',
      'tablist',
      'tree',
      'treegrid',
      // Document structure functions
      'application',
      'article',
      'cell',
      'columnheader',
      'definition',
      'directory',
      'document',
      'feed',
      'figure',
      'group',
      'heading',
      'img',
      'list',
      'listitem',
      'math',
      'none',
      'note',
      'presentation',
      'row',
      'rowgroup',
      'rowheader',
      'separator',
      'table',
      'term',
      'toolbar',
      'tooltip',
      // Featured roles
      'banner',
      'complementary',
      'contentinfo',
      'form',
      'main',
      'navigation',
      'region',
      'search',
      // Roles de región en vivo
      'alert',
      'log',
      'marquee',
      'status',
      'timer',
      // Window roles
      'alertdialog',
      'dialog',
    ]

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

    const logElementCounts = () => {
      console.log(`${elements.length} elements with role attribute were found on this page.`)
      console.log('Count of each role:')
      Object.entries(roleCounts).forEach(([role, count]) => {
        console.log(`${role}: ${count} occurrences`)
      })

      console.log(' ')
      Object.entries(roleCounts).forEach(([role]) => {
        if (!validAriaRoles.includes(role)) {
          console.error(`Invalid role: ${role}`)

          elements.forEach((element) => {
            if (element.getAttribute('role') === role) {
              console.error(`Element with invalid role '${role}':`, element)
            }
          })
        }
      })
    }

    const handleHighlighting = (element: any, label: string, color: string, place: string) => {
      let uniqueClass = Array.from(element.classList).find((cl: any) => cl.startsWith('a11yToolkit-'))
      if (!uniqueClass) {
        uniqueClass = `a11yToolkit-AriaRoles-${Math.random().toString(36).substring(2, 15)}`
        element.classList.add(uniqueClass)

        element.style.cssText += `outline: 2px solid ${color} !important; outline-offset: -2px !important;`

        chrome.runtime.sendMessage({
          action: 'highlight',
          elementClass: uniqueClass,
          label: label,
          color: color,
          type: 'AriaRoles',
          place: place,
        })
      }
    }

    const highlightAriaRoles = () => {
      elements.forEach((element: any) => {
        const role = element.getAttribute('role')
        roleCounts[role] = (roleCounts[role] || 0) + 1
        const place = element.tagName === 'IMG' || role === 'img' ? 'beforebegin' : 'afterbegin'
        element.setAttribute('data-highlight-place', place)

        if (validAriaRoles.includes(role)) {
          handleHighlighting(element, role, colors.aria, place)
        } else {
          handleHighlighting(element, `${role} ⚠️`, colors.native, place)
        }
      })

      logElementCounts()
    }

    if (showAriaRoles) {
      chrome.runtime.sendMessage({ action: 'removeIndicators', type: 'AriaRoles', place: 'afterbegin' })
    } else {
      highlightAriaRoles()
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
            args: [showAriaRoles],
          },
          () => {
            setShowAriaRoles(!showAriaRoles)
          }
        )
      }
    })
  }

  return (
    <CustomButton onClick={handleClick} className={iconClass}>
      <img src={ariaRoles} className="svg-icon" alt="Aria Roles" /> Aria Roles
    </CustomButton>
  )
}
