/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from 'axios'
import axios from 'axios'

export type QueryParamsType = Record<string | number, any>

export interface FullRequestParams extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean
    /** request path */
    path: string
    /** content type of request body */
    type?: ContentType
    /** query params */
    query?: QueryParamsType
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseType
    /** request body */
    body?: unknown
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
    securityWorker?: (
        securityData: SecurityDataType | null,
    ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void
    secure?: boolean
    format?: ResponseType
}

export enum ContentType {
    Json = 'application/json',
    FormData = 'multipart/form-data',
    UrlEncoded = 'application/x-www-form-urlencoded',
    Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
    public instance: AxiosInstance
    private securityData: SecurityDataType | null = null
    private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
    private secure?: boolean
    private format?: ResponseType

    constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
        this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || 'https://api.web3.world/v1/v2' })
        this.secure = secure
        this.format = format
        this.securityWorker = securityWorker
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data
    }

    protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
        const method = params1.method || (params2 && params2.method)

        return {
            ...this.instance.defaults,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        }
    }

    protected stringifyFormItem(formItem: unknown) {
        if (typeof formItem === 'object' && formItem !== null) {
            return JSON.stringify(formItem)
        } else {
            return `${formItem}`
        }
    }

    protected createFormData(input: Record<string, unknown>): FormData {
        return Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key]
            const propertyContent: any[] = property instanceof Array ? property : [property]

            for (const formItem of propertyContent) {
                const isFileType = formItem instanceof Blob || formItem instanceof File
                formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem))
            }

            return formData
        }, new FormData())
    }

    public request = async <T = any, _E = any>({
        secure,
        path,
        type,
        query,
        format,
        body,
        ...params
    }: FullRequestParams): Promise<AxiosResponse<T>> => {
        const secureParams = ((typeof secure === 'boolean' ? secure : this.secure)
            && this.securityWorker
            && (await this.securityWorker(this.securityData)))
            || {}
        const requestParams = this.mergeRequestParams(params, secureParams)
        const responseFormat = format || this.format || undefined

        if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
            body = this.createFormData(body as Record<string, unknown>)
        }

        if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
            body = JSON.stringify(body)
        }

        return this.instance.request({
            ...requestParams,
            headers: {
                ...(requestParams.headers || {}),
                ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
            },
            params: query,
            responseType: responseFormat,
            data: body,
            url: path,
        })
    }
}

/**
 * @title No title
 * @baseUrl https://api.web3.world/v1/v2
 *
 * an example API
 */
export class DexApi<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    swaggerYaml = {
        /**
         * No description
         *
         * @tags swagger
         * @name SwaggerYamlList
         * @request GET:/swagger.yaml
         */
        swaggerYamlList: (params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/swagger.yaml`,
                method: 'GET',
                ...params,
            }),
    }
    pools = {
        /**
         * @description It can be used for showing a list of all desired pools, for example to show a list of pools that the user marked as favorite. List is filtered by request body params such as left and right currencies and token addresses, farming pool root address etc.
         *
         * @tags pools
         * @name PoolsCreate
         * @summary pools
         * @request POST:/pools/
         */
        poolsCreate: (
            data: {
                currencyAddress?: string | null
                currencyAddresses?: any[] | null
                favoritePools?: any[] | null
                /** @format int64 */
                limit: number
                /** @format int64 */
                offset: number
                ordering?:
                    | 'tvlascending'
                    | 'tvldescending'
                    | 'volume24hascending'
                    | 'volume24hdescending'
                    | 'volume7dascending'
                    | 'volume7ddescending'
                tvlAmountGe?: string | null
                tvlAmountLe?: string | null
                whiteListUri?: string | null
            },
            params: RequestParams = {},
        ) => this.request<any, any>({
            path: `/pools/`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            ...params,
        }),

        /**
         * No description
         *
         * @tags pools
         * @name AddressCreate
         * @request POST:/pools/address/{address}
         */
        addressCreate: (address: string, params: RequestParams = {}) =>
            this.request<
                {
                    /** @format int32 */
                    count24Transactions: number
                    fee24h: string
                    fee7d: string
                    feeAllTime: string
                    lpLocked: string
                    meta: {
                        beneficiaryAddress?: string | null
                        currencies: string[]
                        currencyAddresses: string[]
                        fee: string
                        feeBeneficiary?: string | null
                        lpAddress: string
                        pairType: 'default' | 'stable'
                        poolAddress: string
                    }
                    prices: string[]
                    stableOneSwap?: string | null
                    tvl: string
                    tvlChange: string
                    volume24h: string
                    volume24hChange: string
                    volume7d: string
                    volumesLocked: string[]
                },
                any
            >({
                path: `/pools/address/${address}`,
                method: 'POST',
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags pools
         * @name OhlcvCreate
         * @request POST:/pools/ohlcv
         */
        ohlcvCreate: (
            data: {
                firstCurrencyAddress?: string | null
                /** @format int64 */
                from: number
                ohlcvKind: 'Tvl' | 'Price' | 'Volume'
                poolAddress: string
                secondCurrencyAddress?: string | null
                timeframe: 'H1' | 'D1'
                /** @format int64 */
                to: number
            },
            params: RequestParams = {},
        ) => this.request<
            {
                close?: string | null
                /** @format int32 */
                countTransactions?: number | null
                currencyVolumes?: string | null
                high?: string | null
                low?: string | null
                open?: string | null
                /** @format int32 */
                timestamp: number
                tvl?: string | null
                usdtVolume?: string | null
            }[],
            any
        >({
            path: `/pools/ohlcv`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        }),

        /**
         * No description
         *
         * @tags pools
         * @name MetaList
         * @request GET:/pools/meta
         */
        metaList: (params: RequestParams = {}) =>
            this.request<
                {
                    beneficiaryAddress?: string | null
                    currencies: string[]
                    currencyAddresses: string[]
                    fee: string
                    feeBeneficiary?: string | null
                    lpAddress: string
                    pairType: 'default' | 'stable'
                    poolAddress: string
                }[],
                any
            >({
                path: `/pools/meta`,
                method: 'GET',
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags pools
         * @name CrossSwapRouteCreate
         * @request POST:/pools/cross_swap_route
         */
        crossSwapRouteCreate: (
            data: {
                amount: string
                /** @format int32 */
                deep: number
                direction: 'expectedexchange' | 'expectedspendamount'
                fromCurrencyAddress: string
                minTvl: string
                slippage?: string | null
                toCurrencyAddress: string
                whiteListCurrencies: string[]
                whiteListUri?: string | null
            },
            params: RequestParams = {},
        ) => this.request<
            {
                globalFee: string
                globalPriceImpact: string
                steps: {
                    actionType: 'Swap' | 'Withdraw' | 'Deposit'
                    currencyAddresses: string[]
                    expectedReceiveAmount: string
                    fee: string
                    minimumReceiveAmount: string
                    poolAddress: string
                    poolType: 'default' | 'stable'
                    priceImpact: string
                    receiveCurrencyAddress: string
                    spentAmount: string
                    spentCurrencyAddress: string
                }[]
            },
            any
        >({
            path: `/pools/cross_swap_route`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        }),

        /**
         * @description It gives you the ability to trade tokens. You can build swap payload and get additional info for trade like: abi, gas amount and ie.
         *
         * @tags pools
         * @name CrossSwapPayloadCreate
         * @summary cross_swap_payload
         * @request POST:/pools/cross_swap_payload
         */
        crossSwapPayloadCreate: (
            data: {
                crossPairInput: {
                    amount: string
                    /** @format int32 */
                    deep: number
                    direction: 'expectedexchange' | 'expectedspendamount'
                    fromCurrencyAddress: string
                    minTvl: string
                    slippage?: string | null
                    toCurrencyAddress: string
                    whiteListCurrencies: string[]
                    whiteListUri?: string | null
                }
                /**
                 * @format uint64
                 * @min 0
                 */
                id?: number | null
                nativeBalance: string
                nativeInfo?: 'spendonlynative' | 'spendnativeandwrappednative' | 'receivenative'
                recipient?: string | null
                referrer?: string | null
                tokenBalance: string
            },
            params: RequestParams = {},
        ) => this.request<
            {
                abi: string
                abiFunction: 'transfer' | 'acceptNative'
                amountToWrap?: string | null
                /** ERROR DESCRIPTION HERE */
                error?: 'NotEnoughNativeBalance' | 'NotEnoughTokenBalance'
                gas: string
                /** @format int64 */
                id: number
                payload: string
                route: {
                    globalFee: string
                    globalPriceImpact: string
                    steps: {
                        actionType: 'Swap' | 'Withdraw' | 'Deposit'
                        currencyAddresses: string[]
                        expectedReceiveAmount: string
                        fee: string
                        minimumReceiveAmount: string
                        poolAddress: string
                        poolType: 'default' | 'stable'
                        priceImpact: string
                        receiveCurrencyAddress: string
                        spentAmount: string
                        spentCurrencyAddress: string
                    }[]
                }
                walletOfDestination: string
            },
            any
        >({
            path: `/pools/cross_swap_payload`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        }),

        /**
         * No description
         *
         * @tags pools
         * @name CrossSwapPayloadStatusCreate
         * @request POST:/pools/cross_swap_payload_status
         */
        crossSwapPayloadStatusCreate: (
            data: {
                /** @format int64 */
                id: number
                recipient: string
            },
            params: RequestParams = {},
        ) => this.request<
            {
                amount: string[]
                /** @format int64 */
                createdAt: number
                status: 'Succeed' | 'Cancelled' | 'Pending'
                timestamp: number[]
                tokenRoot: string[]
            },
            any
        >({
            path: `/pools/cross_swap_payload_status`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        }),
    }
    transactions = {
        /**
         * No description
         *
         * @tags transactions
         * @name TransactionsCreate
         * @request POST:/transactions/
         */
        transactionsCreate: (
            data: {
                /** @format int64 */
                createdAtGe?: number | null
                /** @format int64 */
                createdAtLe?: number | null
                currencyAddress?: string | null
                currencyAddresses?: any[] | null
                displayTotalCount?: boolean | null
                eventType?: any[] | null
                leftAmountGe?: string | null
                leftAmountLe?: string | null
                /** @format int64 */
                limit: number
                /** @format int64 */
                offset: number
                ordering?:
                    | 'blocktimeascending'
                    | 'blocktimedescending'
                    | 'fromexecascending'
                    | 'fromexecdescending'
                    | 'toexecascending'
                    | 'toexecdescending'
                    | 'tvascending'
                    | 'tvdescending'
                poolAddress?: string | null
                rightAmountGe?: string | null
                rightAmountLe?: string | null
                /** @format int64 */
                timestampBlockGe?: number | null
                /** @format int64 */
                timestampBlockLe?: number | null
                tvGe?: string | null
                tvLe?: string | null
                userAddress?: string | null
                whiteListUri?: string | null
            },
            params: RequestParams = {},
        ) => this.request<
            {
                /** @format int64 */
                count: number
                /** @format int64 */
                offset: number
                /** @format int64 */
                totalCount: number
                transactions: {
                    beneficiaryAddresses?: any[] | null
                    beneficiaryFeeUsdt?: string | null
                    beneficiaryFees?: any[] | null
                    currencies: string[]
                    currencyAddresses: string[]
                    eventType: 'swap' | 'deposit' | 'withdraw'
                    feeCurrencies?: any[] | null
                    feeCurrencyAddresses?: any[] | null
                    feeUsdt?: string | null
                    fees?: any[] | null
                    lp: string
                    lpAddress: string
                    lpVolume: string
                    messageHash: string
                    poolAddress: string
                    /** @format int32 */
                    timestampBlock: number
                    transactionHash: string
                    tv: string
                    userAddress: string
                    volumes: string[]
                }[]
            },
            any
        >({
            path: `/transactions/`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        }),
    }
    middleware = {
        /**
         * No description
         *
         * @tags middleware
         * @name MiddlewareCreate
         * @request POST:/middleware/
         */
        middlewareCreate: (
            data: {
                input:
                    | {
                        swap: {
                            amount: string
                            cancelPayload: {
                                deployWalletValue: string
                                payload?: string | null
                                tokenReceiver: string
                                valueForFinalTransfer: string
                            }
                            /** @format int32 */
                            deep: number
                            direction?: 'expectedexchange' | 'expectedspendamount'
                            fromCurrencyAddress: string
                            /**
                             * @format uint64
                             * @min 0
                             */
                            id?: number | null
                            minTvl: string
                            remainingGasTo: string
                            slippage?: string | null
                            successPayload: {
                                deployWalletValue: string
                                payload?: string | null
                                tokenReceiver: string
                                valueForFinalTransfer: string
                            }
                            toCurrencyAddress: string
                            whiteListCurrencies: string[]
                            whiteListUri?: string | null
                        }
                    }
                    | {
                        unwrapAll: {
                            amount: string
                            destination: string
                            payload?: string | null
                            remainingGasTo: string
                        }
                    }
                    | {
                        swapAndUnwrapAll: {
                            amount: string
                            cancelPayload: {
                                deployWalletValue: string
                                payload?: string | null
                                tokenReceiver: string
                                valueForFinalTransfer: string
                            }
                            /** @format int32 */
                            deep: number
                            direction?: 'expectedexchange' | 'expectedspendamount'
                            fromCurrencyAddress: string
                            /**
                             * @format uint64
                             * @min 0
                             */
                            id?: number | null
                            minTvl: string
                            remainingGasTo: string
                            slippage?: string | null
                            successPayload: {
                                deployWalletValue?: string | null
                                payload?: string | null
                                tokenReceiver: string
                            }
                            whiteListCurrencies: string[]
                            whiteListUri?: string | null
                        }
                    }
                    | {
                        burn: {
                            amountToBurn: string
                            attachedValue: string
                            destination: string
                            payload?: string | null
                            remainingGasTo: string
                        }
                    }
                    | {
                        swapAndBurn: {
                            amount: string
                            cancelPayload: {
                                deployWalletValue: string
                                payload?: string | null
                                tokenReceiver: string
                                valueForFinalTransfer: string
                            }
                            /** @format int32 */
                            deep: number
                            direction?: 'expectedexchange' | 'expectedspendamount'
                            fromCurrencyAddress: string
                            /**
                             * @format uint64
                             * @min 0
                             */
                            id?: number | null
                            minTvl: string
                            remainingGasTo: string
                            slippage?: string | null
                            successPayload: {
                                attachedValue: string
                                destination: string
                                payload?: string | null
                            }
                            toCurrencyAddress: string
                            whiteListCurrencies: string[]
                            whiteListUri?: string | null
                        }
                    }
            },
            params: RequestParams = {},
        ) => this.request<
            {
                output:
                    | {
                        swap: {
                            deployWalletValue: string
                            everAmount: string
                            minTokenAmountReceive: string
                            sendTo: string
                            tokenAmount: string
                            tokenAmountReceive: string
                            tokensTransferPayload: string
                        }
                    }
                    | {
                        unwrapAll: {
                            everAmount: string
                            sendTo: string
                            tokenAmount: string
                            tokensTransferPayload: string
                        }
                    }
                    | {
                        swapAndUnwrapAll: {
                            deployWalletValue: string
                            everAmount: string
                            everAmountReceive: string
                            minEverAmountReceive: string
                            sendTo: string
                            tokenAmount: string
                            tokensTransferPayload: string
                        }
                    }
                    | {
                        burn: {
                            everAmount: string
                            sendTo: string
                            tokenAmount: string
                            tokensTransferPayload: string
                        }
                    }
                    | {
                        swapAndBurn: {
                            deployWalletValue: string
                            everAmount: string
                            minTokenAmountBurn: string
                            sendTo: string
                            tokenAmount: string
                            tokenAmountBurn: string
                            tokensTransferPayload: string
                        }
                    }
            },
            any
        >({
            path: `/middleware`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        }),
    }
    ws = {
        /**
         * @description Request is a vector of subscribe messages Swap subscribe message: { "Swap": { "poolAddress": "address" } } Balance update subscribe message: { "Balance": { "poolAddress": "address" } } Liquidity subscribe message: { "Liquidity": { "poolAddress": "address" } }
         *
         * @tags ws
         * @name GetWs
         * @request GET:/ws/
         */
        getWs: (params: RequestParams = {}) =>
            this.request<
                any,
                | {
                    messageType: 'swap'
                    payload: {
                        /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
                        feeUsdt: string
                        fromCurrencyAddress: string
                        /**
                         * @format uint128
                         * @min 0
                         */
                        fromExec: number
                        messageHash: string
                        poolAddress: string
                        /** @format int32 */
                        timestampBlock: number
                        /** @format int64 */
                        timestampLt: number
                        toCurrencyAddress: string
                        /**
                         * @format uint128
                         * @min 0
                         */
                        toExec: number
                        transactionHash: string
                        /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
                        tvExec: string
                        userAddress: string
                    }
                }
                | {
                    messageType: 'balance'
                    payload: {
                        /**
                         * @format uint128
                         * @min 0
                         */
                        lpVolume: number
                        poolAddress: string
                        /** @format int32 */
                        timestampBlock: number
                        /** @format int64 */
                        timestampLt: number
                        /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
                        tvl: string
                        volumes: number[]
                    }
                }
                | {
                    messageType: 'liquidity'
                    payload: {
                        /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
                        feeUsdt: string
                        kind: 'deposit' | 'withdraw'
                        liquidityExec: number[]
                        /**
                         * @format uint128
                         * @min 0
                         */
                        lpExec: number
                        messageHash: string
                        poolAddress: string
                        /** @format int32 */
                        timestampBlock: number
                        /** @format int64 */
                        timestampLt: number
                        transactionHash: string
                        /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
                        tvExec: string
                        userAddress: string
                    }
                }
                | {
                    messageType: 'ping'
                }
                | {
                    messageType: 'errMsg'
                    payload: string
                }
                | {
                    messageType: 'okSub'
                    payload: (
                        | {
                            Swap: {
                                poolAddress: string
                            }
                        }
                        | {
                            Liquidity: {
                                poolAddress: string
                            }
                        }
                        | {
                            Balance: {
                                poolAddress: string
                            }
                        }
                    )[]
                }
                | {
                    messageType: 'errSub'
                    payload: (
                        | {
                            Swap: {
                                poolAddress: string
                            }
                        }
                        | {
                            Liquidity: {
                                poolAddress: string
                            }
                        }
                        | {
                            Balance: {
                                poolAddress: string
                            }
                        }
                    )[]
                }
            >({
                path: `/ws/`,
                method: 'GET',
                ...params,
            }),
    }
}
