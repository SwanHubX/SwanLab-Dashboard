<template>
  <div @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" :style="{ zIndex }">
    <slot />
  </div>
</template>

<script setup>
/**
 * @description: 最外层接受父组件class，设置为absolute，当hover的时候设置z-index在最前
 * @file: ZIndexFull.vue
 * @since: 2024-07-28 17:19:22
 **/

const hovering = ref(false)
// 999为toolbar的sticky z-index，不可设置大于等于1500，因为ant-design-vue的modal的z-index被设置为了1500
const zIndex = computed(() => (hovering.value ? 998 : undefined))
const handleMouseEnter = () => {
  hovering.value = true
}
const handleMouseLeave = () => {
  hovering.value = false
}

provide('ShowToolbar', hovering)
</script>

<style lang="scss" scoped></style>
