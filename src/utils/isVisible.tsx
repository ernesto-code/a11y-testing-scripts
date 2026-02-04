function isHidden(element: Element): boolean {
  const style = window.getComputedStyle(element)
  return style.display === 'none' || style.visibility === 'hidden'
}

function hasInaccessibleRole(element: Element): boolean {
  const role = element.getAttribute('role')
  return role === 'presentation' || role === 'none'
}

export const isVisible = (element: Element | null) => {
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
