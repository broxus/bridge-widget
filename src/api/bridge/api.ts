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

export enum AllRelayRoundsOrdering {
    Roundnumascending = 'roundnumascending',
    Roundnumdescending = 'roundnumdescending',
}

export interface AllRelayRoundsRequest {
    /** @format int32 */
    limit: number
    /** @format int32 */
    offset: number
    ordering: AllRelayRoundsOrdering
    userAddress: string
}

export type BuildPayloadRequest =
    | {
        evmTvm: EvmTvmRequest
    }
    | {
        tvmEvm: TvmEvmRequest
    }
    | {
        evmEvm: EvmEvmRequest
    }
    | {
        tvmEvmNativeV1: TvmEvmNativeV1Request
    }
    | {
        tvmEvmNativeV2: TvmEvmNativeV2Request
    }
    | {
        solTvm: SolanaTvmRequest
    }
    | {
        tvmSol: TvmSolanaRequest
    }
    | {
        solEvm: SolanaEvmRequest
    }
    | {
        evmSol: EvmSolRequest
    }
    | {
        tvmSolNativeV1: TvmSolNativeV1Request
    }

export type BuildPayloadResponse =
    | {
        evmTvm: EvmTvmResponse
    }
    | {
        tvmEvm: TvmEvmResponse
    }
    | {
        evmEvm: EvmEvmResponse
    }
    | {
        tvmEvmNativeV1: TvmEvmNativeV1Response
    }
    | {
        tvmEvmNativeV2: TvmEvmNativeV2Response
    }
    | {
        solTvm: SolTvmResponse
    }
    | {
        tvmSol: TvmSolResponse
    }
    | {
        solEvm: SolEvmResponse
    }
    | {
        evmSol: EvmSolResponse
    }
    | {
        tvmSolNativeV1: TvmSolNativeV1Response
    }

export interface BurnCallbackInfoResponse {
    amount: string
    /** @format int64 */
    burnCallbackTimestampLt: number
    /** @format int64 */
    callId: number
    /** @format int32 */
    chainId: number
    /** @format int64 */
    createdAt: number
    creditProcessorAddress?: string | null
    ethUserAddress: string
    proxyAddress: string
    tonEventContractAddress?: string | null
    userAddress: string
}

export enum BurnCallbackOrdering {
    Amountexecascending = 'amountexecascending',
    Amountexecdescending = 'amountexecdescending',
    Createdatascending = 'createdatascending',
    Createdatdescending = 'createdatdescending',
}

export interface BurnCallbackTableResponse {
    /** @format int64 */
    totalCount: number
    transfers: BurnCallbackInfoResponse[]
}

export type CalcDestinationTokenInput =
    | {
        evmTvm: EvmTvmTokenRequest
    }
    | {
        tvmEvm: TvmEvmTokenRequest
    }

export type CalcDestinationTokenResponse =
    | {
        evmTvm: EvmTvmTokenResponse
    }
    | {
        tvmEvm: TvmEvmTokenResponse
    }

export interface ChainIdStatsResponse {
    /** @format int32 */
    chainId: number
    /** @format int32 */
    potentialConfirmed: number
    /** @format int32 */
    relayConfirmed: number
}

export interface ChainIds {
    chainIds: number[]
}

export interface CompoundResponse {
    amount: string
    deployWalletValue: string
    notify: boolean
    payload: string
    recipient: string
    remainingGasTo: string
}

export interface DaoStakeholderResponse {
    /** @format int64 */
    proposalVotesCount: number
    userAddress: string
    voteWeight: string
    votes: string
}

export enum EventType {
    Deposit = 'deposit',
    Withdraw = 'withdraw',
    Claim = 'claim',
    Freeze = 'freeze',
}

export interface EvmEvmRequest {
    callback: TvmEvmCallbackRequest
    evmRecipientAddress: string
    evmTokenAddress: string
    evmTokenAmount: string
    /** @format int32 */
    evmTokenDecimals: number
    evmTokenName: string
    evmTokenSymbol: string
    /** @format int32 */
    fromChainId: number
    /** @format int32 */
    toChainId: number
    userWalletAddress?: string | null
}

export interface EvmEvmResponse {
    destinationEvmTokenAddress: string
    evmDepositTokenAddress: string
    evmGlobalFeeAmount: string
    evmGlobalFeeTokensAmount: string
    evmMultivaultAddress: string
    evmTokenAmount: string
    evmTvmFeeAmount: string
    evmTvmFeeTokensAmount: string
    evmTvmGasEstimateTokensAmount: string
    evmTvmRate: string
    evmTvmRemainingGasTo: string
    evmTvmTokenIsDeployed: boolean
    evmTvmTokenType: TokenType
    expectedNativeTokensAmount: string
    payload: string
    tvmEvmFeeAmount: string
    tvmEvmFeeTokensAmount: string
    tvmEvmGasEstimateTokensAmount: string
    tvmEvmRate: string
    tvmEvmRemainingGasTo: string
    tvmEvmTokenIsDeployed: boolean
    tvmEvmTokenType: TokenType
    tvmRecipientAddress: string
    tvmTokenAddress: string
}

export interface EvmSolRequest {
    evmTokenAddress: string
    evmTokenAmount: string
    /** @format int32 */
    evmTokenDecimals: number
    evmTokenName: string
    evmTokenSymbol: string
    executeAccounts: ExecuteAccountRequest[]
    /** @format int32 */
    fromChainId: number
    solRecipientAddress: string
}

export interface EvmSolResponse {
    destinationSolTokenAddress: string
    evmDepositTokenAddress: string
    evmGlobalFeeAmount: string
    evmGlobalFeeTokensAmount: string
    evmTokenAmount: string
    evmTvmFeeAmount: string
    evmTvmFeeTokensAmount: string
    evmTvmRate: string
    evmTvmRemainingGasTo: string
    evmTvmTokenIsDeployed: boolean
    evmTvmTokenType: TokenType
    expectedNativeTokensAmount: string
    payload: string
    tvmRecipientAddress: string
    tvmSolFeeAmount: string
    tvmSolFeeTokensAmount: string
    tvmSolRate: string
    tvmSolRemainingGasTo: string
    tvmSolTokenIsDeployed: boolean
    tvmSolTokenType: TokenType
    tvmTokenAddress: string
}

export interface EvmTvmRequest {
    /** @format int32 */
    evmChainId: number
    evmTokenAddress: string
    evmTokenAmount: string
    /** @format int32 */
    evmTokenDecimals: number
    evmTokenName: string
    evmTokenSymbol: string
    expectedNativeTokensAmount?: string | null
    payload: string
    tvmRecipientAddress: string
    tvmRemainingGasTo: string
    useCredit: boolean
}

export interface EvmTvmResponse {
    evmDepositFeeAmount: string
    evmDepositFeeTokensAmount: string
    evmDepositTokenAddress: string
    evmDepositTokensAmount: string
    evmExpectedNativeTokensAmount?: string | null
    evmMultivaultAddress: string
    expectedNativeTokensAmount: string
    gasEstimateTokensAmount: string
    payload: string
    rate: string
    tokenIsDeployed: boolean
    tokenType: TokenType
    tvmRecipientAddress: string
    tvmRemainingGasTo: string
    tvmTokenAddress: string
}

export interface EvmTvmTokenRequest {
    /** @format int32 */
    evmChainId: number
    evmTokenAddress: string
    /** @format int32 */
    evmTokenDecimals: number
    evmTokenName: string
    evmTokenSymbol: string
}

export interface EvmTvmTokenResponse {
    /** @format int32 */
    decimals?: number | null
    name?: string | null
    symbol?: string | null
    tokenAddress: string
    tokenType: TokenType
}

export interface ExecuteAccountRequest {
    account: string
    isSigner: boolean
    readOnly: boolean
}

export interface GatePricesRequest {
    ticker: string
}

export interface GlobalRelayEventsSearchResponse {
    amount: string
    /** @format int32 */
    chainId: number
    contractAddress: string
    from?: string | null
    /** @format int64 */
    timestamp: number
    to?: string | null
    tokenAddress: string
    transferKind: TransferKind
}

export interface GlobalRelayEventsTableSearchResponse {
    relays: GlobalRelayEventsSearchResponse[]
    /** @format int64 */
    totalCount: number
}

export interface GraphDataResponse {
    data: string
    /** @format int64 */
    timestamp: number
}

export interface GraphRequest {
    /** @format int64 */
    from: number
    timeframe: Timeframe
    /** @format int64 */
    to: number
}

export interface GraphRequest2 {
    /** @format int64 */
    from: number
    timeframe: Timeframe
    /** @format int64 */
    to: number
}

export interface MainPageStakingResponse {
    averageApr: string
    reward30d: string
    reward30dChange: string
    /** @format int64 */
    stakeholders: number
    tvl: string
    tvlChange: string
}

export enum NotInstantTransfersOrdering {
    Volumeexecascending = 'volumeexecascending',
    Volumeexecdescending = 'volumeexecdescending',
    Bountyascending = 'bountyascending',
    Bountydescending = 'bountydescending',
    Createdatascending = 'createdatascending',
    Createdatdescending = 'createdatdescending',
}

export type OperationTvmEvmEverV1Response =
    | {
        vaultWrap: VaultWrapResponse
    }
    | {
        transfer: TvmEvmNativeTransferResponse
    }
    | {
        compound: CompoundResponse
    }

export type OperationTvmEvmEverV2Response =
    | {
        transfer: TvmEvmNativeTransferV2Response
    }
    | {
        acceptNative: TvmEvmNativeAcceptNativeResponse
    }

export enum OperationTvmEvmResponse {
    Burn = 'burn',
    Transfer = 'transfer',
}

export enum RelayEventsOrdering {
    Amountascending = 'amountascending',
    Amountdescending = 'amountdescending',
    Timestampascending = 'timestampascending',
    Timestampdescending = 'timestampdescending',
}

export interface RelayEventsSearchResponse {
    amount: string
    /** @format int32 */
    chainId: number
    contractAddress: string
    from?: string | null
    /** @format int64 */
    timestamp: number
    to?: string | null
    tokenAddress: string
    transferKind: TransferKind
}

export interface RelayEventsTableSearchResponse {
    relays: RelayEventsSearchResponse[]
    /** @format int64 */
    totalCount: number
}

export interface RelayInfoRequest {
    relayAddress: string
}

export interface RelayRoundInfoRequest {
    relayAddress: string
    /** @format int32 */
    roundNum?: number | null
}

export interface RelayRoundInfoResponse {
    /** @format int64 */
    endTime: number
    ethToTonUsdt: string
    /** @format int32 */
    eventsConfirmed: number
    eventsConfirmedShare: string
    evmStats: ChainIdStatsResponse[]
    relayAddress: string
    /** @format int32 */
    relayPlace?: number | null
    roundAddress: string
    /** @format int32 */
    roundNum: number
    stake: string
    /** @format int64 */
    startTime: number
    tonToEthUsdt: string
    /** @format int32 */
    totalRoundConfirms: number
}

export interface RelayRoundsCalendarRequest {
    /** @format int32 */
    fromRoundNum: number
    /** @format int32 */
    toRoundNum: number
}

export enum RelayRoundsOrdering {
    Stakeascending = 'stakeascending',
    Stakedescending = 'stakedescending',
    Roundnumascending = 'roundnumascending',
    Roundnumdescending = 'roundnumdescending',
}

export interface RelayRoundsRequest {
    /** @format int32 */
    limit: number
    /** @format int32 */
    offset: number
    ordering?: RelayRoundsOrdering | null
    /** @format int32 */
    roundNum?: number | null
    userAddress?: string | null
}

export interface RelaySearchResponse {
    /** @format int64 */
    createdAt: number
    currentRound: boolean
    /** @format int32 */
    potentialTotalConfirmed: number
    relayAddress: string
    /** @format int32 */
    relayTotalConfirmed: number
    slashed: boolean
    stake: string
    /** @format int32 */
    successfulRounds: number
    /** @format int32 */
    totalRounds: number
}

export interface RelayTableSearchResponse {
    relays: RelaySearchResponse[]
    /** @format int64 */
    totalCount: number
}

export enum RelaysOrdering {
    Stakeascending = 'stakeascending',
    Stakedescending = 'stakedescending',
    Createdatascending = 'createdatascending',
    Createdatdescending = 'createdatdescending',
}

export interface RelaysRoundInfoRequest {
    /** @format int32 */
    limit: number
    /** @format int32 */
    offset: number
    ordering: RelaysRoundOrdering
    /** @format int32 */
    roundNum?: number | null
}

export enum RelaysRoundOrdering {
    Stakeascending = 'stakeascending',
    Stakedescending = 'stakedescending',
}

export interface RoundInfoRequest {
    /** @format int32 */
    roundNum?: number | null
}

export interface RoundInfoResponse {
    averageRelayStake: string
    averageRelayStakeChange: string
    ethToTonUsdt: string
    /** @format int32 */
    eventsConfirmed: number
    evmStats: ChainIdStatsResponse[]
    /** @format int32 */
    relaysCount: number
    relaysCountChange: string
    /** @format int32 */
    roundNum: number
    tonToEthUsdt: string
    totalStake: string
    totalStakeChange: string
}

export enum RoundInterval {
    Default = 'default',
    Bidding = 'bidding',
}

export interface SearchBurnCallbackInfoRequest {
    amountGe?: string | null
    amountLe?: string | null
    /** @format int64 */
    callId?: number | null
    /** @format int32 */
    chainId?: number | null
    /** @format int64 */
    createdAtGe?: number | null
    /** @format int64 */
    createdAtLe?: number | null
    creditProcessorAddress?: string | null
    ethUserAddress?: string | null
    /** @format int64 */
    limit: number
    /** @format int64 */
    offset: number
    ordering?: BurnCallbackOrdering | null
    proxyAddress?: string | null
    tonEventUserAddress?: string | null
}

export interface SearchDaoStakeholdersRequest {
    /** @format int32 */
    limit: number
    /** @format int32 */
    offset: number
    ordering?: StakeholdersDaoOrdering | null
}

export interface SearchGlobalRelayEventsRequest {
    amountGe?: string | null
    amountLe?: string | null
    /** @format int32 */
    chainId?: number | null
    ethUserAddress?: string | null
    /** @format int32 */
    limit: number
    /** @format int32 */
    offset: number
    ordering?: RelayEventsOrdering | null
    /** @format int32 */
    roundNum?: number | null
    /** @format int64 */
    timestampGe?: number | null
    /** @format int64 */
    timestampLe?: number | null
    tokenAddress?: string | null
    tonUserAddress?: string | null
    transferContractAddress?: string | null
    transferKind?: TransferKind | null
}

export interface SearchMergeTokensInfoRequest {
    canonTokenAddress?: string | null
    /** @format int32 */
    chainId?: number | null
    configurationAddress?: string | null
    isEnable?: boolean | null
    isOnlyMerge?: boolean | null
    /** @format int32 */
    limit: number
    mergePoolAddress?: string | null
    mergeRouterAddress?: string | null
    /** @format int32 */
    offset: number
    symbol?: string | null
    tokenAddress?: string | null
}

export interface SearchNotInstantTransfersRequest {
    bountyGe?: string | null
    bountyLe?: string | null
    /** @format int32 */
    chainId?: number | null
    contractAddress?: string | null
    /** @format int64 */
    createdAtGe?: number | null
    /** @format int64 */
    createdAtLe?: number | null
    ethTokenAddress?: string | null
    evmWhiteListTokens?: any[] | null
    /** @format int32 */
    limit: number
    /** @format int32 */
    offset: number
    ordering?: NotInstantTransfersOrdering | null
    status?: WithdrawalsStatus | null
    tonTokenAddress?: string | null
    tvmWhiteListTokens?: any[] | null
    userAddress?: string | null
    volumeExecGe?: string | null
    volumeExecLe?: string | null
}

export interface SearchRelayEventsRequest {
    amountGe?: string | null
    amountLe?: string | null
    /** @format int32 */
    chainId?: number | null
    ethUserAddress?: string | null
    /** @format int32 */
    limit: number
    /** @format int32 */
    offset: number
    ordering?: RelayEventsOrdering | null
    relayAddress?: string | null
    /** @format int32 */
    roundNum?: number | null
    /** @format int64 */
    timestampGe?: number | null
    /** @format int64 */
    timestampLe?: number | null
    tokenAddress?: string | null
    tonUserAddress?: string | null
    transferContractAddress?: string | null
    transferKind?: TransferKind | null
}

export interface SearchRelaysRequest {
    /** @format int64 */
    createdAtGe?: number | null
    /** @format int64 */
    createdAtLe?: number | null
    /** @format int32 */
    limit: number
    /** @format int32 */
    offset: number
    ordering?: RelaysOrdering | null
    relayAddresses?: any[] | null
    roundInterval?: RoundInterval | null
    /** @format int32 */
    roundNum?: number | null
    stakeGe?: string | null
    stakeLe?: string | null
    transferContractAddress?: string | null
}

export interface SearchStakeholdersRequest {
    /** @format int64 */
    createdAtGe?: number | null
    /** @format int64 */
    createdAtLe?: number | null
    frozenStakeGe?: string | null
    frozenStakeLe?: string | null
    lastRewardGe?: string | null
    lastRewardLe?: string | null
    /** @format int32 */
    limit: number
    /** @format int32 */
    offset: number
    ordering?: StakeholdersOrdering | null
    /** @format int64 */
    relayCreatedAtGe?: number | null
    /** @format int64 */
    relayCreatedAtLe?: number | null
    stakeholderAddresses?: any[] | null
    stakeholderKind?: UserType | null
    totalRewardGe?: string | null
    totalRewardLe?: string | null
    untilFrozenGe?: string | null
    untilFrozenLe?: string | null
    userBalanceGe?: string | null
    userBalanceLe?: string | null
}

export interface SearchTransactionsRequest {
    amountGe?: string | null
    amountLe?: string | null
    /** @format int32 */
    limit: number
    /** @format int32 */
    offset: number
    ordering?: TransactionOrdering | null
    /** @format int64 */
    timestampBlockGe?: number | null
    /** @format int64 */
    timestampBlockLe?: number | null
    transactionKind?: EventType | null
    userAddress?: string | null
}

export interface SearchTransfersRequest {
    /** @format int64 */
    createdAtGe?: number | null
    /** @format int64 */
    createdAtLe?: number | null
    ethTokenAddress?: string | null
    /** @format int32 */
    ethTonChainId?: number | null
    ethTonTransactionHashEth?: string | null
    /** @format int32 */
    limit: number
    /**
     * @format uint64
     * @min 0
     */
    nonce?: number | null
    /** @format int32 */
    offset: number
    ordering?: TransfersOrdering | null
    status?: TransferStatus | null
    /** @format int32 */
    tonEthChainId?: number | null
    tonEthContractAddress?: string | null
    tonTokenAddress?: string | null
    transferKinds?: any[] | null
    /** @format int64 */
    updatedAtGe?: number | null
    /** @format int64 */
    updatedAtLe?: number | null
    userAddress?: string | null
    volumeExecGe?: string | null
    volumeExecLe?: string | null
}

export interface SolEvmResponse {
    destinationEvmTokenAddress: string
    evmGlobalFeeAmount: string
    evmGlobalFeeTokensAmount: string
    evmMultivaultAddress: string
    expectedNativeTokensAmount: string
    payload: string
    solDepositTokenAddress: string
    solTokenAmount: string
    solTvmFeeAmount: string
    solTvmFeeTokensAmount: string
    solTvmRate: string
    solTvmRemainingGasTo: string
    solTvmTokenIsDeployed: boolean
    solTvmTokenType: TokenType
    tvmEvmFeeAmount: string
    tvmEvmFeeTokensAmount: string
    tvmEvmRate: string
    tvmEvmRemainingGasTo: string
    tvmEvmTokenIsDeployed: boolean
    tvmEvmTokenType: TokenType
    tvmRecipientAddress: string
    tvmTokenAddress: string
}

export interface SolTvmResponse {
    expectedNativeTokensAmount: string
    payload: string
    rate: string
    solDepositFeeAmount: string
    solDepositFeeTokensAmount: string
    solDepositTokenAddress: string
    solDepositTokensAmount: string
    solExpectedNativeTokensAmount?: string | null
    tokenIsDeployed: boolean
    tokenType: TokenType
    tvmRecipientAddress: string
    tvmRemainingGasTo: string
    tvmTokenAddress: string
}

export interface SolanaEvmRequest {
    callback: TvmEvmCallbackRequest
    evmRecipientAddress: string
    solTokenAddress: string
    solTokenAmount: string
    /** @format int32 */
    solTokenDecimals: number
    solTokenName: string
    solTokenSymbol: string
    /** @format int32 */
    toChainId: number
}

export interface SolanaTvmRequest {
    expectedNativeTokensAmount?: string | null
    payload: string
    solTokenAddress: string
    solTokenAmount: string
    /** @format int32 */
    solTokenDecimals: number
    solTokenName: string
    solTokenSymbol: string
    tvmRecipientAddress: string
    tvmRemainingGasTo: string
    useCredit: boolean
}

export interface StakeholderResponse {
    /** @format int64 */
    createdAt: number
    frozenStakeBalance: string
    lastReward: string
    stakeBalance: string
    totalReward: string
    userAddress: string
    userType: string
}

export enum StakeholdersDaoOrdering {
    Voteweightascending = 'voteweightascending',
    Voteweightdescending = 'voteweightdescending',
    Votesascending = 'votesascending',
    Votesdescending = 'votesdescending',
}

export interface StakeholdersDaoTableResponse {
    stakeholders: DaoStakeholderResponse[]
    /** @format int64 */
    totalCount: number
}

export enum StakeholdersOrdering {
    Updateatascending = 'updateatascending',
    Updateatdescending = 'updateatdescending',
    Stakeascending = 'stakeascending',
    Stakedescending = 'stakedescending',
    Frozenstakeascending = 'frozenstakeascending',
    Frozenstakedescending = 'frozenstakedescending',
    Lastrewardascending = 'lastrewardascending',
    Lastrewarddescending = 'lastrewarddescending',
    Totalrewardascending = 'totalrewardascending',
    Totalrewarddescending = 'totalrewarddescending',
    Createdatascending = 'createdatascending',
    Createdatdescending = 'createdatdescending',
    Relaycreatedatascending = 'relaycreatedatascending',
    Relaycreatedatdescending = 'relaycreatedatdescending',
    Votesascending = 'votesascending',
    Votesdescending = 'votesdescending',
}

export interface StakeholdersTableResponse {
    stakeholders: StakeholderResponse[]
    /** @format int64 */
    totalCount: number
}

export enum Timeframe {
    H1 = 'H1',
    D1 = 'D1',
}

export interface TokenInfoResponse {
    address: string
    currency: string
    /** @format int32 */
    decimals: number
    evmAddress: string
}

export enum TokenType {
    Alien = 'Alien',
    Native = 'Native',
}

export interface TokensInfoResponse {
    chainIdTokens: Record<string, TokenInfoResponse[]>
}

export enum TransactionOrdering {
    Amountascending = 'amountascending',
    Amountdescending = 'amountdescending',
    Timestampblockascending = 'timestampblockascending',
    Timestampblockatdescending = 'timestampblockatdescending',
}

export interface TransactionResponse {
    amountExec: string
    /** @format int64 */
    timestampBlock: number
    transactionHash: string
    transactionKind: string
    tvExec: string
}

export interface TransactionsTableResponse {
    /** @format int64 */
    totalCount: number
    transactions: TransactionResponse[]
}

export enum TransferKind {
    Tontoeth = 'tontoeth',
    Ethtoton = 'ethtoton',
    Ethtoeth = 'ethtoeth',
    Creditethtoton = 'creditethtoton',
}

export enum TransferStatus {
    Pending = 'pending',
    Rejected = 'rejected',
    Confirmed = 'confirmed',
}

export interface TransfersGraphDataResponse {
    ethTonVolume: string
    /** @format int64 */
    timestamp: number
    tonEthVolume: string
}

export enum TransfersOrdering {
    Tonethvolumeexecascending = 'tonethvolumeexecascending',
    Tonethvolumeexecdescending = 'tonethvolumeexecdescending',
    Ethtonvolumeexecascending = 'ethtonvolumeexecascending',
    Ethtonvolumeexecdescending = 'ethtonvolumeexecdescending',
    Updateatascending = 'updateatascending',
    Updateatdescending = 'updateatdescending',
    Createdatascending = 'createdatascending',
    Createdatdescending = 'createdatdescending',
}

export interface TransfersStatResponse {
    fromEverscaleUsdt: string
    toEverscaleUsdt: string
    volume24hUsdt: string
    volume24hUsdtChange: string
    volume7dUsdt: string
    volume7dUsdtChange: string
}

export interface TvmCurrenciesVaultsRequest {
    addresses: string[]
}

export interface TvmEvmCallbackRequest {
    evmHexPayload: string
    evmRecipientAddress: string
    strict: boolean
}

export interface TvmEvmNativeAcceptNativeResponse {
    deployWalletValue: string
    tvmBase64Payload: string
    tvmRecipientAddress: string
    tvmRemainingGasTo: string
    tvmTokenAmount: string
}

export interface TvmEvmNativeTransferResponse {
    tvmBase64Payload: string
    tvmRecipientAddress: string
    tvmRemainingGasTo: string
    tvmTokenAmount: string
}

export interface TvmEvmNativeTransferV2Response {
    deployWalletValue: string
    notify: boolean
    tvmBase64Payload: string
    tvmRecipientAddress: string
    tvmRemainingGasTo: string
    tvmTokenAmount: string
}

export interface TvmEvmNativeV1Request {
    callback: TvmEvmCallbackRequest
    /** @format int32 */
    evmChainId: number
    evmRecipientAddress: string
    nativeTokenAmount: string
    tvmRemainingGasTo: string
    tvmTokenAmount: string
    useCredit: boolean
    wrappedNativeTokenAmount: string
}

export interface TvmEvmNativeV1Response {
    evmMultivaultAddress: string
    evmTokenAddress: string
    feeAmount: string
    feeTokensAmount: string
    operation: OperationTvmEvmEverV1Response
    rate?: string | null
    tvmConfigurationAddress: string
    tvmValue: string
}

export interface TvmEvmNativeV2Request {
    callback: TvmEvmCallbackRequest
    /** @format int32 */
    evmChainId: number
    evmRecipientAddress: string
    nativeTokenAmount: string
    tvmRemainingGasTo: string
    tvmTokenAmount: string
    useCredit: boolean
    userWalletAddress?: string | null
    wrappedNativeTokenAmount: string
}

export interface TvmEvmNativeV2Response {
    evmMultivaultAddress: string
    evmTokenAddress: string
    feeAmount: string
    feeTokensAmount: string
    gasEstimateTokensAmount: string
    initialBalanceTokensAmount: string
    operation: OperationTvmEvmEverV2Response
    rate?: string | null
    tvmConfigurationAddress: string
    tvmNativeValue?: string | null
    tvmValue: string
}

export interface TvmEvmRequest {
    callback: TvmEvmCallbackRequest
    /** @format int32 */
    evmChainId: number
    evmRecipientAddress: string
    tvmRemainingGasTo: string
    tvmTokenAddress: string
    tvmTokenAmount: string
    useCredit: boolean
}

export interface TvmEvmResponse {
    evmFeeAmount: string
    evmFeeTokensAmount: string
    evmMultivaultAddress: string
    evmTokenAddress: string
    gasEstimateTokensAmount: string
    operation: OperationTvmEvmResponse
    rate: string
    tokenIsDeployed: boolean
    tokenType: TokenType
    tvmBase64Payload: string
    tvmConfigurationAddress: string
    tvmRecipientAddress: string
    tvmRemainingGasTo: string
    tvmTokenAmount: string
}

export interface TvmEvmTokenRequest {
    /** @format int32 */
    evmChainId: number
    tvmTokenAddress: string
}

export interface TvmEvmTokenResponse {
    tokenAddress: string
    tokenType: TokenType
}

export interface TvmSolNativeV1Request {
    executeAccounts: ExecuteAccountRequest[]
    nativeTokenAmount: string
    solRecipientAddress: string
    tvmRemainingGasTo: string
    tvmTokenAmount: string
    useCredit: boolean
    wrappedNativeTokenAmount: string
}

export interface TvmSolNativeV1Response {
    feeAmount: string
    feeTokensAmount: string
    operation: OperationTvmEvmEverV1Response
    rate?: string | null
    solTokenAddress: string
    tvmConfigurationAddress: string
    tvmValue: string
}

export interface TvmSolResponse {
    operation: OperationTvmEvmResponse
    rate: string
    solFeeAmount: string
    solFeeTokensAmount: string
    solTokenAddress: string
    tokenIsDeployed: boolean
    tokenType: TokenType
    tvmBase64Payload: string
    tvmConfigurationAddress: string
    tvmRecipientAddress: string
    tvmRemainingGasTo: string
    tvmTokenAmount: string
}

export interface TvmSolanaRequest {
    executeAccounts: ExecuteAccountRequest[]
    solRecipientAddress: string
    tvmRemainingGasTo: string
    tvmTokenAddress: string
    tvmTokenAmount: string
    useCredit: boolean
}

export interface UserPageStakingRequest {
    userAddress: string
}

export interface UserPageStakingResponse {
    averageApr: string
    user30dReward: string
    user30dRewardChange: string
    userFrozenStake: string
    userTvl: string
    userTvlChange: string
}

export enum UserType {
    Ordinary = 'ordinary',
    Relay = 'relay',
}

export interface VaultWrapResponse {
    gasBackAddress: string
    ownerAddress: string
    payload: string
    tokens: string
}

export enum WithdrawalsStatus {
    Open = 'Open',
    Close = 'Close',
}

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
    public baseUrl: string = 'https://api.venombridge.com/v1'
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
 * @baseUrl https://api.venombridge.com/v1
 *
 * an example API
 */
export class BridgeApi<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
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
    staking = {
        /**
         * No description
         *
         * @tags staking
         * @name StakingCreate
         * @request POST:/staking/
         */
        stakingCreate: (data: UserPageStakingRequest, params: RequestParams = {}) =>
            this.request<UserPageStakingResponse, any>({
                path: `/staking/`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags staking
         * @name SearchStakeholdersCreate
         * @request POST:/staking/search/stakeholders
         */
        searchStakeholdersCreate: (data: SearchStakeholdersRequest, params: RequestParams = {}) =>
            this.request<StakeholdersTableResponse, any>({
                path: `/staking/search/stakeholders`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags staking
         * @name MainList
         * @request GET:/staking/main
         */
        mainList: (params: RequestParams = {}) =>
            this.request<MainPageStakingResponse, any>({
                path: `/staking/main`,
                method: 'GET',
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags staking
         * @name SearchTransactionsCreate
         * @request POST:/staking/search/transactions
         */
        searchTransactionsCreate: (data: SearchTransactionsRequest, params: RequestParams = {}) =>
            this.request<TransactionsTableResponse, any>({
                path: `/staking/search/transactions`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags staking
         * @name SearchGraphTvlCreate
         * @request POST:/staking/search/graph/tvl
         */
        searchGraphTvlCreate: (data: GraphRequest, params: RequestParams = {}) =>
            this.request<GraphDataResponse[], any>({
                path: `/staking/search/graph/tvl`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags staking
         * @name SearchGraphAprCreate
         * @request POST:/staking/search/graph/apr
         */
        searchGraphAprCreate: (data: GraphRequest, params: RequestParams = {}) =>
            this.request<GraphDataResponse[], any>({
                path: `/staking/search/graph/apr`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),
    }
    transfers = {
        /**
         * @description Depending on the type of transfer eth->ton (evm->tvm), ton->eth (tvm->evm) or eth-eth (evm-evm), the null transfer fields will differ. Fields with the prefix EthTon refer to eth->ton transfers, similar to TonEth for transfers of the type ton->eth.
         *
         * @tags transfers
         * @name SearchCreate
         * @summary /transfers/search
         * @request POST:/transfers/search
         */
        searchCreate: (data: SearchTransfersRequest, params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/transfers/search`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags transfers
         * @name GraphVolumeCreate
         * @request POST:/transfers/graph/volume
         */
        graphVolumeCreate: (data: GraphRequest2, params: RequestParams = {}) =>
            this.request<TransfersGraphDataResponse[], any>({
                path: `/transfers/graph/volume`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags transfers
         * @name MainPageList
         * @request GET:/transfers/main_page
         */
        mainPageList: (params: RequestParams = {}) =>
            this.request<TransfersStatResponse, any>({
                path: `/transfers/main_page`,
                method: 'GET',
                format: 'json',
                ...params,
            }),

        /**
         * @description Transfers that could not close automatically get here (liquidity requests).
         *
         * @tags transfers
         * @name SearchNotInstantCreate
         * @summary /search_not_instant
         * @request POST:/transfers/search_not_instant
         */
        searchNotInstantCreate: (data: SearchNotInstantTransfersRequest, params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/transfers/search_not_instant`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description A utility for merging the same tokens from different evm networks into tvm.
         *
         * @tags transfers
         * @name MergeTokensInfoCreate
         * @summary /merge_tokens_info
         * @request POST:/transfers/merge_tokens_info
         */
        mergeTokensInfoCreate: (data: SearchMergeTokensInfoRequest, params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/transfers/merge_tokens_info`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags transfers
         * @name TokensInfoCreate
         * @request POST:/transfers/tokens_info
         */
        tokensInfoCreate: (data: ChainIds, params: RequestParams = {}) =>
            this.request<TokensInfoResponse, any>({
                path: `/transfers/tokens_info`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),
    }
    dao = {
        /**
         * No description
         *
         * @tags dao
         * @name SearchCreate
         * @request POST:/dao/search
         */
        searchCreate: (data: SearchDaoStakeholdersRequest, params: RequestParams = {}) =>
            this.request<StakeholdersDaoTableResponse, any>({
                path: `/dao/search`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags dao
         * @name UserDetail
         * @request GET:/dao/user/{address}
         */
        userDetail: (address: string, params: RequestParams = {}) =>
            this.request<DaoStakeholderResponse, any>({
                path: `/dao/user/${address}`,
                method: 'GET',
                format: 'json',
                ...params,
            }),
    }
    relaysPages = {
        /**
         * @description Global statistics (with every evm) on relayers.
         *
         * @tags relays
         * @name RelayInfoCreate
         * @summary /relay_info
         * @request POST:/relays_pages/relay_info
         */
        relayInfoCreate: (data: RelayInfoRequest, params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/relays_pages/relay_info`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags relays
         * @name RelayRoundInfoCreate
         * @request POST:/relays_pages/relay_round_info
         */
        relayRoundInfoCreate: (data: RelayRoundInfoRequest, params: RequestParams = {}) =>
            this.request<RelayRoundInfoResponse, any>({
                path: `/relays_pages/relay_round_info`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Relayer statistics (with every evm) by rounds.
         *
         * @tags relays
         * @name AllRelayRoundsInfoCreate
         * @summary /all_relay_rounds_info
         * @request POST:/relays_pages/all_relay_rounds_info
         */
        allRelayRoundsInfoCreate: (data: AllRelayRoundsRequest, params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/relays_pages/all_relay_rounds_info`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Relayers statistics (with every evm) for a specific round.
         *
         * @tags relays
         * @name RelaysRoundInfoCreate
         * @summary /relays_round_info
         * @request POST:/relays_pages/relays_round_info
         */
        relaysRoundInfoCreate: (data: RelaysRoundInfoRequest, params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/relays_pages/relays_round_info`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags relays
         * @name RoundInfoCreate
         * @request POST:/relays_pages/round_info
         */
        roundInfoCreate: (data: RoundInfoRequest, params: RequestParams = {}) =>
            this.request<RoundInfoResponse, any>({
                path: `/relays_pages/round_info`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags relays
         * @name SearchRelaysCreate
         * @request POST:/relays_pages/search/relays
         */
        searchRelaysCreate: (data: SearchRelaysRequest, params: RequestParams = {}) =>
            this.request<RelayTableSearchResponse, any>({
                path: `/relays_pages/search/relays`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags relays
         * @name SearchRelaysEventsCreate
         * @request POST:/relays_pages/search/relays_events
         */
        searchRelaysEventsCreate: (data: SearchRelayEventsRequest, params: RequestParams = {}) =>
            this.request<RelayEventsTableSearchResponse, any>({
                path: `/relays_pages/search/relays_events`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags relays
         * @name SearchGlobalRelaysEventsCreate
         * @request POST:/relays_pages/search/global_relays_events
         */
        searchGlobalRelaysEventsCreate: (data: SearchGlobalRelayEventsRequest, params: RequestParams = {}) =>
            this.request<GlobalRelayEventsTableSearchResponse, any>({
                path: `/relays_pages/search/global_relays_events`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description Information on time periods in rounds.
         *
         * @tags relays
         * @name RoundsCalendarCreate
         * @summary /rounds_calendar
         * @request POST:/relays_pages/rounds_calendar
         */
        roundsCalendarCreate: (data: RelayRoundsCalendarRequest, params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/relays_pages/rounds_calendar`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description General information on relayers (without every evm network stat).
         *
         * @tags relays
         * @name RelayRoundsInfoCreate
         * @summary /relay_rounds_info
         * @request POST:/relays_pages/relay_rounds_info
         */
        relayRoundsInfoCreate: (data: RelayRoundsRequest, params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/relays_pages/relay_rounds_info`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                ...params,
            }),
    }
    gatePrices = {
        /**
         * @description A route to receive prices (ETH, BNB, FMT, etc.) from the "gate.io" in native tvm tokens. The price is updated every 1 minute.
         *
         * @tags gate_prices
         * @name GatePricesCreate
         * @summary /gate_prices
         * @request POST:/gate_prices/
         */
        gatePricesCreate: (data: GatePricesRequest, params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/gate_prices`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Get all gate rates by chain_id
         *
         * @tags gate_prices
         * @name GetGatePrices
         * @summary /gate_prices/all
         * @request GET:/gate_prices/all
         */
        getGatePrices: (params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/gate_prices/all`,
                method: 'GET',
                ...params,
            }),
    }
    payload = {
        /**
         * No description
         *
         * @tags payload
         * @name BuildCreate
         * @request POST:/payload/build
         */
        buildCreate: (data: BuildPayloadRequest, params: RequestParams = {}) =>
            this.request<BuildPayloadResponse, any>({
                path: `/payload/build`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags payload
         * @name CalcDestinationTokenCreate
         * @request POST:/payload/calc_destination_token
         */
        calcDestinationTokenCreate: (data: CalcDestinationTokenInput, params: RequestParams = {}) =>
            this.request<CalcDestinationTokenResponse, any>({
                path: `/payload/calc_destination_token`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),
    }
    vaults = {
        /**
         * @description Get vaults token balances.
         *
         * @tags vaults
         * @name TvmCurrencyInfoCreate
         * @summary /tvm_currency_info
         * @request POST:/vaults/tvm_currency_info
         */
        tvmCurrencyInfoCreate: (data: TvmCurrenciesVaultsRequest, params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/vaults/tvm_currency_info`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Get all gas prices by chain_id
         *
         * @tags vaults
         * @name AllGasPricesList
         * @summary /all_gas_prices
         * @request GET:/vaults/all_gas_prices
         */
        allGasPricesList: (params: RequestParams = {}) =>
            this.request<any, any>({
                path: `/vaults/all_gas_prices`,
                method: 'GET',
                ...params,
            }),
    }
}
