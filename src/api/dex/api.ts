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

export type QueryParamsType = Record<string | number, any>
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean
    /** request path */
    path: string
    /** content type of request body */
    type?: ContentType
    /** query params */
    query?: QueryParamsType
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseFormat
    /** request body */
    body?: unknown
    /** base url */
    baseUrl?: string
    /** request cancellation token */
    cancelToken?: CancelToken
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> {
    baseUrl?: string
    baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>
    securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void
    customFetch?: typeof fetch
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
    data: D
    error: E
}

type CancelToken = Symbol | string | number

export enum ContentType {
    Json = 'application/json',
    FormData = 'multipart/form-data',
    UrlEncoded = 'application/x-www-form-urlencoded',
    Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
    public baseUrl: string = 'https://api.web3.world/v1/v2'
    private securityData: SecurityDataType | null = null
    private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
    private abortControllers = new Map<CancelToken, AbortController>()
    private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams)

    private baseApiParams: RequestParams = {
        credentials: 'same-origin',
        headers: {},
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    }

    constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
        Object.assign(this, apiConfig)
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data
    }

    protected encodeQueryParam(key: string, value: any) {
        const encodedKey = encodeURIComponent(key)
        return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`
    }

    protected addQueryParam(query: QueryParamsType, key: string) {
        return this.encodeQueryParam(key, query[key])
    }

    protected addArrayQueryParam(query: QueryParamsType, key: string) {
        const value = query[key]
        return value.map((v: any) => this.encodeQueryParam(key, v)).join('&')
    }

    protected toQueryString(rawQuery?: QueryParamsType): string {
        const query = rawQuery || {}
        const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key])
        return keys
            .map((
                key,
            ) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
            .join('&')
    }

    protected addQueryParams(rawQuery?: QueryParamsType): string {
        const queryString = this.toQueryString(rawQuery)
        return queryString ? `?${queryString}` : ''
    }

    private contentFormatters: Record<ContentType, (input: any) => any> = {
        [ContentType.Json]: (input: any) =>
            input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
        [ContentType.Text]: (
            input: any,
        ) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
        [ContentType.FormData]: (input: any) =>
            Object.keys(input || {}).reduce((formData, key) => {
                const property = input[key]
                formData.append(
                    key,
                    property instanceof Blob
                        ? property
                        : typeof property === 'object' && property !== null
                        ? JSON.stringify(property)
                        : `${property}`,
                )
                return formData
            }, new FormData()),
        [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
    }

    protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
        return {
            ...this.baseApiParams,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...(this.baseApiParams.headers || {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        }
    }

    protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
        if (this.abortControllers.has(cancelToken)) {
            const abortController = this.abortControllers.get(cancelToken)
            if (abortController) {
                return abortController.signal
            }
            return void 0
        }

        const abortController = new AbortController()
        this.abortControllers.set(cancelToken, abortController)
        return abortController.signal
    }

    public abortRequest = (cancelToken: CancelToken) => {
        const abortController = this.abortControllers.get(cancelToken)

        if (abortController) {
            abortController.abort()
            this.abortControllers.delete(cancelToken)
        }
    }

    public request = async <T = any, E = any>({
        body,
        secure,
        path,
        type,
        query,
        format,
        baseUrl,
        cancelToken,
        ...params
    }: FullRequestParams): Promise<HttpResponse<T, E>> => {
        const secureParams = ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure)
            && this.securityWorker
            && (await this.securityWorker(this.securityData)))
            || {}
        const requestParams = this.mergeRequestParams(params, secureParams)
        const queryString = query && this.toQueryString(query)
        const payloadFormatter = this.contentFormatters[type || ContentType.Json]
        const responseFormat = format || requestParams.format

        return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
            ...requestParams,
            headers: {
                ...(requestParams.headers || {}),
                ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
            },
            signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
            body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
        }).then(async (response) => {
            const r = response as HttpResponse<T, E>
            r.data = null as unknown as T
            r.error = null as unknown as E

            const data = !responseFormat
                ? r
                : await response[responseFormat]()
                    .then((data) => {
                        if (r.ok) {
                            r.data = data
                        } else {
                            r.error = data
                        }
                        return r
                    })
                    .catch((e) => {
                        r.error = e
                        return r
                    })

            if (cancelToken) {
                this.abortControllers.delete(cancelToken)
            }

            if (!response.ok) throw data
            return data
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
