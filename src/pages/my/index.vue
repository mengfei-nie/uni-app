<template>
  <view class="my">
    <view
      class="header"
      @click="handleJump(WEBVIEW_URLS.USER_SETTING)"
    >
      <template v-if="isLogin">
        <image
          :src="userInfo.userImageUrl"
          class="avatar"
        />
        <text class="nick-name">
          {{ userInfo.nickname }}
        </text>
        <text class="mobile">
          {{ userInfo.mobile }}
        </text>
      </template>
      <template v-else>
        <image
          src="@/static/my/avatar.png"
          class="avatar"
        />
        <text class="nick-name">
          登录/注册
        </text>
      </template>
    </view>
  </view>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { auth, debounce } from '@utils/decorator'
import { WEBVIEW_URLS } from '@utils/config'

const userModule = namespace('user')

@Component
export default class My extends Vue {
  WEBVIEW_URLS = WEBVIEW_URLS;

  @userModule.State userInfo;

  @userModule.Getter isLogin;
  @userModule.Action getUserInfo;

  onLoad() {
    this.getUserInfo()
  }

  @debounce()
  @auth
  handleJump(url) {
    this.$jump(url)
  }
}
</script>

<style lang="scss" scoped>
.my {
	width: 100%;
	min-height: 100%;
	padding: 0 24rpx;
	box-sizing: border-box;
	background-color: #f0f4f5;
	background-image: url("@/static/my/avatar_bg.jpg");
	background-size: 100% 624rpx;
	background-repeat: no-repeat;

	.header {
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 48rpx;

		.avatar {
			width: 160rpx;
			height: 160rpx;
			border-radius: 50%;
			margin-top: 188rpx;
		}

		.nick-name {
			height: 48rpx;
			font-size: 34rpx;
			font-weight: 400;
			line-height: 48rpx;
			margin-top: 16rpx;
		}

		.mobile {
			height: 40rpx;
			font-size: 28rpx;
			font-weight: 400;
			line-height: 40rpx;
		}
	}

	.list {
		background: #fff;
		border-radius: 32rpx;

		.list-item {
			display: flex;
			height: 120rpx;
			align-items: center;
			padding: 0 15rpx 0 24rpx;

			.icon {
				width: 48rpx;
				height: 48rpx;
			}

			.content {
				flex: 1;
				margin-left: 16rpx;
				font-size: 32rpx;
				font-weight: 400;
				color: #333;
			}

			.arrow {
				width: 44rpx;
				height: 40rpx;
			}
		}
	}

	.btn {
		margin-top: 24rpx;
		padding-bottom: 24rpx;
		display: flex;
		justify-content: space-between;

		.btn-item {
			width: 340rpx;
			height: 120rpx;
			line-height: 120rpx;
			background: #fff;
			border-radius: 32rpx;
			display: flex;
			align-items: center;

			image {
				width: 48rpx;
				height: 48rpx;
				margin: 0 16rpx 0 24rpx;
			}
		}
	}
}
</style>
