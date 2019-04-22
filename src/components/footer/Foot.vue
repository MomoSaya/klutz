<template>
  <section class="footer-wrapper" :class="{'no-link': !hasLink}">
    <div class="nav">
      <div>
        <a @click="clickNavs(0)">首页</a>
      </div>
      <div>
        <a @click="clickNavs(1)">我的</a>
      </div>
      <div>
        <a @click="clickNavs(2)">云庐下载</a>
      </div>
      <div>
        <a @click="clickNavs(3)">帮助中心</a>
      </div>
    </div>
    <div v-if="hasLink" class="links">
      <span>友情链接:</span>
      <a @click="clickLinks(0)">百石堂</a>
      <a @click="clickLinks(1)">医药通</a>
      <a @click="clickLinks(2)">云庐测绘</a>
      <a @click="clickLinks(3)">云庐茶通</a>
    </div>
    <div class="copyright">
      &copy;2017 云庐数据 鄂ICP备15015354号-1
    </div>
  </section>
</template>

<script>
  import { getStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        hasLogin: !!getStore('user')
      }
    },
    props: {
      hasLink: {
        default: false
      }
    },
    methods: {
      clickNavs (index) {
        switch (index) {
          case 0:
            this.$router.push({name: 'See'})
            break
          case 1:
            this.$router.push({name: this.hasLogin ? 'Mine' : 'Login'})
            break
          case 2:
            this.$router.push({name: 'Download'})
            break
          case 3:
            this.$router.push({name: 'Help', query: {from: 'web'}})
            break
        }
      },
      clickLinks (index) {
        switch (index) {
          case 0:
            window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.yunlu6.stone'
            break
          case 1:
            window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.yunlu6.medicine'
            break
          case 2:
            window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.yunlu6.plotting'
            break
          case 3:
            window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.yunlu6.tea'
            break
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .footer-wrapper {
    @include px2rem(height, 273px);
    position: relative;
    background-color: $tenth-grey;
    .nav {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      @include px2rem(top, 40px);
      @include px2rem(height, 60px);
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        @include px2rem(border-right-width, 2px);
        border-right-color: $green;
        border-right-style: solid;
        @include pm2rem(padding, 0px, 38px, 0px, 38px);
        @include px2rem(height, 20px);
        overflow: visible;
        position: relative;
        line-height: normal;
      }
      div:last-child {
        border: none;
      }
      a {
        color: $green;
        @include px2rem(font-size, 26px);
        cursor: pointer;
      }
      a:active {
        opacity: .8;
      }
    }
    .links {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      @include px2rem(bottom, 124px);
      @include px2rem(font-size, 24px);
      width: 100%;
      text-align: center;
      color: $second-dark;
      line-height: normal;
      span {
        @include px2rem(margin-right, 27px);
      }
      a {
        @include px2rem(margin-right, 52px);
        cursor: pointer;
      }
      & a:last-child {
        margin-right: 0;
      }
      & a:active {
        opacity: .8;
      }
    }
    .copyright {
      text-align: center;
      position: absolute;
      @include px2rem(bottom, 50px);
      left: 50%;
      transform: translateX(-50%);
      @include px2rem(font-size, 24px);
      width: 100%;
      color: $third-dark;
    }
  }
  .no-link {
    @include px2rem(height, 220px);
  }
</style>
