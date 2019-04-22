<template>
  <section class="card-wrapper">
    <div class="card" @click.stop="handleClick(store)">
      <div class="top">
        <div class="info-wrapper">
          <img :src="store.logo" class="logo">
          <div class="content">
            <p class="name">{{store.company}}</p>
            <div class="icon-box">
              <svg v-if="store && store.state && store.state === 'approved'" class="icon" aria-hidden="true">
                <use xlink:href="#icon-zhenshi4"></use>
              </svg>
              <svg v-else class="icon" aria-hidden="true">
                <use xlink:href="#icon-zhenshi3"></use>
              </svg>
            </div>
          </div>
        </div>
        <div v-if="sharer && sharer.role" class="role-wrapper">
          <p class="name">{{sharer.name}}</p>
          <p class="role">{{sharer.role}}</p>
        </div>
        <a class="qr-btn" @click.stop="clickQrCodeBtn(store)">
          <img src="../../assets/theme/gudianfenga/erweima.png">
        </a>
        <img class="nav-bar" src="../../assets/theme/gudianfenga/zixun.png" @click.stop="navClick(store.id, store.service.name, 0)">
      </div>
      <div class="bottom">
        <div class="icons-wrapper">
          <a v-if="isOnPc(store && store.mobile)" @click.stop="stopBubble" :href="'tel:' + store.mobile" class="icon-box flex">
            <img src="../../assets/theme/gudianfenga/dianhua.png">
          </a>
          <a v-if="store && store.qq" @click.stop="handleIconClick({type: 'qq', value: store.qq})" class="icon-box flex">
            <img src="../../assets/theme/gudianfenga/qq.png">
          </a>
          <a v-if="store && store.email" @click.stop="handleIconClick({type: 'email', value: store.email})" class="icon-box flex">
            <img src="../../assets/theme/gudianfenga/youxiang.png">
          </a>
          <a v-if="store && (store.address || store.longitude && store.latitude)" @click.stop="handleIconClick({type:'address', value: {longitude: store.longitude, latitude: store.latitude, address: store.address}})" class="icon-box flex">
            <img src="../../assets/theme/gudianfenga/dizhi.png">
          </a>
          <a v-if="store && store.website" @click.stop="handleIconClick({type: 'website', value: store.website})" class="icon-box flex">
            <img src="../../assets/theme/gudianfenga/wangzhi.png">
          </a>
        </div>
        <div class="items-wrapper ellipsis">
          <a v-for="(item, index) in store.suggestion_categories" :key="index" class="item" @click.stop="categoryClick(item)">{{item.category_name}}{{handleQoute(index, store.suggestion_categories)}}</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import {isPc} from '../../config/mUtils'
  export default {
    name: 'CardGudianfengA',
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
      isOnPc (bool) {
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
    background: url("../../assets/theme/gudianfenga/cardGudianfenga.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    .top {
      @include px2rem(height, 240px);
      width: 100%;
      position: relative;
    }
    .bottom {
      @include px2rem(height, 160px);
      width: 100%;
      position: relative;
    }
    .info-wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      @include px2rem(height, 100px);
      @include pm2rem(padding, 20px, 0px, 0px, 144px);
      box-sizing: border-box;
      .logo {
        @include px2rem(width, 80px);
        @include px2rem(height, 80px);
        border-radius: 50%;
        @include px2rem(margin-right, 18px);
      }
      .content {
        height: 100%;
        .name {
          @include px2rem(font-size, 28px);
          color: #42403B;
          @include px2rem(margin-bottom, 8px);
        }
        .icon-box {
          svg {
            @include px2rem(font-size, 28px);
          }
        }
      }
    }
    .role-wrapper {
      text-align: center;
      @include px2rem(margin-top, 30px);
      .name {
        color: #42403B;
        @include px2rem(font-size, 36px);
        font-weight: bold;
      }
      .role {
        @include px2rem(font-size, 26px);
        color: #83755A;
      }
    }
    .qr-btn {
      position: absolute;
      @include px2rem(padding, 8px);
      left: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        @include px2rem(width, 58px);
        @include px2rem(height, 58px);
      }
    }
    .nav-bar {
      @include px2rem(width, 104px);
      @include px2rem(height, 59px);
      position: absolute;
      right: 0;
      @include px2rem(bottom, 8px);
    }
    .icons-wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      @include pm2rem(padding, 10px, 0px, 0px, 34px);
      .icon-box {
        cursor: pointer;
        @include px2rem(width, 82px);
        @include px2rem(height, 82px);
        img {
          @include px2rem(width, 42px);
          @include px2rem(height, 42px);
        }
      }
      & a:active {
        background-color: rgba(239, 234, 234, .5);
      }
    }
    .items-wrapper {
      position: absolute;
      bottom: 0;
      @include pm2rem(padding, 0px, 26px, 0px, 26px);
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      a {
        @include px2rem(font-size, 26px);
        color: #FEFEFE;
        @include px2rem(line-height, 58px);
        @include px2rem(margin-right, 20px);
      }
      & :last-child {
        margin-right: 0;
      }
    }
  }
</style>
