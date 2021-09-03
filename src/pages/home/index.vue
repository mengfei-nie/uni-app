<template>
  <view
    class="home"
  >
    <status-bar />

    <view @click="handleOpenPopup">
      open popup
    </view>

    <view @click="jumpH5">
      跳转webview
    </view>

    <uni-popup
      ref="popup"
      type="dialog"
      background-color="#fff"
      class="popup-box"
    >
      <button>
        test uniPopup
      </button>
    </uni-popup>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import StatusBar from '@components/statusBar.vue'
import { namespace } from 'vuex-class'
import { WEBVIEW_URLS } from '../../utils/config'
import { auth, debounce } from '@utils/decorator'
import { UniPopup } from '@customeTypes/uni-ui.d'

const systemModule = namespace('system')
const userModule = namespace('user')

@Component({
  components: {
    StatusBar
  }
})
export default class Home extends Vue {
  @systemModule.Getter barHeightStyle;
  @userModule.Getter isLogin;

  WEBVIEW_URLS = WEBVIEW_URLS

  @debounce()
  handleOpenPopup() {
    (this.$refs.popup as UniPopup).open('center')
  }

  @auth
  jumpH5() {
    this.$jumpWebview(WEBVIEW_URLS.ABOUT_US)
  }
}
</script>

<style lang="scss">
page {
	height: 100%;
}

.home {
	height: 100%;
	overflow: hidden;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;

	.header {
		height: 70rpx;
		line-height: 70rpx;
		padding: 0 24rpx;
		display: flex;
		align-items: center;
	}
}
</style>
