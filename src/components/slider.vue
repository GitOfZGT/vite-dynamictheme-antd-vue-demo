<template>
  <div>
    <a-slider id="test" v-model:value="value1" :disabled="disabled" />
    <a-slider v-model:value="value2" range :disabled="disabled" />
    Disabled:
    <a-switch v-model:checked="disabled" size="small" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const value1 = ref<number>(0);
    const value2 = ref<number[]>([20, 50]);
    const disabled = ref<boolean>(false);

    return {
      value1,
      value2,
      disabled,
    };
  },
});
</script>
<style scoped>
.code-box-demo .ant-slider {
  margin-bottom: 16px;
}
</style>
