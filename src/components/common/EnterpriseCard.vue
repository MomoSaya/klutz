<template>
  <section class="card white-bg">
    <div class="user-info" @click.stop="handleClick(store)">
      <div class="img-container flex">
        <img v-if="store && store.logo" :src="store.logo"/>
        <div v-else></div>
      </div>
      <div class="content">
        <p v-if="store && store.company" class="font-17 name">{{store.company}}</p>
        <div v-else>
          <p class="font-17 empty-name"></p>
          <p class="font-17 empty-name"></p>
        </div>
        <div class="icon-container">
          <div v-if="!store || !store.state" class="svg"></div>
          <template v-else-if="store && store.state && store.state !== 'approved'">
            <svg class="icon large" aria-hidden="true">
              <use xlink:href="#icon-zhenshi3"></use>
            </svg>
          </template>
          <template v-else-if="store && store.state && store.state === 'approved'">
            <svg class="icon large" aria-hidden="true">
              <use xlink:href="#icon-zhenshi4"></use>
            </svg>
          </template>
        </div>
      </div>
    </div>
    <div class="icons">
      <a
        v-if="products && products.length > 0 && store && store.service && store.service.name !== '协会' && store.service.name !== '校友会' && store.service.name !== '班级'"
        @click="handleIconClick({type: 'chat', value: products[0].id})"
        class="icon-box">
        <i class="iconfont icon-huihua2 huihua"></i>
      </a>
      <a
        v-if="isOnPc(store && store.mobile)"
        :href="'tel:' + store.mobile"
        class="icon-box">
        <i class="iconfont icon-dianhua2 dianhua"></i>
      </a>
      <a
        v-if="store && store.qq"
        @click="handleIconClick({type: 'qq', value: store.qq})"
        class="icon-box">
        <i class="iconfont icon-qq1 qq"></i>
      </a>
      <a
        v-if="store && store.email"
        @click="handleIconClick({type: 'email', value: store.email})"
        class="icon-box">
        <i class="iconfont icon-youxiang1 youxiang"></i>
      </a>
      <a
        v-if="store && (store.address || store.longitude && store.latitude)"
        @click="handleIconClick({type:'address', value: {longitude: store.longitude, latitude: store.latitude, address: store.address}})"
        class="icon-box">
        <i class="iconfont icon-dingwei2 dingwei"></i>
      </a>
      <a
        v-if="store && store.website"
        @click="handleIconClick({type: 'website', value: store.website})"
        class="icon-box">
        <i class="iconfont icon-wangluo wangluo"></i>
      </a>
      <div v-else-if="!store" class="tips">&nbsp;</div>
      <div v-else-if="!hasLink" class="tips">暂无联系方式</div>
    </div>
  </section>
</template>

<script>
  import { isPc } from '../../config/mUtils'
  export default {
    data () {
      return {}
    },
    props: ['store', 'products'],
    methods: {
      handleClick (item) {
        this.$emit('click', item.enterprise_id)
      },
      handleIconClick (obj) {
        this.$emit('icon-click', obj)
      },
      isOnPc (bool) {
        return !isPc() && bool
      }
    },
    computed: {
      hasLink () {
        // 机构中，只有企业与商城支持与客服会话
        return !!this.store.id && ((this.products && this.products.length > 0 && this.store.service.name !== '协会' && this.store.service.name !== '校友会' && this.store.service.name !== '班级') || ((!!this.store.mobile && !isPc()) || !!this.store.email || !!this.store.address || !!this.store.longitude || !!this.store.latitude || !!this.store.wechat || !!this.store.website || !!this.store.qq))
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .card {
    border: 1px solid $third-grey;
    @include px2rem(padding-top, 40px);
    box-shadow: 0 1px 5px rgba(119, 113, 113, 0.1), 0 2px 2px rgba(189, 188, 188, 0.1), 0 3px 1px -2px rgba(245, 243, 243, 0.1);
    .user-info {
      display: flex;
      @include pm2rem(padding, 0px, 26px, 40px, 26px);
      .img-container {
        @include px2rem(width, 180px);
        @include px2rem(height, 180px);
        div {
          background-color: $ninth-grey;
        }
        div, img {
          @include px2rem(max-width, 180px);
          @include px2rem(max-height, 180px);
          width: 100%;
          height: 100%;
        }
      }
      .content {
        display: flex;
        flex: 1;
        @include px2rem(margin-left, 26px);
        @include px2rem(width, 448px);
        @include px2rem(height, 185px);
        flex-direction: column;
        .name {
          line-height: 1.5;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
          float: left;
          @include px2rem(height, 140px);
        }
        .empty-name {
          @include px2rem(width, 400px);
          @include px2rem(height, 40px);
          @include px2rem(margin-bottom, 10px);
          background-color: $ninth-grey;
          &:last-child {
            margin-bottom: 0;
          }
        }
        .icon-container {
          display: flex;
          align-items: center;
          line-height: 1;
          .large {
            @include font-dpr(23px);
          }
        }
        .svg {
          display: block;
          @include px2rem(height, 50px);
          @include px2rem(width, 50px);
          @include px2rem(border-radius, 25px);
          @include pm2rem(margin, 20px, 18px, 30px, 0px);
          background-color: $ninth-grey;
        }
        svg {
          @include pm2rem(margin, 20px, 18px, 30px, 0px);
        }
      }
    }

    .icons {
      display: flex;
      @include px2rem(height, 100px);
      @include pm2rem(padding, 0px, 27px, 0px, 27px);
      justify-content: flex-start;
      align-items: center;
      border-top: 1px solid $third-grey;
      a {
        text-decoration: none;
        @include px2rem(width, 108px);
        display: flex;
        align-items: center;
        justify-content: center;
        height: inherit;
      }
      a:active {
        background-color: rgba(239, 234, 234, .5);
      }
      i {
        @include font-dpr(24px);
      }
      .huihua {
        color: #d52eff;
      }
      .dianhua {
        color: #31C27C;
      }
      .youxiang {
        color: #4C8DE7;
      }
      .dingwei {
        color: $red;
      }
      .weixin {
        color: #2EB6FC;
      }
      .wangluo {
        color: #D52EFF;
      }
      .qq {
        color: #F9B000;
      }
      .tips {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: inherit;
        height: inherit;
        line-height: 1;
        @include font-dpr(13px);
        color: $third-dark;
      }
    }
  }
</style>
