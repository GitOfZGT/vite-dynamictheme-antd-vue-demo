import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import {
  themePreprocessorPlugin,
  themePreprocessorHmrPlugin,
} from "@zougt/vite-plugin-theme-preprocessor";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import path from "path";
// import legacy from "@vitejs/plugin-legacy";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3300,
    watch: {
      ignored: ["!**/node_modules/**/setCustomTheme.js"],
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    // legacy({
    //   targets: ["ie >= 11"],
    //   additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    // }),
    vue(),
    Components({
      resolvers: [AntDesignVueResolver({ importStyle: "less" })],
    }),
    // 创建动态主题切换
    themePreprocessorPlugin({
      less: {
        // 启用任意主题色模式
        arbitraryMode: true,
        // 默认的主题色，与原主题色有差异的即可
        defaultPrimaryColor: "#512da7",
        // 只需提供一个变量文件
        multipleScopeVars: [
          {
            scopeName: "theme-default",
            path: path.resolve("src/theme/theme-vars.less"),
            // varsContent参数等效于 path文件的内容 ，可以让 defaultPrimaryColor 与 "@primary-color"值只写一遍， varsContent 与 path 选一个使用
            // varsContent:`@primary-color:${defaultPrimaryColor};`
          },
        ],
        // css中不是由主题色变量生成的颜色，也让它抽取到主题css内，可以提高权重
        includeStyleWithColors: [
          {
            color: "#ffffff",
            // 此类颜色的是否跟随主题色梯度变化，默认false
            // inGradient: true,
          },
        ],
      },
    }),
    // 主题热更新
    themePreprocessorHmrPlugin(),
  ],
});
