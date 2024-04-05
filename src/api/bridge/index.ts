import { BridgeApi } from '@/api/bridge/api'
import { BridgeApiBaseUrl } from '@/config'

export const bridgeApi = new BridgeApi({
    baseUrl: BridgeApiBaseUrl,
})
