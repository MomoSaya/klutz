<template>
  <section>
    <div
      class="float-btn"
      :class="{'up': single}">
      <div
        class="cirlce-btn"
        @click="handleClick()">
        <i v-show="active" class="iconfont icon-dianzan1"></i>
        <i v-show="!active" class="iconfont icon-dianzan"></i>
        <p v-if="count">{{likeCount}}</p>
        <p v-else>0</p>
      </div>
      <div class="animation-icon" :class="{'slide-up': active && handled}">
        <i class="iconfont icon-icon-test2"></i>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'LikeBtn',
    data () {
      return {

      }
    },
    props: {
      count: {
        default: 0,
        type: Number
      },
      single: {
        default: true,
        type: Boolean
      },
      active: {
        default: false,
        type: Boolean
      },
      handled: {
        default: false,
        type: Boolean
      }
    },
    methods: {
      handleClick () {
        this.$emit('click')
      }
    },
    computed: {
      likeCount () {
        return this.count > 99 ? '99+' : this.count
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .float-btn {
    position: fixed;
    @include px2rem(bottom, 290px);
    @include px2rem(height, 0px);
    display: block;
    width: 100%;
    max-width: 540px;
    transition: all .3s cubic-bezier(0, 0, 0, 1);
    .cirlce-btn {
      right: 0;
      bottom: 0;
      @include px2rem(width, 90px);
      @include px2rem(height, 90px);
      border-radius: 50%;
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      @include px2rem(margin-right, 20px);
      color: $white;
      background-color: rgba(254, 104, 48, 0.8);
      z-index: 1004;
      box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.14), 0 1px 18px rgba(0, 0, 0, 0.12);
      i {
        @include px2rem(font-size, 40px);
        line-height: normal;
      }
      p {
        @include px2rem(font-size, 24px);
      }
    }
    .animation-icon {
      @include px2rem(right, 44px);
      @include px2rem(bottom, 100px);
      position: absolute;
      opacity: 0;
      i {
        color: #ff6a27;
        @include px2rem(font-size, 30px);
      }
    }
  }
  .up {
    @include px2rem(bottom, 180px);
  }
  .slide-up {
    animation: slideUpHide 1s linear;
  }
  @keyframes slideUpHide {
    0% {
      opacity: 0;
      transform: scale3d(.03, .03, .03);
    }
    20% {
      opacity: 1;
      transform: scale3d(1.5, 1.5, 1.5);
    }
    40% {
      transform: scale3d(.8, .8, .8);
    }
    60% {
      opacity: 1;
      transform: scale3d(1, 1, 1);
    }
    80% {
      opacity: 1;
      transform: scale3d(1, 1, 1);
    }
    100% {
      opacity: 0;
      transform: scale3d(1.5, 1.5, 1.5);
    }
  }
</style>
