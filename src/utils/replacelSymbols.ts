export  const regExpSortTel = /(?:\+|\d)[\d\-() ]{9,}\d/g
//export  const regExpSortDescription = /(<(\/?[^>]+)>)/g
export const replaceSpecialSymbols = (str: string | undefined) => {
  if (str) {
    return str
      .replace(/(<(\/?[^>]+)>)/g, ' ')
      .replace(/^\s+/g, ' ')
      .replace('&#047;', '/')
      .replace('&#092;', '/')
      .replace('&#063;', ':')
      .replace('&#035;', '#')
      .replace(/&amp;ndash;/g, '–')
      .replace(/&amp;mdash;/g, '—');
  }

}

export const formatPhoneNumber =  (number) => {
  const cleaned = number.replace(/\D/g, '')

  if(cleaned.length > 11) return

    if (cleaned.startsWith('8')) {
      return '+7' + cleaned.slice(1)
    } else if (cleaned.startsWith('7')) {
      return '+7' + cleaned.slice(1)
    } else if (!cleaned.startsWith('7') && !cleaned.startsWith('9')) {
      return '+7' + cleaned
    }

    return cleaned
}
