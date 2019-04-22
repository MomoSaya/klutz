<template>
  <section class="container full-width">
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="order-info">
      <div class="row">
        <span>订单号：</span>
        <span v-if="code">{{code}}</span>
      </div>
      <div class="row">
        <span>总金额：</span>
        <span class="money">
          &yen;&nbsp;{{amount}}
        </span>
      </div>
    </div>
    <div class="payment-list">
      <p class="title">支付方式</p>
      <a
        v-for="(item, index) in paymentMethods"
        :key="index"
        class="white-bg primary-test font-14 flex-between"
        @click="pay(item.id)">
        <div class="name">
          <div class="flex img-wrapper">
            <img :src="item.assets">
          </div>
          <span>{{item.label}}</span>
        </div>
        <i class="iconfont icon-you"></i>
      </a>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, setStore, removeStore, mobileClient } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  export default {
    name: 'Pay',
    data () {
      return {
        header: '支付',
        token: getStore('user') ? getStore('user').authentication_token : '',
        isRedirect: this.$route.query.back || '',
        code: this.$route.query.code || '',
        amount: this.$route.query.amount || '',
        paymentMethods: [
          {
            id: 1,
            label: '微信支付',
            assets: 'http://oatl31bw3.bkt.clouddn.com/weixinPay.png'
          }, {
            id: 2,
            label: '支付宝',
            assets: 'http://oatl31bw3.bkt.clouddn.com/aliPay.png'
          }
        ],
        selectedItem: 1
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('Paying_goHome')) {
          removeStore('Paying_goHome')
          this.$router.push({name: 'See'})
        } else if (this.isRedirect) {
          this.$router.replace({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      pay (id) {
        if (id === 1) {
          if (mobileClient() === 'weixin') {
            this.wechatPayInside()
          } else {
            this.selectedItem = id
            this.wechatPayRequestH5()
          }
        } else if (id === 2) {
          this.aliPayRequest()
        }
      },
      handleAliPayLink (link) {
        if (mobileClient() === 'weixin') {
          _AP.pay(link, this.code, this.amount)
        } else if (mobileClient() === 'qq') {
          Toast({
            message: 'QQ中不支持支付宝支付，您可以选择微信支付！',
            duration: 2000
          })
        } else {
          window.location.href = link
        }
      },
      wechatPayInside () {
        this.$store.dispatch('commonAction', {
          url: '/v1/prepay/wechat/h5_inside',
          method: 'get',
          params: {
            token: this.token,
            code: this.code
            },
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              this.wechatPayRequest(res.data.order_form)
            } else {
              Toast({
                message: res.data || '支付失败，请重试',
                duration: '1000'
              })
            }
          },
          reject: () => {
          }
        })
      },
      aliPayRequest () {
        this.$store.dispatch('commonAction', {
          url: '/v1/alipay/wap',
          method: 'get',
          params: {
            token: this.token,
            code: this.code,
            return_url: `${window.location.href}&back=1`
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              this.handleAliPayLink(res.data.pay_link)
            } else {
              Toast({
                message: res.data || '支付失败，请重试',
                duration: '1000'
              })
            }
          },
          reject: () => {
          }
        })
      },
      wechatPayRequest (params) {
        const onBridgeReady = () => {
          WeixinJSBridge.invoke('getBrandWCPayRequest', {
            appId: params.appId,
            timeStamp: params.timeStamp,
            nonceStr: params.nonceStr,
            package: params.package,
            signType: params.signType,
            paySign: params.paySign
          }, (res) => {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              this.getPayStatus()
            } else {
              console.log('支付失败')
              this.getPayStatus()
            }
          })
        }
        if (typeof WeixinJSBridge == 'undefined') {
          if (document.addEventListener){
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
          } else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
          }
        }else{
          onBridgeReady()
        }
      },
      testWechatPay () {
        if (mobileClient() === 'weixin') {
          this.wechatPayInside()
        }
      },
      wechatPayRequestH5 () {
        this.$store.dispatch('commonAction', {
          url: '/v1/prepay/wechat/h5',
          method: 'get',
          params: {
            token: this.token,
            code: this.code
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              window.location.href = res.data.pay_link + '&redirect_url=' + encodeURIComponent(`${window.location.href}&back=1`)
            } else if (res.data.result && res.data.result.err_code_des === '201 商户订单号重复') {
              Toast({
                message: 'App与网页支付暂不互通，请回原支付端进行支付',
                duration: '3000'
              })
            } else {
              Toast({
                message: res.data.result && res.data.result.err_code_des ? res.data.result.err_code_des : '支付失败，请重试',
                duration: '1000'
              })
            }
          },
          reject: () => {
          }
        })
      },
      goPaySuccess () {
        this.$router.push({name: 'PaySuccess'})
      },
      goPayError () {
        this.$router.push({name: 'PayError', params: {id: this.code}, query: {amount: this.amount}})
      },
      showStatus () {
        if (this.isRedirect) {
          this.getPayStatus()
        }
      },
      getPayStatus () {
        this.$store.dispatch('commonAction', {
          url: `/v1/order_forms/${this.code}`,
          method: 'get',
          params: {
            token: this.token,
            number: this.code
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.order_forms && (res.data.order_forms.state === 'paid' || res.data.order_forms.state === 'reminded')) {
              this.goPaySuccess()
            } else {
              this.goPayError()
            }
          },
          reject: () => {
          }
        })
      },
      handleIOSWechatUrl () {
        let ua = navigator.userAgent.toLowerCase()
        if (mobileClient() === 'weixin' && (ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1 || ua.indexOf('ipod') !== -1) && !getStore('iosWechatReload')) {
          setStore('iosWechatReload', 'true')
          window.location.reload()
        }
      }
    },
    created () {
      this.handleIOSWechatUrl()
    },
    mounted () {
      this.showStatus()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: $tenth-grey;
  }
  .order-info {
    @include pm2rem(padding, 115px, 0px, 12px, 0px);
    background-color: $white;
    border-bottom: 1px solid #C9C9C9;
    .row {
      display: flex;
      align-items: center;
      line-height: 1;
      @include pm2rem(padding, 5px, 30px, 20px, 32px);
      span {
        @include font-dpr(15px);
        color: $primary-dark;
      }
      .money {
        color: $second-red;
      }
    }
  }
  .payment-list {
    .title {
      @include px2rem(height, 80px);
      @include px2rem(padding-left, 32px);
      @include font-dpr(16px);
      color: $primary-dark;
      display: flex;
      align-items: center;
    }
    .list {
      border-top: 1px solid #C9C9C9;
    }
    a {
      @include px2rem(height, 96px);
      @include pm2rem(padding, 0px, 32px, 0px, 32px);
      border-top: 1px solid $second-grey;
      align-items: center;
      .name {
        height: inherit;
        display: flex;
        align-items: center;
        line-height: normal;
        .img-wrapper {
          justify-content: flex-start;
          @include px2rem(width, 94px);
          height: inherit;
          img {
            @include px2rem(height, 54px);
            @include px2rem(max-width, 61px);
          }
        }
      }
      i {
        color: $fifth-grey;
      }
    }
    a:last-child {
      border-bottom: 1px solid $second-grey;
    }
    a:active {
      background-color: rgba(239, 234, 234, .5);
    }
  }
</style>
