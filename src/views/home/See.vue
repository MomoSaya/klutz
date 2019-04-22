<template>
  <section>
    <div class="search-bar full-width" :class="{'shadow': hasShadow}">
      <div class="flex icon-box" @click="goMessage()">
        <i class="iconfont icon-xiaoxi1"></i>
        <div
          v-if="unReadeMsgs.length > 0"
          class="dot second-bg"></div>
      </div>
      <div
        class="search-input"
        @click="goRoute('SearchProducts', true)">
        <a class="text font-14 white-bg">任你搜 任意搜</a>
        <i class="iconfont icon-sousuo absolute-vertical"></i>
      </div>
      <div v-if="hasLogin" class="flex mine" @click="goRoute('Mine', true)">
        <i class="iconfont icon-geren icon-btn white"></i>
        <span>我的</span>
      </div>
      <p
        v-else
        @click="goRoute('Login', false)"
        class="flex icon-btn login-btn white">登录|注册</p>
    </div>
    <div class="see-wrapper" id="seeWrapper" ref="seeWrapper" :style="{'height': height}">
      <div style="position: relative; transform-style: preserve-3d;">
        <div class="swipe">
          <swiper :options="swiperOption">
            <swiper-slide v-for="(item, index) in seeSwiperImgs" :key="index">
              <div
                v-lazy:background-image="{
                  src: item.url,
                  error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
                  loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
                }"
                @click="bannerclick(item)"
                class="swipe-img">
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div class="swipe-vertical">
          <div class="flex img-box">
            <img src="../../assets/seeRecommend.png">
          </div>
          <swiper :options="swiperOptionVertical">
            <swiper-slide v-for="(item, index) in seeRecommends" :key="index">
              <a class="item" @click="goDownload()">
                <div class="content">
                  <p class="title">{{item.title}}</p>
                  <p class="sub-title">{{item.subTitle}}</p>
                </div>
                <div class="logo">
                  <img src="../../assets/hot.png">
                </div>
              </a>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div class="malls-wrapper">
          <div class="flex title">
            <div class="icon"></div>
            <p>推荐商城</p>
          </div>
          <transition name="fade" mode="out-in">
            <div v-if="mallLoading">
              <a
                v-for="(item, index) in mallsPageSize"
                :key="index"
                class="mall">
                <div class="mall-content">
                  <div class="img empty-img">
                  </div>
                  <div class="content empty-content">
                    <p></p>
                    <div class="info">
                      <div class="empty-icon"></div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div v-else>
              <a
                v-for="(item, index) in malls"
                :key="index"
                class="mall"
                @click="goMall(item)">
                <div class="mall-content">
                  <div
                    v-lazy:background-image="{
                      src: item.logo,
                      error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
                      loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
                    }"
                    class="img">
                  </div>
                  <div class="content">
                    <p>{{item.name}}</p>
                    <div class="info">
                      <svg class="icon large" aria-hidden="true">
                        <use xlink:href="#icon-zhenshi4"></use>
                      </svg>
                      <div>
                        <span>{{item.provice_name}}</span>
                        <span>{{item.city_name}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </transition>
          <a class="flex footer" @click="viewMoreMalls()">
            <p>查看更多商城</p>
            <div class="icon-box">
              <i class="iconfont icon-you"></i>
            </div>
          </a>
        </div>
        <div class="products-wrapper">
          <div class="flex title">
            <div class="icon"></div>
            <p>热销商品</p>
          </div>
          <see-grid
            :num="productsPageSize"
            :store="products"
            :loading="productLoading"
            @click="goProductCategory">
          </see-grid>
        </div>
        <div class="products-wrapper">
          <div class="flex title">
            <div class="icon"></div>
            <p>优质企业</p>
          </div>
          <see-grid
            :num="productsPageSize"
            :store="enterprises"
            :loading="productLoading"
            @click="goService">
          </see-grid>
        </div>
        <foot :has-link="true"></foot>
      </div>
    </div>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import Foot from '../../components/footer/Foot'
  import SeeGrid from '../../components/product/SeeGrid'
  import { getStore, setStore, removeStore, showBack } from '../../config/mUtils'
  export default {
    name: 'See',
    data () {
      return {
        hasLogin: !!getStore('user'),
        enterpriseOwner: false,
        card: getStore('user'),
        token: getStore('user') ? getStore('user').authentication_token : '',
        clientKeyWrods: [],
        seeCard: null,
        seeSwiperImgs: [
          {
            id: 1,
            jumpDirectly: true,
            router: 'Download',
            url: 'http://oatl31bw3.bkt.clouddn.com/seeCarousel.png'
          }, {
            id: 2,
            jumpDirectly: true,
            router: 'Activity',
            url: 'http://oatl31bw3.bkt.clouddn.com/seeCarousel2.jpg'
          }, {
            id: 3,
            jumpDirectly: true,
            router: 'StoneWeb',
            url: 'http://oatl31bw3.bkt.clouddn.com/seeCarousel3.png'
          }
        ],
        seeRecommends: [
          {
            title: '导购赚钱',
            subTitle: '成为导购员，分享赚钱',
            id: 1
          }, {
            title: '数字名片',
            subTitle: '展示身份，快速拓展人脉',
            id: 2
          }, {
            title: '自主电商',
            subTitle: '零成本，企业网上自助销售',
            id: 3
          }
        ],
        swiperOption: {
          pagination: '.swiper-pagination',
          paginationClickable: true,
          speed: 300,
          autoplay: 5000,
          loop: true,
          onSlideChangeEnd: (swiper) => {
            this.currentIndex = swiper.activeIndex + 1
          }
        },
        swiperOptionVertical: {
          direction: 'vertical',
          speed: 300,
          autoplay: 5000,
          loop: true
        },
        mallLoading: true,
        productLoading: true,
        enterpriseLoading: true,
        mallsPageSize: 5,
        productsPageSize: 8,
        enterprisePageSize: 8,
        malls: [],
        products: [],
        enterprises: [],
        scrollHeight: 145,
        height: '15rem',
        hasShadow: false
      }
    },
    components: {
      swiper,
      swiperSlide,
      Foot,
      SeeGrid
    },
    methods: {
      goRoute (route, bool) {
        if (!bool) {
          setStore('Login_goHome', 'true')
        }
        this.$router.push({name: bool ? route : 'Login'})
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
            this.getProducts()
          },
          reject: () => {
            this.mallLoading = false
          }
        })
      },
      getProducts () {
        this.productLoading = true
        this.$store.dispatch('commonAction', {
          url: '/v1/customsize_goods',
          method: 'get',
          params: {
            limit: 8,
            ...(this.token ? {token: this.token} : {})
          },
          data: {},
          target: this,
          resolve: (state, res) => {
            this.products = res.data.categories
            this.enterprises = res.data.services
            this.productLoading = false
          },
          reject: () => {
            this.productLoading = false
          }
        })
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.height = `${Math.round(divHeight * 100) / 100}rem`
        this.scrollHeight = Math.round(290) / 75 * rootFontSize
      },
      handleNavBarOpacity () {
        showBack((status) => {
          this.hasShadow = status
        }, this.scrollHeight, this.$refs.seeWrapper, 0, 0)
      },
      goDownload () {
        this.$router.push({name: 'Download'})
      },
      goMall (item) {
        this.$router.push({name: 'Mall', params: {id: item.id}})
      },
      viewMoreMalls () {
        this.$router.push({name: 'MallList'})
      },
      goMessage () {
        if (!this.hasLogin) {
          this.$router.push({name: 'Login'})
        } else {
          this.$router.push({name: 'Conversation'})
        }
      },
      goProductCategory (item) {
        this.$router.push({name: 'ProductCategory', params: {id: item.id}, query: {title: item.name}})
      },
      goService (item) {
        this.$router.push({name: 'SearchEnterprise', params: {id: item.id}, query: {title: item.name}})
      },
      bannerclick (item) {
        if (item.jumpDirectly) {
          this.$router.push({name: item.router})
        }
      }
    },
    mounted () {
      removeStore('showGoHome')
      this.handleScrollHeight()
      this.handleNavBarOpacity()
      this.getMalls()
    },
    computed: {
      ...mapGetters([
        'unReadeMsgs'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .see-wrapper {
    width: 100%;
    max-width: 540px;
    overflow-y: scroll;
    box-sizing: border-box;
    margin-bottom: 1px; // 避免安卓手机QQ浏览器，滑动到底部后第一次不能直接上滑的bug
    -webkit-overflow-scrolling: touch;
  }
  .search-bar {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    z-index: 999;
    @include px2rem(height, 110px);
    background-color: rgba(82, 202, 167, 0);
    transition: all .3s;
    .icon-box {
      @include px2rem(width, 88px);
      height: inherit;
      position: relative;
      i {
        @include px2rem(font-size, 40px);
        color: $white;
      }
      .dot {
        @include px2rem(width, 16px);
        @include px2rem(height, 16px);
        @include px2rem(border-radius, 8px);
        position: absolute;
        @include px2rem(top, 20px);
        @include px2rem(right, 10px);
      }
    }
    .search-input {
      position: relative;
      flex: 1;
      z-index: 1000;
      @include px2rem(height, 70px);
      @include pm2rem(padding, 22px, 0px, 22px, 0px);
      @include pm2rem(margin, 0px, 26px, 0px, 0px);
      .text {
        color: $eighth-grey;
        border: none;
        display: flex;
        @include px2rem(height, 70px);
        @include px2rem(border-radius, 40px);
        @include pm2rem(padding, 0px, 20px, 0px, 102px);
        align-items: center;
        line-height: normal;
      }
      i {
        color: $eleventh-grey;
        @include font-dpr(21px);
        @include px2rem(left, 40px);
      }
    }
    .icon-btn {
      @include px2rem(font-size, 40px);
      z-index: 1000;
      @include pm2rem(margin, 0px, 12px, 0px, 0px);
    }
    .mine {
      @include px2rem(padding-right, 20px);
      span {
        color: $white;
        @include px2rem(font-size, 28px);
      }
    }
    .login-btn {
      height: inherit;
      @include px2rem(font-size, 28px);
      @include px2rem(margin-right, 20px);
    }
  }
  .shadow {
    background-color: rgba(82, 202, 167, 1);
    box-shadow: 0px 4px 4px -2px rgba(199, 194, 194, .4);
  }
  .swipe {
    @include px2rem(height, 400px);
    position: relative;
    overflow: hidden;
    .swiper-container {
      height: 100%;
      width: 100%;
      background-color: #E8E8E8;
    }
    .swiper-slide {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .swipe-img {
      height: inherit;
      width: inherit;
      z-index: 1;
      background-position: center center!important;
      background-repeat: no-repeat;
      background-size: cover;
    }
    .swipe-img[lazy=loading] {
      z-index: 1;
      background-position: center center!important;
      background: url("../../assets/imgLoading3.jpg");
      background-repeat: no-repeat;
      background-size: contain;
    }
    .swipe-img[lazy=error] {
      z-index: 1;
      background-position: center center!important;
      background: url("../../assets/imgLoadingError.png");
      background-repeat: no-repeat;
      background-size: contain;
    }
    .swipe-img[lazy=loaded] {
      height: inherit;
      width: inherit;
      z-index: 1;
      background-position: center center!important;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
  .swipe-vertical {
    @include pm2rem(margin, 0px, 0px, 18px, 0px);
    @include px2rem(height, 110px);
    border: 1px solid $third-grey;
    border-right: none;
    border-left: none;
    display: flex;
    align-items: center;
    background-color: $white;
    .img-box {
      height: auto;
      width: auto;
      @include pm2rem(padding, 0px, 24px, 0px, 24px);
      border-right: 1px solid $third-grey;
      img {
        @include px2rem(width, 74px);
        @include px2rem(height, 66px);
      }
    }
    .item {
      display: flex;
      align-items: center;
      flex: 1;
      position: relative;
      height: inherit;
      cursor: pointer;
      .content {
        color: $second-dark;
        flex: 1;
        @include px2rem(padding-left, 38px);
        box-sizing: border-box;
        .title {
          @include px2rem(font-size, 30px);
          font-weight: bold;
        }
        .sub-title {
          @include px2rem(font-size, 28px);
        }
      }
      .logo {
        position: absolute;
        @include px2rem(top, 8px);
        @include px2rem(right, 14px);
        @include px2rem(width, 52px);
        @include px2rem(height, 26px);
        img {
          width: inherit;
          height: inherit;
        }
      }
    }
    & a:active {
      background-color: rgba(239, 234, 234, .5);
    }
    .swiper-container {
      flex: 1;
      height: inherit;
    }
  }
  .malls-wrapper {
    background-color: $white;
    .title {
      @include px2rem(height, 82px);
      @include pm2rem(padding, 0px, 24px, 0px, 24px);
      justify-content: flex-start;
      border-bottom: 1px solid $third-grey;
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
    }
    .mall {
      @include px2rem(height, 160px);
      cursor: pointer;
      display: block;
      .mall-content {
        height: inherit;
        @include pm2rem(margin, 0px, 24px, 0px, 24px);
        border-bottom: 1px solid $third-grey;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      .img {
        @include px2rem(height, 132px);
        @include px2rem(width, 156px);
        @include px2rem(border-radius, 6px);
      }
      .img[lazy=loading] {
        z-index: 1;
        background-position: center center!important;
        background: url("../../assets/imgLoading3.jpg");
        background-repeat: no-repeat;
        background-size: contain;
      }
      .img[lazy=error] {
        z-index: 1;
        background-position: center center!important;
        background: url("../../assets/imgLoadingError.png");
        background-repeat: no-repeat;
        background-size: contain;
      }
      .img[lazy=loaded] {
        z-index: 1;
        background-position: center center!important;
        background-repeat: no-repeat;
        background-size: cover;
      }
      .empty-img {
        background-color: $ninth-grey;
      }
      .content {
        @include px2rem(margin-left, 40px);
        @include pm2rem(padding, 32px, 0px, 32px, 0px);
        flex: 1;
        height: inherit;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: column;
        p {
          @include px2rem(font-size, 30px);
          color: $primary-dark;
          font-weight: bold;
        }
        .info {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          @include px2rem(height, 40px);
          span {
            @include px2rem(font-size, 24px);
            color: $second-dark;
            line-height: normal;
          }
        }
        svg {
          @include px2rem(font-size, 34px);
          @include px2rem(margin-right, 16px);
        }
      }
      .empty-content {
        p {
          background-color: $ninth-grey;
          @include px2rem(width, 200px);
          @include px2rem(height, 30px);
        }
        .empty-icon {
          @include px2rem(width, 34px);
          @include px2rem(height, 34px);
          @include px2rem(border-radius, 17px);
          background-color: $ninth-grey;
        }
      }
    }
    & a:active {
      background-color: rgba(239, 234, 234, .5);
    }
    .footer {
      @include px2rem(height, 110px);
      p {
        @include px2rem(font-size, 30px);
        color: $primary-dark;
      }
      i {
        color: $primary-dark;
        @include px2rem(font-size, 28px);
        @include px2rem(margin-left, 20px);
      }
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
    }
  }
</style>

<style lang="scss">
  @import "../../styles/mixin";
  .see-wrapper {
    .swipe {
      .swiper-container-horizontal > .swiper-pagination-bullets {
        bottom: 4px;
      }
    }
    .swiper-pagination {
      text-align: right;
      .swiper-pagination-bullet {
        background-color: $third-dark;
        opacity: .9;
      }
      .swiper-pagination-bullet-active {
        background: $white;
      }
    }
  }
</style>

