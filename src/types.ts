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
