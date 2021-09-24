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
