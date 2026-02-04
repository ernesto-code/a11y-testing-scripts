import { CustomButton } from './common/Button'
import targetSize from '../assets/targetSize.svg'
import { useLocalStorage } from '../hooks/useLocalStorage.hook'

declare global {
  interface Window {
    // handleMouseOver?: (event: MouseEvent) => void
    handleScroll?: (event: Event) => void
    handleMouseOut?: (event: MouseEvent) => void
    handleKeyDown?: (event: KeyboardEvent) => void
    showTooltip?: boolean
  }
}

window.showTooltip = false

export const HighlightTargetSize = () => {
  const [isActive, setIsActive, iconClass] = useLocalStorage('TargetSizeActive', false)

  const codeToExecute = (isActive: boolean) => {
    let currentElement: any = null
    let tooltip: any
    let widthValue: number = 0
    let heightValue: number = 0

    if (!document.querySelector('.a11yToolkit-size-tooltip')) {
      tooltip = document.createElement('figure')
      tooltip.style.display = 'flex'
      tooltip.style.flexDirection = 'column'
      tooltip.style.position = 'absolute'
      tooltip.style.borderRadius = '8px'
      tooltip.style.background = 'hsla(0, 0%, 10%, 0.8)'
      tooltip.style.fontSize = '14px'
      tooltip.style.fontWeight = 'bold'
      tooltip.style.backdropFilter = 'blur(5px)'
      tooltip.style.boxShadow = ' rgba(0, 0, 0, 0.35) 0px 5px 15px'
      tooltip.style.transition = 'top 0.2s, left 0.2s'
      tooltip.style.fontFamily = ' monospace'
      tooltip.style.zIndex = '99999999999'
      tooltip.className = 'a11yToolkit-size-tooltip'

      document.body.appendChild(tooltip)
    } else {
      tooltip = document.querySelector('.a11yToolkit-size-tooltip') as any
    }

    const isSmall = (width: number, height: number) => {
      return width < 24 || height < 24
    }

    const updateTooltipPosition = () => {
      const tooltip: any = document.querySelector('.a11yToolkit-size-tooltip')
      if (!tooltip || !currentElement) return

      const rect = currentElement.getBoundingClientRect()
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // Ajustar la posición basada en la ubicación del elemento
      let tooltipLeft = rect.right + scrollLeft + 50 // A la derecha del elemento
      let tooltipTop = rect.top + scrollTop - tooltip.offsetHeight - 30 // Arriba del elemento

      // Asegurarse de que el tooltip no se sale de la ventana
      if (tooltipLeft + tooltip.offsetWidth > window.innerWidth) {
        tooltipLeft = window.innerWidth - tooltip.offsetWidth - 70
      }

      if (tooltipTop < 0) {
        tooltipTop = rect.bottom + scrollTop + 50 // Si no cabe arriba, mostrar debajo
      }

      tooltip.style.left = `${tooltipLeft}px`
      tooltip.style.top = `${tooltipTop}px`
    }

    if (!window.handleKeyDown) {
      window.handleKeyDown = (event: KeyboardEvent) => {
        if (!window.showTooltip) return
        if (event.key === 'Control' || event.key === 'Ctrl') {
          if (isSmall(widthValue, heightValue)) {
            console.log(currentElement)
          }
        }
      }
    }
    if (!window.handleScroll) {
      window.handleScroll = () => {
        if (currentElement) {
          updateTooltipPosition()
        }
      }
    }
    if (!window.handleMouseOut) {
      window.handleMouseOut = () => {
        if (currentElement) {
          currentElement.style.outline = ''
          currentElement.style.boxShadow = ''
          currentElement.style.background = ''
          currentElement.style.backgroundColor = ''
        }
      }
    }

    const handleMouseOver = (event: any) => {
      if (!window.showTooltip) return
      const element = event.target
      if (element !== currentElement) {
        const computedStyle = window.getComputedStyle(element)
        let width = element.style.width || computedStyle.width
        let height = element.style.height || computedStyle.height

        if (width === 'auto') {
          width = `${element.offsetWidth}px`
        }

        if (height === 'auto') {
          height = `${element.offsetHeight}px`
        }

        widthValue = parseFloat(width)
        heightValue = parseFloat(height)

        let elementName = element.tagName.toLowerCase()
        let idOrClass = ''
        if (element.id) {
          idOrClass = `#${element.id}`
        } else if (element.className) {
          // Comprobar si className es una cadena o un objeto SVGAnimatedString
          const className =
            typeof element.className === 'string' ? element.className : element.className.baseVal // Para SVGs

          idOrClass = className ? `.${className.split(' ')[0]}` : ''
        }

        const tooltipWidth = tooltip.offsetWidth
        const tooltipHeight = tooltip.offsetHeight

        let tooltipLeft = event.clientX + 10
        let tooltipTop = event.clientY + 60

        if (tooltipLeft + tooltipWidth * 2 > window.innerWidth || event.clientX > window.innerWidth / 2) {
          tooltipLeft = event.clientX - tooltipWidth * 2
        }

        if (event.clientY < window.innerHeight / 2) {
          tooltipTop = event.clientY + 60
        } else {
          tooltipTop = event.clientY - tooltipHeight - 60
        }
        tooltip.style.top = `${tooltipTop}px`
        tooltip.style.left = `${tooltipLeft}px`

        element.style.outline = '2px dotted black'
        element.style.boxShadow = '0 0 5px 5px white'

        let codeBackgroundColor = 'hsla(0, 0%, 10%, 0.9)'
        let codeColor = 'hotpink'

        if (isSmall(widthValue, heightValue)) {
          codeBackgroundColor = '#990000'
          codeColor = 'white'
          element.style.background = '#990000'
          element.style.backgroundColor = '#990000'
        }

        tooltip.innerHTML = `
              <header style="padding: 10px;">
                <strong style="color: white;">&lt${elementName}&gt${idOrClass}</strong>
              </header>
              <code style="background: ${codeBackgroundColor}; padding: 10px; border-radius: 8px; display: grid; grid-template-columns: max-content auto; gap: 0.25em 0.5em;">
                <span style="color: ${codeColor};">Width:</span><span style="color: white;"> ${width}</span>
                <span style="color: ${codeColor};">Height:</span><span style="color: white;">  ${height}</span>
              </code>`

        currentElement = element
        updateTooltipPosition()
      }
    }

    document.body.addEventListener('mousemove', handleMouseOver)
    window.addEventListener('scroll', window.handleScroll!)
    document.body.addEventListener('keydown', window.handleKeyDown!)
    document.body.addEventListener('mouseout', window.handleMouseOut!)

    if (isActive) {
      window.showTooltip = false
      const indicators = document.querySelectorAll('.a11yToolkit-size-tooltip')
      indicators.forEach((indicator) => indicator.remove())
    } else {
      window.showTooltip = true
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
            args: [isActive],
          },
          () => setIsActive(!isActive)
        )
      }
    })
  }

  return (
    <CustomButton disabled onClick={handleClick} className={`${iconClass} disabled`}>
      <img src={targetSize} className="svg-icon" alt="Target Size" /> Target Size
    </CustomButton>
  )
}
