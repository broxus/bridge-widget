import { DexApi } from '@/api/dex/api'
import { DexApiBaseUrl } from '@/config'

export const dexApi = new DexApi({
    baseUrl: DexApiBaseUrl,
})
