import { lastOfCalls, WrappedFn } from '@/utils/last-of-calls'
import { makeAutoObservable, runInAction } from 'mobx'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DataSync<T, A extends any[]> {
    value?: T = undefined
    protected loader = 0
    protected wrappedFn: WrappedFn<A, T>

    constructor(protected fn: (...args: A) => Promise<T>) {
        makeAutoObservable(this, {}, { autoBind: true })
        this.wrappedFn = lastOfCalls(this.fn)
    }

    async sync(...args: A) {
        let value: T | undefined
        this.wrappedFn.skip()
        runInAction(() => {
            this.loader += 1
        })
        try {
            const result = await this.wrappedFn.call(...args)

            if (result.skip) {
                value = this.value
            } else {
                value = result.result
            }
        } catch (e) {
            console.error(e)
        }
        runInAction(() => {
            this.loader -= 1
            this.value = value
        })
    }

    reset() {
        this.wrappedFn.skip()
        this.value = undefined
    }

    get loading() {
        return this.loader > 0
    }
}
