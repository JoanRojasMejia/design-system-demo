/**
 * Dialog component
 * Derived from Element Plus v2.9.5
 * https://github.com/element-plus/element-plus/tree/2.9.5/packages/components/dialog
 */
import GDialog from './Dialog.vue'
import { useDialog } from './use-dialog'
import { DialogEmits, DialogProps, dialogEmits, dialogProps } from './dialog'
import type { FooterButton } from './types'

export { dialogEmits, dialogProps, useDialog }
export type { FooterButton, DialogProps, DialogEmits }
export { GDialog }

export default GDialog;
