import { AddressLiteral } from 'everscale-inpage-provider'

import { NetworkConfig } from '@/types'

export const BridgeApiBaseUrl = 'https://api.venombridge.com/v1'

export const TokenListURI = 'https://cdn.venom.foundation/assets/mainnet/manifest.json'

export const AlienTokenListURI = 'https://raw.githubusercontent.com/broxus/bridge-assets/v-main-1/tokenlist/tokens.json'

export const BridgeAssetsURI = 'https://raw.githubusercontent.com/broxus/bridge-assets/v-main-1/main.json'

export const WVENOMVaultRootAddress = new AddressLiteral('0:77d36848bb159fa485628bc38dc37eadb74befa514395e09910f601b841f749e')

export const networks: NetworkConfig[] = [
    {
        chainId: '1',
        currency: {
            decimals: 9,
            icon: '/assets/icons/VENOM.svg',
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
    },
    {
        chainId: '1',
        currency: {
            decimals: 18,
            icon: '/assets/icons/ETH.svg',
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
        icon: '/assets/icons/ETH.svg',
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
            icon: '/assets/icons/BNB.svg',
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
        icon: '/assets/icons/BNB.svg',
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
            icon: '/assets/icons/FTM.svg',
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
        icon: '/assets/icons/FTM.svg',
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
            icon: '/assets/icons/MATIC.svg',
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
        icon: '/assets/icons/MATIC.svg',
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
            icon: '/assets/icons/AVAX.svg',
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
        icon: '/assets/icons/AVAX.svg',
        id: 'evm-43114',
        name: 'Avalanche Network',
        rpcUrl: 'https://avalanche-c-chain.publicnode.com',
        shortName: 'Avalanche',
        transactionType: '0x0',
        type: 'evm',
    },
]
