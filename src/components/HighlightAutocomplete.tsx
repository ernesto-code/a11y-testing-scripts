import autoComplete from '../assets/autoComplete.svg'
import { CustomButton } from './common/Button'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'

export const HighlightAutocomplete = () => {
  const [showAutoCompletes, setShowAutoCompletes, iconClass] = useLocalStorage('AutocompleteActive', false)

  const codeToExecute = function (showAutoCompletes: boolean) {
    const autocompleteCounts: Record<string, number> = {}
    const inputs = document.querySelectorAll('input')
    const visibleInputs = [...inputs].filter(isVisible)
    const validAutocompleteValues: string[] = [
      'name',
      'honorific-prefix',
      'given-name',
      'additional-name',
      'family-name',
      'honorific-suffix',
      'nickname',
      'username',
      'new-password',
      'current-password',
      'one-time-code',
      'organization-title',
      'organization',
      'street-address',
      'address-line1',
      'address-line2',
      'address-line3',
      'address-level4',
      'address-level3',
      'address-level2',
      'address-level1',
      'country',
      'country-name',
      'postal-code',
      'cc-name',
      'cc-given-name',
      'cc-additional-name',
      'cc-family-name',
      'cc-number',
      'cc-exp',
      'cc-exp-month',
      'cc-exp-year',
      'cc-csc',
      'cc-type',
      'transaction-currency',
      'transaction-amount',
      'language',
      'bday',
      'bday-day',
      'bday-month',
      'bday-year',
      'sex',
      'url',
      'photo',
      'tel',
      'tel-country-code',
      'tel-national',
      'tel-area-code',
      'tel-local',
      'tel-local-prefix',
      'tel-local-suffix',
      'tel-extension',
      'email',
      'impp',
    ]

    function isButton(element: Element) {
      const buttonTypes = new Set(['submit', 'button', 'reset', 'image', 'radio', 'range', 'checkbox'])
      const type = element.getAttribute('type') ?? ''
      return buttonTypes.has(type)
    }

    function isHidden(element: Element): boolean {
      const style = window.getComputedStyle(element)
      return style.display === 'none' || style.visibility === 'hidden'
    }

    function hasInaccessibleRole(element: HTMLElement): boolean {
      const role = element.getAttribute('role')
      return role === 'presentation' || role === 'none'
    }

    function isVisible(element: HTMLElement | null): boolean {
      if (element !== null && hasInaccessibleRole(element)) {
        return false
      }

      while (element) {
        if (isHidden(element) || isButton(element)) {
          return false
        }
        element = element.parentElement
      }

      return true
    }

    const countAutocompleteAttr = (element: any, autocompleteCounts: Record<string, number>) => {
      const autocompleteValue = element.getAttribute('autocomplete')
      autocompleteCounts[autocompleteValue] = (autocompleteCounts[autocompleteValue] || 0) + 1
    }

    const logElementCounts = () => {
      visibleInputs.forEach((element) => countAutocompleteAttr(element, autocompleteCounts))

      console.log(`${visibleInputs.length} elements with autocomplete attribute were found on this page.`)
      console.log('Count of each autocomplete:')
      Object.entries(autocompleteCounts).forEach(([role, count]) => {
        console.log(`${role}: ${count} occurrences`)
      })
    }

    const handleHighlighting = (element: any, label: string, type: string) => {
      let uniqueClass = Array.from(element.classList).find((cl: any) => cl.startsWith('a11yToolkit-'))
      if (!uniqueClass) {
        uniqueClass = `a11yToolkit-${type}-${Math.random().toString(36).substring(2, 15)}`
        element.classList.add(uniqueClass)

        element.style.cssText += `outline: 2px solid red !important; outline-offset: -2px !important;`

        chrome.runtime.sendMessage({
          action: 'highlight',
          elementClass: uniqueClass,
          label: label,
          color: 'red',
          type: type,
          place: 'beforebegin',
        })
      }
    }

    const highlightAutocomplete = () => {
      logElementCounts()

      visibleInputs.forEach((element) => {
        const autocompleteValue = element.getAttribute('autocomplete')
        let label

        if (!autocompleteValue) {
          label = 'No'
          console.error(`Input without autocomplete '${autocompleteValue}':`, element)
        } else if (!validAutocompleteValues.includes(autocompleteValue)) {
          label = '⚠️'
          console.error(`Input with invalid autocomplete '${autocompleteValue}':`, element)
        } else {
          label = autocompleteValue
        }

        handleHighlighting(element, label, 'Autocomplete')
      })
    }

    if (showAutoCompletes) {
      chrome.runtime.sendMessage({ action: 'removeIndicators', type: 'Autocomplete', place: 'beforebegin' })
    } else {
      highlightAutocomplete()
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
            args: [showAutoCompletes],
          },
          () => {
            setShowAutoCompletes(!showAutoCompletes)
          }
        )
      }
    })
  }

  return (
    <CustomButton onClick={handleClick} className={iconClass}>
      <img src={autoComplete} className="svg-icon" alt="Autocomplete" /> Autocomplete
    </CustomButton>
  )
}
