export const highlightElement = function (elementClass: string, label: string, color: string, type: string) {
  const element = document.querySelector(`.${elementClass}`)
  if (element) {
    const existingIndicator = Array.from(element.querySelectorAll(`.a11yToolkit-${type}-indicator`)).some(
      (indicator) => indicator.textContent === label
    )

    if (!existingIndicator) {
      element.classList.add(`a11yToolkit-${type}-highlighted`)

      const span = document.createElement('span')
      span.className = `a11yToolkit-${type}-indicator`
      span.style.position = 'relative'
      span.style.padding = '2px'
      span.style.zIndex = '999'
      span.style.background = color
      span.style.color = 'white'
      span.innerText = label
      element.insertAdjacentElement('afterbegin', span)
    }
  }
}
