import { BridgeAssetsURI } from '@/config'
import { BridgeRawAssetVault } from '@/types'
import { BridgeAssetsManifest } from '@broxus/js-bridge-essentials'
import { makeAutoObservable, runInAction } from 'mobx'

export class BridgeAssetsStore {
    isReady = false
    manifest?: BridgeAssetsManifest = undefined

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    async init() {
        try {
            const data = await fetch(BridgeAssetsURI)
                .then(data => data.json())
                .then(data => data as BridgeAssetsManifest)
            runInAction(() => {
                this.manifest = data
                this.isReady = true
            })
        } catch (e) {
            console.error(e)
        }
    }

    get evmTvmVaultByChain(): { [k: string]: BridgeRawAssetVault | undefined } {
        const vaults = this.manifest?.multitoken && 'evm_tvm' in this.manifest.multitoken
            ? this.manifest.multitoken.evm_tvm.vaults
            : []

        return vaults.reduce<{ [k: string]: BridgeRawAssetVault }>((acc, item) => ({
            ...acc,
            [item.chainId]: item,
        }), {})
    }
}
