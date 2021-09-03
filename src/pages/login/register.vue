<template>
  <view
    :class="['modal', visibleClass]"
    data-name="modal"
    @click="handleCloseModal"
  >
    <view class="content transition">
      <view
        class="close"
        data-name="modal"
        @click="handleCloseModal"
      />
      <view class="title">
        手机号登录
      </view>
      <view class="sub-title">
        若手机号未注册，验证后将自动注册
      </view>
      <label>
        <input
          v-model="mobile"
          type="number"
          maxlength="11"
          placeholder="请输入手机号"
          placeholder-class="placeholder"
        >
      </label>
      <label>
        <input
          v-model="authCode"
          type="number"
          maxlength="6"
          placeholder="请输入验证码"
          placeholder-class="placeholder"
        >
        <view
          :class="['send-code', btnInfo.isStartCountDown ? 'disabled' : '']"
          @click="handleSendCode"
        >{{ btnInfo.text }}</view>
      </label>

      <button
        :class="['confirm', disabled ? 'disabled' : '']"
        @click="handleLogin"
      >
        确定
      </button>
    </view>
  </view>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Component, Vue, Model, Emit } from 'vue-property-decorator'
import Validator from '@utils/validator'
import { debounce } from '@utils/decorator'
import userAPI from '@api/user'
import { namespace } from 'vuex-class'

const COUNT_DOWN_TIME = 60
const userModule = namespace('user')

@Component
export default class extends Vue {
  mobile = '';
  authCode = '';
  countDown = COUNT_DOWN_TIME;
  timer: ReturnType<typeof setInterval> | null = null;

  @Model('input', { default: false }) value!: boolean;

  @userModule.Action loginByPhone!: (data: {mobile: string;authCode: string;}) => unknown;

  get disabled() {
    return !this.mobile || !this.authCode
  }

  get visibleClass() {
    return this.value ? 'visible' : ''
  }

  get btnInfo() {
    const isStartCountDown = this.countDown !== COUNT_DOWN_TIME

    return {
      isStartCountDown,
      text: isStartCountDown ? `剩余${this.countDown}s` : '获取验证码'
    }
  }

  handleCloseModal(e) {
    if (e.target.dataset.name === 'modal') {
      this.$emit('input', false)
    }
  }

  startCountDown() {
    if (!this.timer) {
      this.countDown--

      this.timer = setInterval(() => {
        this.countDown--
        if (this.countDown === 0) {
          clearInterval(this.timer as ReturnType<typeof setInterval>)
          this.timer = null
          this.countDown = COUNT_DOWN_TIME
        }
      }, 1000)
    }
  }

  async handleSendCode() {
    if (this.btnInfo.isStartCountDown) {
      return false
    }

    try {
      const data = { mobile: this.mobile }
      await new Validator({
        rule: {
          mobile: [
            { type: 'isNonEmpty', message: '请输入手机号' },
            { type: 'isMobile', message: '手机号格式错误' }
          ]
        }
      }).validate(data)

      await userAPI.sendCode(data)

      this.startCountDown()
    } catch (error) {
      this.$showToast(error)
    }
  }

  @debounce()
  @Emit('loginSuccess')
  async handleLogin() {
    if (this.disabled) {
      return false
    }

    try {
      const data = { mobile: this.mobile, authCode: this.authCode }

      await new Validator({
        rule: {
          mobile: [
            { type: 'isNonEmpty', message: '请输入手机号' },
            { type: 'isMobile', message: '手机号格式错误' }
          ],
          authCode: { type: 'isNonEmpty', message: '请输入验证码' }
        }
      }).validate(data)

      await this.loginByPhone(data)
    } catch (error) {
      this.$showToast(error)
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: -10;

	.content {
		width: 100%;
		background: #fff;
		position: absolute;
		bottom: -500px;
		text-align: center;
		padding: 32rpx 60rpx 240rpx;
		box-sizing: border-box;
		border-radius: $uni-border-radius;

		.close {
			width: 40rpx;
			height: 40rpx;
			background: url('../../static/login/icon_close.png') no-repeat center center;
			background-size: 100% 100%;
			margin-left: auto;
			margin-right: -28rpx;
		}

		.title {
			height: 66rpx;
			font-size: 48rpx;
			font-weight: 600;
			color: #333;
			line-height: 66rpx;
			margin-top: 16rpx;
		}

		.sub-title {
			height: 40rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #333;
			line-height: 40rpx;
			margin: 16rpx 0 64rpx;
		}

		label {
			display: flex;
			justify-content: space-between;
			border-bottom: 1rpx solid #e6e6e6;

			input {
				height: 112rpx;
				line-height: 112rpx;
				text-align: left;
				flex: 1;
			}

			::v-deep .placeholder {
				color: #c4c2c2;
			}

			.send-code {
				height: 112rpx;
				padding-left: 40rpx;
				line-height: 112rpx;
				font-weight: 400;
				color: #007cc8;
				position: relative;
				font-size: 28rpx;

				&::after {
					content: "";
					position: absolute;
					width: 1rpx;
					height: 40rpx;
					left: 0;
					background: #d8d9d9;
					top: 0;
					bottom: 0;
					margin: auto;
				}
			}

			.disabled {
				color: #999;
			}
		}

		.confirm {
			height: 88rpx;
			line-height: 88rpx;
			margin-top: 48rpx;
			background: #007cc8;
			border-radius: $uni-border-radius-small;
			color: #fff;

			&.disabled {
				background: #d8d9d9;
			}
		}
	}
}

.visible {
	z-index: 10;

	.transition {
		bottom: 0;
		transition: bottom 0.3s linear;
	}
}

button::before {
	border: none;
}

button::after {
	border: none;
}
</style>
