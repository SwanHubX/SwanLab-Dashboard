<template>
  <div class="env-items" v-if="valid">
    <h1 class="flex items-center gap-2 font-semibold" v-if="title">{{ title }}</h1>
    <EnvItem
      :env-key="item.key"
      :env-value="item.value"
      v-for="item in data"
      :key="item.key"
      :highLight="item.highLight"
      :copy="item.copy"
      :link="item.link"
    />
  </div>
</template>

<script setup>
/**
 * @description: 环境分块 - 每个分块包含多条环境信息
 * @file: EnvGroup.vue
 * @since: 2024-01-09 20:03:21
 **/
import EnvItem from './EnvItem.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: null
  }
})

// 数据全为空时不合法
const valid = computed(() => {
  return props.data.filter((item) => item.value).length > 0
})
</script>

<style lang="scss" scoped>
.env-items {
  @apply w-full py-5 flex-col space-y-5;

  &:not(:last-child) {
    @apply border-b;
  }
}
</style>
