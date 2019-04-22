<template>
  <section>
    <common-header
      :title="headerName"
      @back="goBack()">
    </common-header>
    <div class="wrapper" ref="spaceContainer" :style="{height: scrollHeight}">
      <div class="card-container">
        <card
          :store="userCard"
          @click="cardClick">
        </card>
      </div>
      <template v-if="loading || folders && folders.length > 0">
        <div class="space-container">
          <div>
            <space-folders
              :loading="loading"
              :num="pageSize"
              :store="folders"
              @click="goFolder">
            </space-folders>
            <mugen-scroll
              :handler="loadFolderBottom"
              :handle-on-mount="false"
              :should-handle="!loading"
              :threshold="0.1"
              scroll-container="spaceContainer">
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
          </div>
        </div>
      </template>
      <template v-else>
        <div class="no-data">
          <img src="../../assets/noFile.png">
        </div>
        <foot :has-link="false"></foot>
      </template>
    </div>
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
  import { mapGetters } from 'vuex'
  import { getStore, removeStore } from '../../config/mUtils'
  import SpaceFolders from '../../components/common/SpaceFolers'
  import PopDialog from '../../components/common/PopDialog'
  import Foot from '../../components/footer/Foot'
  import MugenScroll from 'vue-mugen-scroll'
  export default {
    name: 'Spaces',
    data () {
      return {
        headerName: this.$route.query.header || '私人空间',
        p: this.$route.query.p || '',
        space_id: this.$route.params.space_id || '',
        user_id: this.$route.params.user_id || '',
        token: getStore('user') ? getStore('user').authentication_token : '',
        thumbnails: [],
        showDialog: false,
        message: null,
        folders: [],
        pageIndex: 1,
        pageSize: 6,
        targetSpaceId: '',
        targetUserId: '',
        photos: [],
        currentIndex: 1,
        showPreview: false,
        loading: true,
        loadingText: '加载中...',
        noMoreData: false,
        scrollHeight: '15rem'
      }
    },
    components: {
      CommonHeader,
      Card,
      PopDialog,
      SpaceFolders,
      MugenScroll,
      Foot
    },
    methods: {
      goFolder (item) {
        this.$router.push({path: `/v1/photos/${item.id}`,
          query: {
            name: item.name,
            p: this.p
          }
        })
      },
      getPersonDetail (url, params) {
        this.$store.dispatch('commonAction', {
          url: url,
          method: 'get',
          params: params,
          target: this,
          resolve: (state, res) => {
            state.userCard = res.data.cards
            this.getData(this.p ? '/v1/shares/zone' : '/v1/galleries', this.token, this.p, this.space_id, this.user_id)
          },
          reject: (state, err) => {
            console.dir(err)
            this.$router.replace({name: 'ReportExpired'})
          }
        })
      },
      getData (url, token, p, spaceId, userId) {
        this.loading = true
        this.$store.dispatch('commonAction', {
          url: url,
          method: 'get',
          params: {
            ...(p ? {p: p} : {}),
            ...(token && !p ? {token: token} : {}),
            ...(p ? {} : {user_id: userId}),
            ...(spaceId ? {cluster_id: spaceId} : {}),
            page: this.pageIndex,
            per_page: this.pageSize
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.gallery.length < this.pageSize) {
              this.noMoreData = true
              this.loadingText = '没有更多数据了...'
            }
            this.headerName = res.data.cluster
            this.folders = this.pageIndex === 1 ? res.data.gallery : [...this.folders, ...res.data.gallery]
            this.loading = false
          },
          reject: () => {
            this.loading = false
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
            if (item.value.latitude && item.value.longitude) {
              this.$router.push({name: 'Maps', query: {lat: item.value.latitude, lng: item.value.longitude, title: this.$store.state.teams.company}})
            } else {
              this.$router.push({name: 'Maps', query: {lat: '', lng: '', title: this.$store.state.userCard.name, address: item.value}})
            }
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
      closeDialog () {
        this.showDialog = false
      },
      goBack () {
        if (getStore('Spaces_goHome')) {
          removeStore('Spaces_goHome')
          this.$router.push({name: 'See'})
        } else if (getStore('Zone_goHome')) { // 当前页面有两种方式进入，路由名称不一样
          removeStore('Zone_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      goReportPhoto () {
        this.$router.push({name: 'Report', query: {resourceId: this.photos[this.currentIndex - 1].id, resourceClass: 'photo'}})
      },
      loadFolderBottom () {
        if (!this.noMoreData) {
          this.pageIndex += 1
          this.getPersonDetail(this.p ? '/v1/shares/card' : '/v1/business_cards', this.p ? {p: this.p, ...(this.token ? {token: this.token} : {})} : {token: this.token, user_id: this.user_id})
        }
      },
      goLogin () {
        this.$store.dispatch('switchIntegralDialog', {status: true})
      },
      handleIntegralModal () {
        if (getStore('shareIntegral')) {
          this.$store.dispatch('switchRegistDialog', {status: getStore('shareIntegral')})
          removeStore('shareIntegral')
          removeStore('shareRegist')
        }
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      }
    },
    mounted () {
      this.handleScrollHeight()
      this.handleIntegralModal()
      this.getPersonDetail(this.p ? '/v1/shares/card' : '/v1/business_cards', this.p ? {p: this.p, ...(this.token ? {token: this.token} : {})} : {token: this.token, user_id: this.user_id})
    },
    computed: {
      ...mapGetters([
        'userCard',
        'clusters'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .wrapper {
    overflow-y: scroll;
    padding-bottom: 1px;
    -webkit-overflow-scrolling: touch;
    background-color: $tenth-grey;
  }
  .card-container {
    @include px2rem(padding-top, 88px);
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
  .no-data {
    @include pm2rem(padding, 100px, 20px, 100px, 0px);
    @include pm2rem(margin, 20px, 22px, 0px, 22px);
    background-color: $white;
    text-align: center;
    border: 1px solid $fifth-grey;
    img {
      @include px2rem(width, 260px);
      height: auto;
    }
  }
</style>
