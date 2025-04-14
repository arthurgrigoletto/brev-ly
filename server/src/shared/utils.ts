export const cleanString = (value?: string | null) => {
  if (!value) {
    return value
  }

  const cleanValue = value
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z]+/g, '') // Removes non-words

  if (cleanValue.length === 0) {
    return null
  }

  return cleanValue
}

export const slugify = (value?: string | null) => {
  const cleanValue = cleanString(value)
  if (!cleanValue) {
    return cleanValue
  }

  const slugText = cleanValue
    .replace(/\s+/g, '-') // Removes whitespace
    .replace(/_/g, '-') // Replace underlines
    .replace(/--+/g, '-') // Replace doble hyphens
    .replace(/-$/g, '') // Remove hyphen at the end

  return slugText
}
