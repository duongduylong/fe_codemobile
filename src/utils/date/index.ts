export const dateUtil = {
  formatDate: (input: string | undefined) => {
    if (!input) {
      return
    }

    const date = new Date(input)
    const formatted = `${String(date.getDate()).padStart(2, '0')}/${String(
      date.getMonth() + 1
    ).padStart(2, '0')}/${date.getFullYear()} - ${String(date.getHours()).padStart(
      2,
      '0'
    )}:${String(date.getMinutes()).padStart(2, '0')}`

    return formatted
  }
}
