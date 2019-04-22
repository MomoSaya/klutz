<template>
  <section>
    <common-header
      :title="header"
      :icon-class="iconClass"
      :right-text="rightBtnText"
      @right-click="goHome()"
      @back="goBack()">
    </common-header>
    <div class="container">
      <div class="name-wrapper">
        <div v-if="loading || !comityDetail.organization" class="wrapper">
          <div class="logo empty-logo"></div>
          <p class="name empty-name"></p>
        </div>
        <div v-else class="wrapper">
          <img class="logo" :src="comityDetail.organization.logo">
          <p class="name">{{comityDetail.name}}</p>
        </div>
      </div>
      <div class="level-wrapper">
        <div v-if="loading || !comityDetail.organization" class="wrapper">
          <div class="level">
            <div class="level-icon empty-icon"></div>
          </div>
          <div class="star-level">
            <div class="rate">
              <i v-for="item in 5" :key="item" class="iconfont icon-icon-test1"></i>
            </div>
          </div>
        </div>
        <div v-else class="wrapper">
          <div class="level">
            <svg v-if="comityDetail && comityDetail.organization && comityDetail.organization.state  && comityDetail.organization.state === 'approved'" class="icon level-icon" aria-hidden="true">
              <use xlink:href="#icon-zhenshi4"></use>
            </svg>
            <svg v-if="comityDetail && comityDetail.organization && comityDetail.organization.state  && comityDetail.organization.state !== 'approved'" class="icon level-icon" aria-hidden="true">
              <use xlink:href="#icon-zhenshi3"></use>
            </svg>
          </div>
          <div class="star-level">
            <div class="rate" v-if="comityDetail && comityDetail.organization && comityDetail.organization.state">
              <i v-for="(item, index) in starLevelComputed" :key="index" :class="{'selected': item.selected}" class="iconfont icon-icon-test1"></i>
            </div>
          </div>
        </div>
        <div
          v-if="comityDetail && comityDetail.enttype"
          class="item">
          <span class="label">机构状态</span>
          <span class="content">{{comityDetail.enttype}}</span>
        </div>
        <div
          v-if="comityDetail && comityDetail.legal_person"
          class="item">
          <span class="label">法定代表人</span>
          <span class="content">{{comityDetail.legal_person}}</span>
        </div>
        <div
          v-if="comityDetail && comityDetail.info_id"
          class="item">
          <span class="label">注册号</span>
          <span class="content">{{comityDetail.info_id}}</span>
        </div>
        <div
          v-if="comityDetail && comityDetail.reg_org"
          class="item">
          <span class="label">登记机关</span>
          <span class="content">{{comityDetail.reg_org}}</span>
        </div>
        <div
          v-if="comityDetail && comityDetail.reg_no"
          class="item">
          <span class="label">机构代码</span>
          <span class="content">{{comityDetail.reg_no}}</span>
        </div>
        <div
          v-if="comityDetail && comityDetail.id_no"
          class="item">
          <span class="label">信用代码</span>
          <span class="content">{{comityDetail.id_no}}</span>
        </div>
        <div
          v-if="comityDetail && comityDetail.organization && comityDetail.organization.service && comityDetail.organization.service.aliaz === 'mall'"
          class="item">
          <span class="label">有效期</span>
          <span class="content">
            从{{comityDetail.organization.from}}至{{comityDetail.organization.to}}止
          </span>
        </div>
      </div>
      <div v-if="archives.length > 0" class="files-wrapper">
        <div class="title">
          <img src="../../assets/IDCard.png">
          <span>社会身份</span>
        </div>
        <div class="archives">
          <a v-for="(item, index) in archives" :key="index" class="tag" @click="viewArchives(item)">
            {{item.name}}
          </a>
        </div>
      </div>
      <div v-if="comityDetail && comityDetail.organization &&  comityDetail.organization.guild_organizations && comityDetail.organization.guild_organizations.length > 0" class="social-wrapper">
        <div class="title">
          <img src="../../assets/socialCertification.png">
          <span>{{comityDetail && comityDetail.organization && comityDetail.organization.service && comityDetail.organization.service.aliaz === 'mall' ? '运营主体' : '社会认证'}}</span>
        </div>
        <a v-for="(item, index) in comityDetail.organization.guild_organizations" :key="index" class="item" @click="goCarte(item)">
          <div class="row-item">
            <span>{{item.name}}</span>
            <i class="iconfont icon-you"></i>
          </div>
        </a>
      </div>
    </div>
    <div v-show="showPreview">
      <div class="option-bar full-width">
        <div
          class="close"
          @click="closePreview()">
          <i class="iconfont icon-fanhui"></i>
        </div>
        <span class="preview-page-nav white flex font-20">{{currentFullScreenIndex}}/{{previewImgs.length}}</span>
      </div>
      <swiper
        :options="swiperOptionFullScreen"
        class="full-screen-swiper"
        ref="productDetailSwiper">
        <!-- slides -->
        <swiper-slide
          class="swiper-zoom-container full-screen-bg"
          v-for="(item, index) in previewImgs"
          :key="index">
          <img
            v-lazy="{
              src: item.url,
              error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
              loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
            }"
            alt="">
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  export default {
    name: 'EnterpriseDetail',
    data () {
      return {
        header: '信用',
        iconClass: 'icon-zhuye',
        rightBtnText: '',
        token: getStore('user') ? getStore('user').authentication_token : '',
        teamId: this.$route.params.id,
        starLevel: [],
        comityDetail: null,
        loading: true,
        currentFullScreenIndex: 1,
        archives: [],
        tempArchivesFiles: [],
        previewImgs: [],
        showPreview: false,
        swiperOptionFullScreen: {
          notNextTick: false,
          autoplay: 0,
          direction: 'horizontal',
          grabCursor: true,
          setWrapperSize: true,
          autoHeight: false,
          paginationClickable: false,
          prevButton: null,
          nextButton: null,
          mousewheelControl: true,
          observeParents: true,
          preventClicks: false,
          passiveListeners: false,
          zoom: true,
          height: window.innerHeight,
          width: window.innerWidth,
          initialSlide: 0,
          onSlideChangeEnd: (swiper) => {
            this.currentFullScreenIndex = swiper.activeIndex + 1
          }
        }
      }
    },
    components: {
      CommonHeader,
      swiper,
      swiperSlide
    },
    methods: {
      getEnterpriseDetail () {
        this.loading = true
        this.$store.dispatch('commonAction', {
          url: `/v1/enterprises/${this.teamId}/details`,
          method: 'get',
          params: {
            token: this.token
          },
          target: this,
          resolve: (state, res) => {
            this.comityDetail = res.data.enterprises
            this.getTeamArchives(res.data.enterprises.organization.id)
            this.loading = false
            if (res.data.enterprises.organization && res.data.enterprises.organization.state) {
              if (res.data.enterprises.organization.state === 'approved') {
                for (let i = 0; i < 5; i++) {
                  this.starLevel.push({index: i, selected: i < 3})
                }
              } else {
                for (let i = 0; i < 5; i++) {
                  this.starLevel.push({index: i, selected: false})
                }
              }
            }
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      handleProductFiles (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push(arr[i].file_id)
        }
        return tmpArr
      },
      viewArchives (item) {
        this.getArchivesFiles(this.handleProductFiles(item.files))
      },
      getTeamArchives (teamId) {
        this.$store.dispatch('commonAction', {
          url: `/v1/team/${teamId}/archives/public`,
          method: 'get',
          params: {},
          target: this,
          resolve: (state, res) => {
            this.archives = res.data.archives
            this.visits(teamId)
          },
          reject: () => {
          }
        })
      },
      visits (teamId) {
        this.$store.dispatch('commonAction', {
          url: '/visits',
          method: 'post',
          params: {},
          data: {
            id: teamId,
            type: 'organization',
            ...(this.token ? {token: this.token} : {})
          },
          target: this,
          resolve: (state, res) => {
            // 该机构新增了一条访客记录
          },
          reject: () => {
          }
        })
      },
      getArchivesFiles (ids) {
        this.$store.dispatch('commonAction', {
          url: '/v1/links/files/publisheds',
          method: 'get',
          params: {
            type: 'document',
            team_id: this.teamId,
            thumbs: ['general'],
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            this.tempArchivesFiles = res.data.files
            this.currentFullScreenIndex = 1
            this.viewFullScreenPic(0, res.data.files)
          },
          reject: () => {
          }
        })
      },
      viewFullScreenPic (index, arr) {
        this.currentFullScreenIndex = index + 1
        this.previewImgs = arr
        this.showPreview = true
      },
      goBack () {
        if (getStore('EnterpriseDetail_goHome')) {
          removeStore('EnterpriseDetail_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      closePreview () {
        this.showPreview = false
        this.currentFullScreenIndex = 1
      },
      goCarte (item) {
        if (item.service_name === '班级') {
          this.$router.push({name: 'Class', params: {id: item.id}})
        } else if (item.service_name === '协会') {
          this.$router.push({name: 'ComityCarte', params: {id: item.id}})
        } else if (item.service_name === '校友会') {
          this.$router.push({name: 'Alumni', params: {id: item.id}})
        } else if (item.service_name === '商城') {
          this.$router.push({name: 'Mall', params: {id: item.id}})
        } else {
          this.$router.push({name: 'EnterpriseCarte', params: {id: item.id}})
        }
      },
      goHome () {
        this.$router.push({name: 'See'})
      }
    },
    mounted () {
      this.getEnterpriseDetail()
    },
    computed: {
      starLevelComputed: function () {
        return this.starLevel.sort((a, b) => a.index - b.index)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .container {
    @include px2rem(padding-top, 88px);
    overflow-y: scroll;
    padding-bottom: 1px; // 避免安卓手机QQ浏览器，滑动到底部后第一次不能直接上滑的bug
    -webkit-overflow-scrolling: touch;
    .name-wrapper {
      @include px2rem(height, 140px);
      @include px2rem(margin-top, 16px);
      background-color: $white;
      .wrapper {
        height: inherit;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        @include px2rem(padding-left, 30px);
        .logo {
          @include px2rem(width, 120px);
          @include px2rem(height, 120px);
          @include px2rem(border-radius, 6px);
          @include px2rem(margin-right, 30px);
        }
        .empty-logo {
          background-color: $ninth-grey;
        }
        .name {
          @include px2rem(font-size, 30px);
          color: #333;
        }
        .empty-name {
          @include px2rem(height, 40px);
          @include px2rem(width, 360px);
          background-color: $ninth-grey;
        }
      }
    }
    .level-wrapper {
      border-top: 2px solid $tenth-grey;
      box-sizing: border-box;
      background-color: $white;
      .wrapper {
        @include px2rem(height, 100px);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        @include px2rem(padding-left, 30px);
        .level-icon {
          @include px2rem(font-size, 42px);
          color: $third-dark;
          @include px2rem(margin-right, 20px);
        }
        .empty-icon {
          @include px2rem(width, 42px);
          @include px2rem(height, 42px);
          border-radius: 50%;
          background-color: $ninth-grey;
        }
        .rate {
          color: $ninth-grey;
          .selected {
            color: #F7D14E;
          }
        }
      }
      .item {
        @include px2rem(margin-left, 60px);
        @include px2rem(font-size, 26px);
        @include px2rem(line-height, 52px);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #555;
        .label {
          @include px2rem(width, 186px);
          display: block;
        }
        .content {
          flex: 1;
        }
      }
    }
    .files-wrapper {
      @include px2rem(padding-left, 30px);
      box-sizing: border-box;
      background-color: $white;
      border-top: 2px solid $tenth-grey;
      .title {
        @include px2rem(height, 80px);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        img {
          @include px2rem(height, 37px);
          @include px2rem(width, 38px);
          @include px2rem(margin-right, 20px);
        }
        span {
          @include px2rem(font-size, 30px);
          color: #333;
          @include px2rem(line-height, 80px);
        }
      }
      .archives {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        @include px2rem(padding-left, 30px);
        .tag {
          display: flex;
          justify-content: center;
          align-items: center;
          @include px2rem(height, 60px);
          background-color: #F2F2F6;
          @include px2rem(font-size, 28px);
          color: $second-dark;
          @include px2rem(border-radius, 4px);
          @include pm2rem(padding, 0px, 20px, 0px, 20px);
          @include pm2rem(margin, 0px, 30px, 20px, 0px);
        }
      }
    }
    .social-wrapper {
      box-sizing: border-box;
      background-color: $white;
      border-top: 2px solid $tenth-grey;
      .title {
        @include px2rem(height, 80px);
        @include px2rem(padding-left, 30px);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        img {
          @include px2rem(height, 42px);
          @include px2rem(width, 35px);
          @include px2rem(margin-right, 20px);
        }
        span {
          @include px2rem(font-size, 30px);
          color: #333;
          @include px2rem(line-height, 80px);
        }
      }
      .item {
        @include px2rem(padding-left, 60px);
        display: flex;
        box-sizing: border-box;
        .row-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          @include px2rem(height, 90px);
          box-sizing: border-box;
          flex: 1;
          @include px2rem(padding-right, 30px);
          border-bottom: 1px solid $third-grey;
          span {
            @include px2rem(font-size, 28px);
            color: $second-dark;
          }
          i {
            @include px2rem(font-size, 36px);
            color: $third-dark;
          }
        }
      }
      .item:last-child .row-item {
        border-bottom: none;
      }
      & a:active {
        background-color: rgba(239, 234, 234, .5);
      }
    }
  }
  .option-bar {
    position: fixed;
    @include px2rem(top, 38px);
    display: flex;
    align-items: center;
    z-index: 1004;
    .close {
      @include pm2rem(padding, 4px, 10px, 4px, 10px);
      @include px2rem(border-radius, 10px);
      @include pm2rem(margin, 0px, 30px, 0px, 30px);
      background-color: rgba(0, 0, 0, .5);
      color: white;
      z-index: 1003;
      display: flex;
      align-items: center;
      i {
        @include font-dpr(20px);
      }
    }
    .preview-page-nav {
      background-color: rgba(0, 0, 0, .5);
      @include px2rem(border-radius, 10px);
      z-index: 1003;
      @include pm2rem(padding, 4px, 10px, 4px, 10px);
    }
  }
  .full-screen-swiper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1003 !important;
    background-color: $dark;
    img[lazy=loading] {
      max-width: 100%;
      max-height: 100%;
      width: inherit;
      z-index: 1;
      background-position: center center!important;
      background: url("../../assets/imgLoading3.jpg");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=error] {
      max-width: 100%;
      max-height: 100%;
      width: inherit;
      z-index: 1;
      background-position: center center!important;
      background: url("../../assets/imgLoadingError.png");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=loaded] {
      max-width: 100%;
      max-height: 100%;
      width: inherit;
      z-index: 1;
    }
  }
  .full-screen-bg {
    background-color: $dark;
  }
  .product-popup-dialog {
    position: fixed;
    width: 100%;
    max-width: 540px;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 1001;
    top: 0;
    .main {
      @include px2rem(width, 562px);
      @include px2rem(top, 200px);
    }
    .title {
      @include px2rem(height, 80px);
      text-align: center;
      @include px2rem(line-height, 80px);
    }
    .content {
      @include px2rem(min-height, 500px);
      border-bottom: 1px solid $third-grey;
      .item {
        border-bottom: 1px solid $third-grey;
        @include px2rem(height, 108px);
        display: flex;
        align-items: center;
        box-sizing: border-box;
        @include pm2rem(padding, 20px, 12px, 20px, 12px);
        img {
          @include px2rem(width, 70px);
          @include px2rem(height, 70px);
          @include px2rem(margin-right, 22px);
        }
        .info {
          div {
            line-height: 1;
          }
          p {
            line-height: 1;
            @include px2rem(max-width, 400px);
            @include px2rem(margin-bottom, 20px);
          }
          span {
            @include px2rem(margin-right, 50px);
          }
          .product-price {
            color: #F50E0E;
          }
          .width-limit {
            display: inline-flex;
            @include px2rem(max-width, 200px);
          }
        }
      }
    }
    .footer {
      @include px2rem(height, 80px);
      @include px2rem(line-height, 80px);
      text-align: center;
    }
  }
</style>
