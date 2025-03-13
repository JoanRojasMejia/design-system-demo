import {
  withInstall,
  withNoopInstall,
  SFCWithInstall,
} from "element-plus/es/utils/index.mjs";
import From from "./Form.vue";
import FormItem from "./form-item.vue";

export const GForm: SFCWithInstall<typeof From> & {
  FormItem: typeof FormItem;
} = withInstall(From, {
  FormItem,
});
export default GForm;
export const GFormItem: SFCWithInstall<typeof FormItem> =
  withNoopInstall(FormItem);

export * from "./form";
export * from "./form-item";
export * from "./types";
export * from "./constants";
export * from "./hooks";

export type FormInstance = InstanceType<typeof From>;
export type FormItemInstance = InstanceType<typeof FormItem>;
