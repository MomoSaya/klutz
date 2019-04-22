<template>
  <section class="card-wrapper">
    <div class="card" @click.stop="handleClick(store)">
      <div class="top">
        <img :src="store.logo" class="logo">
        <p class="name ellipsis">{{store.company}}</p>
      </div>
      <div class="middle">
        <div class="left">
          <div v-if="sharer && sharer.role" class="role-wrapper">
            <span class="name">{{sharer.name}}</span>
            <span class="role">{{sharer.role}}</span>
          </div>
          <div class="items-wrapper ellipsis">
            <a v-for="(item, index) in store.suggestion_categories" :key="index" @click.stop="categoryClick(item)">{{item.category_name}}{{handleQoute(index, store.suggestion_categories)}}</a>
          </div>
        </div>
        <a class="right flex" @click.stop="clickQrCodeBtn(store)">
          <img src="../../assets/theme/duobianxingjianbiana/erweima.png">
        </a>
      </div>
      <div class="bottom">
        <div class="level">
          <svg v-if="store && store.state && store.state === 'approved'" class="icon" aria-hidden="true">
            <use xlink:href="#icon-zhenshi4"></use>
          </svg>
          <svg v-else class="icon" aria-hidden="true">
            <use xlink:href="#icon-zhenshi3"></use>
          </svg>
        </div>
        <div class="options-wrapper">
          <div class="icons-wrapper">
            <a v-if="isOnMobile(store && store.mobile)" @click.stop="stopBubble" :href="'tel:' + store.mobile" class="icon-box flex">
              <img src="../../assets/theme/duobianxingjianbiana/dianhua.png">
            </a>
            <a v-if="store && store.qq" @click.stop="handleIconClick({type: 'qq', value: store.qq})" class="icon-box flex">
              <img src="../../assets/theme/duobianxingjianbiana/qq.png">
            </a>
            <a v-if="store && store.email" @click.stop="handleIconClick({type: 'email', value: store.email})" class="icon-box flex">
              <img src="../../assets/theme/duobianxingjianbiana/youxiang.png">
            </a>
            <a v-if="store && (store.address || store.longitude && store.latitude)" @click.stop="handleIconClick({type:'address', value: {longitude: store.longitude, latitude: store.latitude, address: store.address}})" class="icon-box flex">
              <img src="../../assets/theme/duobianxingjianbiana/dizhi.png">
            </a>
            <a v-if="store && store.website" @click.stop="handleIconClick({type: 'website', value: store.website})" class="icon-box flex">
              <img src="../../assets/theme/duobianxingjianbiana/wangzhi.png">
            </a>
          </div>
          <img src="../../assets/theme/duobianxingjianbiana/zixun.png" class="img-btn" @click.stop="navClick(store.id, store.service.name, 0)">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import {isPc} from '../../config/mUtils'
  export default {
    name: 'CardDuobianxingjianbianA',
    props: {
      store: {
        default: () => {},
        type: Object,
        required: true
      },
      sharer: {
        default: () => {},
        type: Object
      }
    },
    data () {
      return {
      }
    },
    methods: {
      stopBubble (e) {
        e.stopPropagation()
      },
      handleClick (item) {
        this.$emit('click', item.enterprise_id)
      },
      clickQrCodeBtn (obj) {
        this.$emit('qr-code', obj)
      },
      handleIconClick (obj) {
        this.$emit('icon-click', obj)
      },
      isOnMobile (bool) {
        return !isPc() && bool
      },
      navClick (id, type, index) {
        this.$emit('nav', {id, type, index})
      },
      categoryClick (item) {
        this.$emit('go-category', item)
      },
      handleQoute (index, arr) {
        return index < arr.length - 1 ? ';' : ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .card-wrapper {
    @include pm2rem(padding, 12px, 16px, 30px, 16px);
    box-sizing: border-box;
  }
  .card {
    @include px2rem(width, 716px);
    @include px2rem(height, 403px);
    background: url("../../assets/theme/duobianxingjianbiana/cardDuobianxingjianbiana.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    position: relative;
  }
  .top {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    @include px2rem(height, 80px);
    width: 100%;
    @include px2rem(top, 14px);
    left: 0;
    .logo {
      @include px2rem(height, 80px);
      @include px2rem(width, 80px);
      border-radius: 50%;
      @include pm2rem(margin, 0px, 12px, 0px, 24px);
    }
    .name {
      width: 65%;
      @include px2rem(font-size, 28px);
      color: #3B3D36;
      font-weight: bold;
    }
  }
  .middle {
    position: absolute;
    @include px2rem(top, 173px);
    left: 0;
    @include px2rem(height, 80px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    @include px2rem(padding-left, 50px);
    width: 100%;
    box-sizing: border-box;
    .left {
      height: inherit;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      width: 65%;
      .role-wrapper {
        color: #393C34;
        line-height: normal;
        .name {
          @include px2rem(font-size, 34px);
          @include px2rem(margin-right, 26px);
          font-weight: bold;
        }
        .role {
          @include px2rem(font-size, 24px);
        }
      }
      .items-wrapper {
        box-sizing: border-box;
        width: 100%;
        @include px2rem(font-size, 25px);
        color: #3B3D36;
      }
    }
    .right {
      height: inherit;
      @include px2rem(width, 80px);
      @include px2rem(margin-right, 10px);
      img {
        @include px2rem(width, 66px);
        @include px2rem(height, 66px);
      }
    }
    & a:active {
      background-color: rgba(239, 234, 234, .5);
    }
  }
  .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    @include px2rem(height, 140px);
    .level {
      @include px2rem(padding-left, 50px);
      @include px2rem(margin-top, 10px);
      svg {
        @include px2rem(width, 30px);
        @include px2rem(height, 30px);
        @include px2rem(font-size, 30px);
      }
    }
    .options-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      @include px2rem(padding-left, 42px);
      position: absolute;
      @include px2rem(bottom, 16px);
      width: 100%;
      left: 0;
      box-sizing: border-box;
      .icons-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .icon-box {
          @include px2rem(height, 70px);
          @include px2rem(width, 70px);
          @include px2rem(margin-right, 14px);
          img {
            @include px2rem(width, 70px);
            @include px2rem(height, 70px);
          }
        }
      }
      .img-btn {
        @include px2rem(width, 111px);
        @include px2rem(height, 62px);
      }
    }
  }
</style>
