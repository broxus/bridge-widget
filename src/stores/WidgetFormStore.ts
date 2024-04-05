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
    balance?: string = undefined
    amount?: string = undefined
    inputNetworkId?: string = undefined
    inputTokenId?: string = undefined
    outputTokenId?: string = undefined
    bridgePayload?: EvmTvmResponse = undefined
    bridgePayloadParams?: EvmTvmRequest = undefined
    swapRequired?: boolean = undefined
    swapPayload?: SwapPayload = undefined
    swapPayloadToken?: Token = undefined
    bridgeEvmToken?: Token = undefined
    bridgeTvmToken?: Token = undefined
    notEnoughLiquidity?: boolean = undefined
    outputAddress?: string = undefined
    txHash?: string | undefined = undefined

    protected reactions = new Reactions()

    protected getEvmBalance = lastOfCalls(getEvmBalance, 200)
    protected getEvmTokenBalance = lastOfCalls(getEvmTokenBalance, 200)
    protected getEvmToken = lastOfCalls(getEvmToken, 200)
    protected deriveTvmToken = lastOfCalls(bridgeApi.payload.calcDestinationTokenCreate.bind(bridgeApi), 200)
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
                () => this.evmConnect.blockNum,
                this.syncBalance,
            ),
            reaction(
                () => this.inputNetworkId,
                () => {
                    this.inputTokenId = undefined
                    this.balance = undefined
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
                    this.balance = undefined
                    this.syncBalance()
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
        this.balance = undefined
        this.amount = undefined
        this.inputNetworkId = undefined
        this.inputTokenId = undefined
        this.outputTokenId = undefined
        this.bridgePayload = undefined
        this.bridgePayloadParams = undefined
        this.swapRequired = undefined
        this.swapPayload = undefined
        this.swapPayloadToken = undefined
        this.bridgeEvmToken = undefined
        this.bridgeTvmToken = undefined
        this.notEnoughLiquidity = undefined
        this.outputAddress = undefined
        this.txHash = undefined
    }

    async syncBalance() {
        let balance: string | undefined
        this.getEvmBalance.skip()
        this.getEvmTokenBalance.skip()
        try {
            if (
                this.inputToken
                && this.evmConnect.address
                && this.inputNetwork
                && this.isGasToken !== undefined
            ) {
                const result = this.isGasToken
                    ? await this.getEvmBalance.call(
                        this.evmConnect.address,
                        this.inputNetwork.rpcUrl,
                    )
                    : await this.getEvmTokenBalance.call(
                        this.inputNetwork.rpcUrl,
                        this.inputToken.address,
                        this.evmConnect.address,
                    )
                balance = result.skip ? this.balance : result.result
            }
        } catch (e) {
            console.error(e)
        }
        runInAction(() => {
            this.balance = balance
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
        let swapRequired: boolean | undefined
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
                if (this.bridgeTvmToken.address === this.outputToken.address) {
                    swapRequired = false
                } else {
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
                        swapRequired = this.swapRequired
                        swapPayloadToken = this.swapPayloadToken
                    } else if ('swap' in result.result.data.output) {
                        swapPayload = result.result.data.output.swap
                        swapRequired = true
                        swapPayloadToken = token
                    }
                }
            }
        } catch (e) {
            notEnoughLiquidity = true
            console.error(e)
        }
        runInAction(() => {
            this.notEnoughLiquidity = notEnoughLiquidity
            this.swapPayloadToken = swapPayloadToken
            this.swapRequired = swapRequired
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
                const rate = await bridgeApi.gatePrices.gatePricesCreate({
                    ticker: this.inputNetwork.currency.symbol,
                }).then(r => r.json()).then(r => r.price)

                expectedEversToNativeEvmBN = expectedEversToNativeEvmBN.plus(
                    new BigNumber(this.swapPayload!.everAmount)
                        .shiftedBy(-this.tvmConnect.decimals)
                        .div(rate)
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

    get amountEnough(): boolean | undefined {
        return this.amountNormalized && this.balance
            ? (new BigNumber(this.amountNormalized).lte(this.balance)
                && new BigNumber(this.amountNormalized).gt(0))
            : undefined
    }

    get readyToExchange(): boolean {
        return !this.loading
            && this.amountEnough === true
            && this.wrongNetwork === false
            && !!this.bridgePayload
            && this.swapRequired !== undefined
            && (this.swapRequired ? !!this.swapPayload : true)
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
}
