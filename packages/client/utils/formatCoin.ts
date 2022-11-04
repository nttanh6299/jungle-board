const usLocale = Intl.NumberFormat('en-US')
const formatCoin = (value: number) => usLocale.format(value)
export default formatCoin
