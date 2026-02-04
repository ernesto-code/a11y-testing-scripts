export const removeIndicators = function (type: string) {
  const highlightedElements = document.querySelectorAll(`.a11yToolkit-${type}-highlighted`)
  highlightedElements.forEach((element: any) => {
    element.style.outline = ''
    const classListToRemove = Array.from(element.classList).filter((cl: any) =>
      cl.startsWith(`a11yToolkit-${type}-`)
    )
    classListToRemove.forEach((dynamicClass) => {
      element.classList.remove(dynamicClass)
    })

    const spans = element.querySelectorAll(`.a11yToolkit-${type}-indicator`)
    spans.forEach((span: Element) => {
      span.remove()
    })
  })
}
