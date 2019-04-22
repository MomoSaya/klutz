<template>
  <section class="full-width header" :style="{'background-color': bgColor}">
    <div class="left">
      <i class="iconfont icon-fanhui" @click="handleClick()"></i>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
    <div class="title">
      <img src="../../assets/acitvityTitle.png">
    </div>
  </section>
</template>

<script>
  export default {
    name: 'ActivityHeader',
    data () {
      return {

      }
    },
    props: {
      bgColor: {
        type: String,
        default: '#52CAA7'
      }
    },
    methods: {
      handleClick () {
        this.$emit('back')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .header {
    position: fixed;
    @include px2rem(height, 88px);
    @include pm2rem(padding, 0px, 0px, 0px, 30px);
    box-sizing: border-box;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 3;
    .left {
      height: inherit;
      @include px2rem(max-width, 200px);
      display: flex;
      align-items: center;
      justify-content: flex-start;
      i {
        @include px2rem(font-size, 40px);
        color: $third-dark;
      }
    }
    .title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      height: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      @include px2rem(padding-top, 2px);
      img {
        @include px2rem(height, 42px);
        width: auto;
      }
    }
  }
</style>
