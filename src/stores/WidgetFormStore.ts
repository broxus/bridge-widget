import { bridgeApi } from '@/api/bridge'
import { EvmTvmRequest, EvmTvmResponse } from '@/api/bridge/api'
import { dexApi } from '@/api/dex'
import { WHITE_LIST_CURRENCIES } from '@/config'
import { EvmConnectStore } from '@/stores/EvmConnectStore'
import { TokenListStore } from '@/stores/TokenListStore'
import { TvmConnectStore } from '@/stores/TvmConnectStore'
import { NetworkConfig, SwapPayload, Token } from '@/types'
import { approveTokens, getEvmBalance, getEvmToken, getEvmTokenBalance, getNetworkById } from '@/utils/bridge'
import { decimalAmount } from '@/utils/decimal-amount'
import { lastOfCalls } from '@/utils/last-of-calls'
import { normalizeAmount } from '@/utils/normalize-amount'
import { Reactions } from '@/utils/reactions'
import { MultiVaultAbi } from '@broxus/js-bridge-essentials'
import { isTvmAddress } from '@broxus/js-core'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { comparer, makeAutoObservable, reaction, runInAction } from 'mobx'

export class WidgetFormStore {
    loader = 0
    payloadLoader = 0
    walletBalance?: string = undefined
    tokenBalance?: string = undefined
    amount?: string = undefined
    inputNetworkId?: string = undefined
    inputTokenId?: string = undefined
    outputTokenId?: string = undefined
    bridgePayload?: EvmTvmResponse = undefined
    bridgePayloadParams?: EvmTvmRequest = undefined
    swapPayload?: SwapPayload = undefined
    swapPayloadToken?: Token = undefined
    bridgeEvmToken?: Token = undefined
    bridgeTvmToken?: Token = undefined
    notEnoughLiquidity?: boolean = undefined
    outputAddress?: string = undefined
    txHash?: string | undefined = undefined
    rate?: string | undefined = undefined

    protected reactions = new Reactions()

    protected getEvmBalance = lastOfCalls(getEvmBalance, 200)
    protected getEvmTokenBalance = lastOfCalls(getEvmTokenBalance, 200)
    protected getEvmToken = lastOfCalls(getEvmToken, 200)
    protected deriveTvmToken = lastOfCalls(bridgeApi.payload.calcDestinationTokenCreate.bind(bridgeApi), 200)
    protected getRate = lastOfCalls(bridgeApi.gatePrices.gatePricesCreate.bind(bridgeApi), 200)
    protected buildBridgePayload = lastOfCalls(bridgeApi.payload.buildCreate.bind(bridgeApi), 300)
    protected buildSwapPayload = lastOfCalls(dexApi.middleware.middlewareCreate.bind(dexApi), 300)

    constructor(
        protected tokenList: TokenListStore,
        protected evmConnect: EvmConnectStore,
        protected tvmConnect: TvmConnectStore,
    ) {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    init() {
        this.reactions.create(
            reaction(
                () => this.inputNetworkId,
                () => {
                    this.inputTokenId = undefined
                    this.tokenBalance = undefined
                },
            ),
            reaction(
                () => [
                    this.inputNetwork,
                    this.evmConnect.blockNum,
                ],
                this.syncRate,
                {
                    equals: comparer.structural,
                },
            ),
            reaction(
                () => this.evmConnect.blockNum,
                () => {
                    this.syncTokenBalance()
                    this.syncWalletBalance()
                },
            ),
            reaction(
                () => [
                    this.inputNetwork,
                    this.evmConnect.address,
                ],
                () => {
                    this.walletBalance = undefined
                    this.syncWalletBalance()
                },
                {
                    equals: comparer.structural,
                },
            ),
            reaction(
                () => [
                    this.inputToken,
                    this.inputNetwork,
                    this.evmConnect.address,
                    this.isGasToken,
                ],
                () => {
                    this.tokenBalance = undefined
                    this.syncTokenBalance()
                },
                {
                    equals: comparer.structural,
                },
            ),
            reaction(
                () => [
                    this.inputNetwork,
                    this.inputToken,
                ],
                this.syncBridgeEvmToken,
                {
                    equals: comparer.structural,
                },
            ),
            reaction(
                () => [
                    this.bridgeEvmToken,
                    this.inputNetwork,
                ],
                this.syncBridgeTvmToken,
                {
                    equals: comparer.structural,
                },
            ),
            reaction(
                () => [
                    this.inputNetwork,
                    this.bridgeEvmToken,
                    this.amountNormalized,
                    this.outputTvmAddress,
                ],
                this.syncBridgePayload,
                {
                    equals: comparer.structural,
                },
            ),
            reaction(
                () => [
                    this.bridgeTvmToken,
                    this.bridgeEvmToken,
                    this.outputToken,
                    this.bridgeAmountToReceive,
                    this.outputTvmAddress,
                ],
                this.syncSwapPayload,
                {
                    equals: comparer.structural,
                },
            ),
        )
    }

    dispose() {
        this.reactions.destroy()
    }

    reset() {
        this.tokenBalance = undefined
        this.amount = undefined
        this.inputNetworkId = undefined
        this.inputTokenId = undefined
        this.outputTokenId = undefined
        this.bridgePayload = undefined
        this.bridgePayloadParams = undefined
        this.swapPayload = undefined
        this.swapPayloadToken = undefined
        this.bridgeEvmToken = undefined
        this.bridgeTvmToken = undefined
        this.notEnoughLiquidity = undefined
        this.outputAddress = undefined
        this.txHash = undefined
    }

    async syncWalletBalance() {
        let walletBalance: string | undefined
        this.getEvmBalance.skip()
        try {
            if (
                this.evmConnect.address
                && this.inputNetwork
            ) {
                const result = await this.getEvmBalance.call(
                    this.evmConnect.address,
                    this.inputNetwork.rpcUrl,
                )
                walletBalance = result.skip ? this.walletBalance : result.result
            }
        } catch (e) {
            console.error(e)
        }
        runInAction(() => {
            this.walletBalance = walletBalance
        })
    }

    async syncTokenBalance() {
        let tokenBalance: string | undefined
        this.getEvmTokenBalance.skip()
        try {
            if (
                this.inputToken
                && this.evmConnect.address
                && this.inputNetwork
                && this.isGasToken === false
            ) {
                const result = await this.getEvmTokenBalance.call(
                    this.inputNetwork.rpcUrl,
                    this.inputToken.address,
                    this.evmConnect.address,
                )
                tokenBalance = result.skip ? this.tokenBalance : result.result
            }
        } catch (e) {
            console.error(e)
        }
        runInAction(() => {
            this.tokenBalance = tokenBalance
        })
    }

    async syncBridgeEvmToken() {
        let bridgeEvmToken: Token | undefined
        this.getEvmToken.skip()
        runInAction(() => {
            this.loader += 1
        })
        try {
            if (this.inputToken && this.inputNetwork) {
                const result = await this.getEvmToken.call(
                    this.inputToken.address,
                    this.inputNetwork,
                )
                bridgeEvmToken = result.skip ? this.bridgeEvmToken : result.result
            }
        } catch (e) {
            console.error(e)
        }
        runInAction(() => {
            this.bridgeEvmToken = bridgeEvmToken
            this.loader -= 1
        })
    }

    async syncBridgeTvmToken() {
        let tvmToken: Token | undefined
        this.deriveTvmToken.skip()
        runInAction(() => {
            this.loader += 1
        })
        try {
            if (this.bridgeEvmToken && this.inputNetwork) {
                const result = await this.deriveTvmToken.call({
                    evmTvm: {
                        evmChainId: parseInt(this.inputNetwork.chainId, 10),
                        evmTokenAddress: this.bridgeEvmToken.address,
                        evmTokenDecimals: Number(this.bridgeEvmToken.decimals),
                        evmTokenName: this.bridgeEvmToken.name,
                        evmTokenSymbol: this.bridgeEvmToken.symbol,
                    },
                })
                if (result.skip) {
                    tvmToken = this.bridgeTvmToken
                } else if ('evmTvm' in result.result.data) {
                    const token = result.result.data.evmTvm
                    tvmToken = {
                        chainId: 1,
                        address: token.tokenAddress,
                        decimals: token.decimals ?? this.bridgeEvmToken.decimals,
                        name: token.name ?? this.bridgeEvmToken.name,
                        symbol: token.symbol ?? this.bridgeEvmToken.symbol,
                    }
                }
            }
        } catch (e) {
            console.error(e)
        }
        runInAction(() => {
            this.bridgeTvmToken = tvmToken
            this.loader -= 1
        })
    }

    async syncRate() {
        let rate: string | undefined
        this.getRate.skip()
        runInAction(() => {
            this.loader += 1
        })
        try {
            if (this.inputNetwork) {
                const result = await this.getRate.call({
                    ticker: this.inputNetwork.currency.symbol,
                })
                if (result.skip) {
                    rate = this.rate
                } else {
                    rate = (await result.result.json()).price
                }
            }
        } catch (e) {
            console.error(e)
        }
        runInAction(() => {
            this.rate = rate
            this.loader -= 1
        })
    }

    async syncBridgePayload() {
        let bridgePayload: EvmTvmResponse | undefined
        let bridgePayloadParams: EvmTvmRequest | undefined
        let notEnoughLiquidity: boolean | undefined
        this.buildBridgePayload.skip()
        runInAction(() => {
            this.loader += 1
            this.payloadLoader += 1
        })
        try {
            if (
                this.inputNetwork
                && this.bridgeEvmToken
                && this.amountNormalized
                && this.outputTvmAddress
            ) {
                const params: EvmTvmRequest = {
                    evmTokenAddress: this.bridgeEvmToken.address,
                    evmTokenAmount: this.amountNormalized,
                    evmChainId: Number(this.inputNetwork.chainId),
                    evmTokenDecimals: Number(this.bridgeEvmToken.decimals),
                    evmTokenName: this.bridgeEvmToken.name,
                    evmTokenSymbol: this.bridgeEvmToken.symbol,
                    tvmRecipientAddress: this.outputTvmAddress,
                    tvmRemainingGasTo: this.outputTvmAddress,
                    expectedNativeTokensAmount: '0',
                    useCredit: true,
                    payload: '',
                }
                const result = await this.buildBridgePayload.call({
                    evmTvm: params,
                })
                if (result.skip) {
                    bridgePayload = this.bridgePayload
                    bridgePayloadParams = this.bridgePayloadParams
                } else if ('evmTvm' in result.result.data) {
                    bridgePayload = result.result.data.evmTvm
                    bridgePayloadParams = params
                }
            }
        } catch (e) {
            notEnoughLiquidity = true
            console.error(e)
        }
        runInAction(() => {
            this.notEnoughLiquidity = notEnoughLiquidity
            this.bridgePayloadParams = bridgePayloadParams
            this.bridgePayload = bridgePayload
            this.loader -= 1
            this.payloadLoader -= 1
        })
    }

    async syncSwapPayload() {
        let swapPayload: SwapPayload | undefined
        let swapPayloadToken: Token | undefined
        let notEnoughLiquidity: boolean | undefined
        this.buildSwapPayload.skip()
        runInAction(() => {
            this.loader += 1
            this.payloadLoader += 1
        })
        try {
            if (
                this.bridgeAmountToReceive
                && this.outputTvmAddress
                && this.bridgeTvmToken
                && this.outputToken
                && this.bridgeEvmToken
            ) {
                const token = this.outputToken
                const result = await this.buildSwapPayload.call({
                    input: {
                        swap: {
                            amount: normalizeAmount(
                                decimalAmount(this.bridgeAmountToReceive, this.bridgeEvmToken.decimals),
                                this.bridgeTvmToken.decimals,
                            ),
                            cancelPayload: {
                                tokenReceiver: this.outputTvmAddress,
                                deployWalletValue: '200000000',
                                valueForFinalTransfer: '200000000',
                            },
                            deep: 3,
                            fromCurrencyAddress: this.bridgeTvmToken.address,
                            minTvl: '0.1',
                            remainingGasTo: this.outputTvmAddress,
                            successPayload: {
                                deployWalletValue: '200000000',
                                tokenReceiver: this.outputTvmAddress,
                                valueForFinalTransfer: '200000000',
                            },
                            toCurrencyAddress: this.outputToken.address,
                            whiteListCurrencies: WHITE_LIST_CURRENCIES,
                            direction: 'expectedexchange',
                            slippage: '0.05',
                        },
                    },
                })
                if (result.skip) {
                    swapPayload = this.swapPayload
                    swapPayloadToken = this.swapPayloadToken
                } else if ('swap' in result.result.data.output) {
                    swapPayload = result.result.data.output.swap
                    swapPayloadToken = token
                }
            }
        } catch (e) {
            notEnoughLiquidity = true
            console.error(e)
        }
        runInAction(() => {
            this.notEnoughLiquidity = notEnoughLiquidity
            this.swapPayloadToken = swapPayloadToken
            this.swapPayload = swapPayload
            this.loader -= 1
            this.payloadLoader -= 1
        })
    }

    async exchange() {
        let txHash: string | undefined
        runInAction(() => {
            this.loader += 1
        })
        try {
            const { bridgeEvmToken: evmToken } = this
            const evmUserAddress = this.evmConnect.address
            if (!this.evmConnect.provider) {
                throw new Error('Provider must be defined')
            }
            if (!this.bridgePayload) {
                throw new Error('Payload must be defined')
            }
            if (!this.amountNormalized) {
                throw new Error('amountNormalized must be defined')
            }
            if (this.isGasToken === undefined) {
                throw new Error('isGasToken must be defined')
            }
            if (!evmToken) {
                throw new Error('evmToken must be defined')
            }
            if (!evmUserAddress) {
                throw new Error('evmConnect.address must be defined')
            }
            if (!this.inputNetwork) {
                throw new Error('inputNetwork must be defined')
            }
            if (this.swapRequired === undefined) {
                throw new Error('swapRequired must be defined')
            }
            if (this.swapRequired && !this.swapPayload) {
                throw new Error('swapPayload must be defined')
            }
            if (!this.rate) {
                throw new Error('rate must be defined')
            }
            const browserProvider = new ethers.BrowserProvider(this.evmConnect.provider)
            const signer = await browserProvider.getSigner()
            const multiVault = new ethers.Contract(this.bridgePayload.evmMultivaultAddress, MultiVaultAbi, signer)

            const recipient = this.swapRequired
                ? {
                    wid: this.swapPayload!.sendTo.split(':')[0],
                    addr: `0x${this.swapPayload!.sendTo.split(':')[1]}`,
                }
                : {
                    wid: this.bridgePayload.tvmRecipientAddress.split(':')[0],
                    addr: `0x${this.bridgePayload.tvmRecipientAddress.split(':')[1]}`,
                }
            const payload = this.swapRequired
                ? this.swapPayload!.tokensTransferPayload
                : this.bridgePayload.payload
            const hexPayload = `0x${Buffer.from(payload, 'base64').toString('hex')}`

            let expectedEversBN = new BigNumber(this.bridgePayload.expectedNativeTokensAmount)
            if (this.swapRequired) {
                expectedEversBN = expectedEversBN.plus(this.swapPayload!.everAmount)
            }

            let expectedEversToNativeEvmBN = new BigNumber(this.bridgePayload.evmDepositTokensAmount)
            if (this.swapRequired) {
                expectedEversToNativeEvmBN = expectedEversToNativeEvmBN.plus(
                    new BigNumber(this.swapPayload!.everAmount)
                        .shiftedBy(-this.tvmConnect.decimals)
                        .div(this.rate)
                        .times(1.2)
                        .times(1e18)
                        .dp(0, BigNumber.ROUND_DOWN),
                )
            }

            if (this.isGasToken) {
                const trx = await multiVault.depositByNativeToken(
                    [
                        recipient,
                        this.amountNormalized,
                        expectedEversBN.toFixed(),
                        hexPayload,
                    ],
                    {
                        value: expectedEversToNativeEvmBN.toFixed(),
                    },
                )
                await trx.wait()
                txHash = trx.hash
            } else {
                await approveTokens(
                    evmToken.address,
                    evmUserAddress,
                    this.bridgePayload.evmMultivaultAddress,
                    this.amountNormalized,
                    this.evmConnect.provider,
                )
                const trx = await multiVault.deposit(
                    [
                        recipient,
                        this.bridgePayload.evmDepositTokenAddress,
                        this.amountNormalized,
                        expectedEversBN.toFixed(),
                        hexPayload,
                    ],
                    {
                        value: expectedEversToNativeEvmBN.toFixed(),
                    },
                )
                await trx.wait()
                txHash = trx.hash
            }
        } catch (e) {
            console.error(e)
        }
        runInAction(() => {
            this.loader -= 1
            this.txHash = txHash
        })
    }

    get loading(): boolean {
        return this.loader > 0
    }

    get payloadLoading(): boolean {
        return this.payloadLoader > 0
    }

    get wrongOutputAddress(): boolean | undefined {
        return this.outputAddress ? !isTvmAddress(this.outputAddress) : undefined
    }

    get outputTvmAddress(): string | undefined {
        if (this.tvmConnect.address) {
            return this.tvmConnect.address
        }
        if (isTvmAddress(this.outputAddress)) {
            return this.outputAddress
        }
        return undefined
    }

    get inputNetwork(): NetworkConfig | undefined {
        return this.inputNetworkId ? getNetworkById(this.inputNetworkId) : undefined
    }

    get inputToken(): Token | undefined {
        return this.inputTokenId ? this.tokenList.byId[this.inputTokenId] : undefined
    }

    get outputToken(): Token | undefined {
        return this.outputTokenId ? this.tokenList.byId[this.outputTokenId] : undefined
    }

    get isGasToken(): boolean | undefined {
        if (this.inputTokenId && this.inputNetwork) {
            const token = this.tokenList.gasTokensById[this.inputTokenId]
            return token?.baseChainId?.toString() === this.inputNetwork.chainId.toString()
        }
        return undefined
    }

    get amountNormalized(): string | undefined {
        return this.amount && this.inputToken
            ? normalizeAmount(this.amount, this.inputToken.decimals)
            : undefined
    }

    get balance(): string | undefined {
        if (this.isGasToken !== undefined) {
            return this.isGasToken ? this.walletBalance : this.tokenBalance
        }
        return undefined
    }

    get bridgeAmountToReceive(): string | undefined {
        return this.bridgePayloadParams && this.bridgePayload
            ? new BigNumber(this.bridgePayloadParams.evmTokenAmount)
                .minus(this.bridgePayload.evmDepositFeeTokensAmount)
                .toFixed()
            : undefined
    }

    get wrongNetwork(): boolean | undefined {
        return this.evmConnect.chainId && this.inputNetwork
            ? this.evmConnect.chainId.toString() !== this.inputNetwork.chainId.toString()
            : undefined
    }

    get swapRequired() {
        return this.bridgeTvmToken && this.outputToken
            ? this.bridgeTvmToken.address !== this.outputToken.address
            : undefined
    }

    get amountEnough(): boolean | undefined {
        if (this.amountNormalized && this.isGasToken !== undefined) {
            if (this.isGasToken) {
                if (this.walletBalance) {
                    return new BigNumber(this.walletBalance).minus(this.amountNormalized).gt(0)
                }
            } else {
                if (this.tokenBalance) {
                    return new BigNumber(this.tokenBalance).minus(this.amountNormalized).gt(0)
                }
            }
        }
        return undefined
    }

    get valueEnough(): boolean | undefined {
        if (
            this.rate
            && this.bridgePayload
            && this.swapRequired !== undefined
            && (this.swapRequired ? !!this.swapPayload : true)
            && this.walletBalance
        ) {
            let value = new BigNumber(this.bridgePayload.evmDepositTokensAmount)
            if (this.swapRequired) {
                value = value.plus(
                    new BigNumber(this.swapPayload!.everAmount)
                        .shiftedBy(-this.tvmConnect.decimals)
                        .div(this.rate)
                        .times(1.2)
                        .times(1e18)
                        .dp(0, BigNumber.ROUND_DOWN),
                )
            }
            return new BigNumber(this.walletBalance).minus(value).gte(0)
        }
        return undefined
    }

    get amountToReceive(): string | undefined {
        if (this.swapRequired !== undefined) {
            if (this.swapRequired) {
                if (this.swapPayloadToken && this.swapPayload) {
                    return decimalAmount(
                        this.swapPayload.minTokenAmountReceive,
                        this.swapPayloadToken.decimals,
                    )
                }
            } else {
                if (this.bridgeAmountToReceive && this.bridgeEvmToken) {
                    return decimalAmount(
                        this.bridgeAmountToReceive,
                        this.bridgeEvmToken.decimals,
                    )
                }
            }
        }
        return undefined
    }

    get readyToExchange(): boolean {
        return !this.loading
            && this.amountEnough === true
            && this.valueEnough === true
            && this.wrongNetwork === false
            && !!this.bridgePayload
            && this.swapRequired !== undefined
            && (this.swapRequired ? !!this.swapPayload : true)
    }
}
