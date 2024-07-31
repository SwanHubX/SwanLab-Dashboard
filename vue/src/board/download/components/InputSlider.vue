<template>
  <Dropdown
    v-model:open="open"
    overlay-class-name="download-dropdown-overlay"
    placement="top"
    :arrow="{ pointAtCenter: true }"
    :trigger="['click']"
  >
    <InputNumber style="width: 72px" v-model:value="model" :min="min" :max="max" />
    <template #overlay>
      <Menu style="width: 300px; display: flex; padding-right: 10px; padding-left: 10px" class="gap-2 items-center">
        {{ min }}
        <div style="width: 250px">
          <Slider v-model:value="model" :min="Number(min)" :max="Number(max)" :step="1" :tooltip-open="false" />
        </div>
        {{ max }}
      </Menu>
    </template>
  </Dropdown>
</template>

<script setup>
/**
 * @description: 输入数字，弹出滑动条
 * @file: InputSlider.vue
 * @since: 2024-07-29 19:27:14
 **/
import { Dropdown, InputNumber, Menu, Slider } from 'ant-design-vue'

const model = defineModel({ type: Number })

defineProps({
  min: {
    type: [Number, String],
    required: true
  },
  max: {
    type: [Number, String],
    required: true
  }
})

const open = ref(false)
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.download-dropdown-overlay {
  // 模态框1500z-index
  z-index: 1550;
}
</style>
