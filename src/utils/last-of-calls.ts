type Result<T> = {
    skip: true
} | {
    skip: false
    result: T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lastOfCalls<A extends any[], T = unknown>(fn: (...args: A) => Promise<T>, delay?: number): (...args: A) => Promise<Result<T>> {
    let requestId = 0

    return async function(...args) {
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
    }
}
