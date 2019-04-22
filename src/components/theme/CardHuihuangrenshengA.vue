<template>
  <section class="card-wrapper">
    <div class="card" @click.stop="handleClick(store)">
      <div class="info-wrapper">
        <div class="wrapper">
          <img :src="store.logo" class="logo">
          <div class="level">
            <svg v-if="store && store.state && store.state === 'approved'" class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhenshi4"></use>
            </svg>
            <svg v-else class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhenshi3"></use>
            </svg>
          </div>
          <p class="name ellipsis">{{store.company}}</p>
          <div v-if="sharer && sharer.role" class="role-wrapper">
            <p class="user">{{sharer.name}}</p>
            <p class="role">{{sharer.role}}</p>
          </div>
          <a class="qr-code flex" @click.stop="clickQrCodeBtn(store)">
            <img src="../../assets/theme/huihuangrenshenga/erweima.png">
          </a>
        </div>
      </div>
      <div class="options-wrapper">
        <div class="wrapper">
          <img src="../../assets/theme/huihuangrenshenga/zixun.png" class="img-btn" @click.stop="navClick(store.id, store.service.name, 0)">
          <a v-if="first" @click.stop="stopBubble" :href="'tel:' + store.mobile" class="dianhua">
            <img src="../../assets/theme/huihuangrenshenga/dianhua.png">
          </a>
          <img v-if="second" src="../../assets/theme/huihuangrenshenga/youxiang.png" class="btn" :class="{'second': first}" @click.stop="handleIconClick({type: 'email', value: store.email})">
          <img v-if="third" src="../../assets/theme/huihuangrenshenga/dizhi.png" class="btn" :class="{'second': handleArray(1, [first, second]),'third': handleArray(2, [first, second])}" @click.stop="handleIconClick({type:'address', value: {longitude: store.longitude, latitude: store.latitude, address: store.address}})">
          <img v-if="fourth" src="../../assets/theme/huihuangrenshenga/wangzhi.png" class="btn" :class="{'second': handleArray(1, [first, second, third]), 'third': handleArray(2, [first, second, third]), 'fourth': handleArray(3, [first, second, third])}" @click.stop="handleIconClick({type: 'website', value: store.website})">
          <img v-if="fifth" src="../../assets/theme/huihuangrenshenga/qq.png" class="btn" :class="{'second':  handleArray(1, [first, second, third, fourth]), 'third': handleArray(2, [first, second, third]), 'fourth': handleArray(3, [first, second, third]), 'fifth': handleArray(4, [first, second, third, fourth])}" @click.stop="handleIconClick({type: 'qq', value: store.qq})">
        </div>
      </div>
      <div class="items-wrapper ellipsis">
        <a v-for="(item, index) in store.suggestion_categories" :key="index" @click.stop="categoryClick(item)">{{item.category_name}}{{handleQoute(index, store.suggestion_categories)}}</a>
      </div>
    </div>
  </section>
</template>

<script>
  import {isPc} from '../../config/mUtils'
  export default {
    name: 'CardHuihuangrenshengA',
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
      },
      handleArray (num, arr) {
        return arr.filter(i => !!i === true).length === num
      }
    },
    computed: {
      first: function () {
        return this.isOnMobile(this.store && this.store.mobile)
      },
      second: function () {
        return this.store && this.store.email
      },
      third: function () {
        return this.store && (this.store.address || (this.store.longitude && this.store.latitude))
      },
      fourth: function () {
        return this.store && this.store.website
      },
      fifth: function () {
        return this.store && this.store.qq
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
    background: url("../../assets/theme/huihuangrenshenga/cardHuihuangrenshenga.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    position: relative;
  }
  .info-wrapper {
    @include px2rem(width, 464px);
    @include px2rem(height, 340px);
    position: absolute;
    left: 0;
    top: 0;
    .wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      .logo {
        position: absolute;
        @include px2rem(top, 24px);
        @include px2rem(width, 82px);
        @include px2rem(height, 82px);
        border-radius: 50%;
        left: 50%;
        transform: translateX(-50%);
      }
      .level {
        position: absolute;
        @include px2rem(top, 74px);
        @include px2rem(left, 280px);
        svg {
          @include px2rem(width, 30px);
          @include px2rem(height, 30px);
          @include px2rem(font-size, 30px);
        }
      }
      .name {
        text-align: center;
        @include px2rem(font-size, 28px);
        color: $white;
        position: absolute;
        @include px2rem(top, 116px);
        width: 100%;
        @include pm2rem(padding, 0px, 20px, 0px, 20px);
        box-sizing: border-box;
      }
      .role-wrapper {
        position: absolute;
        @include px2rem(top, 188px);
        width: 100%;
        text-align: center;
        .user {
          color: #FEFFFF;
          @include px2rem(font-size, 34px);
          font-weight: bold;
        }
        .role {
          color: #C4BCBC;
          @include px2rem(font-size, 22px);
        }
      }
      .qr-code {
        position: absolute;
        @include px2rem(height, 90px);
        @include px2rem(width, 90px);
        @include px2rem(left, 10px);
        @include px2rem(bottom, 10px);
        img {
          @include px2rem(width, 76px);
          @include px2rem(height, 76px);
        }
      }
      & a:active {
        background-color: rgba(115, 109, 108, .6);
      }
    }
  }
  .options-wrapper {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    @include px2rem(width, 252px);
    .wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      .img-btn {
        position: absolute;
        @include px2rem(right, 26px);
        @include px2rem(top, 26px);
        @include px2rem(width, 58px);
        @include px2rem(height, 26px);
      }
      .btn {
        position: absolute;
        @include px2rem(width, 106px);
        @include px2rem(height, 62px);
        @include px2rem(top, 8px);
        left: 0;
      }
      .dianhua {
        position: absolute;
        left: 0;
        @include px2rem(top, 8px);
        display: block;
        @include px2rem(width, 106px);
        @include px2rem(height, 62px);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .first {
        left: 0;
        @include px2rem(top, 8px);
      }
      .second {
        @include px2rem(left, 25px);
        @include px2rem(top, 74.5px);
      }
      .third {
        @include px2rem(left, 50px);
        @include px2rem(top, 141.5px);
      }
      .fourth {
        @include px2rem(left, 75px);
        @include px2rem(top, 208px);
      }
      .fifth {
        @include px2rem(left, 100px);
        @include px2rem(top, 274.5px);
      }
    }
  }
  .items-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    @include px2rem(width, 464px);
    @include px2rem(height, 64px);
    @include px2rem(padding-left, 27px);
    box-sizing: border-box;
    @include px2rem(line-height, 64px);
    @include px2rem(font-size, 24px);
    color: #322C2B;
  }
</style>
