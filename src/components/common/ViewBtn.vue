<template>
  <section>
    <div v-show="show" class="view-btn" @click="handleClick()">
      <i class="iconfont icon-dianjichakan animation-icon"></i>
      <a>{{text}}</a>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'ViewBtn',
    props: {
      show: {
        default: true,
        type: Boolean
      },
      text: {
        default: '点击查看产品',
        type: String
      }
    },
    data () {
      return {
        handleClick () {
          this.$emit('click')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .view-btn {
    color: $green;
    @include px2rem(font-size, 30px);
    margin: 0 auto;
    @include px2rem(margin-top, 260px);
    text-align: center;
    cursor: pointer;
    i {
      @include px2rem(font-size, 40px);
      display: block;
    }
    .animation-icon {
      animation: shakeVertical 8s linear infinite reverse backwards;
    }
    a {
      @include px2rem(font-size, 30px);
      display: block;
    }
    & a:active {
      opacity: .8;
    }
  }
  @keyframes shakeVertical {
    0%,
    100% {
      transform: translateY(0);
    }
    10%,
    30%,
    50%,
    70% {
      transform: translateY(-6px);
    }
    20%,
    40%,
    60% {
      transform: translateY(6px);
    }
    80% {
      transform: translateY(4px);
    }
    90% {
      transform: translateY(-4px);
    }
  }
</style>
