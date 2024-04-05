import { EvmNetworkConfig } from '@broxus/js-bridge-essentials'
import { TvmNetworkConfig } from '@broxus/js-core'

export type Token = {
    name: string
    symbol: string
    chainId: string | number
    logoURI?: string
    decimals: number
    address: string
    wrappedName?: string
    wrappedSymbol?: string
    baseChainId?: string
}

export type NetworkConfig = TvmNetworkConfig | EvmNetworkConfig

export type SwapPayload = {
    deployWalletValue: string
    everAmount: string
    minTokenAmountReceive: string
    sendTo: string
    tokenAmount: string
    tokenAmountReceive: string
    tokensTransferPayload: string
}

export interface BridgeRawAssetVault {
    chainId: string
    ethereumConfiguration: string
    vault: string
}

export interface BridgeRawAsset {
    proxy: string
    vaults: BridgeRawAssetVault[]
}

export interface BridgeRawAssets {
    evm_tvm: BridgeRawAsset
    tvm_evm: BridgeRawAsset
}

export interface BridgeAssetsManifest {
    name: string
    multitoken: BridgeRawAssets
}
