type ClickOutsideOption = {
  cb: () => void
}
export function clickOutside(node: HTMLElement, { cb }: ClickOutsideOption) {
  function handleClick(e: MouseEvent) {
    if (node && !node.contains(e.target as Node) && !e.defaultPrevented) {
      cb()
    }
  }

  window.addEventListener('click', handleClick)

  return {
    destroy() {
      window.removeEventListener('click', handleClick)
    }
  }
}
