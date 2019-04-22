<template>
  <section class="card-wrapper">
    <div class="card">
      <div class="user-info">
        <img
          class="user-avatar"
          v-if="store && store.avatar_url"
          :src="store.avatar_url">
        <div
          v-else
          class="avatar-loading">
        </div>
        <div class="content">
          <p class="name ellipsis" v-if="store && store.name">{{store.name}}</p>
          <p v-else class="empty-name">&nbsp;</p>
          <div class="content-info">
            <div class="level">
              <div v-if="!store || !store.name" class="svg">&nbsp;</div>
              <svg v-else-if="store && store.mobiles && store.mobiles.length > 0" class="icon large" aria-hidden="true">
                <use xlink:href="#icon-zhenshi"></use>
              </svg>
              <svg v-else-if="(store && store.mobiles && store.mobiles.length === 0) || (store && !store.mobiles)" class="icon large" aria-hidden="true">
                <use xlink:href="#icon-zhenshi3"></use>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="icon-wrapper">
        <a v-if="store && store.id" @click="handleClick({'type': 'chat', 'value': store.id, 'inContact': typeof store.id === 'number'})" class="icon-box flex">
          <img src="../../assets/huihua.png">
        </a>
        <a v-if="store && store.qq" @click="handleClick({'type': 'qq', 'value': store.qq})" class="icon-box flex">
          <img src="../../assets/qqIcon.png">
        </a>
        <a v-if="store && store.email" @click="handleClick({'type': 'email', 'value': store.email})" class="icon-box flex">
          <img src="../../assets/youxiang.png">
        </a>
        <a v-if="store && store.address" @click="handleClick({'type': 'address', 'value': store.address})" class="icon-box flex">
          <img src="../../assets/dingwei.png">
        </a>
        <div v-else-if="!store" class="tips">&nbsp;</div>
        <div v-else-if="!hasLink" class="tips">暂无联系方式</div>
      </div>
    </div>
  </section>
</template>

<script>
  import { isPc } from '../../config/mUtils'
  export default {
    data () {
      return {}
    },
    props: ['store'],
    methods: {
      handleClick (obj) {
        this.$emit('click', obj)
      },
      isOnPc (bool) {
        return !isPc() && bool
      }
    },
    mountd: {
    },
    computed: {
      hasLink () {
        return this.store && ((this.store.mobiles && this.store.mobiles.length > 0 && !isPc()) || !!this.store.id || !!this.store.email || !!this.store.address || !!this.store.qq)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .card-wrapper {
    @include pm2rem(padding, 12px, 16px, 30px, 16px);
    box-sizing: border-box;
    .card {
      @include px2rem(width, 718px);
      @include px2rem(height, 296px);
      box-sizing: border-box;
      background-color: $white;
      position: relative;
      @include px2rem(border-radius, 14px);
      box-shadow: -8px 0px 10px -4px rgba(220, 220, 220, 0.4), 8px 0px 10px -4px rgba(220, 220, 220, 0.4), 0px 10px 10px -2px rgba(216, 216, 216, 0.4);
      .user-info {
        @include px2rem(height, 180px);
        @include pm2rem(padding, 24px, 0px, 0px, 28px);
        width: 100%;
        box-sizing: border-box;
        display: flex;
        .user-avatar {
          @include px2rem(width, 138px);
          @include px2rem(height, 138px);
          @include px2rem(border-radius, 69px);
          display: flex;
          align-self: center;
        }
        .avatar-loading {
          @include px2rem(width, 138px);
          @include px2rem(height, 138px);
          @include px2rem(border-radius, 69px);
          background-color: $ninth-grey;
          display: flex;
          align-self: center;
        }
        .content {
          display: flex;
          flex-direction: column;
          flex: 1;
          @include px2rem(padding-left, 30px);
          .name {
            @include px2rem(font-size, 32px);
            color: $primary-dark;
            @include px2rem(width, 460px);
            line-height: normal;
            font-weight: bold;
          }
          .empty-name {
            @include px2rem(width, 300px);
            @include px2rem(height, 32px);
            background-color: $ninth-grey;
            @include pm2rem(margin, 6px, 0px, 6px, 0px);
          }
          .content-info {
            display: flex;
            flex: 1;
            flex-direction: column;
            .level {
              @include px2rem(padding-top, 20px);
              .svg {
                display: block;
                @include px2rem(height, 36px);
                @include px2rem(width, 36px);
                border-radius: 50%;
                background-color: $ninth-grey;
              }
              .large {
                @include px2rem(font-size, 36px);
                @include px2rem(margin-right, 34px);
              }
            }
          }
        }
      }
      .icon-wrapper {
        @include pm2rem(padding, 20px, 44px, 6px, 44px);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .icon-box {
          cursor: pointer;
          @include px2rem(width, 98px);
          @include px2rem(height, 86px);
          img {
            @include px2rem(width, 40px);
            @include px2rem(height, 40px);
          }
        }
        .tips {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: inherit;
          line-height: normal;
          @include px2rem(font-size, 26px);
          @include px2rem(height, 86px);
          color: $third-dark;
        }
        & a:active {
          background-color: rgba(239, 234, 234, 0.5);
        }
      }
    }
  }
</style>
