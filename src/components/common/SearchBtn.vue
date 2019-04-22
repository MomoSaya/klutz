<template>
  <section class="search-wrapper full-width" :class="{'active': show}">
    <form
      class="search-container"
      action=""
      target="iframe">
      <slot name="input">
      </slot>
      <a class="btn" @click.stop="handleClick">
        搜索
      </a>
      <i class="iconfont icon-sousuo absolute-vertical"></i>
      <iframe name="iframe" style="display: none;">
      </iframe>
    </form>
  </section>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    name: 'SearchBtn',
    props: ['show'],
    methods: {
      handleClick () {
        this.$emit('search')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin.scss';

  .search-wrapper {
    position: fixed;
    @include px2rem(height, 110px);
    background-color: $white;
    @include px2rem(top, 88px);
    z-index: 1001;
    box-sizing: border-box;
    transform: translateY(-142px);
    transition: all .3s ease-in-out;
    border-bottom: 1px solid $third-grey;
  }
  .search-container {
    position: relative;
    height: inherit;
    input {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: $ninth-grey;
      @include px2rem(width, 580px);
      @include px2rem(height, 80px);
      @include px2rem(left, 30px);
      @include px2rem(border-radius, 40px);
      @include pm2rem(padding, 0px, 40px, 0px, 104px);
      box-sizing: border-box;
      color: $second-dark;
      @include px2rem(font-size, 30px);
      line-height: normal;
      text-align: left;
      border: none;
    }
    ::-webkit-input-placeholder{
      color: $third-dark;
      @include px2rem(height, 80px);
      line-height: normal;
      text-align: left;
      border: none;
    }
    i {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      @include px2rem(left, 74px);
      color: $eleventh-grey;
    }
    .btn {
      @include pm2rem(padding, 10px, 20px, 10px, 20px);
      position: absolute;
      @include px2rem(right, 20px);
      top: 50%;
      transform: translateY(-50%);
      @include px2rem(font-size, 30px);
      color: $red;
    }
    & a:active {
      background-color: rgba(239, 234, 234, .5);
    }
  }
  .active {
    transform: translateY(0);
    opacity: 1;
  }

</style>
