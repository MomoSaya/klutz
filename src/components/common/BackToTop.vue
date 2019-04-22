<template>
  <section>
    <div class="float-btn">
      <transition name="zoom">
        <div
          class="cirlce-btn"
          v-if="show"
          @click="handleClick()">
          <i class="iconfont icon-dingzhi"></i>
          <p v-if="text">{{text}}</p>
          <p v-else>置顶</p>
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    props: ['text', 'show'],
    methods: {
      handleClick () {
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .float-btn {
    position: fixed;
    @include px2rem(bottom, 70px);
    @include px2rem(height, 0px);
    display: block;
    width: 100%;
    max-width: 540px;
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
      background-color: rgba(0, 0, 0, .4);
      line-height: 1;
      z-index: 1004;
      box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.14), 0 1px 18px rgba(0, 0, 0, 0.12);
      transform-origin: center center 0px;
      i {
        @include px2rem(font-size, 36px);
      }
      p {
        @include px2rem(font-size, 24px);
      }
    }
  }
  .zoom-enter-active {
    animation: zoomIn .2s ease-in-out 0s 1 both;
  }
  .zoom-leave-active {
    animation: zoomOut .2s ease-in-out 0s 1 both;
  }
  .zoom-enter, .zoom-leave-to {
    transform: scale3d(1, 1, 1);
  }
  @keyframes zoomIn {
    from {
      transform: scale3d(.03, .03, .03);
    }
    to {
      transform: scale3d(1, 1, 1);
    }
  }
  @keyframes zoomOut {
    from {
      transform: scale3d(1, 1, 1);
    }
    to {
      transform: scale3d(.03, .03, .03);
    }
  }
</style>
