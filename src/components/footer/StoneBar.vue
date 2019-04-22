<template>
  <section>
    <div class="container">
      <a class="flex icon-box" @click="close()">
        <i class="iconfont icon-guanbi"></i>
      </a>
      <div class="content" @click="download()">
        <img src="../../assets/bestoneLogo.png" class="logo">
        <div class="info">
          <p class="name">百石堂 Bestone</p>
          <p class="cn">定制行业上下游企业</p>
          <p class="en">More Info Download Bestone APP</p>
        </div>
      </div>
      <a class="download-btn" @click="download()">下载</a>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'StoneBar',
    data () {
      return {

      }
    },
    methods: {
      close () {
        this.$emit('close')
      },
      download () {
        this.$emit('download')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .container {
    @include px2rem(height, 140px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    border-top: 1px solid $second-grey;
    background-color: $white;
    box-sizing: border-box;
    .icon-box {
      cursor: pointer;
      @include px2rem(width, 100px);
      height: inherit;
      i {
        width: 100%;
        text-align: center;
        @include px2rem(font-size, 40px);
        color: $third-dark;
      }
    }
    & a.icon-box:active {
      background-color: rgba(239, 234, 234, .5);
    }
    .content {
      display: flex;
      align-items: center;
      flex: 1;
      .logo {
        @include px2rem(height, 100px);
        @include px2rem(width, 100px);
        @include pm2rem(margin, 0px, 20px, 0px, 0px);
      }
      .info {
        .name {
          @include px2rem(font-size, 32px);
          color: $primary-dark;
        }
        .cn {
          @include px2rem(font-size, 28px);
          color: $green;
        }
        .en {
          @include px2rem(font-size, 28px);
          color: $third-dark;
        }
      }
    }
    .download-btn {
      cursor: pointer;
      display: block;
      position: absolute;
      @include px2rem(right, 20px);
      top: 50%;
      transform: translateY(-50%);
      box-sizing: border-box;
      @include px2rem(font-size, 28px);
      color: $white;
      @include px2rem(height, 52px);
      @include px2rem(width, 120px);
      @include px2rem(border-radius, 60px);
      border: 1px solid $second-grey;
      background-color: $green;
      text-align: center;
      @include px2rem(line-height, 52px);
    }
    & a.download-btn:active {
      background-color: #67e2be;
    }
  }
</style>


