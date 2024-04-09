import { EvmTokenUtils } from '@broxus/js-bridge-essentials'
import { isTvmAddress, TvmTokenUtils } from '@broxus/js-core'
import Web3 from 'web3'

import { ERC20Abi } from '@/abi/ERC20'
import { networks } from '@/config'
import { NetworkConfig, Token } from '@/types'
import { delay } from '@/utils/delay'
import { isEvmAddress } from '@/utils/is-evm-address'
import { rpc } from '@/utils/rpc'
import { staticRpc } from '@/utils/static-rpc'
import { MetaMaskInpageProvider } from '@metamask/providers'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { Address } from 'everscale-inpage-provider'

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

export const getTxLink = (network: NetworkConfig, txHash: string) => (
    `${network.explorer.baseUrl}/${network.explorer.transactionsSubPath}/${txHash}`
)

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

export function getTokenIdChain(tokenId: string): string {
    return tokenId.split('-')[1]
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

export const getEvmToken = async (
    address: string,
    network: NetworkConfig,
    web3 = getStaticWeb3(network.rpcUrl),
): Promise<Token> => {
    const [name, decimals, symbol] = await Promise.all([
        EvmTokenUtils.getName(web3, address),
        EvmTokenUtils.getDecimals(web3, address),
        EvmTokenUtils.getSymbol(web3, address),
    ])
    return {
        address,
        chainId: network.chainId,
        decimals: Number(decimals),
        name,
        symbol,
    }
}

export const approveTokens = async (
    token: string,
    user: string,
    vault: string,
    amount: string,
    provider: MetaMaskInpageProvider,
) => {
    const browserProvider = new ethers.BrowserProvider(provider)
    const signer = await browserProvider.getSigner()
    const ERC20Token = new ethers.Contract(token, ERC20Abi, signer)
    const allowance = await ERC20Token.allowance(user, vault)
    const delta = new BigNumber(allowance.toString()).minus(amount)
    if (delta.lt(0)) {
        await ERC20Token.approve(vault, amount)
        let count = 0
        let ready = false
        while (!ready && count < 25) {
            await delay(500)
            const allowance = await ERC20Token.allowance(user, vault)
            const delta = new BigNumber(allowance.toString()).minus(amount)
            ready = delta.gte(0)
            count += 1
        }
    }
}

export const getTvmToken = (
    address: string,
): Promise<Token> => (
    staticRpc.getFullContractState({
        address: new Address(address),
    }).then(({ state }) =>
        Promise.all([
            TvmTokenUtils.getName(rpc, address, state),
            TvmTokenUtils.getDecimals(rpc, address, state),
            TvmTokenUtils.getSymbol(rpc, address, state),
        ])
    ).then(([name, decimals, symbol]) => ({
        address,
        decimals,
        name,
        symbol,
        chainId: 1,
    }))
)
