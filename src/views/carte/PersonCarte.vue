<template>
  <section>
    <div class="full-width">
      <common-header
        :title="header"
        :icon-class="iconClass"
        :right-text="rightBtnText"
        @right-click="goReport()"
        @back="goBack()">
      </common-header>
      <div class="container" ref="personCarte" :style="{'height': scrollHeight}">
        <div class="card-container">
          <card
            :store="userCard"
            @click="cardClick">
          </card>
        </div>
        <div class="space-wrapper">
          <space-list :user-approved="userCard && userCard.mobiles && userCard.mobiles.length > 0" :loading="loading" :num="10" :store="clusters" @click="goCarte">
          </space-list>
        </div>
        <div
          v-if="clusters && clusters.length === 0"
          class="no-data">
          <img src="../../assets/noPersonCarte.png">
        </div>
        <foot :has-link="false"></foot>
      </div>
    </div>
    <favorite-btn :single="true" :count="favorateCount" :active="hasAddFavorites" @click="favoriteAction()">
    </favorite-btn>
    <template v-if="showDialog">
      <pop-dialog
        :store="message"
        @close="closeDialog">
      </pop-dialog>
    </template>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import Card from '../../components/common/Card'
  import SpaceList from '../../components/common/SpaceList'
  import { getStore, removeStore, setScrollTop, getUrlParams } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  import PopDialog from '../../components/common/PopDialog'
  import FavoriteBtn from '../../components/common/FavoriteBtn'
  import {requestFn} from '../../config/request'
  import Foot from '../../components/footer/Foot'
  export default {
    props: ['user_id'],
    name: 'PersonCarte',
    data () {
      return {
        header: '名片',
        rightBtnText: '投诉',
        iconClass: 'icon-jubao',
        p: this.$route.query.p || '',
        hasLogin: !!getStore('user'),
        token: getStore('user') ? getStore('user').authentication_token : null,
        showDialog: false,
        message: null,
        loading: true,
        favorateCount: 0,
        hasAddFavorites: false,
        userCard: {},
        clusters: [],
        scrollHeight: '14rem'
      }
    },
    components: {
      CommonHeader,
      Card,
      PopDialog,
      FavoriteBtn,
      Foot,
      SpaceList
    },
    methods: {
      beforeGetData () {
        if (this.p) {
          this.getPersonDetail('/v1/shares/card', {
            p: this.p,
            ...(this.token ? {token: this.token} : {})
          })
        } else {
          this.shouldLogin()
        }
      },
      isSharedPageFn () {
        this.isSharedPage = getUrlParams(window.location.search, 'sharer_uuid') !== null
      },
      handleSharerInfo () {
        if (this.isSharedPage) {
          this.getSharerInfo(getUrlParams(window.location.search, 'sharer_uuid'))
        }
      },
      getSharerInfo (sharerId = getUrlParams(window.location.search, 'sharer_uuid')) {
        this.$store.dispatch('commonAction', {
          url: '/v1/people/inviter_info',
          method: 'get',
          params: {
            sharer_uuid: sharerId
          },
          target: this,
          resolve: (state, res) => {
            state.sharerInfo = {
              name: res.data.home_name,
              logo: res.data.img
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
      goReport () {
        this.$router.push({name: 'Report', query: {resourceId: typeof this.userCard.id === 'number' ? this.userCard.user_id : this.userCard.id, resourceClass: 'user'}})
      },
      getPersonDetail (url, params) {
        this.$store.dispatch('commonAction', {
          url: url,
          method: 'get',
          params: params,
          target: this,
          resolve: (state, res) => {
            this.userCard = res.data.cards
            this.clusters = res.data.clusters
            this.header = res.data.cards.name
            this.handleLikeStatus(this.token, typeof this.userCard.id === 'number' ? this.userCard.user_id : this.userCard.id)
          },
          reject: (state, err) => {
            console.dir(err)
            this.$router.replace({name: 'ReportExpired'})
          }
        })
      },
      cardClick (item) {
        switch (item.type) {
          case 'chat':
            if (!this.token) {
              this.goLogin()
            } else {
              this.$router.push({name: 'Chat', query: {type: item.inContact ? 'Stranger' : 'User', linkId: item.value}})
            }
            break
          case 'email':
            this.showPopDialog(2, '邮箱地址', item.value)
            break
          case 'qq':
            this.showPopDialog(0, 'QQ号', item.value)
            break
          case 'address':
            this.$router.push({name: 'Maps', query: {lat: '', lng: '', title: this.userCard.name, address: item.value}})
            break
        }
      },
      showPopDialog (type, name, value) {
        this.message = {
          type: type,
          name: name,
          value: value
        }
        this.showDialog = true
      },
      goCarte (item) {
        if (item.type === 'personal') {
          this.$router.push({path: `/users/${this.userCard.id}/spaces/${item.id}`, query: {p: this.p, header: item.name}})
        } else if (item.type === 'association') {
          this.$router.push({name: 'ComityCarte', params: {id: item.team_id}})
        } else if (item.type === 'company') {
          this.$router.push({name: 'EnterpriseCarte', params: {id: item.team_id}})
        } else if (item.type === 'class') {
          this.$router.push({name: 'Class', params: {id: item.team_id}})
        } else if (item.type === 'school') {
          this.$router.push({name: 'Alumni', params: {id: item.team_id}})
        } else if (item.type === 'mall') {
          this.$router.push({name: 'Mall', params: {id: item.team_id}})
        } else {
          this.$router.push({name: 'EnterpriseCarte', params: {id: item.team_id}})
        }
      },
      goBack () {
        if (getStore('PersonCarte_goHome')) {
          removeStore('PersonCarte_goHome')
          this.$router.push({name: 'See'})
        } else if (getStore('Card_goHome')) { // 当前页面有两种方式进入，路由名称不一样
          removeStore('Card_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      goLogin () {
        this.$store.dispatch('switchIntegralDialog', {status: true})
      },
      shouldLogin () {
        if (!this.token) {
          let toast = Toast({
            message: `您未登录，正在转入登录页`
          })
          setTimeout(() => {
            toast.close()
            this.$router.push({name: 'Login'})
          }, 2000)
        } else {
          this.getPersonDetail('/v1/business_cards', {token: this.token, user_id: this.user_id})
        }
      },
      closeDialog () {
        this.showDialog = false
      },
      favoriteAction () {
        if (!this.hasLogin) {
          this.goLogin()
        } else if (!this.hasAddFavorites) {
          this.favoriteRequest(typeof this.userCard.id === 'number' ? this.userCard.user_id : this.userCard.id)
        } else {
          this.removeFavorites(typeof this.userCard.id === 'number' ? this.userCard.user_id : this.userCard.id)
        }
      },
      removeFavorites (id) {
        this.$store.dispatch('commonAction', {
          url: `/v1/favorites/${id}`,
          method: 'delete',
          params: {},
          data: {
            token: this.token,
            id: id,
            type: 'User'
          },
          target: this,
          resolve: (state, res) => {
            if (res.status === 200 && res.data.favorable_id) {
              this.hasAddFavorites = false
              this.favorateCount -= 1
            }
          },
          reject: () => {
            Toast({
              message: '取消收藏失败，请重试',
              duration: 500
            })
          }
        })
      },
      favoriteRequest (userId) {
        this.$store.dispatch('commonAction', {
          url: '/v1/favorites',
          method: 'post',
          params: {},
          data: {
            token: this.token,
            user_id: userId
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.favorites && res.data.favorites.id && res.data.favorites.type === 'User') {
              this.hasAddFavorites = true
              this.favorateCount += 1
            } else {
              Toast({
                message: '收藏该用户失败',
                duration: 1000
              })
            }
          },
          reject: () => {
            Toast({
              message: '收藏失败',
              duration: 1000
            })
          }
        })
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      },
      async handleLikeStatus (token = this.token, userId = this.user_id) {
        let {res} = await requestFn({
          url: '/interactions/summary',
          params: {
            user_id: userId,
            ...(token ? {token: token} : {})
          }
        })
        if (res.data) {
          this.hasAddFavorites = res.data.interactions.collected
          this.favorateCount = res.data.interactions.collected_total
        }
      }
    },
    mounted () {
      this.handleScrollHeight()
    },
    activated () {
      this.loading = true
      this.favoratesText = '收藏'
      this.hasAddFavorites = false
      this.hasLogin = !!getStore('user')
      this.token = getStore('user') ? getStore('user').authentication_token : null
      if (!this.$store.state.popState || this.$store.state.fromLogin) {
        setScrollTop(0, this.$refs.personCarte)
        this.handleSharerInfo()
        if (getStore('shareIntegral')) {
          this.$store.dispatch('switchRegistDialog', {status: getStore('shareIntegral')})
          removeStore('shareIntegral')
          removeStore('shareRegist')
        }
      } else {
        setScrollTop(this.$store.state.scrollMap.PersonCarte || 0, this.$refs.personCarte)
      }
      this.beforeGetData()
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'PersonCarte', value: this.$refs.personCarte.scrollTop})
      if (to.name !== 'Chat' && to.name !== 'Report' && to.name !== 'Photos' && to.name !== 'Maps' && to.name !== 'Login' && to.name !== 'BeforeRegister' && to.name !== 'Help' && to.name !== 'Download' && to.name !== 'Spaces' && to.name !== 'ComityCarte' && to.name !== 'Mall' && to.name !== 'EnterpriseCarte' && to.name !== 'Class' && to.name !== 'Alumni') {
        this.loading = true
        this.favorateCount = 0
        this.hasAddFavorites = false
        this.userCard = {}
        this.clusters = []
        this.header = '名片'
      }
      next()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .container {
    overflow-y: scroll;
    padding-bottom: 1px;
    -webkit-overflow-scrolling: touch;
  }
  .card-container {
    @include pm2rem(padding, 88px, 0px, 0px, 0px);
  }
</style>
