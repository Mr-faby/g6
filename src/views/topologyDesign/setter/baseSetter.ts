import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    max: Number,
    label: String,
    options: {
      type: Array,
      default: () => []
    },
    readonlyBol: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleChange(ev: string | string[]) {
      this.$emit('update', ev)
    }
  }
})
