<template>
  <section>
    <common-header :title="title" @back="goBack()">
    </common-header>
    <div class="container" ref="organization" :style="{height: scrollHeight}">
      <template v-if="loading || (organizations && organizations.length > 0)">
        <div key="enterprise" class="list-wrapper">
          <enterprise-list ref="list" :loading="loading" :num="pageSize" :store="organizations" @click="goRoute">
          </enterprise-list>
          <mugen-scroll key="enterprise" :handler="loadBottom" :handle-on-mount="false" :should-handle="!loading" :threshold="0.1" scroll-container="organization">
            <div class="loading">
              <mt-spinner v-show="!noMore" type="snake" :size="18">
              </mt-spinner>
              <p>{{loadingText}}</p>
            </div>
            <foot v-show="!footFixed" :has-link="false"></foot>
          </mugen-scroll>
        </div>
      </template>
      <div v-else key="enterprise1" class="list-wrapper">
        <div class="no-data">
          <img src="../../assets/noEnterprise.png">
        </div>
      </div>
      <div class="foot-component">
        <foot v-show="footFixed" :has-link="false"></foot>
      </div>
    </div>
    <back-to-top :show="showGoTopBtn" @click="goScroll(0)">
    </back-to-top>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import EnterpriseList from '../../components/common/EnterpriseList'
  import {getStore, removeStore, showBack, setScrollTop} from '../../config/mUtils'
  import MugenScroll from 'vue-mugen-scroll'
  import BackToTop from '../../components/common/BackToTop'
  import Foot from '../../components/footer/Foot'
  export default {
    props: ['id'],
    name: 'Organization',
    data () {
      return {
        title: this.$route.query.title || '企业会员',
        type: this.$route.query.type || '',
        token: getStore('user') ? getStore('user').authentication_token : '',
        hasLogin: !!getStore('user'),
        organizations: [],
        loadingText: '加载中...',
        queryParams: '',
        scrollHeight: '14rem',
        noMore: false,
        scrollActive: false,
        height: 120,
        showGoTopBtn: false,
        pageIndex: 1,
        pageSize: 20,
        loading: true,
        footFixed: false
      }
    },
    components: {
      CommonHeader,
      BackToTop,
      Foot,
      EnterpriseList,
      MugenScroll
    },
    methods: {
      goBack () {
        if (getStore('Organization_goHome')) {
          removeStore('Organization_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      handleGoTopBtn () {
        if (!this.scrollActive) {
          showBack((status) => {
            this.showGoTopBtn = status
            this.scrollActive = true
          }, this.height, this.$refs.organization)
        }
      },
      goScroll (scroll) {
        setScrollTop(scroll, this.$refs.organization)
      },
      loadBottom () {
        if (!this.noMore) {
          this.pageIndex += 1
          this.getList(this.queryParams, this.type)
        }
      },
      goRoute (item) {
        switch (item.type) {
          case '企业':
            this.$router.push({name: 'EnterpriseCarte', params: {id: item.id}})
            break
          case '班级':
            this.$router.push({name: 'Class', params: {id: item.id}})
            break
          case '':
            break
          default:
            this.$router.push({name: 'EnterpriseCarte', params: {id: item.id}})
            break
        }
      },
      getList (q = this.queryParams, type = this.type) {
        this.loading = true
        this.$store.dispatch('commonAction', {
          url: type === 'enterprise' ? '/v1/enterprises' : `/v1/team/${this.id}/guilds`,
          method: 'get',
          params: {
            team_id: this.id,
            states: ['joined'],
            page: this.pageIndex,
            per_page: this.pageSize,
            q: q
          },
          target: this,
          resolve: (state, res) => {
            this.loading = false
            this.handleResult(res, type)
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      handleResult (res, type) {
        if (type !== 'enterprise') {
          if (res.data.members.length < this.pageSize) {
            this.loadingText = '没有更多数据了...'
            this.noMore = true
          }
          this.organizations = this.pageIndex === 1 ? res.data.members : [...this.organizations, ...res.data.members]
        } else {
          if (res.data.enterprises.length < this.pageSize) {
            this.loadingText = '没有更多数据了...'
            this.noMore = true
          }
          this.organizations = this.pageIndex === 1 ? res.data.enterprises : [...this.organizations, ...res.data.enterprises]
        }
        this.$nextTick(() => {
          this.handleFootPosition()
        })
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.height = Math.round((240 / 75) * parseFloat(rootFontSize + ''))
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      },
      handleFootPosition () {
        if (this.$refs.list) {
          let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
          let footHeight = Math.round((273 / 75) * parseFloat(rootFontSize + ''))
          this.footFixed = this.$refs.list.$el.offsetTop + this.$refs.list.$el.offsetHeight + footHeight < window.screen.availHeight
        }
      }
    },
    mounted () {
      this.handleGoTopBtn()
      this.handleScrollHeight()
    },
    activated () {
      this.showGoTopBtn = false
      if (!this.$store.state.popState || this.$store.state.fromLogin) {
        setScrollTop(parseInt(this.$route.query.height + '' || 0 + ''), this.$refs.organization)
        this.token = getStore('user') ? getStore('user').authentication_token : ''
        this.hasLogin = !!getStore('user')
        this.type = this.$route.query.type || ''
        this.title = this.$route.query.title || '企业会员'
        this.getList(this.queryParams, this.type)
      } else {
        setScrollTop(this.$store.state.scrollMap.Organization || 0, this.$refs.organization)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'Organization', value: this.$refs.organization.scrollTop})
      if (to.name !== 'EnterpriseCarte' && to.name !== 'Class') {
        this.showGoTopBtn = false
        this.pageIndex = 1
        this.noMore = false
        this.loading = true
        this.footFixed = false
        this.loadingText = '加载中...'
        this.queryParams = ''
        this.type = ''
        this.scrollActive = false
        this.organizations = []
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
    .list-wrapper {
      @include px2rem(padding-top, 88px);
    }
    .loading {
      @include px2rem(height, 120px);
      @include px2rem(font-size, 28px);
      color: $third-dark;
      line-height: normal;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
          -ms-flex-align: center;
              align-items: center;
      -webkit-box-pack: center;
          -ms-flex-pack: center;
              justify-content: center;
      p {
        @include px2rem(margin-left, 20px);
      }
    }
    .foot-component {
      position: absolute;
      bottom: 0;
      width: 100%;
    }
  }
</style>
