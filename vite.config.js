/*
 * @Description: 
 * @Author: 尚夏
 * @Date: 2024-01-22 17:46:17
 * @LastEditTime: 2024-03-09 16:22:29
 * @FilePath: /cbank-client/vite.config.js
 */
import { fileURLToPath, URL } from "node:url"

import { defineConfig, loadEnv } from "vite"
import createVitePlugins from './vite/plugins'
// https://vitejs.dev/config/
export default ({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV, VITE_PLATFORM } = env
  // const isWeb = VITE_PLATFORM === "electron"
  const config = {
    base: "./",
    server: {
      port: 9527,
      proxy: {
        // '/api': {
        //   target: 'http://192.168.0.118:9030',
        //   changeOrigin: true,
        //   // rewrite: (path) => path.replace(/^\/api/, ''),
        // },
        // '/cbank': {
        //   target: 'http://192.168.0.118:8040',
        //   changeOrigin: true,
        //   // rewrite: (path) => path.replace(/^\/api/, ''),
        // }

      },
    },

    plugins: createVitePlugins(env, command === 'build'),
    // css: {
    //   preprocessorOptions: {
    //     sass: {
    //       implementation: sass,
    //       additionalData: `@import "@/assets/styles/variables.module.scss";`
    //     }
    //   }
    // },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
  }
  // if (isWeb) {
  //   config.experimental = {
  //     renderBuiltUrl(filename: string, { type }: { type: "public" | "asset" }) {
  //       if (type === "asset") {
  //         return "https://example.com/" + filename;
  //       }
  //     },
  //   };
  // }

  return defineConfig(config)
}
