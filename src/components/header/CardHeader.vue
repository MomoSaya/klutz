<template>
  <section>
    <div class="header">
      <img src="../../assets/fanhui.png" @click="handleClick()">
      <span>{{title}}</span>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'CardHeader',
    props: {
      title: {
        default: '数字名片',
        type: String,
        required: true
      }
    },
    data () {
      return {
        handleClick () {
          this.$emit('back')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .header {
    @include px2rem(height, 118px);
    width: 100%;
    max-width: 540px;
    text-align: center;
    position: fixed;
    z-index: 1004;
    img {
      @include px2rem(width, 74px);
      @include px2rem(height, 74px);
      position: absolute;
      @include px2rem(top, 22px);
      @include px2rem(left, 22px);
    }
    span {
      position: relative;
      margin: 0 auto;
      @include px2rem(line-height, 118px);
      @include px2rem(font-size, 34px);
      color: $primary-dark;
    }
  }
</style>
