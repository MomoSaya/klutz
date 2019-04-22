<template>
  <section class="container">
    <div class="header">
      <div class="search-bar" @click="handleFocus()">
        <input :placeholder="placeHolder" v-model="searchParams">
        <a class="search-box" @click.stop="handleSearch()">
          <i class="iconfont icon-sousuo"></i>
        </a>
      </div>
      <div class="icon-box left" @click="goBack()">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <a v-show="showFilter" class="icon-box close" @click="closeFilter()">
        <i class="iconfont icon-guanbi"></i>
      </a>
      <a v-show="!showFilter" class="icon-box" @click="switchMenu()">
        <i class="iconfont icon-fenlei"></i>
      </a>
      <a v-show="showFilter" class="icon-box" @click="resetFilter()">
        重置
      </a>
    </div>
    <div class="grid-wrapper" ref="taxonomiesWrapper" :style="{'height': scrollHeight}">
      <template v-if="loading || taxonomies.length > 0">
        <taxonomy-grid :store="taxonomies" :num="pageSize" :loading="loading" @click="goTaxonomyCover"></taxonomy-grid>
        <mugen-scroll :handler="loadTaxonomyBottom" :handle-on-mount="false" :should-handle="!loading" :threshold="0.1" scroll-container="taxonomiesWrapper">
          <div class="loading">
            <mt-spinner v-show="!noMore" type="snake" :size="18">
            </mt-spinner>
            <p>{{loadingText}}</p>
          </div>
        </mugen-scroll>
      </template>
      <div v-else class="empty-stones">
        <img src="../../assets/emptyStones.png">
        <p>没有所搜到相关宝贝</p>
      </div>
    </div>
    <back-to-top :show="showGoTopBtn" @click="goScroll(0)">
    </back-to-top>
    <transition name="router-fade" mode="out-in">
      <div v-if="showMenu" class="option-menu">
        <div class="menu-bg" @click="closeMenu()"></div>
        <div class="menu">
          <a class="item" @click="goTopic()">返回专题页</a>
          <!-- <a class="item" @click="goCategoriesSearch()">分类搜索</a> -->
        </div>
      </div>
    </transition>
    <stone-filter :show="showFilter" :loading="filterLoading" :colors="colors" :depth="depth" :product-classes="productClasses" :selected-product-class="selectedProductClass" :surfaces="surfaces" :selected-surface="selectedSurface" :selected-depth="selectedDepth" :zones="zones" :selected-zone="selectedZone" :selected-color="selectedColor" @select-color="selectColor" @select-depth="selectDepth" @select-product-class="selectProductClass" @select-surface="selectSurface" @search="handleSearch"></stone-filter>
  </section>
</template>

<script>
  import {getStore, showBack, removeStore, setScrollTop} from '../../config/mUtils'
  import TaxonomyGrid from '../../components/product/TaxonomyGrid'
  import StoneFilter from '../../components/common/StoneFilter'
  import BackToTop from '../../components/common/BackToTop'
  import MugenScroll from 'vue-mugen-scroll'
  import { requestFn } from '../../config/request'
  export default {
    name: 'Taxonomy',
    data () {
      return {
        placeHolder: '搜索石种',
        searchParams: '',
        showMenu: false,
        showGoTopBtn: false,
        scrollActive: false,
        loading: true,
        noMore: false,
        loadingText: '加载中...',
        pageIndex: 1,
        pageSize: 24,
        height: 160,
        scrollHeight: '14rem',
        taxonomies: [],
        showFilter: !!this.$route.query.filter,
        filterLoading: true,
        colors: [
          {
            name: '黑',
            value: 'black',
            id: 1
          }, {
            name: '白',
            value: 'white',
            id: 2
          }, {
            name: '灰',
            value: 'grey',
            id: 3
          }, {
            name: '棕',
            value: 'brown',
            id: 4
          }, {
            name: '红',
            value: 'red',
            id: 5
          }, {
            name: '橙',
            value: 'orange',
            id: 6
          }, {
            name: '黄',
            value: 'yellow',
            id: 7
          }, {
            name: '绿',
            value: 'green',
            id: 8
          }, {
            name: '青',
            value: 'blueness',
            id: 9
          }, {
            name: '蓝',
            value: 'blue',
            id: 10
          }, {
            name: '紫',
            value: 'purple',
            id: 11
          }, {
            name: '其他',
            value: 'other',
            id: 12
          }
        ],
        selectedColor: {},
        depth: [
          {
            name: '深色',
            value: 'deep',
            id: 1
          }, {
            name: '浅色',
            value: 'shallow',
            id: 2
          }
        ],
        selectedDepth: {},
        pattern: [
          {
            name: '麻点状',
            value: 'pock',
            id: 1
          }, {
            name: '云纹',
            value: 'cloud',
            id: 2
          }
        ],
        selectedPattern: {},
        productClasses: [],
        selectedProductClass: {},
        zones: [],
        surfaces: [],
        selectedSurface: {},
        selectedZone: {},
        hasReset: false
      }
    },
    components: {
      BackToTop,
      TaxonomyGrid,
      MugenScroll,
      StoneFilter
    },
    methods: {
      goBack () {
        if (getStore('Taxonomy_goHome')) {
          removeStore('Taxonomy_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      goTopic () {
        this.$router.go(-1)
      },
      goCategoriesSearch () {
        console.log('123')
      },
      switchMenu () {
        this.showMenu = !this.showMenu
      },
      closeMenu () {
        this.showMenu = false
      },
      handleGoTopBtn () {
        if (!this.scrollActive) {
          showBack((status) => {
            this.showGoTopBtn = status
            this.scrollActive = true // 滚动监听被激活，不需要再次监听
          }, this.height, this.$refs.taxonomiesWrapper)
        }
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      },
      goScroll (scroll) {
        setScrollTop(scroll, this.$refs.taxonomiesWrapper)
      },
      getTaxonomies () {
        this.$store.dispatch('commonAction', {
          url: '/v1/taxonomies',
          method: 'get',
          params: {
            page: this.pageIndex,
            per_page: this.pageSize,
            ...(this.selectedColor.id ? {colour: this.selectedColor.value} : {}),
            ...(this.selectedDepth.id ? {depth: this.selectedDepth.value} : {}),
            ...(this.selectedPattern.id ? {pattern: this.selectedPattern.value} : {}),
            ...(this.selectedProductClass.id ? {product_class_id: this.selectedProductClass.id} : {}),
            ...(this.selectedSurface.id ? {surface_id: this.selectedSurface.id} : {}),
            ...(this.searchParams ? {q: this.searchParams} : {})
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.taxonomies.length < this.pageSize) {
              this.noMore = true
              this.loadingText = '没有更多数据了...'
            }
            let tmpArr = this.handleThumbnails(res.data.taxonomies)
            this.getFilesPublisheds(tmpArr, res.data.taxonomies)
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      handleThumbnails (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push(arr[i].cover_file_id)
        }
        return tmpArr
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
            this.taxonomies = this.handleTaxonomies(arr, res.data.files)
          } else {
            this.taxonomies = [...this.taxonomies, ...this.handleTaxonomies(arr, res.data.files)]
          }
        } else {
          this.loading = false
        }
      },
      // 手机QQ浏览器不支持array.findIndex方法
      handleTaxonomies (arr, arr2) {
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
            if (arr2[i].id === tmpArr[j].cover_file_id) {
              tmpArr[j].file_url = arr2[i].url
              tmpArr[j].file_thumb_urls = arr2[i].thumb_urls[0]
              break
            }
          }
        }
        return tmpArr
      },
      goTaxonomyCover (item) {
        this.$router.push({name: 'TaxonomyCover', params: {id: item.id}, query: {name: item.name}})
      },
      loadTaxonomyBottom () {
        if (!this.noMore) {
          this.pageIndex += 1
          this.getTaxonomies()
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
        this.getProductProvinces()
      },
      async getProductProvinces () {
        let {res} = await requestFn({
          url: '/v1/province',
          params: {}
        })
        if (res.data) {
          this.zones = res.data.province
        }
        this.filterLoading = false
      },
      async getProductDistricts (code) {
        let {res} = await requestFn({
          url: '/v1/district',
          params: {
            code: code
          }
        })
        if (res.data) {
          this.zones = res.data.district
        }
      },
      handleFocus () {
        this.showFilter = true
        this.getProductClasses()
      },
      selectColor (item) {
        let index = this.colors.findIndex(i => item.id === i.id)
        this.selectedColor = this.colors[index]
        this.placeHolder = '已选择过滤条件'
        this.hasReset = false
      },
      selectDepth (item) {
        let index = this.depth.findIndex(i => item.id === i.id)
        this.selectedDepth = this.depth[index]
        this.placeHolder = '已选择过滤条件'
        this.hasReset = false
      },
      selectProductClass (item) {
        let index = this.productClasses.findIndex(i => item.id === i.id)
        this.selectedProductClass = this.productClasses[index]
        this.surfaces = this.productClasses[index].surfaces
        this.placeHolder = '已选择过滤条件'
        this.hasReset = false
      },
      selectSurface (item) {
        let index = this.surfaces.findIndex(i => item.id === i.id)
        this.selectedSurface = this.surfaces[index]
        this.placeHolder = '已选择过滤条件'
        this.hasReset = false
      },
      closeFilter () {
        this.showFilter = false
        if (this.hasReset) {
          this.surfaces = []
          this.getTaxonomies()
        }
      },
      resetFilter () {
        this.selectedColor = {}
        this.selectedDepth = {}
        this.selectedProductClass = {}
        this.selectedSurface = {}
        this.surfaces = []
        this.searchParams = ''
        this.placeHolder = '搜索石种'
        this.pageIndex = 1
        this.hasReset = true
      },
      handleSearch () {
        this.closeFilter()
        this.getTaxonomies()
      }
    },
    mounted () {
      this.handleScrollHeight()
    },
    activated () {
      if (!this.$store.state.popState || this.$store.state.fromLogin) {
        setScrollTop(0, this.$refs.taxonomiesWrapper)
        this.handleGoTopBtn()
        this.getTaxonomies()
        if (this.$route.query.filter) {
          this.handleFocus()
        }
      } else {
        setScrollTop(this.$store.state.scrollMap.Taxonomy || 0, this.$refs.taxonomiesWrapper)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'Taxonomy', value: this.$refs.taxonomiesWrapper.scrollTop})
      if (to.name !== 'TaxonomyCover') {
        this.showGoTopBtn = false
        this.showMenu = false
        this.pageIndex = 1
        this.noMore = false
        this.loading = true
        this.loadingText = '加载中...'
        this.taxonomies = []
        this.hasReset = false
        this.showFilter = false
        this.filterLoading = true
        this.selectedColor = {}
        this.selectedDepth = {}
        this.selectedPattern = {}
        this.productClasses = []
        this.selectedProductClass = {}
        this.surfaces = []
        this.selectedSurface = {}
        this.searchParams = ''
      }
      next()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .container {
    position: relative;
  }
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    max-width: 540px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @include px2rem(height, 88px);
    background-color: $green;
    z-index: 1004;
    .icon-box {
      position: absolute;
      right: 0;
      color: $white;
      @include px2rem(font-size, 28px);
      height: inherit;
      @include px2rem(line-height, 88px);
      @include px2rem(width, 80px);
      text-align: center;
    }
    .left {
      left: 0;
    }
    .close {
      @include px2rem(right, 80px);
    }
    .search-bar {
      position: relative;
      margin: 0 auto;
      input {
        position: relative;
        @include px2rem(width, 400px);
        @include px2rem(height, 68px);
        @include px2rem(border-radius, 40px);
        border: none;
        @include pm2rem(padding, 0px, 20px, 0px, 20px);
        box-sizing: border-box;
        @include px2rem(font-size, 26px);
      }
      ::-webkit-input-placeholder{
        color: $eighth-grey;
        @include px2rem(height, 68px);
        text-align: left;
        border: none;
        @include px2rem(font-size, 26px);
        @include px2rem(line-height, 68px);
      }
      .search-box {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        @include px2rem(right, 20px);
        @include px2rem(height, 68px);
        @include px2rem(line-height, 68px);
        @include px2rem(width, 68px);
        text-align: center;
        i {
          @include px2rem(font-size, 32px);
          color: $third-dark;
        }
      }
    }
    & a:active {
      opacity: .8;
    }
  }
  .grid-wrapper {
    position: relative;
    overflow-y: scroll;
    padding-bottom: 1px; // 避免安卓手机QQ浏览器，滑动到底部后第一次不能直接上滑的bug
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    @include px2rem(padding-top, 88px);
    .loading {
      @include px2rem(height, 120px);
      @include px2rem(font-size, 28px);
      color: $third-dark;
      line-height: normal;
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        @include px2rem(margin-left, 20px);
      }
    }
    .empty-stones {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      img {
        @include px2rem(width, 372px);
        @include px2rem(height, 334px);
      }
      p {
        @include px2rem(font-size, 32px);
        color: $third-dark;
        margin: 0 auto;
        @include px2rem(margin-top, 40px);
        text-align: center;
      }
    }
  }
  .option-menu {
    position: fixed;
    @include px2rem(top, 88px);
    height: 100%;
    width: 100%;
    max-width: 540px;
    z-index: 1004;
    .menu-bg {
      height: 100%;
      width: 100%;
      z-index: 1003;
    }
    .menu {
      position: fixed;
      @include px2rem(top, 96px);
      @include px2rem(right, 10px);
      background-color: $white;
      @include px2rem(width, 240px);
      @include px2rem(border-radius, 10px);
      z-index: 1004;
      .item {
        display: block;
        border-bottom: 1px solid $second-grey;
        @include px2rem(height, 80px);
        @include px2rem(line-height, 80px);
        color: $second-dark;
        @include px2rem(font-size, 26px);
        box-sizing: border-box;
        text-align: center;
      }
      & .item:last-child {
        border-bottom: none;
      }
      & a:active {
        background-color: rgba(239, 234, 234, .5);
      }
    }
    .menu::before {
      content: '';
      display: inline-block;
      position: absolute;
      @include px2rem(border-left-width, 14px);
      @include px2rem(border-right-width, 14px);
      @include px2rem(border-bottom-width, 28px);
      border-left-color: transparent;
      border-right-color: transparent;
      border-bottom-color: $white;
      border-style: solid;
      border-top: none;
      width: 0;
      height: 0;
      @include px2rem(top, -28px);
      @include px2rem(right, 16px);
    }
  }
</style>
