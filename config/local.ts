import { AddressLiteral } from 'everscale-inpage-provider'

import { NetworkConfig } from '@/types'

export const BridgeApiBaseUrl = 'https://api.venombridge.com/v1'

export const DexApiBaseUrl = 'https://api.web3.world/v2'

export const TokenListURI = 'https://cdn.venom.foundation/assets/mainnet/manifest.json'

export const AlienTokenListURI = 'https://raw.githubusercontent.com/broxus/bridge-assets/v-main-1/tokenlist/tokens.json'

export const BridgeAssetsURI = 'https://raw.githubusercontent.com/broxus/bridge-assets/v-main-1/main.json'

export const WVENOMVaultRootAddress = new AddressLiteral(
    '0:77d36848bb159fa485628bc38dc37eadb74befa514395e09910f601b841f749e',
)

export const IFRAME_BASE_URL = 'http://localhost:3000/widget.html'

export const networks: NetworkConfig[] = [
    {
        chainId: '1',
        currency: {
            decimals: 9,
            icon: 'https://cdn.venom.foundation/assets/mainnet/icons/WVENOM/logo.svg',
            name: 'Native currency',
            symbol: 'VENOM',
            wrappedCurrencyAddress: WVENOMVaultRootAddress,
        },
        explorer: {
            accountsSubPath: 'accounts',
            baseUrl: 'https://venomscan.com',
            title: 'VenomScan',
            transactionsSubPath: 'transactions',
        },
        id: 'tvm-1',
        name: 'Venom Mainnet',
        rpcUrl: 'https://jrpc.venom.foundation/proto',
        shortName: 'Venom',
        type: 'tvm',
        icon: 'https://cdn.venom.foundation/assets/mainnet/icons/WVENOM/logo.svg',
    },
    {
        chainId: '1',
        currency: {
            decimals: 18,
            icon: 'https://cdn.venom.foundation/assets/mainnet/icons/WETH/logo.svg',
            name: 'Native currency',
            symbol: 'ETH',
            wrappedCurrencyAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        },
        explorer: {
            accountsSubPath: 'address',
            baseUrl: 'https://etherscan.io',
            title: 'Etherscan',
            transactionsSubPath: 'tx',
        },
        icon: 'https://cdn.venom.foundation/assets/mainnet/icons/WETH/logo.svg',
        id: 'evm-1',
        name: 'Ethereum Mainnet',
        rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        shortName: 'Ethereum',
        transactionType: '0x2',
        type: 'evm',
    },
    {
        chainId: '56',
        currency: {
            decimals: 18,
            icon: 'https://cdn.venom.foundation/assets/mainnet/icons/BNB/logo.svg',
            name: 'Native currency',
            symbol: 'BNB',
            wrappedCurrencyAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        },
        explorer: {
            accountsSubPath: 'address',
            baseUrl: 'https://bscscan.com',
            title: 'BscScan',
            transactionsSubPath: 'tx',
        },
        icon: 'https://cdn.venom.foundation/assets/mainnet/icons/BNB/logo.svg',
        id: 'evm-56',
        name: 'Binance Smart Chain',
        rpcUrl: 'https://bsc-dataseed.binance.org/',
        shortName: 'BSC',
        transactionType: '0x0',
        type: 'evm',
    },
    {
        chainId: '250',
        currency: {
            decimals: 18,
            icon: 'https://cdn.venom.foundation/assets/mainnet/icons/FTM/logo.svg',
            name: 'Native currency',
            symbol: 'FTM',
            wrappedCurrencyAddress: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
        },
        explorer: {
            accountsSubPath: 'address',
            baseUrl: 'https://ftmscan.com',
            title: 'FTMScan',
            transactionsSubPath: 'tx',
        },
        icon: 'https://cdn.venom.foundation/assets/mainnet/icons/FTM/logo.svg',
        id: 'evm-250',
        name: 'Fantom Opera',
        rpcUrl: 'https://rpcapi.fantom.network',
        shortName: 'Fantom Opera',
        transactionType: '0x0',
        type: 'evm',
    },
    {
        chainId: '137',
        currency: {
            decimals: 18,
            icon: 'https://cdn.venom.foundation/assets/mainnet/icons/MATIC/logo.svg',
            name: 'Native currency',
            symbol: 'MATIC',
            wrappedCurrencyAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        },
        explorer: {
            accountsSubPath: 'address',
            baseUrl: 'https://polygonscan.com',
            title: 'PolygonScan',
            transactionsSubPath: 'tx',
        },
        icon: 'https://cdn.venom.foundation/assets/mainnet/icons/MATIC/logo.svg',
        id: 'evm-137',
        name: 'Polygon',
        rpcUrl: 'https://polygon-rpc.com/',
        shortName: 'Polygon',
        transactionType: '0x0',
        type: 'evm',
    },
    {
        chainId: '43114',
        currency: {
            decimals: 18,
            icon: 'https://cdn.venom.foundation/assets/mainnet/icons/AVAX/logo.svg',
            name: 'Native currency',
            symbol: 'AVAX',
            wrappedCurrencyAddress: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
        },
        explorer: {
            accountsSubPath: 'address',
            baseUrl: 'https://snowtrace.io',
            title: 'SnowTrace',
            transactionsSubPath: 'tx',
        },
        icon: 'https://cdn.venom.foundation/assets/mainnet/icons/AVAX/logo.svg',
        id: 'evm-43114',
        name: 'Avalanche Network',
        rpcUrl: 'https://avalanche-c-chain.publicnode.com',
        shortName: 'Avalanche',
        transactionType: '0x0',
        type: 'evm',
    },
]

export const WHITE_LIST_CURRENCIES = [
    '0:77d36848bb159fa485628bc38dc37eadb74befa514395e09910f601b841f749e',
    '0:74604c7a56419477d67329848d754d205f31870025a7135909e90e1726ad9a54',
    '0:8a4ed4483500caf2d4bb4b56c84df41009cc3d0ed6a9de05d853e26a30faeced',
    '0:cda5e8d5953e1a09ffeb9f62316f2994019f10abe83c8f1b0aadfbc997bd79e6',
    '0:0447c738d8549c5ea92f1c945628367db4adcc706685f760c93f8b236bf8e7e4',
    '0:4ff3c0f078889cbda817a5f5f2651824dea11a84f3857df27e76fee37d541877',
    '0:60b3ebf994515df7985cb62a9d141467edf2f869272baf507dc83d9ba2e1b199',
    '0:0a75b9ad65982b02493491b00454b34dcecb9e63700d560fc001473659297661',
    '0:e04e68f58e85ea3ce3976356c4aefaa47c983bd9394bcf2a16c2252e7c27a39e',
    '0:10d6d5c11f7ce319842b9ceb8bc9ee4d64f317cd99f1f4ce17985e7ef50e2d2d',
    '0:3558fbc02e33cd62a5c2702f9405e272c41ede875956d2179074fe25bb4d1ce8',
    '0:bbb7aa35a536b1aae92ea5e2aa8c13ee1296bbcc3a673c226f6faed51234e179',
    '0:a86d07f621365f9feacfb40d14fe536a79437e86ae2cf43886fac67c74e3db99',
    '0:a53178ec8c6fe0c62413edd9eed25508f357cfba8bf8a7dbfad9290413b2e6be',
    '0:345841b1bf59e9ddce996d4f51a934a62576b4125ace41244e3ca40ea29fb4bf',
]
