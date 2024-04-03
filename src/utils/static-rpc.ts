import { ProviderRpcClient } from 'everscale-inpage-provider'
import { EverscaleStandaloneClient } from 'everscale-standalone-client'

export const staticRpc = new ProviderRpcClient({
    fallback: () =>
        EverscaleStandaloneClient.create({
            connection: {
                id: 1,
                group: 'venom_mainnet',
                type: 'jrpc',
                data: {
                    endpoint: 'https://jrpc.venom.foundation/rpc',
                },
            },
        }),
    forceUseFallback: true,
})
