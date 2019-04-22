<template>
  <section class="full-width">
    <common-header
      :title="title"
      @back="goBack()">
    </common-header>
    <search :show="true" @search="getProducts(searchParams)">
      <input
        slot="input"
        type="search"
        @input="handleInput"
        @keyup.enter.prevent="handleSearch(searchParams)"
        v-model="searchParams"
        :placeholder="placeholder">
    </search>
    <div
      class="product-list-container container"
      ref="productCategory"
      :style="{height: scrollHeight}">
      <template v-if="loading || (products && products.length > 0)">
        <product-list-mode
          :store="products"
          :num="pageSize"
          :loading="loading"
          @click="goProductDetail">
        </product-list-mode>
        <mugen-scroll
          :handler="loadProductBottom"
          :handle-on-mount="false"
          :should-handle="!loading"
          :threshold="0.1"
          scroll-container="productCategory">
          <div class="loading">
            <mt-spinner
              v-show="!noMoreData"
              type="snake"
              :size="18">
            </mt-spinner>
            <p>{{loadingText}}</p>
          </div>
          <foot :has-link="false"></foot>
        </mugen-scroll>
      </template>
      <template v-if="!loading && products && products.length === 0">
        <div class="empty-products">
          <div class="img-container">
            <img src="../../assets/noSearchProducts.png">
          </div>
          <p>SORRY! 暂没有找到符合条件的信息</p>
        </div>
        <div class="empty-footer">
          <foot :has-link="false"></foot>
        </div>
      </template>
    </div>
    <back-to-top
      :show="showGoTopBtn"
      @click="goScroll(0)">
    </back-to-top>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import Search from '../../components/common/Search'
  import ProductListMode from '../../components/product/List'
  import MugenScroll from 'vue-mugen-scroll'
  import BackToTop from '../../components/common/BackToTop'
  import Foot from '../../components/footer/Foot'
  import { getStore, removeStore, showBack, setScrollTop } from '../../config/mUtils'
  import { requestFn } from '../../config/request'
  export default {
    name: 'ProductCategory',
    props: ['id'],
    data () {
      return {
        title: this.$route.query.title || '商品',
        searchParams: '',
        pageIndex: 1,
        pageSize: 20,
        loading: true,
        loadingText: '加载中...',
        placeholder: '请输入商品名称',
        products: [],
        scrollActive: false,
        noMoreData: false,
        height: 165,
        showGoTopBtn: false,
        scrollHeight: '15rem',
        hasSearch: false
      }
    },
    components: {
      CommonHeader,
      Search,
      ProductListMode,
      MugenScroll,
      BackToTop,
      Foot
    },
    methods: {
      goBack () {
        if (getStore('ProductCategory_goHome')) {
          removeStore('ProductCategory_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      async getProducts (searchParams) {
        this.loading = true
        let {res} = await requestFn({
          url: '/v1/products',
          params: {
            q: searchParams,
            page: this.pageIndex,
            per_page: this.pageSize,
            category_id: this.id
          }
        })
        if (res.data) {
          if (res.data.products.length < this.pageSize) {
            this.noMoreData = true
            this.loadingText = '没有更多数据了...'
          }
          let tmpArr = this.handleProductThumbnails(res.data.products)
          this.getFilesPublisheds(tmpArr, res.data.products)
        } else {
          this.loading = false
        }
      },
      handleProductThumbnails (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push(arr[i].file_id)
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
          this.hasSearch = true
          this.loading = false
          if (this.pageIndex === 1) {
            this.products = this.handleProducts(arr, res.data.files)
          } else {
            this.products = [...this.products, ...this.handleProducts(arr, res.data.files)]
          }
        } else {
          this.loading = false
        }
      },
      // 手机QQ浏览器不支持array.findIndex方法
      handleProducts (arr, arr2) {
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
      handleInput (e) {
        if (e.target.value === '') {
          this.resetSearchBar()
        }
        this.pageIndex = 1
      },
      resetSearchBar () {
        this.searchParams = ''
        this.hasSearch = false
        this.loading = true
        this.pageIndex = 1
        this.noMoreData = false
        this.loadingText = '加载中...'
        this.throttle(this.getProducts, this)
        setScrollTop(0, this.$refs.productCategory)
      },
      handleSearch (q) {
        // 每次搜索需重置分页索引,并重置产品列表
        this.pageIndex = 1
        this.products = []
        this.getProducts(q)
        document.activeElement.blur()
      },
      // 节流函数
      throttle (method, context) {
        clearTimeout(method.tId)
        method.tId = setTimeout(() => {
          method.call(context)
        }, 500)
      },
      handleGoTopBtn () {
        if (!this.scrollActive) {
          showBack((status) => {
            this.showGoTopBtn = status
            this.scrollActive = true
          }, this.height, this.$refs.productCategory)
        }
      },
      loadProductBottom () {
        if (!this.noMoreData) {
          this.pageIndex += 1
          this.getProducts(this.searchParams)
        }
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      },
      goProductDetail (item) {
        this.$router.push({name: 'ProductDetail', params: {id: item.id}})
      },
      goScroll (scroll) {
        setScrollTop(scroll, this.$refs.productCategory)
      }
    },
    mounted () {
      this.handleScrollHeight()
    },
    activated () {
      this.showGoTopBtn = false
      if (!this.$store.state.popState) {
        setScrollTop(0, this.$refs.productCategory)
        this.pageIndex = 1
        this.loading = true
        this.searchParams = this.$route.query.q || ''
        this.hasSearch = false
        this.loadingText = '加载中...'
        this.noMoreData = false
        this.getProducts(this.searchParams)
        this.handleGoTopBtn()
      } else {
        setScrollTop(this.$store.state.scrollMap.ProductCategory || 0, this.$refs.productCategory)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'ProductCategory', value: this.hasSearch ? this.$refs.productCategory.scrollTop : 0})
      if (to.name !== 'ProductDetail') {
        this.searchParams = ''
        this.loading = true
        this.hasSearch = false
        this.loadingText = '加载中...'
        this.products = []
        this.pageIndex = 1
        this.noMoreData = false
        this.showGoTopBtn = false
      }
      next()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    overflow-y: scroll;
    padding-bottom: 1px;
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
  }
  .product-list-container {
    position: relative;
    @include px2rem(padding-top, 178px);
    .loading {
      @include px2rem(height, 120px);
      @include px2rem(font-size, 28px);
      color: $third-dark;
      line-height: normal;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $tenth-grey;
      p {
        @include px2rem(margin-left, 20px);
      }
    }
    .empty-products {
      color: $third-dark;
      .img-container {
        text-align: center;
        @include pm2rem(padding, 30px, 0px, 40px, 0px);
        img {
          width: 50%;
        }
      }
      p {
        @include font-dpr(16px);
        text-align: center;
      }
    }
    .empty-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
    }
  }
</style>

