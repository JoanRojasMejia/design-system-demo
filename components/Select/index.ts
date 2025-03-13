import { withInstall } from 'element-plus/es/utils/index'
import Select from './select.vue'

import type { SFCWithInstall } from 'element-plus/es/utils/index'

export const GSelect: SFCWithInstall<typeof Select> = withInstall(Select)
export type SelectInstance = InstanceType<typeof Select>;
export default GSelect

export * from './types/token'