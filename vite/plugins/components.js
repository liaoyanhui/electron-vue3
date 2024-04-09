import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
export default function createComponents(isBuild) {
  return Components({
    resolvers: [ElementPlusResolver()]
  })
}