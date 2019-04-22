<template>
  <section>
    <common-header :title="header" @back="goBack()">
    </common-header>
    <div class="list-container" ref="coverWrapper" :style="{'height': scrollHeight}">
      <div class="swipe">
        <swiper :options="swiperOption">
          <swiper-slide v-for="(item, index) in covers" :key="index">
            <div
              v-lazy:background-image="{
                src: item.url,
                error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
                loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
              }"
              class="swipe-img"
              @click="viewFullScreenPic(index, covers)">
            </div>
          </swiper-slide>
        </swiper>
        <div v-show="teams.company" class="bottom-cover">
          公司：{{teams.company}}
        </div>
      </div>
      <cover-list
        :store="stones"
        @click="goProductDetail">
      </cover-list>
    </div>
    <div v-show="showPreview">
      <div class="option-bar full-width">
        <div
          class="close"
          @click="closePreview()">
          <i class="iconfont icon-fanhui"></i>
        </div>
        <span class="preview-page-nav white flex font-20">{{currentFullScreenIndex}}/{{previewImgs.length}}</span>
      </div>
      <swiper
        :options="swiperOptionFullScreen"
        class="full-screen-swiper"
        ref="taxonomyCoverSwiper">
        <!-- slides -->
        <swiper-slide
          class="swiper-zoom-container full-screen-bg"
          v-for="(item, index) in previewImgs"
          :key="index">
          <img
            v-lazy="{
              src: item.url,
              error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
              loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
            }"
            alt="">
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import CoverList from '../../components/product/CoverList'
  import {getStore, removeStore, setScrollTop} from '../../config/mUtils'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { requestFn } from '../../config/request'
  export default {
    name: 'TaxonomyCover',
    props: ['id'],
    data () {
      return {
        header: this.$route.query.name || '石种',
        covers: [],
        colors: [],
        provinces: [],
        loading: true,
        pageIndex: 1,
        pageSize: 10,
        currentIndex: 1,
        currentFullScreenIndex: 1,
        teams: {},
        stones: [],
        scrollHeight: '14rem',
        swiperOption: {
          onSlideChangeEnd: (swiper) => {
            this.currentIndex = swiper.activeIndex + 1
          }
        },
        showPreview: false,
        swiperOptionFullScreen: {
          notNextTick: false,
          autoplay: 0,
          direction: 'horizontal',
          grabCursor: true,
          setWrapperSize: true,
          autoHeight: false,
          paginationClickable: false,
          prevButton: null,
          nextButton: null,
          mousewheelControl: true,
          observeParents: true,
          preventClicks: false,
          passiveListeners: false,
          zoom: true,
          height: window.innerHeight,
          width: window.innerWidth,
          initialSlide: 0,
          onSlideChangeEnd: (swiper) => {
            this.currentFullScreenIndex = swiper.activeIndex + 1
          }
        },
        previewImgs: []
      }
    },
    components: {
      CommonHeader,
      CoverList,
      swiper,
      swiperSlide
    },
    methods: {
      goBack () {
        if (getStore('TaxonomyCover_goHome')) {
          removeStore('TaxonomyCover_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      getStones () {
        this.$store.dispatch('commonAction', {
          url: '/v1/stone_materials',
          method: 'get',
          params: {
            page: this.pageIndex,
            per_page: this.pageSize,
            taxonomy_id: this.id
          },
          target: this,
          resolve: (state, res) => {
            this.getTeams(res.data.cover.organization_id)
            this.getCover([res.data.cover.file_id])
            if (res.data.stone_materials.length < this.pageSize) {
              this.noMoreData = true
              this.loadingText = '没有更多数据了...'
            }
            let tmpArr = this.handleThumbnails(res.data.stone_materials)
            this.getFilesPublisheds(tmpArr, res.data.stone_materials)
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      async getTeams (teamId) {
        let {res} = await requestFn({
          url: '/v1/links/teams',
          params: {
            ids: teamId
          }
        })
        if (res.data) {
          this.teams = res.data.teams[0]
        }
      },
      handleThumbnails (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push(arr[i].file_id)
        }
        return tmpArr
      },
      async getCover (ids) {
        let {res} = await requestFn({
          url: '/v1/links/files/publisheds',
          params: {
            type: 'product',
            thumbs: ['general'],
            ids: ids
          }
        })
        if (res.data) {
          this.covers = res.data.files
        }
      },
      async getFilesPublisheds (ids, arr) {
        let {res} = await requestFn({
          url: '/v1/links/files/publisheds',
          params: {
            type: 'product',
            thumbs: ['general'],
            ids: ids
          }
        })
        if (res.data) {
          this.loading = false
          if (this.pageIndex === 1) {
            this.stones = this.handleStones(arr, res.data.files)
          } else {
            this.stones = [...this.stones, ...this.handleStones(arr, res.data.files)]
          }
        } else {
          this.loading = false
        }
      },
      // 手机QQ浏览器不支持array.findIndex方法
      handleStones (arr, arr2) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push({
            ...arr[i],
            file_url: '',
            file_thumb_urls: ''
          })
        }
        for (let i = 0; i < arr2.length; i++) {
          for (let j = 0; j < tmpArr.length; j++) {
            if (arr2[i].id === tmpArr[j].file_id) {
              tmpArr[j].file_url = arr2[i].url
              tmpArr[j].file_thumb_urls = arr2[i].thumb_urls[0]
              break
            }
          }
        }
        return tmpArr
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      },
      goProductDetail (item) {
        this.$router.push({name: 'ProductDetail', params: {id: item.product_id}})
      },
      viewFullScreenPic (index, arr) {
        this.currentFullScreenIndex = index + 1
        this.previewImgs = arr
        this.$refs.taxonomyCoverSwiper.swiper.slideTo(index, 1, true)
        this.showPreview = true
      },
      closePreview () {
        this.showPreview = false
        this.currentFullScreenIndex = 1
      },
      async getColors () {
        let {res} = await requestFn({
          url: '/v1/taxonomies/colours',
          params: {}
        })
        if (res.data) {
          this.colors = res.data.colours
        }
      },
      async getProvince () {
        let {res} = await requestFn({
          url: '/v1/province',
          params: {}
        })
        if (res.data) {
          this.provinces = res.data.province
        }
      },
      async getProductClasses () {
        let {res} = await requestFn({
          url: '/v1/product_classes',
          params: {}
        })
        if (res.data) {
          this.productClasses = res.data.product_classes
        }
      }
    },
    mounted () {
      this.handleScrollHeight()
    },
    activated () {
      if (!this.$store.state.popState) {
        setScrollTop(0, this.$refs.coverWrapper)
        this.getStones()
      } else {
        setScrollTop(this.$store.state.scrollMap.TaxonomyCover || 0, this.$refs.coverWrapper)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'TaxonomyCover', value: this.$refs.coverWrapper.scrollTop})
      if (to.name !== 'ProductDetail') {
        this.loading = true
        this.loadingText = '加载中...'
        this.stones = []
        this.pageIndex = 1
        this.noMoreData = false
      }
      next()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .list-container {
    @include px2rem(padding-top, 88px);
    position: relative;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 1px;
    box-sizing: border-box;
    .swipe {
      @include px2rem(height, 400px);
      @include pm2rem(margin, 0px, 0px, 0px, 0px);
      position: relative;
      overflow: hidden;
      .swiper-container {
        height: 100%;
        width: 100%;
        background-color: #E8E8E8;
      }
      .bottom-cover {
        @include px2rem(height, 60px);
        position: absolute;
        bottom: 0;
        right: 0;
        width: 100%;
        max-width: 540px;
        text-align: right;
        @include px2rem(line-height, 60px);
        z-index: 1;
        @include px2rem(padding-right, 20px);
        background-color: rgba(0, 0, 0, .3);
        color: $white;
        @include px2rem(font-size, 28px);
      }
      .swiper-container {
        height: 100%;
        width: 100%;
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
      img {
        max-width: 100%;
        max-height: 100%;
        width: inherit;
        z-index: 1;
      }
    }
  }
  .option-bar {
    position: fixed;
    @include px2rem(top, 38px);
    display: flex;
    align-items: center;
    z-index: 1004;
    .close {
      @include pm2rem(padding, 4px, 10px, 4px, 10px);
      @include px2rem(border-radius, 10px);
      @include pm2rem(margin, 0px, 30px, 0px, 30px);
      background-color: rgba(0, 0, 0, .5);
      color: white;
      z-index: 1003;
      display: flex;
      align-items: center;
      i {
        @include font-dpr(20px);
      }
    }
    .preview-page-nav {
      background-color: rgba(0, 0, 0, .5);
      @include px2rem(border-radius, 10px);
      z-index: 1003;
      @include pm2rem(padding, 4px, 10px, 4px, 10px);
    }
  }
  .full-screen-swiper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1003 !important;
    background-color: $dark;
    img[lazy=loading] {
      max-width: 100%;
      max-height: 100%;
      width: inherit;
      z-index: 1;
      background-position: center center!important;
      background: url("../../assets/imgLoading3.jpg");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=error] {
      max-width: 100%;
      max-height: 100%;
      width: inherit;
      z-index: 1;
      background-position: center center!important;
      background: url("../../assets/imgLoadingError.png");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=loaded] {
      max-width: 100%;
      max-height: 100%;
      width: inherit;
      z-index: 1;
    }
  }
  .full-screen-bg {
    background-color: $dark;
  }
</style>
