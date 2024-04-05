import BigNumber from 'bignumber.js'

export function decimalAmount(amount: string, decimals: number): string {
    return new BigNumber(amount).shiftedBy(-Number(decimals)).toFixed()
}
