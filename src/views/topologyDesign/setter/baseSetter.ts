import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class BaseSetter extends Vue {
  @Prop({ default: "" }) value: string | number;
  @Prop() max: number;
  @Prop() label: string;
  @Prop({ default: () => [] }) options: any[];
  @Prop({ default: false }) readonlyBol: boolean;

  handleChange(ev: string | string[]) {
    this.$emit("change", ev);
  }
}
