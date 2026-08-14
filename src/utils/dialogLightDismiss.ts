export function isDialogBackdropClick(
  dialog: object,
  event: { target: object | null; clientX: number; clientY: number },
  rect: { top: number; left: number; height: number; width: number },
): boolean {
  if (event.target !== dialog) return false;
  const inside =
    rect.top <= event.clientY &&
    event.clientY <= rect.top + rect.height &&
    rect.left <= event.clientX &&
    event.clientX <= rect.left + rect.width;
  return !inside;
}
