import { DexApi } from '@/api/dex-v1/api'
import { DexApiV1BaseUrl } from '@/config'

export const dexApiV1 = new DexApi({
    baseURL: DexApiV1BaseUrl,
})
