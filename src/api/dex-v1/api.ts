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

export interface BridgeIndexerCurrencyInfoResponse {
    currency: string
    currency_price: string
    /** @format int32 */
    currency_scale: number
}

export interface CmcDexPoolInfoResponse {
    base_id: string
    base_name: string
    base_symbol: string
    base_volume: string
    last_price: string
    quote_id: string
    quote_name: string
    quote_symbol: string
    quote_volume: string
}

export interface CmcFarmingPoolInfoResponse {
    apr: string
    logo: string
    name: string
    pair: string
    pairLink: string
    poolRewards: string[]
    totalStake: string
}

export interface CmcFarmingPoolsResponse {
    links: CmcLinkResponse[]
    pools: CmcFarmingPoolInfoResponse[]
    provider: string
    provider_URL: string
    provider_logo: string
}

export interface CmcLinkResponse {
    link: string
    title: string
}

export interface CrossChainCurrencyInfoResponse {
    /**
     * @format uint128
     * @min 0
     */
    amount: number
    currencyAddress: string
}

export interface CrossChainPairInfoResponse {
    leftAddress: string
    pairAddress: string
    rightAddress: string
}

export interface CrossChainResponse {
    currencies: CrossChainCurrencyInfoResponse[]
    pairs: CrossChainPairInfoResponse[]
}

export interface CrossPairsRequest {
    fromCurrencyAddress: string
    toCurrencyAddresses: string[]
}

export enum CrossSwapKind {
    Expectedexchange = 'expectedexchange',
    Expectedspendamount = 'expectedspendamount',
}

export interface CrossSwapSilentInput {
    amounts: string[]
    receiveCurrencyAddress: string
    spendCurrencyAddress: string
}

export interface CrossSwapSilentResponse {
    receiveAmount: string
    steps: CrossSwapStepSilentResponse[]
}

export interface CrossSwapSilentVecRequest {
    /** @format int32 */
    deep: number
    inputCurrenciesMeta: CrossSwapSilentInput[]
    minTvl: string
    slippage?: string | null
    whiteListCurrencies: string[]
    whiteListUri?: string | null
}

export interface CrossSwapStepSilentResponse {
    actionType: string
    fee: string
    minimumReceiveAmount: string
    poolAddress: string
    priceImpact?: string | null
    receiveCurrencyAddress: string
    spendAmount: string
    spendCurrencyAddress: string
}

export interface CurrenciesFeeRequest {
    /** @format int64 */
    from: number
    timeframe: Timeframe
    /** @format int64 */
    to: number
}

export interface CurrenciesPricesRequest {
    /** @format int64 */
    from: number
    timeframe: Timeframe
    /** @format int64 */
    to: number
}

export interface CurrenciesRequest {
    currencyAddresses?: any[] | null
    /** @format int64 */
    limit: number
    /** @format int64 */
    offset: number
    ordering?: CurrencyOrdering | null
    whiteListUri?: string | null
}

export interface CurrenciesResponse {
    /** @format int64 */
    count: number
    currencies: CurrencyInfoResponse[]
    /** @format int64 */
    offset: number
    /** @format int64 */
    totalCount: number
}

export interface CurrenciesTvlRequest {
    /** @format int64 */
    from: number
    timeframe: Timeframe
    /** @format int64 */
    to: number
}

export interface CurrenciesUsdtPricesRequest {
    currency_addresses: string[]
}

export interface CurrenciesVolumeRequest {
    /** @format int64 */
    from: number
    timeframe: Timeframe
    /** @format int64 */
    to: number
}

export interface CurrencyDataResponse {
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    data: string
    /** @format int64 */
    timestamp: number
}

export interface CurrencyInfoRequest {
    currency_address: string
    /** @format int32 */
    timestamp_block: number
}

export interface CurrencyInfoResponse {
    address: string
    currency: string
    fee24h: string
    price: string
    priceChange: string
    /** @format int64 */
    transactionsCount24h: number
    tvl: string
    tvlChange: string
    volume24h: string
    volume7d: string
    volumeChange24h: string
}

export enum CurrencyOrdering {
    Tvlascending = 'tvlascending',
    Tvldescending = 'tvldescending',
    Volume24Hascending = 'volume24hascending',
    Volume24Hdescending = 'volume24hdescending',
    Priceascending = 'priceascending',
    Pricedescending = 'pricedescending',
    Pricechangeascending = 'pricechangeascending',
    Pricechangedescending = 'pricechangedescending',
}

export interface DexPairByTokenRootInfoRequest {
    token_root_address: string
}

export interface DexPairByTokenRootInfoResponse {
    dex_pool_address?: string | null
    left_address: string
    left_currency: string
    /** @format int32 */
    left_scale: number
    lp_address: string
    lp_currency: string
    /** @format int32 */
    lp_scale: number
    right_address: string
    right_currency: string
    /** @format int32 */
    right_scale: number
}

export interface DexPairInfoRequest {
    /** @format int32 */
    timestamp_block: number
    token_root_address: string
}

export interface DexPairInfoResponse {
    /** @format int64 */
    created_at: number
    dex_pool_address: string
    left_address: string
    left_balance: string
    left_currency: string
    left_price: string
    lp_balance: string
    lp_price: string
    right_address: string
    right_balance: string
    right_currency: string
    right_price: string
    /** @format int32 */
    timestamp_block: number
    tvl: string
}

export interface DexPairInfoWithRewardRequest {
    lp_address: string
    reward_addresses: string[]
    /** @format int32 */
    timestamp_block: number
}

export interface DexPairInfoWithRewardResponse {
    dex_pair_info: DexPairInfoResponse
    reward_prices: Record<string, string>
}

export enum EventType {
    Swaplefttoright = 'swaplefttoright',
    Swaprighttoleft = 'swaprighttoleft',
    Deposit = 'deposit',
    Withdraw = 'withdraw',
}

export interface GqlPair {
    fromToken: GqlToken
    toToken: GqlToken
}

export interface GqlSwap {
    fromAmount: string
    id: string
    pair: GqlPair
    timestamp: string
    toAmount: string
}

export interface GqlSwapsResponse {
    swaps: GqlSwap[]
}

export interface GqlToken {
    /** @format int32 */
    decimals: number
    symbol: string
    tradeVolume: string
}

export interface NewCrossPairsRequest {
    amount: string
    /** @format int32 */
    deep: number
    direction: CrossSwapKind
    fromCurrencyAddress: string
    minTvl: string
    slippage?: string | null
    toCurrencyAddress: string
    whiteListCurrencies: string[]
    whiteListUri?: string | null
}

export interface OhlcvResponse {
    close: string
    high: string
    low: string
    open: string
    /** @format int64 */
    timestamp: number
    volume: string
}

export interface PairAddress {
    poolAddress: string
}

export interface PairBalanceInfoLegacy {
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    change24h: string
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    changeTvl: string
    /** @format int64 */
    count24hTransactions: number
    /** @format int64 */
    createdAt: number
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    fee24h: string
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    fee7d: string
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    feeAllTime: string
    feeBeneficiaryAddress?: string | null
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    feeBeneficiaryNumerator?: string | null
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    feeDenominator: string
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    feeNumerator: string
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    feePart: string
    leftAddress: string
    leftCurrency: string
    /**
     * @format uint32
     * @min 0
     */
    leftScale: number
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    leftVolume: string
    lpAddress: string
    lpCurrency: string
    /**
     * @format uint32
     * @min 0
     */
    lpScale: number
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    lpVolume: string
    pairType: PairType
    poolAddress: string
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    price: string
    rightAddress: string
    rightCurrency: string
    /**
     * @format uint32
     * @min 0
     */
    rightScale: number
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    rightVolume: string
    /** @format int32 */
    timestampBlock: number
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    trueTvl: string
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    tvExec: string
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    tvl: string
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    usdtFeeExec: string
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    volume24h: string
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    volume7d: string
}

export interface PairFeeRequest {
    /** @format int64 */
    from: number
    timeframe: Timeframe
    /** @format int64 */
    to: number
}

export interface PairMetaResponseV1 {
    base: string
    baseAddress: string
    beneficiaryAddress?: string | null
    counter: string
    counterAddress: string
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    fee: string
    feeBeneficiary?: string | null
    lpAddress: string
    pairType: PairType
    poolAddress: string
}

export interface PairOhlcvRequest {
    /** @format int64 */
    from: number
    timeframe: Timeframe
    /** @format int64 */
    to: number
}

export enum PairOrdering {
    Tvlascending = 'tvlascending',
    Tvldescending = 'tvldescending',
    Volume24Hascending = 'volume24hascending',
    Volume24Hdescending = 'volume24hdescending',
    Volume7Dascending = 'volume7dascending',
    Volume7Ddescending = 'volume7ddescending',
}

export interface PairResponseV1 {
    fee24h: string
    fee7d: string
    feeAllTime: string
    leftLocked: string
    leftPrice: string
    lpLocked: string
    meta: PairMetaResponseV1
    oneLeftToRight?: string | null
    oneRightToLeft?: string | null
    rightLocked: string
    rightPrice: string
    tvl: string
    tvlChange: string
    volume24h: string
    volume7d: string
    volumeChange24h: string
}

export interface PairTvlRequest {
    /** @format int64 */
    from: number
    timeframe: Timeframe
    /** @format int64 */
    to: number
}

export enum PairType {
    Default = 'default',
    Stable = 'stable',
}

export interface PairVolumeRequest {
    /** @format int64 */
    from: number
    timeframe: Timeframe
    /** @format int64 */
    to: number
}

export interface PairsRequest {
    currencyAddress?: string | null
    currencyAddresses?: any[] | null
    favoritePools?: any[] | null
    /** @format int64 */
    limit: number
    /** @format int64 */
    offset: number
    ordering?: PairOrdering | null
    tvlAmountGe?: string | null
    tvlAmountLe?: string | null
    whiteListUri?: string | null
}

export interface PairsResponseV1 {
    /** @format int64 */
    count: number
    /** @format int64 */
    offset: number
    pairs: PairResponseV1[]
    /** @format int64 */
    totalCount: number
}

export interface PoolFullInfoResponseV1 {
    basePrice: string
    counterPrice: string
    lpPrice: string
    pairAddresses: PairAddress
    pairBalance: PairBalanceInfoLegacy
    tvl: string
}

export enum Timeframe {
    H1 = 'H1',
    D1 = 'D1',
}

export interface TransactionInfoResponseV1 {
    eventType: EventType
    /** @pattern ^-?[0-9]+(\.[0-9]+)?$ */
    fee?: string | null
    feeCurrency?: string | null
    left: string
    leftAddress: string
    leftValue: string
    lp: string
    lpAddress: string
    lpValue: string
    messageHash: string
    poolAddress: string
    right: string
    rightAddress: string
    rightValue: string
    secondFee?: string | null
    secondFeeCurrency?: string | null
    /** @format int32 */
    timestampBlock: number
    transactionHash: string
    tv: string
    userAddress: string
}

export interface TransactionsInfoResponseV1 {
    /** @format int64 */
    count: number
    /** @format int64 */
    offset: number
    /** @format int64 */
    totalCount: number
    transactions: TransactionInfoResponseV1[]
}

export enum TransactionsOrdering {
    Blocktimeascending = 'blocktimeascending',
    Blocktimedescending = 'blocktimedescending',
    Fromexecascending = 'fromexecascending',
    Fromexecdescending = 'fromexecdescending',
    Toexecascending = 'toexecascending',
    Toexecdescending = 'toexecdescending',
    Tvascending = 'tvascending',
    Tvdescending = 'tvdescending',
}

export interface TransactionsRequest {
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
    ordering?: TransactionsOrdering | null
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
}

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
        this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || 'https://api.web3.world/v1/v1' })
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
 * @baseUrl https://api.web3.world/v1/v1
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
    pairs = {
        /**
         * No description
         *
         * @tags pairs
         * @name PairsCreate
         * @request POST:/pairs/
         */
        pairsCreate: (data: PairsRequest, params: RequestParams = {}) =>
            this.request<PairsResponseV1, any>({
                path: `/pairs/`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags pairs
         * @name AddressCreate
         * @request POST:/pairs/address/{address}
         */
        addressCreate: (address: string, params: RequestParams = {}) =>
            this.request<PairResponseV1, any>({
                path: `/pairs/address/${address}`,
                method: 'POST',
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags pairs
         * @name LeftRightCreate
         * @request POST:/pairs/left/{left_address}/right/{right_address}
         */
        leftRightCreate: (leftAddress: string, rightAddress: string, params: RequestParams = {}) =>
            this.request<PairResponseV1, any>({
                path: `/pairs/left/${leftAddress}/right/${rightAddress}`,
                method: 'POST',
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags pairs
         * @name LeftRightOhlcvCreate
         * @request POST:/pairs/left/{left_address}/right/{right_address}/ohlcv
         */
        leftRightOhlcvCreate: (
            leftAddress: string,
            rightAddress: string,
            data: PairOhlcvRequest,
            params: RequestParams = {},
        ) => this.request<OhlcvResponse[], any>({
            path: `/pairs/left/${leftAddress}/right/${rightAddress}/ohlcv`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        }),

        /**
         * No description
         *
         * @tags pairs
         * @name AddressOhlcvCreate
         * @request POST:/pairs/address/{address}/ohlcv
         */
        addressOhlcvCreate: (address: string, data: PairOhlcvRequest, params: RequestParams = {}) =>
            this.request<OhlcvResponse[], any>({
                path: `/pairs/address/${address}/ohlcv`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags pairs
         * @name AddressVolumeCreate
         * @request POST:/pairs/address/{address}/volume
         */
        addressVolumeCreate: (address: string, data: PairVolumeRequest, params: RequestParams = {}) =>
            this.request<CurrencyDataResponse[], any>({
                path: `/pairs/address/${address}/volume`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags pairs
         * @name AddressTvlCreate
         * @request POST:/pairs/address/{address}/tvl
         */
        addressTvlCreate: (address: string, data: PairTvlRequest, params: RequestParams = {}) =>
            this.request<CurrencyDataResponse[], any>({
                path: `/pairs/address/${address}/tvl`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags pairs
         * @name AddressFeeCreate
         * @request POST:/pairs/address/{address}/fee
         */
        addressFeeCreate: (address: string, data: PairFeeRequest, params: RequestParams = {}) =>
            this.request<CurrencyDataResponse[], any>({
                path: `/pairs/address/${address}/fee`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags pairs
         * @name CrossPairsCreate
         * @request POST:/pairs/cross_pairs
         */
        crossPairsCreate: (data: CrossPairsRequest, params: RequestParams = {}) =>
            this.request<PairsResponseV1, any>({
                path: `/pairs/cross_pairs`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags pairs
         * @name NewCrossPairsCreate
         * @request POST:/pairs/new_cross_pairs
         */
        newCrossPairsCreate: (data: NewCrossPairsRequest, params: RequestParams = {}) =>
            this.request<CrossChainResponse, any>({
                path: `/pairs/new_cross_pairs`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags pairs
         * @name MetaList
         * @request GET:/pairs/meta
         */
        metaList: (params: RequestParams = {}) =>
            this.request<PairMetaResponseV1[], any>({
                path: `/pairs/meta`,
                method: 'GET',
                format: 'json',
                ...params,
            }),
    }
    currencies = {
        /**
         * No description
         *
         * @tags currencies
         * @name CurrenciesCreate
         * @request POST:/currencies/
         */
        currenciesCreate: (data: CurrenciesRequest, params: RequestParams = {}) =>
            this.request<CurrenciesResponse, any>({
                path: `/currencies/`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags currencies
         * @name CurrenciesCreate2
         * @request POST:/currencies/{currency_address}
         * @originalName currenciesCreate
         * @duplicate
         */
        currenciesCreate2: (currencyAddress: string, params: RequestParams = {}) =>
            this.request<CurrencyInfoResponse, any>({
                path: `/currencies/${currencyAddress}`,
                method: 'POST',
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags currencies
         * @name PricesCreate
         * @request POST:/currencies/{currency_address}/prices
         */
        pricesCreate: (currencyAddress: string, data: CurrenciesPricesRequest, params: RequestParams = {}) =>
            this.request<OhlcvResponse[], any>({
                path: `/currencies/${currencyAddress}/prices`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags currencies
         * @name VolumeCreate
         * @request POST:/currencies/{currency_address}/volume
         */
        volumeCreate: (currencyAddress: string, data: CurrenciesVolumeRequest, params: RequestParams = {}) =>
            this.request<CurrencyDataResponse[], any>({
                path: `/currencies/${currencyAddress}/volume`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags currencies
         * @name PostCurrencies
         * @request POST:/currencies/{currency_address}/tvl
         */
        postCurrencies: (currencyAddress: string, data: CurrenciesTvlRequest, params: RequestParams = {}) =>
            this.request<CurrencyDataResponse[], any>({
                path: `/currencies/${currencyAddress}/tvl`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags currencies
         * @name PostCurrencies2
         * @request POST:/currencies/{currency_address}/fee
         * @originalName postCurrencies
         * @duplicate
         */
        postCurrencies2: (currencyAddress: string, data: CurrenciesFeeRequest, params: RequestParams = {}) =>
            this.request<CurrencyDataResponse[], any>({
                path: `/currencies/${currencyAddress}/fee`,
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
        transactionsCreate: (data: TransactionsRequest, params: RequestParams = {}) =>
            this.request<TransactionsInfoResponseV1, any>({
                path: `/transactions/`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),
    }
    cmc = {
        /**
         * No description
         *
         * @tags cmc
         * @name GetCmc
         * @request GET:/cmc/dex
         */
        getCmc: (params: RequestParams = {}) =>
            this.request<Record<string, CmcDexPoolInfoResponse>, any>({
                path: `/cmc/dex`,
                method: 'GET',
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags cmc
         * @name FarmingList
         * @request GET:/cmc/farming
         */
        farmingList: (params: RequestParams = {}) =>
            this.request<CmcFarmingPoolsResponse, any>({
                path: `/cmc/farming`,
                method: 'GET',
                format: 'json',
                ...params,
            }),

        /**
         * @description UI /v1/cmc/graphiql API route /v1/cmc/graphql
         *
         * @tags cmc
         * @name GraphqlCreate
         * @summary Graphql
         * @request POST:/cmc/graphql
         */
        graphqlCreate: (params: RequestParams = {}) =>
            this.request<GqlSwapsResponse, any>({
                path: `/cmc/graphql`,
                method: 'POST',
                format: 'json',
                ...params,
            }),
    }
    currenciesUsdtPrices = {
        /**
         * No description
         *
         * @tags currencies
         * @name CurrenciesUsdtPricesCreate
         * @request POST:/currencies_usdt_prices
         */
        currenciesUsdtPricesCreate: (data: CurrenciesUsdtPricesRequest, params: RequestParams = {}) =>
            this.request<Record<string, string>, any>({
                path: `/currencies_usdt_prices`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),
    }
}
