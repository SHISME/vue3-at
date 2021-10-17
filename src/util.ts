export function getRange(): Range | undefined {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    return selection.getRangeAt(0);
  }
}

export function getCurRangeClone(): Range | undefined {
  const r = getRange();
  if (r) {
    const range = r.cloneRange();
    range.collapse(true);
    range.setStart(range.endContainer, 0);
    return range;
  }
}

export function applyRange(range: Range): void {
  const selection = window.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
}

export function htmlToElement(html: string): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html.trim();
  return wrapper.firstChild as HTMLElement;
}

export function isTextNode(el: any): el is Text {
  return el.nodeType === Node.TEXT_NODE;
}

/**
 */
export function getRangeTagContainer(range: Range): HTMLElement | false {
  const parentElement = range.endContainer.parentElement;
  if (!parentElement) return false;
  if (parentElement.getAttribute("is-tag")) {
    return parentElement;
  }
  const granParentElement = parentElement.parentElement;
  if (!granParentElement) return false;
  if (granParentElement.getAttribute("is-tag")) {
    return granParentElement;
  }
  return false;
}

export enum KeyCode {
  up = 38,
  down = 40,
  enter = 13,
  esc = 27,
  left = 37,
  right = 39,
  delete = 8,
}
