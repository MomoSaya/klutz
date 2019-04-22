<template>
  <section>
    <div class="full-width">
      <div v-if="fullPageLoading" class="fullscreen-loading" :style="{height: scrollHeight}">
        <div class="loading-container">
          <mt-spinner type="snake" :size="38">
          </mt-spinner>
        </div>
      </div>
      <transition name="router" mode="out-in">
        <card-header v-if="!fullPageLoading && serverSwitch === 'off'" :title="header" @back="goBack()">
        </card-header>
        <common-header v-if="!fullPageLoading && serverSwitch === 'on'" :title="header" :icon-class="iconClass" :right-text="rightBtnText" @right-click="goReport(teams)" @back="goBack()">
        </common-header>
      </transition>
      <div class="container" ref="class" :style="{height: scrollHeight}" v-lazy:background-image="{
        src: themeBgUrl,
        error: 'http://oatl31bw3.bkt.clouddn.com//yunlu-mobile/loading/loading_f2f2f2.png',
        loading: 'http://oatl31bw3.bkt.clouddn.com//yunlu-mobile/loading/loading_f2f2f2.png'
      }" :class="{'no-background': serverSwitch === 'on'}">
        <div class="qr-card-container" :class="{'only-card': serverSwitch === 'off', 'transition': hasSwitch && serverSwitch === 'on'}">
          <card-jingdianshangwu-b v-if="themeType === 'class_jingdian'" :store="teams" :sharer="sharerInfo" @qr-code="goQrCode" @icon-click="iconClick" @click="goEnterpriseDetail" @nav="navClick" @go-category="goCategory">
          </card-jingdianshangwu-b>
          <card-jianyueshangwu-b v-if="themeType === 'class_jianyue'" :store="teams" :sharer="sharerInfo" @qr-code="goQrCode" @icon-click="iconClick" @click="goEnterpriseDetail" @nav="navClick" @go-category="goCategory">
          </card-jianyueshangwu-b>
          <qr-card v-if="themeType === 'default'" :store="teams" :products="products" :sharer="sharerInfo" @qr-code="goQrCode" @icon-click="iconClick" @click="goEnterpriseDetail" @nav="navClick">
          </qr-card>
          <view-btn :show="serverSwitch === 'off'" @click="swtichServer()">
          </view-btn>
        </div>
        <div class="carte-tab-container" :class="{'hide-products': serverSwitch === 'off'}">
          <template v-if="loading || products && products.length > 0">
            <div>
              <transition name="fade" :appear="false" mode="out-in">
                <product-icon-list v-if="showList" :store="products" @click="goProductDetail" @favorite="handleFavorite">
                </product-icon-list>
                <product-thumbnail v-else :store="products" :loading="loading" :num="productPageSize" @click="goProductDetail" @favorite="handleFavorite">
                </product-thumbnail>
              </transition>
              <mugen-scroll :handler="loadProductBottom" :handle-on-mount="false" :should-handle="!loading" :threshold="0.1" scroll-container="class">
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
    <template v-if="!fullPageLoading">
      <like-btn v-show="teams && teams.id && isSharedPage" :single="!showGoTopBtn" :count="likeCount" :active="liked" :handled="handleLike" @click="likeAction()"></like-btn>
      <favorite-btn v-show="teams && teams.id" :single="!showGoTopBtn" :count="favorateCount" :active="hasAddFavorites" @click="favoriteAction()">
      </favorite-btn>
    </template>
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
  import CardHeader from '../../components/header/CardHeader'
  import QrCard from '../../components/common/QrCard'
  import CardJianyueshangwuB from '../../components/theme/CardJianyueshangwuB'
  import CardJingdianshangwuB from '../../components/theme/CardJingdianshangwuB'
  import ProductThumbnail from '../../components/product/ProductThumbnail'
  import ProductIconList from '../../components/product/ProductIconList'
  import {getStore, showBack, removeStore, setScrollTop, getUrlParams} from '../../config/mUtils'
  import PopDialog from '../../components/common/PopDialog'
  import SearchBtn from '../../components/common/SearchBtn'
  import ProductOrder from '../../components/product/ProductOrder'
  import BackToTop from '../../components/common/BackToTop'
  import Foot from '../../components/footer/Foot'
  import FavoriteBtn from '../../components/common/FavoriteBtn'
  import LikeBtn from '../../components/common/LikeBtn'
  import ViewBtn from '../../components/common/ViewBtn'
  import {Toast} from 'mint-ui'
  import {requestFn} from '../../config/request'
  import MugenScroll from 'vue-mugen-scroll'
  export default {
    props: ['id'],
    name: 'Class',
    data () {
      return {
        teamId: this.$route.params.id,
        header: '名片',
        rightBtnText: '投诉',
        iconClass: 'icon-jubao',
        themeType: 'default',
        themeBgUrl: '',
        serverSwitch: 'on',
        hasSwitch: false,
        fullPageLoading: true,
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
        likeCount: 0,
        hasAddFavorites: false,
        liked: false,
        handleLike: false,
        isSharedPage: false,
        scrollHeight: '14rem',
        scrollActive: false,
        teams: {},
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
      Foot,
      CardHeader,
      CardJianyueshangwuB,
      CardJingdianshangwuB,
      LikeBtn,
      ViewBtn
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
      async getThemes (teamId = this.id) {
        let {res} = await requestFn({
          url: `/v1/team/${teamId}/themes`
        })
        if (res.data) {
          this.themeType = res.data.themes && res.data.themes.aliaz ? res.data.themes.aliaz : 'default'
        }
        this.fullPageLoading = false
      },
      async getCardSettings (teamId = this.id, uuid, state) {
        let {res} = await requestFn({
          url: '/v1/card_settings',
          params: {
            uuid: uuid,
            team_id: teamId
          }
        })
        if (res.data) {
          this.themeBgUrl = res.data.card_settings && res.data.card_settings.bgp_url ? res.data.card_settings.bgp_url : ''
          this.serverSwitch = res.data.card_settings && res.data.card_settings.server_switch ? res.data.card_settings.server_switch : 'on'
          this.themeType = res.data.card_settings && res.data.card_settings.theme_aliaz ? res.data.card_settings.theme_aliaz : 'default'
        }
        this.fullPageLoading = false
        this.switchRegistBarFn(state, uuid)
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
        } else {
          this.getThemes(this.id)
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
            this.getCardSettings(teamId, sharerId, state)
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
          setScrollTop(0, this.$refs.class)
          this.getProducts('', 0)
        } else if (getStore('Class_goHome')) {
          removeStore('Class_goHome')
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
        setScrollTop(this.height, this.$refs.class)
        this.searchFn(res)
        document.activeElement.blur()
      },
      handleSearchBar () {
        if (!this.scrollActive) {
          showBack((status) => {
            this.showGoTopBtn = status
            this.scrollActive = true // 滚动监听被激活，不需要再次监听
            this.showSearchBar = status
          }, this.height, this.$refs.class)
        }
      },
      goScroll (scroll) {
        setScrollTop(scroll, this.$refs.class)
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
              message: '收藏该班级失败',
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
        this.$router.push({name: 'QrPage', query: {name: obj.company, state: obj.state, logo: obj.logo, hasHeader: true, url: `${window.location.protocol}//${window.location.host}/classes/${obj.id}${sharerUrl}`}})
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
              this.$router.push({name: 'PersonMember', params: {id: item.id}, query: {title: '班级成员'}})
            }
            break
          case 2:
            this.$router.push({name: 'Organization', params: {id: item.id}, query: {title: '同学企业', type: 'class'}})
            break
          case 3:
            this.$router.push({name: 'Information', params: {id: item.id}})
            break
          default:
            this.$router.push({name: 'Information', params: {id: item.id}})
            break
        }
      },
      swtichServer () {
        this.serverSwitch = 'on'
        this.hasSwitch = true
      },
      goCategory () {
        this.$router.push({name: 'Categories', params: {id: this.id}})
      },
      likeAction () {
        if (!this.hasLogin) {
          this.goLogin()
        } else {
          this.likeRequest()
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
          this.likeCount = res.data.interactions.liked_total
          this.liked = res.data.interactions.liked
          this.hasAddFavorites = res.data.interactions.collected
          this.favorateCount = res.data.interactions.collected_total
        }
      },
      async likeRequest (token = this.token, teamId = this.id) {
        let {res} = await requestFn({
          url: '/v1/votes',
          method: 'post',
          data: {
            token: token,
            team_id: teamId
          }
        })
        if (res.data) {
          this.likeCount = res.data.liked ? this.likeCount + 1 : this.likeCount - 1
          this.liked = this.handleLike = res.data.liked
        } else {
          Toast({
            message: `${this.liked ? '取消点赞' : '点赞'}失败`,
            duration: 1000
          })
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
        setScrollTop(parseInt(this.$route.query.height + '' || 0 + ''), this.$refs.class)
        this.hasLogin = !!getStore('user')
        this.token = getStore('user') ? getStore('user').authentication_token : null
        this.getTeams(this.id)
        this.visits(this.token, this.id)
        this.isSharedPageFn()
        this.handleSharerInfo()
        this.handleSearchBar()
      } else {
        setScrollTop(this.$store.state.scrollMap.Class || 0, this.$refs.class)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'Class', value: this.$refs.class.scrollTop})
      if (to.name !== 'ProductDetail' && to.name !== 'InformationFolders' && to.name !== 'Chat' && to.name !== 'Login' && to.name !== 'BeforeRegister' && to.name !== 'Help' && to.name !== 'Maps' && to.name !== 'ShoppingCart' && to.name !== 'EnterpriseDetail' && to.name !== 'Report' && to.name !== 'Download' && to.name !== 'QrPage' && to.name !== 'Information' && to.name !== 'Organization' && to.name !== 'PersonMember') {
        this.showGoTopBtn = false
        this.showSearchBar = false
        this.productPageIndex = 1
        this.noMoreProducts = false
        this.productOrder = 0
        this.favorateCount = 0
        this.likeCount = 0
        this.loading = true
        this.loadingText = '加载中...'
        this.hasAddFavorites = false
        this.liked = false
        this.handleLike = false
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
  @import '../../styles/mixin';

  .fullscreen-loading {
    width: 100%;
    height: 100%;
    max-width: 540px;
    position: relative;
    z-index: 1005;
    .loading-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .container {
    overflow-y: scroll;
    padding-bottom: 1px; // 避免安卓手机QQ浏览器，滑动到底部后第一次不能直接上滑的bug
    -webkit-overflow-scrolling: touch;
    background-color: $white;
    .qr-card-container {
      @include px2rem(padding-top, 88px);
    }
    .scroll-bar-fixed {
      @include px2rem(padding-top, 110px);
    }
    .scroll-relative {
      position: relative;
      @include px2rem(margin-bottom, 20px);
    }
    .scroll-hide {
      display: none;
    }
    .only-card {
      @include px2rem(padding-top, 225px);
    }
    .transition {
      transition: all .3s;
    }
    .hide-products {
      display: none;
    }
  }
  .no-background {
    background-image: none !important;
    background-color: $tenth-grey;
  }
  .container[lazy="loaded"] {
    height: inherit;
    width: inherit;
    z-index: 1;
    background-position: top top!important;
    background-repeat: no-repeat;
    background-size: contain;
  }
  .scroll-fixed {
    position: fixed;
    @include px2rem(top, 288px);
    @include px2rem(margin-bottom, 20px);
    max-width: 540px;
    z-index: 1;
    transform: translateY(-288px);
    width: 100%;
    overflow-x: scroll;
    white-space: nowrap;
    transition: all .3s ease-in-out;
  }
  .scroll-show {
    transform: translateY(0);
  }
</style>
