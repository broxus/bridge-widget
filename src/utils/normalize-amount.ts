import BigNumber from 'bignumber.js'

export function normalizeAmount(amount: string, decimals: number): string {
    return new BigNumber(amount).dp(decimals).shiftedBy(decimals).toFixed()
}
