import { makeAutoObservable, runInAction } from 'mobx'

import { AlienTokenListURI, TokenListURI } from '@/config'
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
    tokens: Token[] = []
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
            const [tvmTokens, evmTokens] = await Promise.all([
                fetch(TokenListURI)
                    .then(data => data.json())
                    .then(data => data.tokens as Token[]),
                fetch(AlienTokenListURI)
                    .then(data => data.json())
                    .then(data => data.tokens as Token[]),
            ])

            const entries = [...tvmTokens, ...evmTokens, ...currencies.tokens]
                .map(item => [getTokenId(item), item] as const)

            const unique = Object.values(Object.fromEntries(entries))

            runInAction(() => {
                this.tokens = unique
                this.gasTokens = currencies.tokens
                this.ready = true
            })
        } catch (e) {
            console.error(e)
            runInAction(() => {
                this.tokens = []
                this.gasTokens = []
                this.ready = false
            })
        }
    }

    async addToken(tokenId: string): Promise<boolean> {
        if (this.byId[tokenId]) {
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

    get byId(): { [k: string]: Token | undefined } {
        return Object.fromEntries([...this.tokens, ...this.extraTokens]
            .map(item => [getTokenId(item), item]))
    }

    get byNetwork(): { [k: string]: Token[] | undefined } {
        return [...this.tokens, ...this.extraTokens].reduce<{ [k: string]: Token[] }>((acc, item) => {
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
