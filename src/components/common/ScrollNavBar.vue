<template>
  <section>
    <div class="nav-wrapper">
      <a class="nav-bar" :class="{'active': active === 0}" @click="handleClick(0, 0)">
        <span class="text">全部</span>
        <div class="border"></div>
      </a>
      <a v-for="(item, index) in bars" :key="index" class="nav-bar" :class="{'active': index + 1 === active}" @click="handleClick(index + 1, item.id)">
        <span class="text">{{item.theme}}</span>
        <div class="border"></div>
      </a>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'ScrollNavBar',
    props: {
      bars: {
        default: () => ([])
      },
      active: {
        default: () => (0)
      }
    },
    data () {
      return {
        handleClick (index, id) {
          this.$emit('click', {index, id})
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .nav-wrapper {
    @include px2rem(height, 90px);
    border-top: 1px solid $second-grey;
    border-bottom: 1px solid $second-grey;
    @include px2rem(padding-left, 9px);
    background-color: $white;
    box-sizing: border-box;
    display: flex;
    overflow-x: scroll;
    .nav-bar {
      @include pm2rem(padding, 0px, 33px, 0px, 33px);
      height: 100%;
      display: inline-block;
      position: relative;
      white-space: nowrap;
      .text {
        display: inline-block;
        height: inherit;
        @include px2rem(line-height, 90px);
        text-align: center;
        width: auto;
        color: $second-dark;
        @include px2rem(font-size, 30px);
      }
      .border {
        @include px2rem(height, 10px);
        background-color: transparent;
        width: 30%;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .active {
      .text {
        color: #FF6000;
      }
      .border {
        background-color: #FF6000;
      }
    }
  }
</style>
