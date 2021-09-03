<template>
  <view class="login">
    <!-- <image
      height="100%"
      src="@/static/login/bg.png"
      mode="heightFix"
    /> -->

    <StatusBar />

    <view class="header">
      <view
        v-if="showNavigatorBack"
        class="icon-back"
        @click="handleNavigatorBack"
      />
      登录
    </view>

    <view class="content">
      <text class="f-40">
        Hello!
      </text>
      <text
        class="f-24"
      >
        欢迎来到Inpark
      </text>
    </view>

    <view class="footer">
      <button
        class="btn weixin-btn"
        open-type="getPhoneNumber"
        type="primary"
        @getphonenumber="handleGetphone"
      >
        微信一键登入
      </button>
      <button
        class="btn phone-btn"
        type="primary"
        @click="toggleVisible"
      >
        手机号码登录
      </button>
      <view
        class="protocal"
        @click="handleJump(WEBVIEW_URLS.USER_PROTOCAL)"
      >
        登录代表您已同意《软件许可服务协议》
      </view>
    </view>

    <Register
      v-model="visible"
      @loginSuccess="handleSuccess"
    />
  </view>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import StatusBar from '@components/statusBar.vue'
import Register from './register.vue'
import { WEBVIEW_URLS } from '@utils/config'

const userModule = namespace('user')

@Component({
  components: {
    StatusBar,
    Register
  }
})
export default class extends Vue {
  WEBVIEW_URLS = WEBVIEW_URLS

  showNavigatorBack = false;
  visible = false;

  @userModule.Action uniLogin;
  @userModule.Action saveUser;

  onLoad() {
    const routes = getCurrentPages()

    if (routes.length > 1) {
      this.showNavigatorBack = true
    }
  }
  handleJump(url) {
    this.$jump(url)
  }

  handleSuccess() {
    uni.navigateBack({ delta: 1 })
  }

  async handleGetphone(e) {
    const { iv, encryptedData, errMsg } = e.detail
    if (iv && encryptedData) {
      await this.saveUser({ iv, encryptedData })
      this.handleSuccess()
    } else {
      console.log(errMsg)
    }
  }

  toggleVisible() {
    this.visible = true
  }

  handleNavigatorBack() {
    uni.navigateBack({})
  }
}
</script>

<style lang="scss" scoped>
.login {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background: url('@/static/login/bg.png');
	background-size: 150% 100%;
	background-repeat: no-repeat;
	animation: 20s linear 0.5s infinite alternate animatedBackground;

	.header {
		height: 44px;
		line-height: 44px;
		text-align: center;
		color: #fff;
		position: relative;

		.icon-back {
			width: 48rpx;
			height: 48rpx;
			background:
				url("/static/login/icon_arrow_left.png") no-repeat center
				center;
			background-size: 100%;
			position: absolute;
			left: 30rpx;
			top: 0;
			bottom: 0;
			margin: auto;
		}
	}

	.content {
		margin-top: 172rpx;
		padding: 0 70rpx;
		display: flex;
		flex-direction: column;
		color: #fff;
		flex: 1;

		.f-40 {
			font-size: 80rpx;
		}

		.f-24 {
			font-size: 48rpx;
			margin-top: 16rpx;
		}
	}

	.footer {
		margin-top: auto;
		padding: 0 70rpx;

		.btn {
			border-radius: $uni-border-radius-small;
			font-size: 32rpx;
			height: 88rpx;
			line-height: 88rpx;
		}

		.weixin-btn {
			background: #16b129;
		}

		.phone-btn {
			background: #007cc8;
			margin-top: 48rpx;
		}

		.protocal {
			margin-top: 88rpx;
			margin-bottom: 92rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #f9f9f9;
			text-align: center;
		}
	}
}

@keyframes animatedBackground {
	from { background-position: 0 0; }
	to { background-position: 100% 0; }
}

button::before {
	border: none;
}

button::after {
	border: none;
}
</style>
