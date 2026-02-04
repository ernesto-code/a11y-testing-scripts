// const removeIndicators = function (type, place) {
//   const highlightedElements = document.querySelectorAll(`.a11yToolkit-${type}-highlighted`)
//   highlightedElements.forEach((element) => {
//     element.style.outline = ''
//     const classListToRemove = Array.from(element.classList).filter((cl) =>
//       cl.startsWith(`a11yToolkit-${type}-`)
//     )

//     classListToRemove.forEach((dynamicClass) => {
//       element.classList.remove(dynamicClass)
//     })

//     if (place === 'beforebegin') {
//       const associatedElement = element.previousElementSibling
//       if (associatedElement && associatedElement.classList.contains(`a11yToolkit-${type}-indicator`)) {
//         associatedElement.remove()
//       }
//     } else {
//       const spans = element.querySelectorAll(`.a11yToolkit-${type}-indicator`)
//       spans.forEach((span) => {
//         span.remove()
//       })
//     }
//   })
// }

const removeIndicators = function (type, place) {
  document.querySelectorAll(`.a11yToolkit-${type}-highlighted`).forEach((element) => {
    element.classList.remove(
      ...Array.from(element.classList).filter((cl) => cl.startsWith(`a11yToolkit-${type}-`))
    )
    element.style.outline = ''
    element.style.outlineOffset = ''
    const dataPlace = element.getAttribute('data-highlight-place')

    if (dataPlace === 'beforebegin' || place === 'beforebegin') {
      const indicator = element.previousElementSibling
      if (indicator && indicator.matches(`.a11yToolkit-${type}-indicator`)) {
        indicator.remove()
      }
    } else {
      element.querySelectorAll(`.a11yToolkit-${type}-indicator`).forEach((span) => span.remove())
    }

    element.removeAttribute('data-highlight-place')
  })
}

const highlightElement = function (message) {
  const element = document.querySelector(`.${message.elementClass}`)
  let existing

  if (message.type === 'headings') {
    existing = Array.from(element.querySelectorAll(`.a11yToolkit-${message.type}-indicator`)).some(
      (indicator) => indicator.textContent === message.label
    )
  } else {
    // existing = element.querySelector(`.a11yToolkit-${message.type}-indicator`)
    existing = element.classList.contains(`.a11yToolkit-${message.type}-highlighted`)
  }

  if (element && !existing) {
    element.classList.add(`a11yToolkit-${message.type}-highlighted`)

    const span = document.createElement('span')
    span.className = `a11yToolkit-${message.type}-indicator`
    span.style.position = 'relative'
    span.style.padding = '2px'
    span.style.zIndex = '9999999'
    span.style.background = message.color
    span.style.color = 'white'
    span.style.border = '1px solid'
    span.style.margin = '1px'
    span.innerText = message.label
    element.insertAdjacentElement(message.place, span)
  }
}

chrome.runtime.onMessage.addListener((message, sender) => {
  // console.log('🚀  message:', message)
  if (message && message.action === 'removeIndicators') {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      func: removeIndicators,
      args: [message.type, message.place],
    })
  } else if (message && message.action === 'highlight') {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      func: highlightElement,
      args: [message],
    })
  }
})
