<template>
  <div class="w-full py-5 flex-col space-y-5">
    <h1 class="flex items-center gap-2 font-semibold">{{ $t('experiment.env.groups.apple') }}</h1>
    <EnvItem env-key="brand" :env-value="data.type" />
    <EnvItem env-key="cpu" :env-value="data.cpu" />
    <EnvItem env-key="memory" :env-value="data.memory + 'GB'" />
  </div>
</template>

<script setup>
import EnvItem from '@swanlab-vue/views/experiment/pages/environment/components/EnvItem.vue'

defineProps({
  data: {
    type: {
      type: String,
      cpu: String,
      gpu: String,
      memory: String
    },
    default: {}
  }
})
</script>
