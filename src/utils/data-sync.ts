import { lastOfCalls, WrappedFn } from '@/utils/last-of-calls'
import { makeAutoObservable, runInAction } from 'mobx'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DataSync<T, A extends any[], G = T, P = A> {
    protected loader = 0
    protected wrappedFn: WrappedFn<A, T>

    value?: G = undefined
    params?: P = undefined
    error?: unknown = undefined

    constructor(
        protected fn: (...args: A) => Promise<T>,
        protected valueGet: (value: T) => G = v => v as unknown as G,
        protected paramGet: (value: A) => P = v => v as unknown as P,
    ) {
        makeAutoObservable(this, {}, { autoBind: true })
        this.wrappedFn = lastOfCalls(this.fn, 400)
    }

    async sync(...args: A) {
        let value: G | undefined
        let params: P | undefined
        let error: unknown | undefined
        this.wrappedFn.skip()
        runInAction(() => {
            this.loader += 1
        })
        try {
            const result = await this.wrappedFn.call(...args)
            if (result.skip) {
                value = this.value
                params = this.params
            } else {
                value = this.valueGet(result.result)
                params = this.paramGet(args)
            }
        } catch (e) {
            error = e
            console.error(e)
        }
        runInAction(() => {
            this.loader -= 1
            this.value = value
            this.params = params
            this.error = error
        })
    }

    reset() {
        this.wrappedFn.skip()
        this.params = undefined
        this.value = undefined
    }

    get loading() {
        return this.loader > 0
    }
}
