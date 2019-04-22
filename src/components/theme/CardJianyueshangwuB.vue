<template>
  <section class="card-wrapper">
    <div class="card" @click.stop="handleClick(store)">
      <div class="left">
        <div class="top">
          <div class="info-wrapper">
            <div class="name-wrapper">
              <img :src="store.logo" class="logo">
              <div class="content">
                <p class="name ellipsis">{{store.company}}</p>
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
              <span class="name">{{sharer.name}}</span>
              <span class="role">{{sharer.role}}</span>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="items-wrapper ellipsis">
            <a v-for="(item, index) in store.suggestion_categories" :key="index" @click.stop="categoryClick(item)">{{item.category_name}}{{handleQoute(index, store.suggestion_categories)}}</a>
          </div>
          <div class="icons-wrapper">
            <a v-if="isOnPc(store && store.mobile)" @click.stop="stopBubble" :href="'tel:' + store.mobile" class="icon-box flex">
              <img src="../../assets/theme/jianyueshangwub/dianhua.png">
            </a>
            <a v-if="store && store.qq" @click.stop="handleIconClick({type: 'qq', value: store.qq})" class="icon-box flex">
              <img src="../../assets/theme/jianyueshangwub/qq.png">
            </a>
            <a v-if="store && store.email" @click.stop="handleIconClick({type: 'email', value: store.email})" class="icon-box flex">
              <img src="../../assets/theme/jianyueshangwub/youxiang.png">
            </a>
            <a v-if="store && (store.address || store.longitude && store.latitude)" @click.stop="handleIconClick({type:'address', value: {longitude: store.longitude, latitude: store.latitude, address: store.address}})" class="icon-box flex">
              <img src="../../assets/theme/jianyueshangwub/dizhi.png">
            </a>
            <a v-if="store && store.website" @click.stop="handleIconClick({type: 'website', value: store.website})" class="icon-box flex">
              <img src="../../assets/theme/jianyueshangwub/wangzhi.png">
            </a>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="option-wrapper">
          <a class="img-btn" @click.stop="clickQrCodeBtn(store)">
            <img src="../../assets/theme/jianyueshangwub/erweima.png" class="qr-img">
          </a>
          <div class="btn-group">
            <img src="../../assets/theme/jianyueshangwub/zixun.png" class="btn" @click.stop="navClick(store.id, store.service.name, 0)">
            <img src="../../assets/theme/jianyueshangwub/banjichengyuan.png" class="btn" @click.stop="navClick(store.id, store.service.name, 1)">
            <img src="../../assets/theme/jianyueshangwub/tongxueqiye.png" class="btn" @click.stop="navClick(store.id, store.service.name, 2)">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import {isPc} from '../../config/mUtils'
  export default {
    name: 'CardJianyueshangwu',
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
    background: url("../../assets/theme/jianyueshangwub/cardJianyueshangwub.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    position: relative;
  }
  .left {
    @include px2rem(width, 605px);
    height: 100%;
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
  }
  .right {
    @include px2rem(width, 112px);
    display: inline-block;
    position: absolute;
    right: 0;
    top: 0;
  }
  .top {
    display: flex;
  }
  .info-wrapper {
    @include px2rem(padding-top, 23px);
    @include px2rem(width, 600px);
    @include px2rem(height, 228px);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    .name-wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      @include px2rem(height, 88px);
      width: 100%;
      .logo {
        @include px2rem(width, 88px);
        @include px2rem(height, 88px);
        @include px2rem(border-radius, 7px);
        @include pm2rem(margin, 0px, 20px, 0px, 26px);
      }
      .content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        height: 100%;
        width: 75%;
        .name {
          @include px2rem(font-size, 28px);
          color: $primary-dark;
          font-weight: bold;
          @include px2rem(margin-bottom, 6px);
          width: 100%;
        }
        .icon-box {
          svg {
            @include px2rem(width, 30px);
            @include px2rem(height, 30px);
            @include px2rem(font-size, 30px);
          }
        }
      }
    }
    .role-wrapper {
      @include pm2rem(padding, 0px, 0px, 10px, 26px);
      .name {
        @include px2rem(font-size, 34px);
        color: $primary-dark;
        font-weight: bold;
        @include px2rem(margin-right, 20px);
      }
      .role {
        @include px2rem(font-size, 26px);
        color: $primary-dark;
      }
    }
  }
  .option-wrapper {
    flex: 1;
    position: relative;
    @include px2rem(height, 403px);
    width: 100%;
    text-align: center;
    .img-btn {
      @include px2rem(padding, 20px);
      display: flex;
      justify-content: center;
      align-items: center;
      @include px2rem(margin-top, 3px);
      .qr-img {
        @include px2rem(width, 63px);
        @include px2rem(height, 63px);
      }
    }
    & a:active {
      background-color: rgba(239, 234, 234, .5);
    }
    .btn-group {
      width: 100%;
      @include px2rem(padding-top, 2px);
      .btn {
        @include px2rem(width, 68px);
        @include px2rem(height, 68px);
        border-radius: 50%;
        display: block;
        margin: 0 auto;
        @include px2rem(margin-bottom, 20px);
      }
    }
  }
  .bottom {
    @include px2rem(height, 164px);
    width: 100%;
    position: relative;
    .items-wrapper {
      @include pm2rem(padding, 0px, 26px, 0px, 26px);
      box-sizing: border-box;
      width: 100%;
      a {
        @include px2rem(font-size, 26px);
        color: $primary-dark;
        @include px2rem(line-height, 80px);
        @include px2rem(margin-right, 20px);
      }
      & :last-child {
        margin-right: 0;
      }
    }
    .icons-wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: absolute;
      @include px2rem(left, 20px);
      @include px2rem(bottom, 16px);
      .icon-box {
        cursor: pointer;
        @include px2rem(width, 70px);
        @include px2rem(height, 70px);
        @include px2rem(margin-right, 14px);
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
