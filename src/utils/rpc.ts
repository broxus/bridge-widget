import { ProviderRpcClient } from 'everscale-inpage-provider'

export const rpc = new ProviderRpcClient({
    forceUseFallback: true,
    fallback: () =>
        new Promise((resolve, reject) => {
            if (window.__venom) {
                resolve(window.__venom)
            } else {
                let tries: number = 0
                const interval = setInterval(() => {
                    tries += 1
                    if (window.__venom) {
                        resolve(window.__venom)
                        clearInterval(interval)
                    } else if (tries >= 3) {
                        reject(new Error('Provider not founded'))
                        clearInterval(interval)
                    }
                }, 500)
            }
        }),
})
