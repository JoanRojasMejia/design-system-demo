/**
 * Dialog component
 * Derived from Element Plus v2.9.5
 * https://github.com/element-plus/element-plus/tree/2.9.5/packages/components/dialog
 */
import GDialog from './Dialog.vue'
import { useDialog } from './use-dialog'
import { DialogEmits, DialogProps } from './dialog'
import type { FooterButton } from './types'

export { useDialog, DialogEmits, DialogProps }
export type { FooterButton }
export { GDialog }

export default GDialog;
