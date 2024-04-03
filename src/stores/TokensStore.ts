import { makeAutoObservable, runInAction } from 'mobx'

import { AlienTokenListURI, TokenListURI } from '@/config'
import currencies from '@/currencies.json'
import { Token } from '@/types'
import { getNetworkId, getTokenId, getTokenType } from '@/utils/bridge'

export class TokenListStore {
    gasTokens: Token[] = []
    tokens: Token[] = []
    isReady = false

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
                this.isReady = true
            })
        } catch (e) {
            console.error(e)
            runInAction(() => {
                this.tokens = []
                this.gasTokens = []
                this.isReady = false
            })
        }
    }

    get byId(): { [k: string]: Token | undefined } {
        return Object.fromEntries(this.tokens.map(item => [getTokenId(item), item]))
    }

    get byNetwork(): { [k: string]: Token[] | undefined } {
        return this.tokens.reduce<{ [k: string]: Token[] }>((acc, item) => {
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
}
