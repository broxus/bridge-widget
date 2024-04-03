import { rpc } from '@/utils/rpc'
import { makeAutoObservable, runInAction } from 'mobx'

export class TvmConnectStore {
    address?: string = undefined
    loading = false
    initialized = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    init() {
        try {
            this.syncProvider()
        } catch (e) {
            console.error(e)
        }
    }

    async syncProvider(): Promise<void> {
        let address: string | undefined

        try {
            await rpc.ensureInitialized()
            const providerState = await rpc.getProviderState()
            address = providerState.permissions.accountInteraction?.address.toString()
        } catch (e) {
            console.error(e)
        }

        runInAction(() => {
            this.address = address
            this.initialized = true
        })
    }

    async connect() {
        let address: string | undefined
        runInAction(() => {
            this.loading = true
        })
        try {
            await rpc.ensureInitialized()
            const permissions = await rpc.requestPermissions({
                permissions: ['basic', 'accountInteraction'],
            })
            address = permissions.accountInteraction?.address.toString()
        } catch (e) {
            console.error(e)
        }
        runInAction(() => {
            this.address = address
            this.loading = false
        })
    }

    async disconnect() {
        let address = this.address
        runInAction(() => {
            this.loading = true
        })
        try {
            await rpc.ensureInitialized()
            await rpc.disconnect()
            address = undefined
        } catch (e) {
            console.error(e)
        }
        runInAction(() => {
            this.address = address
            this.loading = false
        })
    }

    get disabled(): boolean {
        return !this.initialized || this.loading
    }
}
