<template>
  <section>
    <common-header
      v-if="hasHeader"
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="container" :class="{'no-header': !hasHeader}">
      <div class="wrapper">
        <div class="info">
          <img class="logo" :src="logo">
          <div class="content">
            <p class="name">{{name}}</p>
          </div>
        </div>
        <div class="qr-wrapper">
          <qr-code
            :text="url"
            :size="size"
            error-level="H">
          </qr-code>
          <img class="logo" :src="logo">
        </div>
        <p class="tips">扫一扫上面的二维码图案，访问ta的名片</p>
      </div>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import QrCode from 'vue-qrcode-component'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        header: this.$route.query.name || '二维码',
        state: this.$route.query.state || 'approved',
        logo: this.$route.query.logo || 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
        name: this.$route.query.name || '',
        url: this.$route.query.url || 'https://web.yunlu6.com',
        hasHeader: this.$route.query.hasHeader || false,
        size: 240
      }
    },
    name: 'QrPage',
    components: {
      CommonHeader,
      QrCode
    },
    methods: {
      goBack () {
        if (getStore('QrPage_goHome')) {
          removeStore('QrPage_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      sizeHandler () {
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        this.size = Math.round((480 / 75) * parseFloat(rootFontSize + ''))
      }
    },
    created () {
      this.sizeHandler()
    },
    mounted () {
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    @include px2rem(padding-top, 88px);
  }
  .no-header {
    padding-top: 0;
  }
  .wrapper {
    @include px2rem(width, 600px);
    @include px2rem(height, 800px);
    @include px2rem(border-radius, 20px);
    @include pm2rem(padding, 30px, 30px, 30px, 30px);
    background-color: $white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    .info {
      @include px2rem(height, 150px);
      display: flex;
      align-items: flex-start;
      @include px2rem(margin-bottom, 40px);
      .logo {
        @include px2rem(width, 150px);
        @include px2rem(height, 150px);
        @include px2rem(border-radius, 10px);
        @include px2rem(margin-right, 30px);
        background-color: $white;
      }
      .content {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: flex-start;
        position: relative;
        height: inherit;;
        .name {
          @include px2rem(font-size, 32px);
          font-weight: bold;
          color: $primary-dark;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
          float: left;
        }
      }
    }
    .qr-wrapper {
      margin: 0 auto;
      display: flex;
      justify-content: center;
      @include px2rem(height, 520px);
      @include px2rem(width, 520px);
      @include px2rem(border-radius, 10px);
      @include px2rem(padding, 20px);
      box-sizing: border-box;
      position: relative;
      .logo {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        @include px2rem(width, 140px);
        @include px2rem(height, 140px);
        @include px2rem(border-radius, 10px);
        border-style: solid;
        @include px2rem(border-width, 10px);
        border-color: $white;
        background-color: $white;
      }
    }
    .tips {
      @include px2rem(font-size, 28px);
      text-align: center;
      color: $third-dark;
      @include px2rem(margin-top, 40px);
    }
  }
</style>
