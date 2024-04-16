import { DexApi } from '@/api/dex-v2/api'
import { DexApiV2BaseUrl } from '@/config'

export const dexApiV2 = new DexApi({
    baseURL: DexApiV2BaseUrl,
})
