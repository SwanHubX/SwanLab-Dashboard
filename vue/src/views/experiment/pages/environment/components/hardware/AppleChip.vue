<template>
  <EnvGroups :title="$t('experiment.env.groups.apple')">
    <EnvItem env-key="brand" :env-value="data.type" />
    <EnvItem env-key="cpu" :env-value="data.cpu" />
    <EnvItem env-key="memory" :env-value="data.memory + 'GB'" />
  </EnvGroups>
</template>

<script setup>
import EnvGroups from '@swanlab-vue/views/experiment/pages/environment/components/EnvGroup.vue'
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
