import { Input, Form, Select, InputNumber, Radio, Checkbox } from 'ant-design-vue'
import type { App } from 'vue'

export default function registerAntDesign(app: App) {
  app.use(Input)
  app.use(InputNumber)
  app.use(Select)
  app.use(Radio)
  // @ts-ignore
  app.use(Checkbox)
  app.use(Form)
}
