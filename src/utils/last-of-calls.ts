export type Result<T> = {
    skip: true
} | {
    skip: false
    result: T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WrappedFn<A extends any[], T = unknown> = {
    skip: () => void
    call: (...args: A) => Promise<Result<T>>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lastOfCalls<A extends any[], T = unknown>(
    fn: (...args: A) => Promise<T>,
    delay?: number,
): WrappedFn<A, T> {
    let requestId = 0
    return {
        skip: () => {
            requestId += 1
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        call: async function(...args: any) {
            const id = ++requestId
            if (delay) {
                await new Promise(r => {
                    setTimeout(r, delay)
                })

                if (id !== requestId) {
                    return {
                        skip: true,
                    }
                }
            }
            try {
                const result = await fn(...args)
                if (id === requestId) {
                    return {
                        result,
                        skip: false,
                    }
                }
            } catch (e) {
                if (id === requestId) {
                    throw e
                }
            }

            return {
                skip: true,
            }
        },
    }
}
