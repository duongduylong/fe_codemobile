export const stringUtil = {
  truncate: (input: string, length: number) => {
    if (input.length <= length) {
      return input
    }

    return input.slice(0, length) + '...'
  }
}
