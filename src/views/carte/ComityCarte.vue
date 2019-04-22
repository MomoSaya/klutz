<template>
  <section>
    <div class="full-width">
      <common-header :title="header" :icon-class="iconClass" :right-text="rightBtnText" @right-click="goReport(teams)" @back="goBack()">
      </common-header>
      <div class="container" ref="comityCarte" :style="{height: scrollHeight}">
        <div class="qr-card-container">
          <qr-card :store="teams" :products="products" :sharer="sharerInfo" @qr-code="goQrCode" @icon-click="iconClick" @click="goEnterpriseDetail" @nav="navClick">
          </qr-card>
        </div>
        <div class="carte-tab-container">
          <template v-if="loading || products && products.length > 0">
            <div>
              <transition name="fade" :appear="false" mode="out-in">
                <product-icon-list v-if="showList" :store="products" @click="goProductDetail" @favorite="handleFavorite">
                </product-icon-list>
                <product-thumbnail v-else :store="products" :loading="loading" :num="productPageSize" @click="goProductDetail" @favorite="handleFavorite">
                </product-thumbnail>
              </transition>
              <mugen-scroll :handler="loadProductBottom" :handle-on-mount="false" :should-handle="!loading" :threshold="0.1" scroll-container="comityCarte">
                <div class="loading">
                  <mt-spinner v-show="!noMoreProducts" type="snake" :size="18">
                  </mt-spinner>
                  <p>{{loadingText}}</p>
                </div>
                <foot :has-link="false"></foot>
              </mugen-scroll>
            </div>
          </template>
          <div v-else key="product1">
            <div class="no-data">
              <img src="../../assets/noProduct.png">
            </div>
            <foot :has-link="false"></foot>
          </div>
        </div>
      </div>
    </div>
    <favorite-btn v-show="teams && teams.id" :single="!showGoTopBtn" :count="favorateCount" :active="hasAddFavorites" @click="favoriteAction()">
    </favorite-btn>
    <search-btn :show="showSearchBar" @search="handleSearchBtn(queryParams)">
      <input slot="input" type="search" v-model="queryParams" @keyup.enter.prevent="handleSearchBtn(queryParams)" :placeholder="placeholder">
    </search-btn>
    <product-order :show="showSearchBar && showProduct" :order-up="productOrder" :show-list="showList" @order-change="orderChange" @no-order="orderChange" @switch="showListChange">
    </product-order>
    <template v-if="showDialog">
      <pop-dialog :store="message" @close="closeDialog">
      </pop-dialog>
    </template>
    <back-to-top :show="showGoTopBtn" @click="goScroll(0)">
    </back-to-top>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import QrCard from '../../components/common/QrCard'
  import ProductThumbnail from '../../components/product/ProductThumbnail'
  import ProductIconList from '../../components/product/ProductIconList'
  import {getStore, showBack, removeStore, setScrollTop, getUrlParams} from '../../config/mUtils'
  import PopDialog from '../../components/common/PopDialog'
  import SearchBtn from '../../components/common/SearchBtn'
  import ProductOrder from '../../components/product/ProductOrder'
  import BackToTop from '../../components/common/BackToTop'
  import Foot from '../../components/footer/Foot'
  import FavoriteBtn from '../../components/common/FavoriteBtn'
  import {Toast} from 'mint-ui'
  import {requestFn} from '../../config/request'
  import MugenScroll from 'vue-mugen-scroll'
  export default {
    props: ['id'],
    name: 'ComityCarte',
    data () {
      return {
        teamId: this.$route.params.id,
        header: '名片',
        rightBtnText: '投诉',
        iconClass: 'icon-jubao',
        height: 100,
        hasLogin: !!getStore('user'),
        token: getStore('user') ? getStore('user').authentication_token : null,
        hasSearch: false,
        showProduct: true,
        showSearchBar: false,
        placeholder: '搜索产品',
        productPageIndex: 1,
        productPageSize: 10,
        queryParams: '',
        productOrder: 0,
        showList: false,
        showGoTopBtn: false,
        showDialog: false,
        message: null,
        loading: true,
        loadingText: '加载中...',
        noMoreProducts: false,
        favorateCount: 0,
        hasAddFavorites: false,
        scrollHeight: '14rem',
        scrollActive: false,
        teams: null,
        products: [],
        sharerInfo: {}
      }
    },
    components: {
      CommonHeader,
      QrCard,
      ProductThumbnail,
      ProductIconList,
      PopDialog,
      SearchBtn,
      ProductOrder,
      BackToTop,
      FavoriteBtn,
      MugenScroll,
      Foot
    },
    methods: {
      async getTeams (teamId = this.id) {
        let {res} = await requestFn({
          url: '/v1/links/teams',
          params: {
            ids: teamId
          }
        })
        if (res.data) {
          this.teams = res.data.teams[0]
          this.header = this.teams.name
          this.handleRegistGuidDialog()
          this.getProducts()
          this.handleLikeStatus()
        }
      },
      handleRegistGuidDialog () {
        if (getStore('shareIntegral')) {
          this.$store.dispatch('switchRegistDialog', {status: !!getStore('shareIntegral')})
          removeStore('shareIntegral')
          removeStore('shareRegist')
        }
      },
      isSharedPageFn () {
        this.isSharedPage = getUrlParams(window.location.search, 'sharer_uuid') !== null
      },
      handleSharerInfo () {
        if (this.isSharedPage) {
          this.getSharerInfo(this.id, getUrlParams(window.location.search, 'sharer_uuid'))
        }
      },
      getSharerInfo (teamId = this.id, sharerId = getUrlParams(window.location.search, 'sharer_uuid')) {
        this.$store.dispatch('commonAction', {
          url: '/v1/people/inviter_info',
          method: 'get',
          params: {
            sharer_uuid: sharerId,
            team_id: this.id
          },
          target: this,
          resolve: (state, res) => {
            this.sharerInfo = state.sharerInfo = {
              name: res.data.home_name,
              logo: res.data.img,
              role: res.data.role_name
            }
            this.switchRegistBarFn(state, sharerId)
          },
          reject: () => {
          }
        })
      },
      switchRegistBarFn (state, sharerId) {
        this.$store.dispatch('switchRegistBar', {status: !state.hasCloseRegistBar && !(getStore('user') && getStore('user').mobile && !!sharerId)})
      },
      async getProducts (q = this.queryParams, order = this.productOrder) {
        this.loading = true
        this.queryParams = q
        this.productOrder = order
        let {res} = await requestFn({
          url: '/v1/products',
          params: {
            team_id: this.id,
            page: this.productPageIndex,
            per_page: this.productPageSize,
            extra_info: true,
            ...(this.token ? {token: this.token} : {}),
            ...(order === 0 ? {} : {sort: order}),
            ...(q ? {q: q} : {})
          }
        })
        if (res.data) {
          this.hasSearch = q !== ''
          if (res.data.products.length < this.productPageSize) {
            this.loadingText = '没有更多数据了...'
            this.noMoreProducts = true
          }
          this.products = this.productPageIndex === 1 ? res.data.products : [...this.products, ...res.data.products]
        }
        this.loading = false
      },
      goBack () {
        if (this.hasSearch) {
          setScrollTop(0, this.$refs.comityCarte)
          this.getProducts('', 0)
        } else if (getStore('ComityCarte_goHome')) {
          removeStore('ComityCarte_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      goReport (item) {
        this.$router.push({name: 'Report', query: {resourceId: item.enterprise_id, resourceClass: 'product'}})
      },
      searchFn (res) {
        if (this.showProduct) {
          this.getProducts(res, this.productOrder)
        }
      },
      handleSearchBtn (res) {
        // 每次搜索需重置分页索引，并滚动到指定高度(让搜索框显示出来，表明这是搜索结果)
        this.productPageIndex = 1
        setScrollTop(this.height, this.$refs.comityCarte)
        this.searchFn(res)
        document.activeElement.blur()
      },
      handleSearchBar () {
        if (!this.scrollActive) {
          showBack((status) => {
            this.showGoTopBtn = status
            this.scrollActive = true // 滚动监听被激活，不需要再次监听
            this.showSearchBar = status
          }, this.height, this.$refs.comityCarte)
        }
      },
      goScroll (scroll) {
        setScrollTop(scroll, this.$refs.comityCarte)
      },
      goProductDetail (item) {
        this.$router.push({name: 'ProductDetail', params: {id: item.id}})
      },
      goEnterpriseDetail (id) {
        if (!this.hasLogin) {
          this.goLogin()
        } else {
          this.$router.push({name: 'EnterpriseDetail', params: {id: id}})
        }
      },
      iconClick (item) {
        switch (item.type) {
          case 'chat':
            if (!this.hasLogin) {
              this.goLogin()
            } else {
              this.$router.push({name: 'Chat', query: {type: 'Product', productId: item.value}})
            }
            break
          case 'email':
            this.showPopDialog(2, '邮箱地址', item.value)
            break
          case 'website':
            window.location.href = item.value.indexOf('http') > -1 ? item.value : `http://${item.value}`
            break
          case 'qq':
            this.showPopDialog(0, 'QQ号', item.value)
            break
          case 'address':
            if (item.value.latitude && item.value.longitude) {
              this.$router.push({name: 'Maps', query: {lat: item.value.latitude, lng: item.value.longitude, title: this.teams.company}})
            } else {
              this.$router.push({name: 'Maps', query: {lat: '', lng: '', title: this.teams.company, address: item.value.address}})
            }
            break
        }
      },
      goLogin () {
        this.$store.dispatch('switchIntegralDialog', {status: true})
      },
      showPopDialog (type, name, value) {
        this.message = {
          type: type,
          name: name,
          value: value
        }
        this.showDialog = true
      },
      showListChange (val) {
        this.showList = val
      },
      orderChange (val) {
        this.productOrder = val
        this.productPageIndex = 1 // 调整价格排序后，需要从第一页重新开始获取产品数据
        this.getProducts(this.queryParams, this.productOrder)
      },
      loadProductBottom (infinite) {
        if (!this.noMoreProducts) {
          this.productPageIndex += 1
          this.getProducts()
        }
      },
      closeDialog () {
        this.showDialog = false
      },
      favoriteAction () {
        if (!this.hasLogin) {
          this.goLogin()
        } else if (!this.hasAddFavorites) {
          this.favoriteRequest(this.id, {team_id: this.id}, 'enterprise')
        } else {
          this.removeFavorites(this.id, {type: 'Organization'}, 'enterprise')
        }
      },
      removeFavorites (id, obj, str) {
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
            this.handleRemoveFavorites(id, res, str)
          },
          reject: () => {
            Toast({
              message: '取消收藏失败，请重试',
              duration: 500
            })
          }
        })
      },
      favoriteRequest (id, obj, str) {
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
            this.handleAddFavorites(id, res, str)
          },
          reject: () => {
            Toast({
              message: '收藏失败',
              duration: 1000
            })
          }
        })
      },
      handleRemoveFavorites (id, res, str) {
        if (str === 'product') {
          if (res.data.favorable_type && res.data.favorable_type === 'Product') {
            let index = this.handleIndex(this.products, id)
            this.products[index].favorable = !this.products[index].favorable
            this.$set(this.products, index, this.products[index])
          } else {
            Toast({
              message: '取消收藏该产品失败',
              duration: 1000
            })
          }
        } else {
          if (res.data.favorable_id + '' === id + '') {
            this.hasAddFavorites = false
            this.favorateCount -= 1
          }
        }
      },
      handleAddFavorites (id, res, str) {
        if (str === 'product') {
          if (res.data.favorites && res.data.favorites.id === parseInt(id)) {
            let index = this.handleIndex(this.products, res.data.favorites.id)
            this.products[index].favorable = !this.products[index].favorable
            this.$set(this.products, index, this.products[index])
          } else {
            Toast({
              message: '收藏该产品失败',
              duration: 1000
            })
          }
        } else {
          if (res.data.favorites && res.data.favorites.id === parseInt(id)) {
            this.hasAddFavorites = true
            this.favorateCount += 1
          } else {
            Toast({
              message: '收藏该协会失败',
              duration: 1000
            })
          }
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
      goQrCode (obj) {
        let sharerUuid = ''
        if (window.location.search.split('?').length > 1) {
          let params = window.location.search.split('?')[1].split('&')
          for (let i = 0; i < params.length; i++) {
            if (params[i].split('=').length > 1 && params[i].split('=')[0] === 'sharer_uuid') {
              sharerUuid = params[i].split('=')[1]
              break
            }
          }
        }
        let sharerUrl = sharerUuid ? `?sharer_uuid=${sharerUuid}` : ''
        this.$router.push({name: 'QrPage', query: {name: obj.company, state: obj.state, logo: obj.logo, hasHeader: true, url: `${window.location.protocol}//${window.location.host}/associations/${obj.id}${sharerUrl}`}})
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.height = Math.round((200 / 75) * parseFloat(rootFontSize + ''))
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      },
      handleFavorite (item) {
        if (!this.hasLogin) {
          this.goLogin()
        } else if (!item.favorable) {
          this.favoriteRequest(item.id, {product_id: item.id}, 'product')
        } else {
          this.removeFavorites(item.id, {type: 'Product'}, 'product')
        }
      },
      navClick (item) {
        switch (item.index) {
          case 0:
            this.$router.push({name: 'Information', params: {id: item.id}})
            break
          case 1:
            if (!this.hasLogin) {
              this.goLogin()
            } else {
              this.$router.push({name: 'PersonMember', params: {id: item.id}, query: {title: '个人会员'}})
            }
            break
          case 2:
            this.$router.push({name: 'Organization', params: {id: item.id}, query: {title: '企业会员', type: 'association'}})
            break
          case 3:
            this.$router.push({name: 'Information', params: {id: item.id}})
            break
          default:
            this.$router.push({name: 'Information', params: {id: item.id}})
            break
        }
      },
      async handleLikeStatus (token = this.token, teamId = this.id) {
        let {res} = await requestFn({
          url: '/v1/interactions/summary',
          params: {
            team_id: teamId,
            ...(token ? {token: token} : {})
          }
        })
        if (res.data) {
          this.hasAddFavorites = res.data.interactions.collected
          this.favorateCount = res.data.interactions.collected_total
        }
      },
      async visits (token = this.token, teamId = this.id) {
        let {res} = await requestFn({
          url: '/v1/visits',
          method: 'post',
          data: {
            ...(token ? {token} : {}),
            id: teamId,
            type: 'organization'
          }
        })
        if (res.data) {
          // 该机构新增了一条访客记录
        }
      }
    },
    mounted () {
      this.handleScrollHeight()
    },
    activated () {
      this.showGoTopBtn = false
      this.showSearchBar = false
      if (!this.$store.state.popState || this.$store.state.fromLogin) {
        setScrollTop(parseInt(this.$route.query.height + '' || 0 + ''), this.$refs.comityCarte)
        this.hasLogin = !!getStore('user')
        this.token = getStore('user') ? getStore('user').authentication_token : null
        this.getTeams(this.id)
        this.visits(this.token, this.id)
        this.isSharedPageFn()
        this.handleSharerInfo()
        this.handleSearchBar()
      } else {
        setScrollTop(this.$store.state.scrollMap.ComityCarte || 0, this.$refs.comityCarte)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'ComityCarte', value: this.$refs.comityCarte.scrollTop})
      if (to.name !== 'ProductDetail' && to.name !== 'InformationFolders' && to.name !== 'Login' && to.name !== 'BeforeRegister' && to.name !== 'Help' && to.name !== 'Maps' && to.name !== 'ShoppingCart' && to.name !== 'EnterpriseDetail' && to.name !== 'Report' && to.name !== 'Download' && to.name !== 'QrPage' && to.name !== 'Information' && to.name !== 'Organization' && to.name !== 'PersonMember') {
        this.showGoTopBtn = false
        this.showSearchBar = false
        this.productPageIndex = 1
        this.noMoreProducts = false
        this.productOrder = 0
        this.favorateCount = 0
        this.loading = true
        this.loadingText = '加载中...'
        this.hasAddFavorites = false
        this.isSharedPage = false
        this.teams = {}
        this.header = '名片'
        this.products = []
        this.sharerInfo = {}
      }
      next()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    overflow-y: scroll;
    padding-bottom: 1px; // 避免安卓手机QQ浏览器，滑动到底部后第一次不能直接上滑的bug
    -webkit-overflow-scrolling: touch;
    .qr-card-container {
      @include px2rem(padding-top, 88px);
    }
  }
</style>
