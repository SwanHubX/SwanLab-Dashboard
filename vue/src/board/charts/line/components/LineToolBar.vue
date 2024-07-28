<template>
  <ChartToolBar>
    <template #more>
      <SubMenu :title="$t('chart.line.toolbar.download.title')">
        <template #icon>
          <DownloadOutlined />
        </template>
        <MenuItem key="png" @click="() => handleDownload('png')">
          {{ $t('chart.line.toolbar.download.png.menuItem') }}
        </MenuItem>
        <MenuItem key="csv" disabled @click="() => handleDownload('csv')">
          {{ $t('chart.line.toolbar.download.csv.menuItem') }}
        </MenuItem>
      </SubMenu>
    </template>
  </ChartToolBar>
</template>

<script setup>
/**
 * @description: 在原本的基础上添加下载按钮
 * @file: LineToolBar.vue
 * @since: 2024-07-28 20:47:51
 **/
import ChartToolBar from '../../.components/ChartToolBar.vue'
import { DownloadOutlined } from '@ant-design/icons-vue'
import { MenuItem, SubMenu } from 'ant-design-vue'

const pngOpen = ref(false)
const handleDownload = (/** @type {'png' | 'csv'} */ type) => {
  switch (type) {
    case 'png':
      pngOpen.value = true
      break
    case 'csv':
      break
  }
}
</script>

<style lang="scss" scoped></style>
