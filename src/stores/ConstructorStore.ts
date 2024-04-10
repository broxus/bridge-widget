import { IFRAME_BASE_URL } from '@/config'
import { isTvmAddress } from '@broxus/js-core'
import { makeAutoObservable } from 'mobx'

export class ConstructorStore {
    outputTokenAddress?: string = undefined

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    get iframeURL(): string {
        const url = new URL(IFRAME_BASE_URL)
        if (this.outputTokenAddress && isTvmAddress(this.outputTokenAddress)) {
            url.searchParams.append('token', this.outputTokenAddress)
        }
        return url.toString()
    }
}
