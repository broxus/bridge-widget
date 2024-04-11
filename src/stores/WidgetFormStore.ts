import { bridgeApi } from '@/api/bridge'
import { dexApi } from '@/api/dex'
import { WHITE_LIST_CURRENCIES } from '@/config'
import { EvmConnectStore } from '@/stores/EvmConnectStore'
import { TokenListStore } from '@/stores/TokenListStore'
import { TvmConnectStore } from '@/stores/TvmConnectStore'
import { NetworkConfig, Token } from '@/types'
import {
    approveTokens,
    getEvmBalance,
    getEvmToken,
    getEvmTokenBalance,
    getNetworkById,
    getTokenId,
} from '@/utils/bridge'
import { DataSync } from '@/utils/data-sync'
import { decimalAmount } from '@/utils/decimal-amount'
import { normalizeAmount } from '@/utils/normalize-amount'
import { Reactions } from '@/utils/reactions'
import { MultiVaultAbi } from '@broxus/js-bridge-essentials'
import { isTvmAddress } from '@broxus/js-core'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { makeAutoObservable, reaction, runInAction } from 'mobx'

export class WidgetFormStore {
    protected reactions = new Reactions()

    amount?: string = undefined
    inputNetworkId?: string = undefined
    inputTokenId?: string = undefined
    outputTokenId?: string = undefined
    outputAddress?: string = undefined
    txHash?: string | undefined = undefined
    submitLoading = false

    evmBalance = new DataSync(getEvmBalance)
    evmTokenBalance = new DataSync(getEvmTokenBalance)
    bridgeEvmToken = new DataSync(getEvmToken)
    bridgeTvmToken = new DataSync(
        bridgeApi.payload.calcDestinationTokenCreate.bind(bridgeApi),
        value => 'evmTvm' in value.data ? value.data.evmTvm : undefined,
    )
    bridgePayload = new DataSync(
        bridgeApi.payload.buildCreate.bind(bridgeApi),
        value => 'evmTvm' in value.data ? value.data.evmTvm : undefined,
        params => 'evmTvm' in params[0] ? params[0].evmTvm : undefined,
    )
    rate = new DataSync(
        bridgeApi.gatePrices.gatePricesCreate.bind(bridgeApi),
        value => value.data.price,
    )
    swapPayload = new DataSync(
        dexApi.middleware.middlewareCreate.bind(dexApi),
        value => 'swap' in value.data.output ? value.data.output.swap : undefined,
        params => 'swap' in params[0].input ? params[0].input.swap : undefined,
    )

    constructor(
        protected tokenList: TokenListStore,
        protected evmConnect: EvmConnectStore,
        public tvmConnect: TvmConnectStore,
    ) {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    init() {
        this.reactions.create(
            reaction(
                () => this.inputNetworkId,
                () => {
                    this.inputTokenId = undefined
                    this.evmTokenBalance.reset()
                },
            ),
            reaction(
                () => [this.evmConnect.address, this.inputNetwork, this.evmConnect.blockNum],
                () => {
                    if (this.evmConnect.address && this.inputNetwork) {
                        this.evmBalance.sync(this.evmConnect.address, this.inputNetwork.rpcUrl)
                    } else {
                        this.evmBalance.reset()
                    }
                },
            ),
            reaction(
                () => [this.inputNetwork, this.inputToken, this.evmConnect.address, this.evmConnect.blockNum],
                () => {
                    if (this.inputNetwork && this.inputToken && this.evmConnect.address) {
                        this.evmTokenBalance.sync(
                            this.inputNetwork.rpcUrl,
                            this.inputToken.address,
                            this.evmConnect.address,
                        )
                    } else {
                        this.evmTokenBalance.reset()
                    }
                },
            ),
            reaction(
                () => [this.inputToken, this.inputNetwork],
                () => {
                    if (this.inputToken && this.inputNetwork) {
                        this.bridgeEvmToken.sync(this.inputToken.address, this.inputNetwork)
                    } else {
                        this.bridgeEvmToken.reset()
                    }
                },
            ),
            reaction(
                () => [this.inputNetwork, this.bridgeEvmToken.value],
                () => {
                    if (this.inputNetwork && this.bridgeEvmToken.value) {
                        this.bridgeTvmToken.sync({
                            evmTvm: {
                                evmChainId: parseInt(this.inputNetwork.chainId, 10),
                                evmTokenAddress: this.bridgeEvmToken.value.address,
                                evmTokenDecimals: Number(this.bridgeEvmToken.value.decimals),
                                evmTokenName: this.bridgeEvmToken.value.name,
                                evmTokenSymbol: this.bridgeEvmToken.value.symbol,
                            },
                        })
                    } else {
                        this.bridgeTvmToken.reset()
                    }
                },
            ),
            reaction(
                () => [this.inputNetwork, this.evmConnect.blockNum],
                () => {
                    if (this.inputNetwork) {
                        this.rate.sync({ ticker: this.inputNetwork.currency.symbol })
                    } else {
                        this.rate.reset()
                    }
                },
            ),
            reaction(
                () => [this.bridgeEvmToken.value, this.amountNormalized, this.inputNetwork, this.outputTvmAddress],
                () => {
                    if (
                        this.bridgeEvmToken.value && this.amountNormalized && this.inputNetwork && this.outputTvmAddress
                    ) {
                        this.bridgePayload.sync({
                            evmTvm: {
                                evmTokenAddress: this.bridgeEvmToken.value.address,
                                evmTokenAmount: this.amountNormalized,
                                evmChainId: Number(this.inputNetwork.chainId),
                                evmTokenDecimals: Number(this.bridgeEvmToken.value.decimals),
                                evmTokenName: this.bridgeEvmToken.value.name,
                                evmTokenSymbol: this.bridgeEvmToken.value.symbol,
                                tvmRecipientAddress: this.outputTvmAddress,
                                tvmRemainingGasTo: this.outputTvmAddress,
                                expectedNativeTokensAmount: '0',
                                useCredit: true,
                                payload: '',
                            },
                        })
                    } else {
                        this.bridgePayload.reset()
                    }
                },
            ),
            reaction(
                () => [
                    this.bridgeAmountToReceive,
                    this.bridgeEvmToken.value,
                    this.bridgeTvmToken.value,
                    this.outputTvmAddress,
                    this.outputToken,
                    this.swapRequired,
                ],
                () => {
                    if (
                        this.bridgeAmountToReceive && this.bridgeEvmToken.value && this.bridgeTvmToken.value
                        && this.outputTvmAddress && this.outputToken && this.swapRequired
                    ) {
                        this.swapPayload.sync({
                            input: {
                                swap: {
                                    amount: normalizeAmount(
                                        decimalAmount(this.bridgeAmountToReceive, this.bridgeEvmToken.value.decimals),
                                        this.bridgeTvmToken.value.decimals ?? this.bridgeEvmToken.value.decimals,
                                    ),
                                    cancelPayload: {
                                        tokenReceiver: this.outputTvmAddress,
                                        deployWalletValue: '200000000',
                                        valueForFinalTransfer: '200000000',
                                    },
                                    deep: 3,
                                    fromCurrencyAddress: this.bridgeTvmToken.value.tokenAddress,
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
                    } else {
                        this.swapPayload.reset()
                    }
                },
            ),
        )
    }

    dispose() {
        this.reactions.destroy()
    }

    reset() {
        this.amount = undefined
        this.inputNetworkId = undefined
        this.inputTokenId = undefined
        this.outputTokenId = undefined
        this.outputAddress = undefined
        this.txHash = undefined
        this.evmBalance.reset()
        this.evmTokenBalance.reset()
        this.bridgeEvmToken.reset()
        this.bridgeTvmToken.reset()
        this.bridgePayload.reset()
        this.rate.reset()
        this.swapPayload.reset()
    }

    async exchange() {
        let txHash: string | undefined
        runInAction(() => {
            this.submitLoading = true
        })
        try {
            const { bridgeEvmToken: evmToken } = this
            const evmUserAddress = this.evmConnect.address
            if (!this.evmConnect.provider) {
                throw new Error('Provider must be defined')
            }
            if (!this.bridgePayload.value) {
                throw new Error('Payload must be defined')
            }
            if (!this.amountNormalized) {
                throw new Error('amountNormalized must be defined')
            }
            if (this.isGasToken === undefined) {
                throw new Error('isGasToken must be defined')
            }
            if (!evmToken.value) {
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
            if (this.swapRequired && !this.swapPayload.value) {
                throw new Error('swapPayload must be defined')
            }
            if (!this.rate.value) {
                throw new Error('rate must be defined')
            }
            const browserProvider = new ethers.BrowserProvider(this.evmConnect.provider)
            const signer = await browserProvider.getSigner()
            const multiVault = new ethers.Contract(this.bridgePayload.value.evmMultivaultAddress, MultiVaultAbi, signer)

            const recipient = this.swapRequired
                ? {
                    wid: this.swapPayload.value!.sendTo.split(':')[0],
                    addr: `0x${this.swapPayload.value!.sendTo.split(':')[1]}`,
                }
                : {
                    wid: this.bridgePayload.value.tvmRecipientAddress.split(':')[0],
                    addr: `0x${this.bridgePayload.value.tvmRecipientAddress.split(':')[1]}`,
                }
            const payload = this.swapRequired
                ? this.swapPayload.value!.tokensTransferPayload
                : this.bridgePayload.value.payload
            const hexPayload = `0x${Buffer.from(payload, 'base64').toString('hex')}`

            let expectedEversBN = new BigNumber(this.bridgePayload.value.expectedNativeTokensAmount)
            if (this.swapRequired) {
                expectedEversBN = expectedEversBN.plus(this.swapPayload.value!.everAmount)
            }

            let expectedEversToNativeEvmBN = new BigNumber(this.bridgePayload.value.evmDepositTokensAmount)
            if (this.swapRequired) {
                expectedEversToNativeEvmBN = expectedEversToNativeEvmBN.plus(
                    new BigNumber(this.swapPayload.value!.everAmount)
                        .shiftedBy(-this.tvmConnect.decimals)
                        .div(this.rate.value)
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
                    evmToken.value.address,
                    evmUserAddress,
                    this.bridgePayload.value.evmMultivaultAddress,
                    this.amountNormalized,
                    this.evmConnect.provider,
                )
                const trx = await multiVault.deposit(
                    [
                        recipient,
                        this.bridgePayload.value.evmDepositTokenAddress,
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
            this.submitLoading = false
            this.txHash = txHash
        })
    }

    get loading(): boolean {
        return this.submitLoading || this.bridgeEvmToken.loading
            || this.bridgeTvmToken.loading || this.bridgePayload.loading
            || this.swapPayload.loading
    }

    get payloadLoading(): boolean {
        return this.swapPayload.loading || this.bridgePayload.loading
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
            return this.isGasToken ? this.evmBalance.value : this.evmTokenBalance.value
        }
        return undefined
    }

    get bridgeAmountToReceive(): string | undefined {
        return this.bridgePayload.params && this.bridgePayload.value
            ? new BigNumber(this.bridgePayload.params.evmTokenAmount)
                .minus(this.bridgePayload.value.evmDepositFeeTokensAmount)
                .toFixed()
            : undefined
    }

    get wrongNetwork(): boolean | undefined {
        return this.evmConnect.chainId && this.inputNetwork
            ? this.evmConnect.chainId.toString() !== this.inputNetwork.chainId.toString()
            : undefined
    }

    get swapRequired() {
        return this.bridgeTvmToken.value && this.outputToken
            ? this.bridgeTvmToken.value.tokenAddress !== this.outputToken.address
            : undefined
    }

    get amountEnough(): boolean | undefined {
        if (this.amountNormalized && this.isGasToken !== undefined) {
            if (this.isGasToken) {
                if (this.evmBalance.value) {
                    return new BigNumber(this.evmBalance.value).minus(this.amountNormalized).gt(0)
                }
            } else {
                if (this.evmTokenBalance.value) {
                    return new BigNumber(this.evmTokenBalance.value).minus(this.amountNormalized).gt(0)
                }
            }
        }
        return undefined
    }

    get valueEnough(): boolean | undefined {
        if (
            this.rate.value
            && this.bridgePayload.value
            && this.swapRequired !== undefined
            && (this.swapRequired ? !!this.swapPayload.value : true)
            && this.evmBalance.value
        ) {
            let value = new BigNumber(this.bridgePayload.value.evmDepositTokensAmount)
            if (this.swapRequired) {
                value = value.plus(
                    new BigNumber(this.swapPayload.value!.everAmount)
                        .shiftedBy(-this.tvmConnect.decimals)
                        .div(this.rate.value)
                        .times(1.2)
                        .times(1e18)
                        .dp(0, BigNumber.ROUND_DOWN),
                )
            }
            return new BigNumber(this.evmBalance.value).minus(value).gte(0)
        }
        return undefined
    }

    get amountToReceive(): string | undefined {
        if (this.swapRequired !== undefined) {
            if (this.swapRequired) {
                if (this.swapPayload.params && this.swapPayload.value) {
                    const tokenId = getTokenId({
                        chainId: 1,
                        address: this.swapPayload.params.toCurrencyAddress,
                    })
                    if (this.tokenList.byId[tokenId]) {
                        return decimalAmount(
                            this.swapPayload.value.minTokenAmountReceive,
                            this.tokenList.byId[tokenId]!.decimals,
                        )
                    }
                }
            } else {
                if (this.bridgeAmountToReceive && this.bridgeEvmToken.value) {
                    return decimalAmount(
                        this.bridgeAmountToReceive,
                        this.bridgeEvmToken.value.decimals,
                    )
                }
            }
        }
        return undefined
    }

    get readyToExchange(): boolean {
        return !this.loading
            && !this.submitLoading
            && this.amountEnough === true
            && this.valueEnough === true
            && this.wrongNetwork === false
            && !!this.bridgePayload.value
            && this.swapRequired !== undefined
            && (this.swapRequired ? !!this.swapPayload.value : true)
    }
}
