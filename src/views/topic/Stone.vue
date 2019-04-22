<template>
  <section>
    <div class="header">
      <div class="content">
        <p>专题：石材</p>
        <p>Special:stone</p>
      </div>
      <div class="back" @click="goMine()">
        <i class="iconfont icon-geren"></i>
      </div>
    </div>
    <div class="container" :style="{'height': scrollHeight}">
      <div id="stoneEnterprises" class="container-wrapper" :class="{'no-padding-bottom': !showTopicDownloadBar}" :style="{'height': scrollHeight}">
        <div ref="stoneEnterprises" class="scroll-wrapper">
          <div class="news">
            <div class="flex title">
              <img src="../../assets/topicTitle.png">
            </div>
            <div class="vertical-line"></div>
            <div class="content">2018第十八届中国厦门国际石材展览会</div>
            <a class="icon-box" @click="openPopup()">
              <i class="iconfont icon-erweima"></i>
            </a>
          </div>
          <div class="search-wrapper">
            <a @click="goTaxonomy(true)">
              <i class="iconfont icon-sousuo"></i>
              <span>搜索石材资源</span>
            </a>
          </div>
          <stone-list :store="recommendAssociations" :loading="false" :num="3" @click="goCarte" @favorite-action="favoriteAction">
          </stone-list>
          <div class="list-wrapper">
            <div class="title">
              <div class="logo-box">
                <img class="logo" src="../../assets/topicResourceLogo.png">
              </div>
              <div class="content">
                <p class="cn">资源：荒料，板材</p>
                <p class="en">Resource : block,panel</p>
              </div>
              <a class="btn" @click="goTaxonomy()">
                <i class="iconfont icon-you"></i>
              </a>
            </div>
            <resource-grid :store="taxonomies" :loading="loading" :num="6" @click="goStoneMaterial"></resource-grid>
          </div>
          <stone-list :store="resourceOrgs" :loading="false" :num="2" @click="goCarte" @favorite-action="favoriteAction">
          </stone-list>
          <div class="list-wrapper">
            <div class="title">
              <div class="logo-box">
                <img class="logo technology" src="../../assets/topicTechnologyLogo.png">
              </div>
              <div class="content">
                <p class="cn">工艺：机械工具，石材产品</p>
                <p class="en">Technology : Mechanical tools,Stone products</p>
              </div>
            </div>
            <stone-list :store="tecOrgs" :loading="false" :num="2" @click="goCarte" @favorite-action="favoriteAction">
            </stone-list>
          </div>
          <div class="list-wrapper list-no-margin">
            <div class="title">
              <div class="logo-box">
                <img class="logo service" src="../../assets/topicServiceLogo.png">
              </div>
              <div class="content">
                <p class="cn">服务：石材养护，媒体及协会</p>
                <p class="en">Service : Stone conservation,media,association</p>
              </div>
            </div>
            <stone-list :store="serviceOrgs" :loading="false" :num="1" @click="goCarte" @favorite-action="favoriteAction">
            </stone-list>
          </div>
          <div class="tips">
            <span v-show="topicPullingUp">滑动可加载更多石材企业</span>
          </div>
        </div>
      </div>
      <div id="stoneWrapper" class="container-wrapper" :class="{'no-padding-bottom': !showTopicDownloadBar}" :style="{'height': scrollHeight}">
        <div ref="stoneList" class="list">
          <div class="tips">
            <span v-show="stonePullingDown">下拉回到石材专题页</span>
          </div>
          <list
            :store="enterprises"
            :loading="moreLoading"
            :num="enterprisePageSize"
            @click="goEnterpriseCarte">
          </list>
          <div class="loading">
            <mt-spinner
              v-show="!noMoreData"
              type="snake"
              :size="18">
            </mt-spinner>
            <p>{{loadingText}}</p>
          </div>
        </div>
      </div>
    </div>
    <stone-bar v-if="showTopicDownloadBar" class="download-bar" @close="closeDownloadBar()" @download="downloadStone()"></stone-bar>
    <back-to-top
      class="back-to-top"
      :show="showGoTopBtn"
      @click="goTop()">
    </back-to-top>
    <transition name="router-fade" mode="out-in">
      <div v-if="popup" class="stone-pop">
        <div class="popup-bg"></div>
        <div class="popup-body">
          <div class="popup-content"></div>
          <div class="popup-close">
            <img src="../../assets/registClose.png" @click="closePopup()">
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
  import StoneList from '../../components/product/StoneList'
  import ResourceGrid from '../../components/common/ResourceGrid'
  import List from '../../components/enterprise/List'
  import StoneBar from '../../components/footer/StoneBar'
  import BScroll from 'better-scroll'
  import BackToTop from '../../components/common/BackToTop'
  import { getStore, setScrollTop } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  import {mapGetters} from 'vuex'
  export default {
    name: 'StoneWeb',
    data () {
      return {
        token: getStore('user') ? getStore('user').authentication_token : '',
        hasLogin: !!getStore('user'),
        loading: true,
        moreLoading: true,
        noMoreData: false,
        loadingText: '加载中...',
        enterprisePageIndex: 1,
        enterprisePageSize: 10,
        showGoTopBtn: false,
        popup: false,
        height: 1880,
        scrollHeight: '15rem',
        appHeight: 1920,
        scroll: null,
        stoneScroll: null,
        topicPullingUp: true,
        stonePullingDown: false,
        recommendAssociations: [
          {
            id: 1494,
            type: 'associations',
            logo: 'http://imgpub.yunlu6.com/ForHe82BC-pjJJHZH4iehw2RkDAg-thumb',
            name: '湖北省石材工业协会',
            address: '湖北武汉',
            favorable: false
          }, {
            id: 18735,
            type: 'mall',
            logo: 'http://imgpub.yunlu6.com/Fk80SuFKh36N1PiXfN0GC_5-Jj_O-thumb',
            name: '中国中部麻城石材循环经济产业园',
            address: '湖北武汉',
            favorable: false
          }, {
            id: 18502,
            type: 'mall',
            logo: 'http://imgpub.yunlu6.com/Fj7DGf9NrR69vZSttnWERh05Y-Io-thumb',
            name: '中部石谷',
            address: '湖北武汉',
            favorable: false
          }, {
            id: 16769,
            type: 'associations',
            logo: 'http://imgpub.yunlu6.com/FjZ4gGqJVhtlCvcxd_wuDef71XQ1-thumb',
            name: '石材矿山联盟',
            address: '湖北武汉',
            favorable: false
          }
        ],
        taxonomies: [],
        resourceOrgs: [
          {
            id: 133,
            type: 'company',
            logo: 'http://imgpub.yunlu6.com/FoBn15go-IJ7Hs9goWayYhvg2Sij-thumb',
            name: '咸丰县鑫磊矿业开发有限公司',
            address: '湖北恩施',
            favorable: false
          }, {
            id: 2510,
            type: 'company',
            logo: 'http://imgpub.yunlu6.com/FgZ9iWA-U0qenEub5V9Iq5779j1U-thumb',
            name: '五莲县山前石材有限公司',
            address: '山东日照',
            favorable: false
          }
        ],
        tecOrgs: [
          {
            id: 144,
            type: 'company',
            logo: 'http://imgpub.yunlu6.com/FnHPBflj0azvuCoDSY9fQE83EWG9-thumb',
            name: '麻城恒光石材工艺有限责任公司',
            address: '湖北黄冈',
            favorable: false
          }, {
            id: 5161,
            type: 'company',
            logo: 'http://imgpub.yunlu6.com/FuTrdX9S0J_nq8PE6gVgvvAWajIZ-thumb',
            name: '云城区润平石材销售部',
            address: '广东云浮',
            favorable: false
          }
        ],
        serviceOrgs: [
          {
            id: 1339,
            type: 'company',
            logo: 'http://imgpub.yunlu6.com/Flhj5tps_jgSNR85aoCYZgtdSBqz-thumb',
            name: '武汉德立固材料股份有限公司',
            address: '湖北武汉',
            favorable: false
          }
        ],
        servcieIds: [],
        enterprises: []
      }
    },
    components: {
      StoneList,
      ResourceGrid,
      List,
      StoneBar,
      BackToTop,
      BScroll
    },
    methods: {
      handleScrollHeight (barHeight = 140) {
        this.appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        this.height = this.appHeight - (barHeight / 75) * parseFloat(rootFontSize + '')
        let divHeight = (this.height / parseFloat(rootFontSize + '')).toFixed(2)
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      },
      goCarte (item) {
        if (item.type === 'associations') {
          this.$router.push({name: 'ComityCarte', params: {id: item.id}})
        } else if (item.type === 'mall') {
          this.$router.push({name: 'Mall', params: {id: item.id}})
        } else {
          this.$router.push({name: 'EnterpriseCarte', params: {id: item.id}})
        }
      },
      goMine () {
        if (!this.hasLogin) {
          this.goLogin()
        } else {
          this.$router.push({name: 'Mine'})
        }
      },
      goStoneMaterial (item) {
        this.$router.push({name: 'TaxonomyCover', params: {id: item.id}, query: {name: item.name}})
      },
      goTaxonomy (showFilter = false) {
        this.$router.push({name: 'Taxonomy', query: {filter: showFilter}})
      },
      getTaxonomies () {
        this.loading = true
        this.$store.dispatch('commonAction', {
          url: '/v1/taxonomies',
          method: 'get',
          params: {
            page: 1,
            per_page: 6,
            is_stone: true
          },
          target: this,
          resolve: (state, res) => {
            this.getFilesPublisheds(this.handleProductFiles(res.data.taxonomies), res.data.taxonomies)
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      handleProductFiles (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push(arr[i].cover_file_id)
        }
        return tmpArr
      },
      getFilesPublisheds (ids, products) {
        this.$store.dispatch('commonAction', {
          url: '/v1/links/files/publisheds',
          method: 'get',
          params: {
            type: 'product',
            thumbs: ['general'],
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            this.taxonomies = this.handleProducts(products, res.data.files)
            this.getServices()
            this.loading = false
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      handleProducts (products, files) {
        let tmpArr = []
        for (let i = 0; i < products.length; i++) {
          for (let j = 0; j < files.length; j++) {
            if (products[i].cover_file_id === files[j].id) {
              tmpArr.push({...products[i], logo: files[j].thumb_urls[0]})
            }
          }
        }
        return tmpArr
      },
      getServices () {
        this.moreLoading = true
        this.$store.dispatch('commonAction', {
          url: '/v1/services',
          method: 'get',
          params: {
            vocation_alias: 'stone'
          },
          target: this,
          resolve: (state, res) => {
            this.servcieIds = this.handleServiceIds(res.data.services)
            this.getEnterprises(this.servcieIds)
          },
          reject: () => {
            this.moreLoading = false
          }
        })
      },
      getEnterprises (ids) {
        this.$store.dispatch('commonAction', {
          url: '/v1/enterprises',
          method: 'get',
          params: {
            service_ids: ids,
            page: this.enterprisePageIndex,
            per_page: this.enterprisePageSize
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.enterprises.length < this.enterprisePageSize) {
              this.noMoreData = true
              this.loadingText = '没有更多数据了...'
            }
            if (this.enterprisePageIndex === 1) {
              this.enterprises = res.data.enterprises
            } else {
              this.enterprises = [...this.enterprises, ...res.data.enterprises]
            }
            this.moreLoading = false
          },
          reject: () => {
            this.moreLoading = false
          }
        })
      },
      handleServiceIds (services) {
        let tmpArr = []
        for (let i = 0; i < services.length; i++) {
          tmpArr.push(services[i].id)
        }
        return tmpArr
      },
      loadEnterpriseBottom () {
        if (!this.noMoreData) {
          this.enterprisePageIndex += 1
          this.stoneScroll.finishPullUp()
          this.getEnterprises(this.servcieIds)
        }
      },
      goEnterpriseCarte (item) {
        this.$router.push({name: 'EnterpriseCarte', params: {id: item.organization.id}})
      },
      goTop () {
        this.stoneScroll.scrollTo(0, 0, 400)
        setTimeout(() => {
          this.handleWrapperScroll('0px', '0px')
          this.scroll.scrollTo(0, 0, 400)
        }, 400)
        setTimeout(() => {
          this.showGoTopBtn = false
        }, 1000)
      },
      closeDownloadBar () {
        this.handleScrollHeight(0)
        if (!this.showGoTopBtn) {
          let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
          this.scroll.scrollBy(0, 140 / 75 * rootFontSize, 400)
        } else {
          this.handleWrapperScroll(`-${this.appHeight}px`, `-${this.appHeight}px`)
        }
        this.$store.dispatch('closeTopicDownloadBar', {status: true})
      },
      downloadStone () {
        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.yunlu6.stone'
      },
      favoritesRequest (arr, id, obj, str) {
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
            this.handleAddFavorites(arr, id, res, str)
          },
          reject: () => {
          }
        })
      },
      removeFavorites (arr, id, obj, str) {
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
            this.handleRemoveFavorites(arr, id, res, str)
          },
          reject: () => {
          }
        })
      },
      handleAddFavorites (arr, id, res, str) {
        if (res.data.favorites && res.data.favorites.id === parseInt(id)) {
          this.handleFavoritesStatus(arr, id, true)
          Toast({
            message: `你已成功收藏该${str}`,
            className: 'toast-content',
            iconClass: 'iconfont icon-caozuochenggong toast-icon-big',
            duration: 1000
          })
        } else {
          Toast({
            message: `收藏该${str}失败`,
            duration: 1000
          })
        }
      },
      handleFavoritesStatus (arr, id, status) {
        let index = 0
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === id) {
            arr[i].favorable = status
            index = i
          }
        }
        this.$set(arr, index, arr[index])
      },
      handleRemoveFavorites (arr, id, res, str) {
        if (res.data.favorable_id + '' === id + '') {
          this.handleFavoritesStatus(arr, id, false)
          Toast({
            message: `您已取消收藏该${str}`,
            duration: 500
          })
        }
      },
      favoriteAction (obj) {
        if (!this.hasLogin) {
          this.goLogin()
        } else if (!obj.item.favorable) {
          this.favoritesRequest(obj.store, obj.item.id, {team_id: obj.item.id}, obj.item.type === 'associations' ? '协会' : (obj.item.type === 'mall' ? '商城' : '企业'))
        } else {
          this.removeFavorites(obj.store, obj.item.id, {type: 'Organization'}, obj.item.type === 'associations' ? '协会' : (obj.item.type === 'mall' ? '商城' : '企业'))
        }
      },
      goLogin () {
        this.$store.dispatch('switchIntegralDialog', {status: true})
      },
      openPopup () {
        this.popup = true
      },
      closePopup () {
        this.popup = false
      },
      listenScroll () {
        this.scroll = new BScroll('#stoneEnterprises', {
          click: true,
          pullUpLoad: {
            threshold: -70
          }
        })
        this.scroll.on('scrollStart', () => {
          this.topicPullingUp = true
        })
        this.scroll.on('pullingUp', () => {
          this.topicPullingUp = true
          this.stonePullingDown = false
          this.handleWrapperScroll(`-${this.height}px`, `-${this.height}px`)
          setTimeout(() => {
            this.showGoTopBtn = true
            this.scroll.finishPullUp()
          }, 1000)
        })
        this.stoneScroll = new BScroll('#stoneWrapper', {
          click: true,
          pullUpLoad: {
            threshold: 0
          },
          pullDownRefresh: {
            threshold: 90,
            stop: 40
          }
        })
        this.stoneScroll.on('scrollStart', () => {
          this.stonePullingDown = true
          this.topicPullingUp = false
        })
        this.stoneScroll.on('pullingUp', () => {
          this.stonePullingDown = false
          this.loadEnterpriseBottom()
        })
        this.stoneScroll.on('pullingDown', () => {
          this.stonePullingDown = false
          this.topicPullingUp = true
          this.handleWrapperScroll('0px', '0px')
          setTimeout(() => {
            this.showGoTopBtn = false
            this.stoneScroll.finishPullDown()
          }, 1000)
        })
      },
      handleWrapperScroll (topicScrollHeight, stoneScrollHeight) {
        let dom1 = document.getElementById('stoneEnterprises')
        if (dom1) {
          dom1.style = `height: ${this.scrollHeight};transition: transform 1s;transform: translateY(${stoneScrollHeight});`
        }
        let dom2 = document.getElementById('stoneWrapper')
        if (dom2) {
          dom2.style = `height: ${this.scrollHeight};transition: transform 1s;transform: translateY(${topicScrollHeight});`
        }
      }
    },
    mounted () {
      this.handleScrollHeight()
      this.listenScroll()
    },
    activated () {
      if (!this.$store.state.popState || this.$store.state.fromLogin) {
        this.hasLogin = !!getStore('user')
        this.token = getStore('user') ? getStore('user').authentication_token : null
        this.getTaxonomies()
      } else {
        setScrollTop(this.$store.state.scrollMap.Stone || 0, this.$refs.stoneEnterprises)
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.name !== 'EnterpriseCarte' && to.name !== 'Login' && to.name !== 'BeforeRegister' && to.name !== 'TaxonomyCover' && to.name !== 'Taxonomy' && to.name !== 'Download' && to.name !== 'Mine') {
        this.goTop()
        let dom1 = document.getElementById('stoneEnterprises')
        dom1.style = `height: ${this.scrollHeight};transform: translateY(0px);`
        let dom2 = document.getElementById('stoneWrapper')
        dom2.style = `height: ${this.scrollHeight};transform: translateY(0px);`
        this.scroll.scrollTo(0, 0, 0)
        this.topicPullingUp = true
        this.stonePullingDown = false
        this.showGoTopBtn = false
        this.loading = true
        this.noMoreData = false
        this.popup = false
        this.loadingText = '加载中...'
        this.enterprisePageIndex = 1
        this.enterprises = []
      }
      next()
    },
    computed: {
      ...mapGetters([
        'showTopicDownloadBar'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .header {
    position: fixed;
    top: 0;
    width: 100%;
    max-width: 540px;
    background-color: $white;
    @include px2rem(height, 100px);
    border-bottom: 1px solid $second-grey;
    z-index: 1;
    .content {
      height: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      @include px2rem(font-size, 30px);
      color: $primary-dark;
    }
    .back {
      position: absolute;
      left: 0;
      top: 0;
      @include px2rem(width, 100px);
      height: inherit;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      @include px2rem(padding-left, 20px);
      i {
        @include px2rem(font-size, 40px);
        color: $primary-dark;
      }
    }
  }
  .container {
    // @include pm2rem(padding, 0px, 0px, 140px, 0px);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    .container-wrapper {
      // @include px2rem(padding-bottom, 140px);
      box-sizing: border-box;
    }
    .scroll-wrapper {
      @include px2rem(padding-top, 100px);
      box-sizing: border-box;
    }
    .news {
      @include px2rem(height, 80px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: $white;
      border-bottom: 1px solid $second-grey;
      box-sizing: border-box;
      @include px2rem(margin-bottom, 7px);
      .title {
        @include px2rem(width, 56px);
        @include px2rem(height, 56px);
        @include px2rem(margin-left, 30px);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .vertical-line {
        display: block;
        width: 0;
        border: none;
        @include px2rem(border-left-width, 2px);
        border-left-style: solid;
        border-left-color: $second-grey;
        @include px2rem(height, 48px);
      }
      .content {
        @include px2rem(font-size, 28px);
        color: $second-dark;
      }
      .icon-box {
        @include px2rem(width, 80px);
        height: inherit;
        position: relative;
        i {
          @include px2rem(font-size, 46px);
          color: $third-dark;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      & a:active {
        background-color: rgba(239, 234, 234, .5);
      }
    }
    .search-wrapper {
      background-color: $tenth-grey;
      position: relative;
      @include pm2rem(padding, 10px, 20px, 10px, 20px);
      @include px2rem(margin-bottom, 7px);
      a {
        display: block;
        @include px2rem(height, 70px);
        @include px2rem(line-height, 70px);
        @include px2rem(font-size, 28px);
        color: $third-dark;
        background-color: $white;
        @include pm2rem(padding, 0px, 20px, 0px, 20px);
        @include px2rem(border-radius, 10px);
        border: 1px solid #ededed;
        i {
          @include px2rem(font-size, 32px);
          @include px2rem(margin-right, 20px);
        }
      }
      & a:active {
        background-color: rgba(239, 234, 234, .5);
      }
    }
    .list-wrapper {
      background-color: $white;
      @include pm2rem(margin, 7px, 0px, 0px, 0px);
      .title {
        @include px2rem(height, 80px);
        @include pm2rem(padding, 0px, 20px, 0px, 0px);
        border-bottom: 1px solid $second-grey;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        position: relative;
        .logo-box {
          @include px2rem(width, 80px);
          height: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          .logo {
            @include px2rem(width, 40px);
            @include px2rem(height, 40px);
          }
          .technology {
            @include px2rem(width, 49px);
            @include px2rem(height, 35px);
          }
          .service {
            @include px2rem(width, 40px);
            @include px2rem(height, 37px);
          }
        }
        .content {
          height: inherit;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          .cn {
            @include px2rem(font-size, 26px);
            color: #555;
          }
          .en {
            @include px2rem(font-size, 22px);
            color: #555;
          }
        }
        .btn {
          position: absolute;
          height: inherit;
          right: 0;
          bottom: 0;
          @include px2rem(line-height, 80px);
          @include px2rem(font-size, 28px);
          color: #555;
          @include px2rem(width, 100px);
          text-align: center;
        }
        & a:active {
          background-color: rgba(239, 234, 234, .5);
        }
      }
    }
    .list-no-margin {
      margin-bottom: 0;
    }
    .tips {
      display: block;
      @include px2rem(height, 100px);
      @include px2rem(line-height, 100px);
      @include px2rem(font-size, 28px);
      color: $third-dark;
      text-align: center;
    }
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
  }
  .no-padding-bottom {
    padding-bottom: 0;
  }
  .download-bar {
    position: fixed;
    bottom: 0;
    left: 50%;
    width: 100%;
    max-width: 540px;
    transform: translateX(-50%);
  }
  .back-to-top {
    z-index: 1002;
  }
  .stone-pop {
    position: fixed;
    z-index: 1004;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    max-width: 540px;
    .popup-bg {
      background-color: rgba(0, 0, 0, .5);
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      max-width: 540px;
      z-index: 1004;
    }
    .popup-body {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1004;
      .popup-content {
        @include px2rem(width, 625px);
        @include px2rem(height, 983px);
        background: url("../../assets/stonePopup.png") no-repeat;
        background-size: 100%;
      }
      .popup-close {
        text-align: center;
        @include px2rem(padding-top, 44px);
        img {
          @include px2rem(width, 60px);
          @include px2rem(height, 60px);
          margin: 0 auto;
        }
      }
    }
  }
  .list {
    box-sizing: border-box;
    transform: translateY(100%);
  }
</style>
