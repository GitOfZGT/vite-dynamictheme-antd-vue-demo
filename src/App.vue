<script setup lang="ts">
/**
 * "color" 和 "@setCustomTheme" 在ts中缺少模块声明，自行添加即可，如 ./taypes.d.ts
 */
import Color from "color";
// "@setCustomTheme" 是 @zougt/vite-plugin-theme-preprocessor 提供的模块，setCustomTheme的参数必须提供Color模块
import setCustomTheme from "@setCustomTheme";

// console.log(setCustomTheme)
import { ref, watch, computed } from "vue";
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Forms from "./components/forms.vue";
import Table from "./components/table.vue";
import Slider from "./components/slider.vue";
import TimeLine from "./components/timeLine.vue";
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

const defaultPrimaryColor = "#CB38CE";
const defaultRadius = 4;
// 对应less变量 @alert-success-bg-color 的值，让它单独切换，不跟随主题色
const alertSuccessBgReplacerKey = "#F7D06B";
interface ThemeOpt {
  primaryColor: string;
  targetValueReplacer?: object;
  gradientReplacer?: {
    [alertSuccessBgReplacerKey]: string;
  };
}
// 从浏览器获取存储的 setCustomTheme 的参数
const storageOpt = localStorage.getItem("storage-theme-color");
let defaultThemeOpt: ThemeOpt = { primaryColor: defaultPrimaryColor };
try {
  if (storageOpt) {
    defaultThemeOpt = JSON.parse(storageOpt);
  }
} catch (e) {}

// 分析 targetValueReplacer 得到一组值是可以通过 "6px" 替换的
const targetValueReplacer = {
  "6px 6px 0 0": "6px 6px 0 0",
  "6px": "6px",
  "0 0 6px 6px": "0 0 6px 6px",
  "6px 0 0 0": "6px 0 0 0",
  "0 6px 0 0": "0 6px 0 0",
  "6px 0 0 6px": "6px 0 0 6px",
  "0 6px 6px 0": "0 6px 6px 0",
};
// 组件加载时展示默认主题
const roadOpt = {
  Color,
  ...defaultThemeOpt,
};
if (!defaultThemeOpt.targetValueReplacer) {
  defaultThemeOpt.targetValueReplacer = Object.keys(targetValueReplacer).reduce(
    (tol, key) => {
      return { ...tol, [key]: key.replace(/6px/g, `${defaultRadius}px`) };
    },
    {}
  );
}
setCustomTheme(roadOpt);

// 颜色板--切换主题色
const primaryColor = ref(defaultThemeOpt.primaryColor);
// 圆角值
const radius = ref(defaultRadius);
// 颜色板--切换一个非主题色
const oneOtherColor = ref(
  (defaultThemeOpt.gradientReplacer || {})[alertSuccessBgReplacerKey] ||
    alertSuccessBgReplacerKey
);

const themeOptions = computed(() => {
  /**
   * @param {string} primaryColor
   * // 可以终端命令 npx z-theme ins gradientReplacer 查看可用属性，targetValueReplacer同理
   * @param {object} [gradientReplacer]
   * @param {object} [targetValueReplacer]
   */
  return {
    // 主色切换
    primaryColor: primaryColor.value,

    // 在src/theme/theme-vars.less文件中有n种不同的颜色值， gradientReplacer 就有n个可用属性
    gradientReplacer: {
      // 对应less变量 @alert-success-bg-color 的值，让它单独切换，不跟随主题色
      [alertSuccessBgReplacerKey]: oneOtherColor.value,
    },
    targetValueReplacer: Object.keys(targetValueReplacer).reduce((tol, key) => {
      // 分析 targetValueReplacer 得到 "6px" 是一组值的相同部分，用新的radius值替换过去
      return { ...tol, [key]: key.replace(/6px/g, `${radius.value}px`) };
    }, {}),
  };
});
// 参数改变切换主题
watch(themeOptions, (themeOptions) => {
  setCustomTheme({
    Color,
    ...themeOptions,
  });
  localStorage.setItem("storage-theme-color", JSON.stringify(themeOptions));
});
</script>

<template>
  <div style="padding: 20px">
    <h1 style="text-align: center">vite + ant-design-vue 动态主题切换示例</h1>
    <div style="text-align: center">
      <span>当前主题色：</span>
      <color-picker v-model:pureColor="primaryColor" />
      <span>一个非主题色：</span>
      <color-picker v-model:pureColor="oneOtherColor" />
      <span>圆角值联动</span>
      <a-input-number v-model:value="radius" :min="1" :max="1000" />
    </div>
    <h3 class="sub-title">
      这行文字是非组件库的颜色切换演示，之下是组件库的颜色切换
    </h3>
    <a-divider />
    <a-row :gutter="30">
      <a-col :span="12"
        ><a-typography-title>Buttons</a-typography-title>
        <a-button type="primary">Primary Button</a-button>
        <a-button>Default Button</a-button>
        <a-button type="dashed">Dashed Button</a-button>
        <a-button type="text">Text Button</a-button>
        <a-button type="link">Link Button</a-button>
        <a-divider />
        <a-typography-title>Alert</a-typography-title>
        <a-alert
          style="margin-bottom: 10px"
          message="哈！主人给了我独立切换颜色的机会"
          type="success" />
        <a-alert
          style="margin-bottom: 10px"
          message="alert中只有我是由主题色演变的"
          type="info" />
        <a-alert
          style="margin-bottom: 10px"
          message="我不会跟随主题色变化"
          type="warning" />
        <a-alert message="好可惜，我也不会" type="error" />
        <a-divider />
        <a-divider />
        <a-typography-title>Progress</a-typography-title>
        <!-- ant-design-vue 的进度条颜色是由组件参数控制的 -->
        <a-progress :percent="30" :strokeColor="primaryColor" />
        <a-progress :percent="50" :strokeColor="primaryColor" status="active" />
        <div>
          <a-progress type="circle" :strokeColor="primaryColor" :percent="75" />
          <a-progress type="circle" :percent="70" status="exception" />
          <a-progress type="circle" :percent="100" />
        </div>

        <a-divider
      /></a-col>
      <a-col :span="12"
        ><a-typography-title>Slider</a-typography-title>
        <Slider />
        <a-divider />
        <a-typography-title>Forms</a-typography-title>

        <Forms />
        <a-divider />
        <a-typography-title>Table</a-typography-title>
        <Table />

        <a-typography-title>TimeLine</a-typography-title>
        <TimeLine
      /></a-col>
    </a-row>
    <div class="my-plugins">
      使用成本低、适用于任何UI框架（基于less/sass）、不依赖Css3 vars、兼容IE9+?
      <h4>webpack版本插件支持</h4>
      <a href="https://github.com/GitOfZGT/some-loader-utils" target="_blank"
        >@zougt/some-loader-utils</a
      >
      <a
        href="https://github.com/GitOfZGT/theme-css-extract-webpack-plugin"
        target="_blank"
        >@zougt/theme-css-extract-webpack-plugin</a
      >
      <h4>vite版本插件支持</h4>
      <a
        href="https://github.com/GitOfZGT/vite-plugin-theme-preprocessor"
        target="_blank"
        >@zougt/vite-plugin-theme-preprocessor</a
      >
    </div>
  </div>
</template>

<style lang="less" scoped>
/** 注意：@import 默认的组件库变量文件，而不能是 src/theme/theme-vars.less */
@import "ant-design-vue/lib/style/themes/index.less";
.sub-title {
  margin-bottom: 80px;
  margin-top: 20px;
  text-align: center;
  // 用一个固定颜色 与  主题色 混合之后的颜色
  color: mix(#999999, @primary-color, 90%);
}

.my-plugins {
  max-width: 450px;
  padding: 10px 20px;
  position: fixed;
  z-index: 9;
  top: 0px;
  left: 0px;
  background-color:  @body-background;;
  a {
    display: block;
  }
  h4 {
    margin-top: 10px;
  }
}
</style>
