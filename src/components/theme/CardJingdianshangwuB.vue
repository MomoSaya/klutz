<template>
  <section class="card-wrapper">
    <div class="card" @click.stop="handleClick(store)">
      <div class="left">
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
        <div class="items-wrapper ellipsis">
          <a v-for="(item, index) in store.suggestion_categories" :key="index" @click.stop="categoryClick(item)">{{item.category_name}}{{handleQoute(index, store.suggestion_categories)}}</a>
        </div>
        <div class="icons-wrapper">
          <a v-if="isOnPc(store && store.mobile)" @click.stop="stopBubble" :href="'tel:' + store.mobile" class="icon-box flex">
            <img src="../../assets/theme/jingdianshangwuc/dianhua.png">
          </a>
          <a v-if="store && store.qq" @click.stop="handleIconClick({type: 'qq', value: store.qq})" class="icon-box flex">
            <img src="../../assets/theme/jingdianshangwuc/qq.png">
          </a>
          <a v-if="store && store.email" @click.stop="handleIconClick({type: 'email', value: store.email})" class="icon-box flex">
            <img src="../../assets/theme/jingdianshangwuc/youxiang.png">
          </a>
          <a v-if="store && (store.address || store.longitude && store.latitude)" @click.stop="handleIconClick({type:'address', value: {longitude: store.longitude, latitude: store.latitude, address: store.address}})" class="icon-box flex">
            <img src="../../assets/theme/jingdianshangwuc/dizhi.png">
          </a>
          <a v-if="store && store.website" @click.stop="handleIconClick({type: 'website', value: store.website})" class="icon-box flex">
            <img src="../../assets/theme/jingdianshangwuc/wangzhi.png">
          </a>
        </div>
      </div>
      <div class="right btn-group">
        <a class="img-btn" @click.stop="clickQrCodeBtn(store)">
          <img src="../../assets/theme/jingdianshangwuc/erweima.png" class="qr-img">
        </a>
        <img src="../../assets/theme/jingdianshangwuc/zixun.png" class="btn" @click.stop="navClick(store.id, store.service.name, 0)">
        <img src="../../assets/theme/jingdianshangwuc/xiaoyoubanji.png" class="btn" @click.stop="navClick(store.id, store.service.name, 1)">
        <img src="../../assets/theme/jingdianshangwuc/xiaoyouqiye.png" class="btn" @click.stop="navClick(store.id, store.service.name, 2)">
      </div>
    </div>
  </section>
</template>

<script>
  import {isPc} from '../../config/mUtils'
  export default {
    name: 'CardJingdianshangwuB',
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
    background: url("../../assets/theme/jingdianshangwuc/cardJingdianshangwuc.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    position: relative;
  }
  .left {
    @include px2rem(width, 596px);
    height: 100%;
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
  }
  .right {
    @include px2rem(width, 120px);
    display: inline-block;
    position: absolute;
    right: 0;
    top: 0;
  }
  .name-wrapper {
    @include px2rem(height, 107px);
    width: 100%;
    @include pm2rem(padding, 27px, 0px, 0px, 34px);
    display: flex;
    box-sizing: border-box;
    .logo {
      @include px2rem(height, 80px);
      @include px2rem(width, 80px);
      @include px2rem(border-radius, 7px);
      @include px2rem(margin-right, 18px);
    }
    .content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      height: 100%;
      width: 79%;
      .name {
        @include px2rem(font-size, 28px);
        color: #1A2F73;
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
    text-align: center;
    @include px2rem(margin-top, 72px);
    .name {
      @include px2rem(font-size, 34px);
      color: #1A2F73;
      @include px2rem(margin-right, 12px);
      font-weight: bold;
    }
    .role {
      @include px2rem(font-size, 24px);
      color: #1A2F73;
    }
  }
  .items-wrapper {
    position: absolute;
    @include px2rem(height, 80px);
    @include px2rem(bottom, 100px);
    text-align: center;
    width: 100%;
    a {
      @include px2rem(font-size, 26px);
      color: #5A6FB1;
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
    @include px2rem(left, 26px);
    @include px2rem(bottom, 24px);
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
  .btn-group {
    @include px2rem(padding-top, 20px);
    .img-btn {
      display: block;
      @include px2rem(padding, 10px);
      @include px2rem(width, 83px);
      @include px2rem(height, 83px);
      margin: 0 auto;
      @include px2rem(margin-bottom, 17px);
      box-sizing: border-box;
      .qr-img {
        width: 100%;
        height: 100%;
      }
    }
    & a:active {
      background-color: rgba(239, 234, 234, .5);
    }
    .btn {
      @include px2rem(width, 68px);
      @include px2rem(height, 68px);
      border-radius: 50%;
      display: block;
      margin: 0 auto;
      @include px2rem(margin-bottom, 25px);
    }
  }
</style>
