export function calculateNewPage(
  currentPage: number,
  currentPageSize: number,
  newPageSize: number
) {
  const firstRecordIndex = (currentPage - 1) * currentPageSize
  return Math.ceil((firstRecordIndex + 1) / newPageSize)
}
