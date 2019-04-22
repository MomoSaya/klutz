<template>
  <section>
    <activity-header @back="goBack()" bg-color="#FFF">
      <div slot="right">
        <div class="right-btn-group">
          <a class="hader-item category" @click="goCategory()">
            <img src="../../assets/activityCategory.png">
            <p>分类</p>
          </a>
          <a class="hader-item" @click="openMenu()">
            <img src="../../assets/settings.png">
          </a>
        </div>
      </div>
    </activity-header>
    <div class="container" ref="activity" :style="{'height': scrollHeight}">
      <div class="full-width banner-wrapper">
        <div class="banner" v-lazy:background-image="{src: bannerBgUrl, error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png', loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'}">
        </div>
      </div>
      <div v-if="activityProducts.length > 5" class="full-width refresh-wrapper">
        <div class="refresh-bg" v-lazy:background-image="{src: recommendBgUrl, error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png', loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'}">
          <div class="refresh-btn" @click="refreshProducts()">
            <img class="refresh-cirlce" src="../../assets/activityRefresh.png">
            <p>换一批</p>
          </div>
        </div>
      </div>
      <transition name="fade" mode="out-in">
        <div v-if="!loading && activityProducts.length < 6" class="empty-wrapepr">
          <img src="../../assets/activityEmpty.png">
          <p class="tips">客官，你来晚啦！</p>
          <p class="sub-tips">商品已被抢购一空，去商城看看其它商品吧！</p>
        </div>
        <div v-else class="list-wrapper">
          <product-thumbnail :store="activityProducts" :loading="loading" :num="productPageSize" @click="goProductDetail" @favorite="handleFavorite">
          </product-thumbnail>
        </div>
      </transition>
      <div v-if="!loading && activityProducts.length < 6" class="products-wrapper">
        <div class="flex title">
          <div class="icon"></div>
          <p>推荐商城</p>
          <a class="flex more" @click="viewMoreMalls()">
            <span>更多</span>
            <img src="../../assets/activityMore.png">
          </a>
        </div>
        <see-grid
          :num="mallsPageSize"
          :store="malls"
          :loading="mallLoading"
          @click="goMall">
        </see-grid>
      </div>
      <transition name="fade" mode="out-in">
        <div v-if="floatMenu" class="full-width fixed-menu">
          <div class="menu-bg" @click="closeMenu()"></div>
          <div class="menu">
            <a class="item" @click="goRoute('Conversation')">
              <i class="iconfont icon-xiaoxi"></i>
              <span>会话</span>
            </a>
            <a class="item" @click="goRoute('Favorites')">
              <i class="iconfont icon-shoucang"></i>
              <span>收藏</span>
            </a>
            <a class="item" @click="goRoute('ShoppingCart')">
              <i class="iconfont icon-gouwuche"></i>
              <span>购物车</span>
            </a>
          </div>
        </div>
      </transition>
      <foot :has-link="false"></foot>
    </div>
  </section>
</template>

<script>
  import ActivityHeader from '../../components/header/ActivityHeader'
  import ProductThumbnail from '../../components/product/ProductThumbnail'
  import {getStore, removeStore, setScrollTop} from '../../config/mUtils'
  import Foot from '../../components/footer/Foot'
  import SeeGrid from '../../components/product/SeeGrid'
  import {Toast} from 'mint-ui'
  import {mapGetters} from 'vuex'
  export default {
    name: 'Activity',
    data () {
      return {
        bannerBgUrl: 'http://oatl31bw3.bkt.clouddn.com/activityBanner.png',
        recommendBgUrl: 'http://oatl31bw3.bkt.clouddn.com/activityRecommend.png',
        refreshLoading: false,
        floatMenu: false,
        loading: true,
        mallsPageSize: 4,
        mallLoading: true,
        malls: [],
        productPageSize: 6,
        scrollHeight: '14rem',
        hasLogin: !!getStore('user'),
        token: getStore('user') ? getStore('user').authentication_token : null
      }
    },
    components: {
      ActivityHeader,
      ProductThumbnail,
      Foot,
      SeeGrid
    },
    methods: {
      goBack () {
        if (getStore('Activity_goHome')) {
          removeStore('Activity_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      refreshProducts () {
        this.refreshLoading = true
        let timer = window.setTimeout(() => {
          this.getProducts()
          this.refreshLoading = false
          window.clearTimeout(timer)
        }, 3000)
      },
      goRoute (route) {
        this.closeMenu()
        if (this.hasLogin) {
          this.$router.push({name: route})
        } else {
          this.goLogin()
        }
      },
      goLogin (onlyMobile = false) {
        this.$store.dispatch('switchIntegralDialog', {status: true, onlyMobile: onlyMobile})
      },
      closeMenu () {
        this.floatMenu = false
      },
      openMenu () {
        this.floatMenu = !this.floatMenu
      },
      goCategory () {
        this.$router.push({name: 'Categories', params: {id: 1}})
      },
      goProductDetail (item) {
        this.$router.push({name: 'ProductDetail', params: {id: item.id}})
      },
      goMall (item) {
        this.$router.push({name: 'Mall', params: {id: item.id}})
      },
      handleFavorite (item) {
        if (!this.hasLogin) {
          this.goLogin()
        } else if (!item.favorable) {
          this.favoriteRequest(item.id, {product_id: item.id})
        } else {
          this.removeFavorites(item.id, {type: 'Product'})
        }
      },
      favoriteRequest (id, obj) {
        this.$store.dispatch('commonAction', {
          url: '/v1/favorites',
          method: 'post',
          params: {},
          data: {
            token: this.token,
            ...obj
          },
          target: this,
          resolve: (state, res) => {
            this.handleAddFavorites(state, id, res)
          },
          reject: () => {
          }
        })
      },
      removeFavorites (id, obj) {
        this.$store.dispatch('commonAction', {
          url: `/v1/favorites/${id}`,
          method: 'delete',
          params: {},
          data: {
            token: this.token,
            ...obj
          },
          target: this,
          resolve: (state, res) => {
            this.handleRemoveFavorites(state, id, res)
          },
          reject: () => {
            Toast({
              message: '取消收藏失败，请重试',
              duration: 500
            })
          }
        })
      },
      handleRemoveFavorites (state, id, res) {
        if (res.data.favorable_type && res.data.favorable_type === 'Product') {
          Toast({
            message: '你已成功取消收藏该产品',
            duration: 500
          })
          let index = this.handleIndex(state.activityProducts, id)
          state.activityProducts[index].favorable = !state.activityProducts[index].favorable
        } else {
          Toast({
            message: '取消收藏该产品失败',
            duration: 1000
          })
        }
      },
      handleAddFavorites (state, id, res) {
        if (res.data.favorites && res.data.favorites.id === parseInt(id)) {
          Toast({
            message: '你已成功收藏该产品',
            className: 'toast-content',
            iconClass: 'iconfont icon-caozuochenggong toast-icon-big',
            duration: 1000
          })
          let index = this.handleIndex(state.activityProducts, res.data.favorites.id)
          state.activityProducts[index].favorable = !state.activityProducts[index].favorable
        } else {
          Toast({
            message: '收藏该产品失败',
            duration: 1000
          })
        }
      },
      handleIndex (arr, item) {
        let index = 0
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === item) {
            index = i
            break
          }
        }
        return index
      },
      getMalls () {
        this.mallLoading = true
        this.$store.dispatch('commonAction', {
          url: '/v1/mall/index',
          method: 'get',
          params: {
            per_page: this.mallsPageSize
          },
          data: {},
          target: this,
          resolve: (state, res) => {
            this.malls = res.data.malls
            this.mallLoading = false
          },
          reject: () => {
            this.mallLoading = false
          }
        })
      },
      getProducts () {
        this.loading = true
        this.$store.dispatch('commonAction', {
          url: '/v1/promotion/publish/products',
          method: 'get',
          params: {
            ...(this.token ? {token: this.token} : {})
          },
          target: this,
          resolve: (state, res) => {
            state.activityProducts = res.data.products
            if (res.data.products.length < 6) {
              this.getMalls()
            }
            this.loading = false
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      viewMoreMalls () {
        this.$router.push({name: 'MallList'})
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      }
    },
    mounted () {
      this.handleScrollHeight()
    },
    activated () {
      this.hasLogin = !!getStore('user')
      this.token = getStore('user') ? getStore('user').authentication_token : null
      if (!this.$store.state.popState || this.$store.state.fromLogin) {
        setScrollTop(0, this.$refs.activity)
        if (getStore('shareIntegral')) {
          this.$store.dispatch('switchRegistDialog', {status: getStore('shareIntegral')})
          removeStore('shareIntegral')
          removeStore('shareRegist')
        }
        this.getProducts()
      } else {
        setScrollTop(this.$store.state.scrollMap.Activity || 0, this.$refs.activity)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'Activity', value: this.$refs.activity.scrollTop})
      if (to.name !== 'Conversation' && to.name !== 'ShoppingCart' && to.name !== 'Favorites' && to.name !== 'Login' && to.name !== 'BeforeRegister' && to.name !== 'Help' && to.name !== 'Download' && to.name !== 'ProductDetail' && to.name !== 'Mall' && to.name !== 'Categories' && to.name !== 'MallList') {
        this.mallsPageSize = 4
        this.mallLoading = true
        this.refreshLoading = false
        this.floatMenu = false
        this.loading = true
      }
      next()
    },
    computed: {
      ...mapGetters([
        'activityProducts'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    overflow-y: scroll;
    padding-bottom: 1px; // 避免安卓手机QQ浏览器，滑动到底部后第一次不能直接上滑的bug
    -webkit-overflow-scrolling: touch;
  }
  .right-btn-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .hader-item {
      display: flex;
      justify-content: center;
      align-items: center;
      @include px2rem(height, 88px);
      @include px2rem(width, 88px);
      img {
        @include px2rem(height, 74px);
        @include px2rem(width, 74px);
      }
    }
    .category {
      flex-direction: column;
      img {
        @include px2rem(height, 34px);
        @include px2rem(width, 34px);
        @include pm2rem(padding, 10px, 0px, 4px, 0px);
      }
      p {
        @include px2rem(font-size, 20px);
        color: $second-dark;
      }
    }
  }
  .banner-wrapper {
    @include px2rem(padding-top, 88px);
    @include px2rem(height, 566px);
    background-color: #E8E8E8;
    .banner {
      height: inherit;
      width: inherit;
    }
    .banner[lazy=loading] {
      background-position: center center!important;
      background: url("../../assets/imgLoading3.jpg");
      background-repeat: no-repeat;
      background-size: contain;
    }
    .banner[lazy=error] {
      background-position: center center!important;
      background: url("../../assets/imgLoadingError.png");
      background-repeat: no-repeat;
      background-size: contain;
    }
    .banner[lazy=loaded] {
      height: inherit;
      width: 100%;
      background-position: center center!important;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
  .refresh-wrapper {
    @include px2rem(height, 100px);
    background-color: #E8E8E8;
    .refresh-bg {
      height: inherit;
      width: inherit;
      position: relative;
      .refresh-btn {
        position: absolute;
        top: 0;
        height: inherit;
        @include px2rem(right, 20px);
        width: auto;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        img {
          @include px2rem(width, 36px);
          @include px2rem(height, 35px);
          @include px2rem(margin-bottom, 10px);
        }
        p {
          color: #F8D56B;
          @include px2rem(font-size, 24px);
        }
      }
    }
    .refresh-bg[lazy=loading] {
      background-position: center center!important;
      background: url("../../assets/imgLoading3.jpg");
      background-repeat: no-repeat;
      background-size: contain;
    }
    .refresh-bg[lazy=error] {
      background-position: center center!important;
      background: url("../../assets/imgLoadingError.png");
      background-repeat: no-repeat;
      background-size: contain;
    }
    .refresh-bg[lazy=loaded] {
      height: inherit;
      width: inherit;
      background-position: center center!important;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
  .list-wrapper {
    background-color: #E01713;
    @include px2rem(padding-top, 10px);
  }
  .empty-wrapepr {
    @include px2rem(height, 520px);
    background-color: $white;
    @include px2rem(padding-top, 32px);
    box-sizing: border-box;
    @include px2rem(margin-bottom, 8px);
    text-align: center;
    img {
      @include px2rem(width, 303px);
      @include px2rem(height, 320px);
    }
    .tips {
      color: #CC1817;
      @include px2rem(font-size, 34px);
      @include pm2rem(margin, 20px, 0px, 4px, 0px);
    }
    .sub-tips {
      color: $third-dark;
      @include px2rem(font-size, 26px);
    }
  }
  .products-wrapper {
    background-color: $white;
    @include px2rem(margin-top, 12px);
    .title {
      @include px2rem(height, 82px);
      @include pm2rem(padding, 0px, 24px, 0px, 24px);
      justify-content: flex-start;
      border-bottom: 1px solid $third-grey;
      position: relative;
      .icon {
        @include px2rem(height, 38px);
        @include px2rem(width, 10px);
        @include px2rem(border-radius, 4px);
        background-color: $green;
        @include px2rem(margin-right, 24px);
      }
      p {
        @include px2rem(font-size, 32px);
        color: $second-dark;
        line-height: normal;
      }
      .more {
        position: absolute;
        top: 0;
        right: 0;
        height: inherit;
        @include pm2rem(padding, 0px, 35px, 0px, 35px);
        span {
          @include px2rem(font-size, 26px);
          color: $third-dark;
          @include px2rem(margin-right, 22px);
        }
        img {
          @include px2rem(width, 37px);
          @include px2rem(height, 36px);
        }
      }
      & a:active {
        background-color: rgba(239, 234, 234, .5);
      }
    }
  }
  .fixed-menu {
    .menu-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      background-color: rgba(0, 0, 0, .1);
    }
    .menu {
      position: fixed;
      z-index: 9999 !important;
      @include px2rem(top, 88px);
      @include px2rem(right, 10px);
      @include px2rem(border-radius, 10px);
      background-color: rgba(57, 55, 66, .8);
      display: flex;
      flex-direction: column;
      z-index: 4;
      .item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        @include px2rem(width, 260px);
        @include px2rem(height, 98px);
        @include pm2rem(padding, 0px, 30px, 0px, 30px);
        box-sizing: border-box;
        border-bottom: 1px solid rgba(166, 166, 166, 0.5);
        color: $white;
        i {
          @include px2rem(font-size, 40px);
        }
        span {
          @include px2rem(margin-left, 30px);
          @include px2rem(font-size, 28px);
        }
      }
      & a:last-child  {
        border-bottom: none;
      }
    }
    .menu::after {
      content: "";
      position: absolute;
      @include px2rem(top, -20px);
      @include px2rem(right, 22px);
      @include px2rem(border-left-width, 12px);
      @include px2rem(border-right-width, 12px);
      @include px2rem(border-bottom-width, 20px);
      border-left-color: transparent;
      border-right-color: transparent;
      border-bottom-color: rgba(57, 55, 66, .8);
      border-top-width: 0;
      border-style: solid;
      display: inline-block;
      width: 0;
      height: 0;
      z-index: 4;
    }
  }
</style>
