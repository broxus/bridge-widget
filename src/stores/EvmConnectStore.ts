/* eslint-disable prefer-destructuring */
import { getNetworkById } from '@/utils/bridge'
import { lastOfCalls } from '@/utils/last-of-calls'
import { MetaMaskInpageProvider } from '@metamask/providers'
import { makeAutoObservable, runInAction } from 'mobx'
import Web3, { BlockHeaderOutput } from 'web3'

export class EvmConnectStore {
    provider?: MetaMaskInpageProvider = undefined
    web3?: Web3 = undefined
    chainId?: string = undefined
    address?: string = undefined
    balance?: string = undefined
    extInstalled?: boolean | undefined = undefined
    initialized = false
    loading = false
    blockNum?: number | undefined = undefined

    constructor() {
        makeAutoObservable(this, {}, {
            autoBind: true,
        })
    }

    async init(): Promise<void> {
        this.loading = true
        let extInstalled = false
        try {
            this.provider?.removeListener('chainChanged', this.syncData)
            this.provider?.removeListener('accountsChanged', this.onAccountsChanged)
            this.provider?.removeListener('disconnect', this.disconnect)

            this.provider = EvmConnectStore.getProvider()
            extInstalled = true

            this.provider.on('chainChanged', this.syncData)
            this.provider.on('accountsChanged', this.onAccountsChanged)
            this.provider.on('disconnect', this.disconnect)

            if (localStorage.getItem('evm_connection')) {
                await this.connect()
            }
        } catch (e) {
            console.error(e)
        }
        runInAction(() => {
            this.extInstalled = extInstalled
            this.initialized = true
            this.loading = false
        })
    }

    onBlock = lastOfCalls(async (e: BlockHeaderOutput) => {
        runInAction(() => {
            this.blockNum = Number(e.number)
        })
    }, 500)

    async connect(): Promise<void> {
        this.loading = true
        try {
            await this.provider?.request({ method: 'eth_requestAccounts' })
            await this.syncData()
        } catch (e) {
            console.error(e)
        }
        runInAction(() => {
            this.loading = false
        })
    }

    disconnect(): void {
        localStorage.removeItem('evm_connection')
        this.address = undefined
        this.balance = undefined
        this.chainId = undefined
    }

    onAccountsChanged(e: unknown) {
        if (Array.isArray(e) && e.length) {
            this.syncData()
        } else {
            this.disconnect()
        }
    }

    async syncData(): Promise<void> {
        let address: string,
            chainId: string,
            balance: string

        if (this.provider) {
            try {
                await this.web3?.removeAllListeners()
                this.web3 = new Web3(this.provider)
                const _address = (await this.web3.eth.getAccounts())[0]
                const _chainId = (await this.web3.eth.getChainId()).toString()
                const _balance = (await this.web3.eth.getBalance(_address)).toString()

                const subscriber = await this.web3.eth.subscribe('newBlockHeaders')
                subscriber.on('data', e => {
                    this.onBlock.call(e)
                })

                address = _address
                chainId = _chainId
                balance = _balance

                localStorage.setItem('evm_connection', 'metamask')
            } catch (e) {
                console.error('evm sync data', e)
            }
        }

        runInAction(() => {
            this.address = address
            this.chainId = chainId
            this.balance = balance
        })
    }

    async changeNetwork(networkId: string) {
        runInAction(() => {
            this.loading = true
        })
        try {
            const network = getNetworkById(networkId)
            const chainId = `0x${parseInt(network.chainId, 10).toString(16)}`
            try {
                await this.provider?.send('wallet_switchEthereumChain', [{ chainId }])
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                if (e.code === 4902) {
                    await this.provider?.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: chainId,
                            rpcUrls: [network.rpcUrl],
                            chainName: network.name,
                            nativeCurrency: {
                                decimals: 18,
                                name: network.currency.symbol,
                                symbol: network.currency.symbol,
                            },
                            blockExplorerUrls: [network.explorer.baseUrl],
                        }],
                    })
                }
                throw e
            }
        } catch (e) {
            console.error(e)
        }
        runInAction(() => {
            this.loading = false
        })
    }

    get disabled(): boolean {
        return !this.initialized || this.loading
    }

    static getProvider(): MetaMaskInpageProvider {
        let provider = Web3.givenProvider

        if (typeof window.ethereum !== 'undefined') {
            provider = window.ethereum.providers?.find((p: MetaMaskInpageProvider) => p.isMetaMask)

            if (provider == null && window.ethereum.isMetaMask) {
                provider = window.ethereum
            }
        }

        if (!provider) {
            throw new Error('No MetaMask Provider found')
        }

        return provider as MetaMaskInpageProvider
    }
}
