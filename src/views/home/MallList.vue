<template>
  <section class="full-width">
    <common-header
      :title="title"
      @back="goBack()">
    </common-header>
    <search :show="true" @search="getMalls(searchParams)">
      <input
        slot="input"
        type="search"
        @input="handleInput"
        @keyup.enter.prevent="handleSearch(searchParams)"
        v-model="searchParams"
        :placeholder="placeholder">
    </search>
    <div
      class="list full-width"
      ref="searchMalls"
      :style="{height: scrollHeight}">
      <template v-if="loading || allMalls && allMalls.length > 0">
        <mall-list-component
          :store="allMalls"
          :loading="loading"
          :num="mallsPageSize"
          @click="goMallCarte">
        </mall-list-component>
        <mugen-scroll
          :handler="loadMallsBottom"
          :handle-on-mount="false"
          :should-handle="!loading"
          scroll-container="searchMalls">
          <div class="loading">
            <mt-spinner
              v-show="!noMoreData"
              type="snake"
              :size="18">
            </mt-spinner>
            <p>{{loadingText}}</p>
          </div>
          <foot :has-link="true"></foot>
        </mugen-scroll>
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
  import { getStore, removeStore, showBack, setScrollTop } from '../../config/mUtils'
  import MugenScroll from 'vue-mugen-scroll'
  import Foot from '../../components/footer/Foot'
  import BackToTop from '../../components/common/BackToTop'
  import MallListComponent from '../../components/enterprise/MallListComponent'
  export default {
    name: 'MallList',
    data () {
      return {
        title: '商城',
        searchParams: '',
        placeholder: '请输入商城名称',
        loading: true,
        loadingText: '加载中...',
        noMoreData: false,
        scrollHeight: '15rem',
        mallsPageSize: 20,
        mallsPageIndex: 1,
        height: 160, // 向上滚动到160px，就显示回到顶部按钮
        allMalls: [],
        scrollActive: false,
        showGoTopBtn: false
      }
    },
    components: {
      CommonHeader,
      Search,
      MugenScroll,
      MallListComponent,
      Foot,
      BackToTop
    },
    methods: {
      goBack () {
        if (getStore('MallList_goHome')) {
          removeStore('MallList_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      // 滚动到页面指定位置
      goScroll (scroll = 0) {
        setScrollTop(scroll, this.$refs.searchMalls)
      },
      getMalls () {
        this.loading = true
        this.$store.dispatch('commonAction', {
          url: '/v1/mall/index',
          method: 'get',
          params: {
            page: this.mallsPageIndex,
            per_page: this.mallsPageSize
          },
          data: {},
          target: this,
          resolve: (state, res) => {
            if (res.data.malls.length < this.mallsPageSize) {
              this.noMoreData = true
              this.loadingText = '没有更多数据了...'
            }
            if (this.mallsPageIndex === 1) {
              setScrollTop(0, this.$refs.searchMalls)
              this.allMalls = res.data.malls
            } else {
              this.allMalls = [...this.allMalls, ...res.data.malls]
            }
            this.loading = false
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      handleInput (e) {
        if (e.target.value === '') {
          this.resetSearchBar()
        }
        this.enterprisePageIndex = 1
      },
      resetSearchBar () {
        this.searchParams = ''
        this.hasSearch = false
        this.loading = true
        this.mallsPageIndex = 1
        this.noMoreData = false
        this.loadingText = '加载中...'
        this.throttle(this.getMalls, this)
        setScrollTop(0, this.$refs.searchMalls)
      },
      // 节流函数
      throttle (method, context) {
        clearTimeout(method.tId)
        method.tId = setTimeout(() => {
          method.call(context)
        }, 500)
      },
      handleSearch (q) {
        this.getMalls(q)
        document.activeElement.blur()
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      },
      loadMallsBottom () {
        if (!this.noMoreData) {
          this.mallsPageIndex += 1
          this.getMalls(this.searchParams)
        }
      },
      goMallCarte (item) {
        this.$router.push({name: 'Mall', params: {id: item.id}})
      },
      handleGoTopBtn () {
        if (!this.scrollActive) {
          showBack((status) => {
            this.showGoTopBtn = status
            this.scrollActive = true
          }, this.height, this.$refs.searchMalls)
        }
      }
    },
    mounted () {
      this.handleScrollHeight()
    },
    activated () {
      this.showGoTopBtn = false
      if (!this.$store.state.popState) {
        setScrollTop(0, this.$refs.searchMalls)
        this.mallsPageIndex = 1
        this.loading = true
        this.searchParams = ''
        this.hasSearch = false
        this.loadingText = '加载中...'
        this.noMoreData = false
        this.getMalls(this.searchParams)
        this.handleGoTopBtn()
      } else {
        setScrollTop(this.$store.state.scrollMap.MallList || 0, this.$refs.searchMalls)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'MallList', value: this.$refs.searchMalls.scrollTop})
      if (to.name === 'See') {
        this.allMalls = []
      }
      next()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .list {
    position: relative;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    margin-bottom: 1px;
    @include pm2rem(padding, 176px, 0px, 0px, 0px);
    .empty-products {
      text-align: center;
      .img-container {
        @include pm2rem(padding, 30px, 0px, 40px, 0px);
        img {
          width: 50%;
        }
      }
    }
    .loading {
      @include px2rem(height, 120px);
      @include font-dpr(15px);
      color: $second-dark;
      line-height: normal;
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        @include px2rem(margin-left, 20px);
      }
    }
  }
</style>
