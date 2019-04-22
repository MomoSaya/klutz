<template>
  <transition name="router-fade">
    <section v-if="show" class="download-bar-container full-width">
      <div class="wrapper">
        <div class="flex content">
          <img v-if="!detail" src="../../assets/yunluLogo.png">
          <img v-else :src="detail.logo">
          <div class="flex-between info">
            <p class="name">{{detail ? detail.name : '云庐'}}</p>
            <p class="tips">邀请你注册获取积分换商品</p>
          </div>
        </div>
        <a class="flex close" @click="close()">
          <i class="iconfont icon-guanbi"></i>
        </a>
        <a class="absolute-vertical flex btn" @click="goRegist()">注册</a>
      </div>
    </section>
  </transition>
</template>

<script>
  export default {
    name: 'RegistBar',
    props: {
      show: {
        default: false
      },
      detail: {
        default: null
      }
    },
    data () {
      return {

      }
    },
    methods: {
      close () {
        this.$emit('close')
      },
      goRegist () {
        this.$emit('regist')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .download-bar-container {
    position: fixed;
    top: 0;
    z-index: 1005;
    .wrapper {
      position: relative;
      @include px2rem(height, 120px);
      @include px2rem(width, 750px);
      background-color: $white;
      box-shadow: 0 1px 5px rgba(0, 0, 0, .2);
      .close {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        height: inherit;
        @include px2rem(width, 96px);
        i {
          @include font-dpr(20px);
          color: $green;
        }
      }
      .content {
        justify-content: flex-start;
        height: inherit;
        width: inherit;
        @include pm2rem(padding, 0px, 200px, 0px, 96px);
        box-sizing: border-box;
        img {
          @include px2rem(margin-right, 30px);
          @include px2rem(width, 96px);
          @include px2rem(height, 96px);
        }
        .info {
          flex: 1;
          flex-direction: column;
          .name {
            @include px2rem(font-size, 28px);
            font-weight: bold;
            columns: $primary-dark;
          }
          .tips {
            @include px2rem(font-size, 24px);
            color: $third-dark;
          }
        }
      }
      .btn {
        position: absolute;
        @include px2rem(height, 70px);
        @include px2rem(right, 26px);
        @include px2rem(width, 160px);
        color: $white;
        @include font-dpr(15px);
        @include px2rem(border-radius, 10px);
        background-color: $green;
        line-height: normal;
      }
      & a:active {
        opacity: .8;
      }
    }
  }
</style>
