<template>
  <transition name="router-fade">
    <section v-if="show" class="bind-wrapper full-width">
      <div class="dialog-bg full-width" @click="closeModal()"></div>
      <div class="dialog-wrapper">
        <p class="title">手机号验证</p>
        <p class="sub-title">为了您能及时收到订单动态提醒，请验证手机号</p>
        <div class="content">
          <div class="input-wrapper">
            <input class="input" v-model="mobile">
            <span>手机号</span>
          </div>
          <div class="input-wrapper">
            <input class="input code" v-model="code">
            <span>验证码</span>
            <a
              class="flex btn"
              :class="{'disabled': disabled}"
              @click="getCode()">
              {{validBtnText}}
            </a>
          </div>
        </div>
        <a class="flex button" @click="bindMobile()">
          确定
        </a>
      </div>
    </section>
  </transition>
</template>

<script>
  import { COUNT_DOWN_SECOND } from '../../constants/constant'
  import { Toast } from 'mint-ui'
  import { getStore, setStore, removeStore, mobileClient } from '../../config/mUtils'
  export default {
    name: 'BindMobile',
    props: ['show'],
    data () {
      return {
        mobile: '',
        code: '',
        validBtnText: '获取验证码',
        disabled: false,
        interval: null,
        token: getStore('user') ? getStore('user').authentication_token : '',
        provider: getStore('provider') || ''
      }
    },
    methods: {
      countDown () {
        if (this.disabled) {
          return false
        }
        let seconds = COUNT_DOWN_SECOND
        this.interval = setInterval(() => {
          seconds -= 1
          if (seconds === 0) {
            this.disabled = false
            this.validBtnText = '获取验证码'
            clearInterval(this.interval)
          } else {
            this.disabled = true
            this.validBtnText = `剩余${seconds}秒`
          }
        }, 1000)
      },
      getCode () {
        this.$store.dispatch('commonAction', {
          url: '/v1/oauth/mobile',
          method: 'get',
          params: {
            mobile: this.mobile,
            token: this.token,
            provider: this.provider
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              this.countDown()
            } else {
              Toast(res.data.msg)
            }
          },
          reject: () => {
          }
        })
      },
      bindMobile () {
        this.$store.dispatch('commonAction', {
          url: '/v1/oauth/mobile',
          method: 'post',
          params: {},
          data: {
            mobile: this.mobile,
            token: this.token,
            code: this.code,
            provider: this.provider
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              if (res.data.tmp_token) {
                removeStore('device_signature')
                removeStore('guidParams')
                removeStore('fromName')
                removeStore('unReadMsgs')
                removeStore('leanCloudConversations')
                this.$store.dispatch('switchLeanCloudStatus', {active: false})
                if (mobileClient() === 'weixin') {
                  setStore('weixinLogin', 'true')
                }
                this.$store.dispatch('clearUnReadMsgCount', {})
                this.authLogin(res.data.tmp_token, this.provider)
              } else {
                let user = getStore('user')
                user.mobile = this.mobile
                setStore('user', user)
                this.goNext()
              }
            } else {
              Toast({
                message: res.data.msg || '绑定失败，请重试！',
                duration: 1000
              })
            }
          },
          reject: () => {
            Toast({
              message: '绑定失败，请重试！',
              duration: 1000
            })
          }
        })
      },
      getSignature (token, provider = '') {
        this.$store.dispatch('commonAction', {
          url: '/v1/im/sign',
          method: 'get',
          params: {
            token: token
          },
          target: this,
          resolve: (state, res) => {
            setStore('signature', res.data)
            this.goNext()
          },
          reject: () => {
          }
        })
      },
      goNext () {
        this.$emit('next')
      },
      authLogin (token, provider) {
        this.$store.dispatch('commonAction', {
          url: '/v1/login_info',
          method: 'get',
          params: {
            token: token
          },
          data: {},
          target: this,
          resolve: (state, res) => {
            setStore('device_signature', res.data.sign)
            removeStore('weixinLogin')
            if (res.data.authentication_token && res.data.id) {
              setStore('user', res.data)
              this.getSignature(res.data.authentication_token, provider)
            } else {
              Toast('授权登录出错')
            }
          },
          reject: () => {
            Toast('授权登录出错')
          }
        })
      },
      closeModal () {
        this.mobile = ''
        this.code = ''
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .bind-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    .dialog-bg {
      position: fixed;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, .45);
    }
    .dialog-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      @include px2rem(width, 560px);
      @include px2rem(height, 420px);
      background-color: $white;
      @include px2rem(border-radius, 10px);
      @include pm2rem(padding, 20px, 20px, 20px, 20px);
      .title {
        width: 100%;
        text-align: center;
        @include px2rem(font-size, 32px);
        color: $primary-dark;
      }
      .sub-title {
        width: 100%;
        text-align: center;
        color: $green;
        @include px2rem(font-size, 24px);
      }
      .content {
        @include px2rem(margin-top, 40px);
        .input-wrapper {
          @include px2rem(height, 70px);
          @include px2rem(margin-bottom, 20px);
          position: relative;
          .input {
            flex: 1;
            border: none;
            @include px2rem(height, 68px);
            background-color: $ninth-grey;
            @include px2rem(border-radius, 14px);
            color: $second-dark;
            @include px2rem(font-size, 28px);
            display: flex;
            line-height: normal;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            @include pm2rem(padding, 0px, 30px, 0px, 140px);
            box-sizing: border-box;
          }
          span {
            position: absolute;
            @include px2rem(left, 20px);
            top: 50%;
            transform: translateY(-50%);
            display: inline-block;
            @include px2rem(padding-right, 20px);
            border-right: 1px solid $eighth-grey;
          }
          .code {
            width: 56%;
          }
          .btn {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            height: inherit;
            @include px2rem(border-radius, 10px);
            background-color: $green;
            color: $white;
            @include px2rem(font-size, 28px);
            @include px2rem(width, 220px);
            line-height: normal;
          }
          .disabled {
            color: $third-dark;
            border-color: $fourth-grey;
            background-color: $fourth-grey;
          }
          & a:active {
            opacity: .8;
          }
          ::-webkit-input-placeholder{
            color: $eighth-grey;
            @include px2rem(height, 70px);
            vertical-align: middle;
            text-align: left;
            border: none;
            @include font-dpr(14px);
            line-height: normal;
          }
        }
      }
      .button {
        margin: 0 auto;
        @include px2rem(margin-top, 40px);
        @include px2rem(height, 80px);
        @include px2rem(width, 280px);
        @include px2rem(border-radius, 10px);
        @include px2rem(font-size, 32px);
        line-height: normal;
        background-color: $green;
        color: $white;
      }
      & a:active {
        opacity: .8;
      }
    }
  }
</style>
