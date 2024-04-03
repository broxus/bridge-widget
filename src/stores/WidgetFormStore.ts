import { EvmConnectStore } from '@/stores/EvmConnectStore'
import { TokenListStore } from '@/stores/TokensStore'
import { NetworkConfig, Token } from '@/types'
import { getEvmBalance, getEvmTokenBalance, getNetworkById, getTokenIdAddress } from '@/utils/bridge'
import { lastOfCalls } from '@/utils/last-of-calls'
import { normalizeAmount } from '@/utils/normalize-amount'
import { Reactions } from '@/utils/reactions'
import BigNumber from 'bignumber.js'
import { makeAutoObservable, reaction, runInAction, when } from 'mobx'

export class WidgetFormStore {
    loading = false
    balance?: string = undefined
    amount?: string = undefined
    inputNetworkId?: string = undefined
    inputTokenId?: string = undefined
    outputTokenId?: string = undefined

    protected reactions = new Reactions()
    protected getEvmBalance = lastOfCalls(getEvmBalance, 200)
    protected getEvmTokenBalance = lastOfCalls(getEvmTokenBalance, 200)

    constructor(
        protected tokenList: TokenListStore,
        protected evmConnect: EvmConnectStore,
    ) {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    init() {
        this.reactions.create(
            reaction(() => this.inputNetworkId, () => {
                this.inputTokenId = undefined
                this.balance = undefined
            }),
            reaction(() => this.inputTokenId, () => {
                this.balance = undefined
                this.syncBalance()
            }),
        )
    }

    async syncBalance() {
        let balance: string | undefined
        runInAction(() => {
            this.loading = true
        })
        try {
            if (this.inputTokenId && this.evmConnect.address && this.inputNetworkId) {
                await when(() => this.tokenList.isReady)
                const network = getNetworkById(this.inputNetworkId)
                const tokenAddress = getTokenIdAddress(this.inputTokenId)
                const currency = this.tokenList.gasTokensById[this.inputTokenId]
                const isGasToken = currency?.baseChainId?.toString() === network.chainId.toString()
                const result = isGasToken
                    ? await this.getEvmBalance(this.evmConnect.address, network.rpcUrl)
                    : await this.getEvmTokenBalance(network.rpcUrl, tokenAddress, this.evmConnect.address)
                if (result.skip) {
                    return
                }
                balance = result.result
            }
        } catch (e) {
            console.error(e)
        }
        runInAction(() => {
            this.balance = balance
            this.loading = false
        })
    }

    get wrongNetwork(): boolean | undefined {
        return this.evmConnect.chainId && this.inputNetwork
            ? this.evmConnect.chainId.toString() !== this.inputNetwork.chainId.toString()
            : undefined
    }

    get inputNetwork(): NetworkConfig | undefined {
        return this.inputNetworkId ? getNetworkById(this.inputNetworkId) : undefined
    }

    get inputToken(): Token | undefined {
        return this.inputTokenId
            ? this.tokenList.byId[this.inputTokenId]
            : undefined
    }

    get amountNormalized(): string | undefined {
        return this.amount && this.inputToken
            ? normalizeAmount(this.amount, this.inputToken.decimals)
            : undefined
    }

    get amountEnough(): boolean | undefined {
        console.log(this.amountNormalized, this.balance)
        return this.amountNormalized && this.balance
            ? new BigNumber(this.amountNormalized).lte(this.balance)
            : undefined
    }
}
