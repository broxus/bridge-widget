import { EvmTokenUtils } from '@broxus/js-bridge-essentials'
import { isTvmAddress, TvmTokenUtils } from '@broxus/js-core'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/TaskEither'
import Web3 from 'web3'

import { networks } from '@/config'
import { NetworkConfig, Token } from '@/types'
import { isEvmAddress } from '@/utils/is-evm-address'
import { staticRpc } from '@/utils/static-rpc'

export const getNetworkId = (network: { chainId: string | number; type: string }): string => (
    `${network.type}-${network.chainId}`
)

export const getNetworkById = (id: string): NetworkConfig => {
    const network = networks.find(item => getNetworkId(item) === id)

    if (!network) {
        throw new Error(`Network ${id} not defined`)
    }

    return network
}

export const getTokenType = (token: { address: string }): 'tvm' | 'evm' | 'unknown' => {
    if (isTvmAddress(token.address)) {
        return 'tvm'
    }

    if (isEvmAddress(token.address)) {
        return 'evm'
    }

    return 'unknown'
}

export const getTokenId = (token: { chainId: string | number; address: string }): string => (
    `${getTokenType(token)}-${token.chainId}-${token.address}`
)

export const getTokenIdType = (tokenId: string): 'tvm' | 'evm' | 'unknown' => {
    const type = tokenId.split('-')[0]

    if (type === 'evm') {
        return 'evm'
    }

    if (type === 'tvm') {
        return 'tvm'
    }

    return 'unknown'
}

export function getTokenIdAddress(tokenId: string): string {
    return tokenId.split('-')[2]
}

export const getStaticWeb3 = (rpcUrl: string): Web3 => (
    new Web3(new Web3.providers.HttpProvider(rpcUrl))
)

export const getEvmTokenBalance = async (
    rpcUrl: string,
    token: string,
    owner: string,
): Promise<string> => {
    const rpc = getStaticWeb3(rpcUrl)
    const balance = await EvmTokenUtils.getBalance(rpc, token, owner)
    return balance.toString()
}

export const getEvmBalance = async (
    owner: string,
    rpcUrl: string,
): Promise<string> => {
    const rpc = getStaticWeb3(rpcUrl)
    const balance = await rpc.eth.getBalance(owner)
    return balance.toString()
}

export const getEvmToken = (
    address: string,
    network: NetworkConfig,
    web3 = getStaticWeb3(network.rpcUrl),
): TE.TaskEither<Error, Token> =>
    pipe(
        TE.bindTo('name')(TE.tryCatch(() => EvmTokenUtils.getName(web3, address), E.toError)),
        TE.bind('decimals', () => TE.tryCatch(() => EvmTokenUtils.getDecimals(web3, address), E.toError)),
        TE.bind('symbol', () => TE.tryCatch(() => EvmTokenUtils.getSymbol(web3, address), E.toError)),
        TE.bind('chainId', () => TE.right(network.chainId)),
        TE.bind('address', () => TE.right(address)),
    )

export const getTvmToken = (
    address: string,
    rpc = staticRpc,
): TE.TaskEither<Error, Token> =>
    pipe(
        TE.bindTo('name')(TE.tryCatch(() => TvmTokenUtils.getName(rpc, address), E.toError)),
        TE.bind('decimals', () => TE.tryCatch(() => TvmTokenUtils.getDecimals(rpc, address), E.toError)),
        TE.bind('symbol', () => TE.tryCatch(() => TvmTokenUtils.getSymbol(rpc, address), E.toError)),
        TE.bind('chainId', () => TE.right(42)),
        TE.bind('address', () => TE.right(address)),
    )
