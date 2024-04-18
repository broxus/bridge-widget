import { makeAutoObservable, runInAction } from 'mobx'

import { AlienTokenListURI, ExtraTokenListURI, TokenListURI } from '@/config'
import currencies from '@/currencies.json'
import { Token } from '@/types'
import {
    getEvmToken,
    getNetworkById,
    getNetworkId,
    getTokenId,
    getTokenIdAddress,
    getTokenIdChain,
    getTokenIdType,
    getTokenType,
    getTvmToken,
} from '@/utils/bridge'

export class TokenListStore {
    gasTokens: Token[] = []
    filteredTokens: Token[] = []
    manifestTokens: Token[] = []
    extraTokens: Token[] = []
    ready = false
    loader = 0

    constructor() {
        makeAutoObservable(this, {}, {
            autoBind: true,
        })
    }

    init(): void {
        this.fetch()
    }

    async fetch(): Promise<void> {
        try {
            const [extraTvmTokens, tvmTokens, evmTokens] = await Promise.all([
                fetch(ExtraTokenListURI)
                    .then(data => data.json())
                    .then(data => data.tokens as Token[]),
                fetch(TokenListURI)
                    .then(data => data.json())
                    .then(data => data.tokens as Token[]),
                fetch(AlienTokenListURI)
                    .then(data => data.json())
                    .then(data => data.tokens as Token[]),
            ])

            const evmTokensFiltered = evmTokens.filter(item => {
                if (item.chainId.toString() === '1') {
                    return true
                }
                if (['usdt', 'usdc', 'wbtc', 'weth', 'dai'].includes(item.symbol.toLowerCase())) {
                    return true
                }
                return false
            })

            const tvmTokensFiltered = tvmTokens.filter(item => {
                if (['w3w', 'wvenom', 'vnm'].includes(item.symbol.toLowerCase())) {
                    return true
                }
                return false
            })

            const gasTokens = currencies.tokens

            const gasTokensFiltered = currencies.tokens.filter(item => {
                if (['avax', 'matic'].includes(item.symbol.toLowerCase())) {
                    return false
                }
                const tokenType = getTokenType(item)
                if (tokenType === 'tvm' && !['w3w', 'wvenom', 'vnm'].includes(item.symbol.toLowerCase())) {
                    return false
                }
                return true
            })

            const allEntries = [...tvmTokens, ...extraTvmTokens, ...evmTokens, ...gasTokens]
                .map(item => [getTokenId(item), item] as const)

            const filteredEntries = [...tvmTokensFiltered, ...evmTokensFiltered, ...gasTokensFiltered]
                .map(item => [getTokenId(item), item] as const)

            const manifestTokens = Object.values(Object.fromEntries(allEntries))
            const filteredTokens = Object.values(Object.fromEntries(filteredEntries))

            runInAction(() => {
                this.manifestTokens = manifestTokens
                this.filteredTokens = filteredTokens
                this.gasTokens = gasTokens
                this.ready = true
            })
        } catch (e) {
            console.error(e)
            runInAction(() => {
                this.filteredTokens = []
                this.gasTokens = []
                this.ready = false
            })
        }
    }

    async addToken(tokenId: string): Promise<boolean> {
        if (this.byIdFiltered[tokenId]) {
            return true
        }
        let success = false
        this.loader += 1
        try {
            const tokenType = getTokenIdType(tokenId)
            const address = getTokenIdAddress(tokenId)
            const chainId = getTokenIdChain(tokenId)
            const networkId = getNetworkId({ chainId, type: tokenType })
            const token = tokenType === 'evm'
                ? await getEvmToken(address, getNetworkById(networkId))
                : await getTvmToken(address)
            const entries = [...this.extraTokens, token].map(item => [getTokenId(item), item] as const)
            const unique = Object.values(Object.fromEntries(entries))
            tokenId = getTokenId(token)
            success = true
            runInAction(() => {
                this.extraTokens = unique
            })
        } catch (e) {
            console.error(e)
        }
        runInAction(() => {
            this.loader -= 1
        })
        return success
    }

    get byIdAll(): { [k: string]: Token | undefined } {
        return Object.fromEntries(
            [...this.extraTokens, ...this.filteredTokens, ...this.manifestTokens]
                .map(item => [getTokenId(item), item])
        )
    }

    get byIdFiltered(): { [k: string]: Token | undefined } {
        return Object.fromEntries(
            [...this.extraTokens, ...this.filteredTokens]
                .map(item => [getTokenId(item), item])
        )
    }

    get byNetworkFiltered(): { [k: string]: Token[] | undefined } {
        return [...this.filteredTokens, ...this.extraTokens]
            .reduce<{ [k: string]: Token[] }>((acc, item) => {
                const networkId = getNetworkId({
                    chainId: item.chainId,
                    type: getTokenType(item),
                })
                return {
                    ...acc,
                    [networkId]: [...(acc[networkId] ?? []), item],
                }
            }, {})
    }

    get gasTokensById(): { [k: string]: Token | undefined } {
        return Object.fromEntries(this.gasTokens.map(item => [getTokenId(item), item]))
    }

    get loading(): boolean {
        return this.loader > 0
    }
}
