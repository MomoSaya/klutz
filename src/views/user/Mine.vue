<template>
  <section class="container">
    <div class="user-info">
      <div class="flex-between icons">
        <div class="flex icon-box back">
          <i class="iconfont icon-fanhui"
            @click="goBack()"></i>
        </div>
        <div class="flex icon-box" @click="goConversation()">
          <i class="iconfont icon-xiaoxi1"></i>
          <div
            v-if="unReadeMsgs.length > 0"
            class="dot second-bg"></div>
        </div>
      </div>
      <div class="user-avatar">
        <div class="circle">
          <img
            v-if="currentUser.avatar_url"
            :src="currentUser.avatar_url">
          <img
            v-else
            src="../../assets/userAvatarBig.png">
        </div>
        <div class="content">
          {{currentUser.home_name}}
        </div>
      </div>
    </div>
    <div class="form-wrapper">
      <div class="flex-between header">
        <span class="title">我的订单</span>
        <a class="flex" @click="goOrderForm(0)">
          <span>查看全部订单</span>
          <i class="iconfont icon-you"></i>
        </a>
      </div>
      <div class="flex-between content">
        <a class="box" @click="goOrderForm(1)">
          <div class="flex img-box">
            <img src="../../assets/needPay.png" class="need-pay">
          </div>
          <span>待付款</span>
          <div v-if="orderFormsCount.submiting > 0" class="bage">{{orderFormsCount.submiting | numFilter}}</div>
        </a>
        <a class="box" @click="goOrderForm(2)">
          <div class="flex img-box">
            <img src="../../assets/needSend.png"  class="need-send">
          </div>
          <span>待发货</span>
          <div v-if="orderFormsCount.sending > 0" class="bage">{{orderFormsCount.sending | numFilter}}</div>
        </a>
        <a class="box" @click="goOrderForm(3)">
          <div class="flex img-box">
            <img src="../../assets/needReceive.png" class="need-receive">
          </div>
          <span>待收货</span>
          <div v-if="orderFormsCount.receiving > 0" class="bage">{{orderFormsCount.receiving | numFilter}}</div>
        </a>
        <a class="box" @click="goOrderForm(4)">
          <div class="flex img-box">
            <img src="../../assets/needComment.png" class="need-comment">
          </div>
          <span>待评价</span>
          <div v-if="orderFormsCount.receipting > 0" class="bage">{{orderFormsCount.receipting}}</div>
        </a>
      </div>
    </div>
    <div class="flex-between favorites-wrapper">
      <a class="box" @click="goFavorite(0)">
        <div class="flex img-box">
          <span>{{favoritesCount.Product || 0}}</span>
        </div>
        <span class="label">收藏的商品</span>
      </a>
      <a class="box" @click="goFavorite(1)">
        <div class="flex img-box">
          <span>{{favoritesCount.Organization || 0}}</span>
        </div>
        <span class="label">收藏的机构</span>
      </a>
      <a class="box" @click="goFavorite(2)">
        <div class="flex img-box">
          <span>{{favoritesCount.User || 0}}</span>
        </div>
        <span class="label">收藏的名片</span>
      </a>
      <a class="box"  @click="goShoppingCart()">
        <div class="flex img-box">
          <img src="../../assets/shoppingCar.png">
        </div>
        <span class="label">购物车</span>
      </a>
    </div>
    <div class="menu-container">
      <a
        class="row-item"
        @click="goFeedBack()">
        <div class="flex box">
          <img src="../../assets/feedBack.png">
        </div>
        <div class="item">
          <span>产品反馈</span>
          <i class="iconfont icon-fanhui arrow"></i>
        </div>
      </a>
      <a
        class="row-item"
        @click="contactUs()">
        <div class="flex box">
          <img src="../../assets/concatUs.png">
        </div>
        <div class="item">
          <span>联系我们</span>
          <span class="right">027-51111113</span>
        </div>
      </a>
      <a
        class="row-item"
        @click="helpCenter()">
        <div class="flex box">
          <img src="../../assets/helpCenter.png">
        </div>
        <div class="item">
          <span>帮助中心</span>
          <i class="iconfont icon-fanhui arrow"></i>
        </div>
      </a>
      <a
        class="row-item"
        @click="openProtocol()">
        <div class="flex box">
          <img src="../../assets/protocol.png">
        </div>
        <div class="item">
          <span>云庐使用条款和隐私政策</span>
          <i class="iconfont icon-fanhui arrow"></i>
        </div>
      </a>
    </div>
    <div class="logout-btn">
      <img src="../../assets/logOut.png" @click="logOutConfirm()">
    </div>
    <foot :has-link="true"></foot>
    <confirm-dialog
      v-if="showConfirm"
      :msg="confirmMsg"
      :okText="okText"
      :cancelText="cancelText"
      @click="handleConfirm">
    </confirm-dialog>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Foot from '../../components/footer/Foot'
  import ConfirmDialog from '../../components/common/ConfirmDialog'
  import { getStore, setStore, removeAllStore, removeStore, mobileClient } from '../../config/mUtils'
  export default {
    name: 'Mine',
    data () {
      return {
        currentUser: getStore('user'),
        token: getStore('user') ? getStore('user').authentication_token : '',
        favoritesCount: {
          Organization: 0,
          Product: 0,
          User: 0
        },
        orderFormsCount: {
          receipting: 0,
          receiving: 0,
          sending: 0,
          submiting: 0
        },
        showConfirm: false,
        confirmMsg: '确定要退出登录吗？',
        okText: '确定',
        cancelText: '取消'
      }
    },
    components: {
      Foot,
      ConfirmDialog
    },
    methods: {
      goBack () {
        if (getStore('Mine_goHome')) {
          removeStore('Mine_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      logOutConfirm () {
        this.showConfirm = true
      },
      handleConfirm (bool) {
        this.showConfirm = false
        if (bool) {
          this.logOut()
        }
      },
      logOut () {
        removeAllStore()
        this.$store.dispatch('switchLeanCloudStatus', {active: false})
        if (mobileClient() === 'weixin') {
          setStore('weixinLogin', 'true')
        }
        this.$store.dispatch('clearUnReadMsgCount', {})
        this.$router.replace({name: 'See'})
      },
      getFavoritesCount () {
        this.$store.dispatch('commonAction', {
          url: '/v1/favorites/count',
          method: 'get',
          params: {
            token: this.token
          },
          target: this,
          resolve: (state, res) => {
            this.favoritesCount = res.data.favorites
            this.orderFormsCount = res.data.order_forms
          },
          reject: () => {
          }
        })
      },
      contactUs () {
        this.$router.push({name: 'Download'})
      },
      helpCenter () {
        this.$router.push({name: 'Help', query: {from: 'web'}})
      },
      openProtocol () {
        this.$router.push({name: 'ProtocolMenu', query: {from: 'web'}})
      },
      goConversation () {
        this.$router.push({name: 'Conversation'})
      },
      goFavorite (index) {
        this.$router.push({name: 'Favorites', query: {index: index}})
      },
      goOrderForm (index) {
        this.$router.push({name: 'OrderForm', query: {index: index}})
      },
      goShoppingCart () {
        this.$router.push({name: 'ShoppingCart'})
      },
      goFeedBack () {
        this.$router.push({name: 'FeedBack'})
      }
    },
    mounted () {
      this.getFavoritesCount()
    },
    filters: {
      numFilter (val) {
        return val > 99 ? '···' : val
      }
    },
    computed: {
      ...mapGetters([
        'user',
        'unReadeMsgs'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .container {
    width: 100%;
    max-width: 540px;
    min-height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    overflow: auto;
    padding-bottom: 1px; // 避免安卓手机QQ浏览器，滑动到底部后第一次不能直接上滑的bug
    -webkit-overflow-scrolling: touch;
  }
  .user-info {
    position: relative;
    background: url("../../assets/mineBg.webp");
    @include px2rem(height, 453px);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
    .icons {
      @include pm2rem(padding, 38px, 36px, 0px, 30px);
      align-items: flex-start;
    }
    .icon-box {
      position: relative;
      i {
        color: $white;
        @include px2rem(font-size, 44px);
        line-height: normal;
      }
      .dot {
        @include px2rem(width, 16px);
        @include px2rem(height, 16px);
        @include px2rem(border-radius, 8px);
        position: absolute;
        @include px2rem(top, 0px);
        @include px2rem(right, -2px);
      }
    }
    .back {
      i {
        @include px2rem(font-size, 40px);
      }
    }
    .circle {
      @include px2rem(width, 178px);
      @include px2rem(height, 178px);
      @include px2rem(border-radius, 89px);
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      @include px2rem(top, 75px);
      left: 50%;
      transform: translateX(-50%);
      img {
        @include px2rem(width, 185px);
        @include px2rem(height, 185px);
        @include px2rem(border-radius, 92.5px);
      }
    }
    .content {
      @include px2rem(font-size, 40px);
      position: absolute;
      @include px2rem(top, 277px);
      width: 100%;
      text-align: center;
      color: $white;
    }
  }
  .form-wrapper {
    background-color: $white;
    @include px2rem(margin-top, 20px);
    border-top: 1px solid $third-grey;
    border-bottom: 1px solid $third-grey;
    .header {
      @include px2rem(height, 96px);
      @include pm2rem(margin, 0px, 30px, 0px, 30px);
      align-items: center;
      line-height: normal;
      border-bottom: 1px solid $third-grey;
      .title {
        @include px2rem(font-size, 32px);
        color: $primary-dark;
      }
      a {
        color: $third-dark;
        height: inherit;
        span {
          @include px2rem(font-size, 26px);
        }
        i {
          @include px2rem(font-size, 18px);
          @include px2rem(margin-left, 18px);
        }
      }
      & a:active {
        background-color: rgba(239, 234, 234, .5);
      }
    }
    .content {
      @include px2rem(height, 170px);
      @include pm2rem(padding, 0px, 10px, 0px, 10px);
      .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        @include pm2rem(padding, 40px, 0px, 30px, 0px);
        @include px2rem(width, 182.5px);
        box-sizing: border-box;
        height: inherit;
        position: relative;
        .img-box {
          @include px2rem(height, 46px);
          width: 100%;
        }
        .need-pay {
          @include px2rem(width, 52px);
          @include px2rem(height, 40px);
        }
        .need-send {
          @include px2rem(width, 46px);
          @include px2rem(height, 41px);
        }
        .need-receive {
          @include px2rem(width, 52px);
          @include px2rem(height, 40px);
        }
        .need-comment {
          @include px2rem(width, 46px);
          @include px2rem(height, 46px);
        }
        span {
          @include px2rem(font-size, 26px);
          color: $second-dark;
        }
        .bage {
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: normal;
          position: absolute;
          @include px2rem(top, 20px);
          @include px2rem(right, 20px);
          background-color: $red;
          color: $white;
          @include px2rem(width, 36px);
          @include px2rem(height, 36px);
          @include px2rem(border-radius, 18px);
          @include px2rem(font-size, 20px);
        }
      }
      & a:active {
        background-color: rgba(239, 234, 234, .5);
      }
    }
  }
  .favorites-wrapper {
    @include px2rem(height, 148px);
    @include pm2rem(padding, 0px, 5px, 0px, 5px);
    @include px2rem(margin-top, 20px);
    background-color: $white;
    .box {
      height: inherit;
      @include px2rem(width, 185px);
      @include pm2rem(padding, 30px, 0px, 24px, 0px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      .img-box {
        @include px2rem(height, 50px);
        span {
          @include px2rem(font-size, 30px);
          color: $primary-dark;
        }
        img {
          @include px2rem(width, 52px);
          @include px2rem(height, 47px);
        }
      }
      .label {
        @include px2rem(font-size, 26px);
        color: $second-dark;
      }
    }
    & a:active {
      background-color: rgba(239, 234, 234, .5);
    }
  }
  .menu-container {
    background-color: $white;
    border-top: 1px solid $primary-grey;
    @include px2rem(margin-top, 16px);
    .row-item {
      @include px2rem(height, 100px);
      display: flex;
      align-items: center;
      border-bottom: 1px solid $primary-grey;
      box-sizing: border-box;
      .box {
        @include pm2rem(margin, 0px, 30px, 0px, 30px);
        color: $second-dark;
        height: inherit;
        img {
          @include px2rem(width, 50px);
          @include px2rem(height, 50px);
        }
      }
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        span {
          @include px2rem(font-size, 30px);
          color: $second-dark;
          line-height: normal;
        }
        .right {
          @include px2rem(margin-right, 30px);
          color: $third-dark;
        }
        .arrow {
          transform: rotate(180deg);
          color: $fifth-grey;
          @include font-dpr(18px);
          @include px2rem(margin-right, 30px);
        }
      }
    }
    a:active {
      background-color: rgba(239, 234, 234, .5);
    }
  }
  .logout-btn {
    @include px2rem(margin-top, 60px);
    text-align: center;
    line-height: normal;
    img {
      @include px2rem(width, 550px);
      @include px2rem(height, 88px);
    }
  }
  .copyright {
    text-align: center;
    @include px2rem(margin-top, 268px);
    color: $fifth-grey;
    @include font-dpr(10px);
  }
</style>

