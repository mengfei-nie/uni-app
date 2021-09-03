<template>
  <view
    class="status-bar-container"
    :style="statusBarHeight ? `height: ${statusBarHeight}px` : ''"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const systemModule = namespace('system')
@Component
export default class extends Vue {
  @systemModule.State statusBarHeight;
}
</script>

<style lang="scss" scoped>
.status-bar-container {
	height: var(--status-bar-height); // 因navigationbar采用胶囊模式，需把状态栏高度撑下去
}
</style>
