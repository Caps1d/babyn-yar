export function trimText(text: string, threshold: number = 50) {
  return text.length < 50 ? text : text.slice(0, threshold) + '...'
}
