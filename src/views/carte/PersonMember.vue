<template>
  <section>
    <common-header :title="title" @back="goBack()">
    </common-header>
    <div class="container" ref="people" :style="{height: scrollHeight}">
      <template v-if="loading || (personMembers && personMembers.length > 0)">
        <div key="person" class="list-wrapper">
          <person-list ref="list" :loading="loading" :num="pageSize" :store="personMembers" @click="goRoute">
          </person-list>
          <mugen-scroll key="person" :handler="loadBottom" :handle-on-mount="false" :should-handle="!loading" :threshold="0.1" scroll-container="people">
            <div class="loading">
              <mt-spinner v-show="!noMore" type="snake" :size="18">
              </mt-spinner>
              <p>{{loadingText}}</p>
            </div>
            <foot v-show="!footFixed" :has-link="false"></foot>
          </mugen-scroll>
        </div>
      </template>
      <div v-else key="person1" class="list-wrapper">
        <div class="no-data">
          <img src="../../assets/noPerson.png">
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
  import {getStore, removeStore, showBack, setScrollTop} from '../../config/mUtils'
  import PersonList from '../../components/common/PersonList'
  import MugenScroll from 'vue-mugen-scroll'
  import BackToTop from '../../components/common/BackToTop'
  import Foot from '../../components/footer/Foot'
  export default {
    props: ['id'],
    name: 'PersonMember',
    data () {
      return {
        title: this.$route.query.title || '个人会员',
        token: getStore('user') ? getStore('user').authentication_token : '',
        hasLogin: !!getStore('user'),
        personMembers: [],
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
      PersonList,
      MugenScroll
    },
    methods: {
      goBack () {
        if (getStore('PersonMember_goHome')) {
          removeStore('PersonMember_goHome')
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
          }, this.height, this.$refs.people)
        }
      },
      goScroll (scroll) {
        setScrollTop(scroll, this.$refs.people)
      },
      getList (q = this.queryParams) {
        this.loading = true
        this.queryParams = q
        this.$store.dispatch('commonAction', {
          url: `/v1/team/${this.id}/members`,
          method: 'get',
          params: {
            team_id: this.id,
            token: this.token,
            states: ['accepted'],
            page: this.pageIndex,
            per_page: this.pageSize,
            q: q
          },
          target: this,
          resolve: (state, res) => {
            this.loading = false
            if (res.data.preps.length < this.pageSize) {
              this.loadingText = '没有更多数据了...'
              this.noMore = true
            }
            this.personMembers = this.pageIndex === 1 ? res.data.preps : [...this.personMembers, ...res.data.preps]
            this.$nextTick(() => {
              this.handleFootPosition()
            })
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      loadBottom () {
        if (getStore('user') && !this.noMore) {
          this.pageIndex += 1
          this.getList()
        }
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.height = Math.round((240 / 75) * parseFloat(rootFontSize + ''))
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      },
      goRoute (id) {
        this.$router.push({path: `/users/${id}`})
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
      this.handleScrollHeight()
    },
    activated () {
      this.showGoTopBtn = false
      if (!this.$store.state.popState || this.$store.state.fromLogin) {
        setScrollTop(0, this.$refs.people)
        this.token = getStore('user') ? getStore('user').authentication_token : ''
        this.hasLogin = !!getStore('user')
        this.getList()
      } else {
        setScrollTop(this.$store.state.scrollMap.PersonMember || 0, this.$refs.people)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'PersonMember', value: this.$refs.people.scrollTop})
      if (to.name !== 'PersonCarte') {
        this.showGoTopBtn = false
        this.loadingText = '加载中...'
        this.queryParams = ''
        this.noMore = false
        this.pageIndex = 1
        this.loading = true
        this.footFixed = false
        this.scrollActive = false
        this.personMembers = []
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

