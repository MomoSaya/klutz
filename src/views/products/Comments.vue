<template>
  <section>
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="comments-list" ref="comments" :style="{'height': scrollHeight}">
      <comment :store="comments" :num="commentsLength" @click="showFullScreenPreview">
      </comment>
      <mugen-scroll :handler="loadBottom" :handle-on-mount="false" :should-handle="!loading" :threshold="0.1" scroll-container="comments">
        <div class="loading">
          <mt-spinner v-show="!noMore" type="snake" :size="18">
          </mt-spinner>
          <p>{{loadingText}}</p>
        </div>
        <foot :has-link="false"></foot>
      </mugen-scroll>
    </div>
    <div v-show="showPreview">
      <div class="option-bar full-width">
        <div
          class="close"
          @click="closePreview()">
          <i class="iconfont icon-fanhui"></i>
        </div>
        <span class="preview-page-nav white flex font-20">{{currentIndex}}/{{previewImgs.length}}</span>
      </div>
      <swiper
        :options="swiperOptionFullScreen"
        class="full-screen-swiper"
        ref="commentSwiper">
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
    <back-to-top :show="showGoTopBtn" @click="goScroll(0)">
    </back-to-top>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import MugenScroll from 'vue-mugen-scroll'
  import Comment from '../../components/common/Comment'
  import Foot from '../../components/footer/Foot'
  import BackToTop from '../../components/common/BackToTop'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { getStore, removeStore, showBack, setScrollTop } from '../../config/mUtils'
  export default {
    name: 'Comments',
    props: ['id'],
    data () {
      return {
        header: '评价',
        baseComments: [],
        comments: [],
        commentsLength: 0,
        noMore: false,
        loadingText: '加载中',
        loading: true,
        pageIndex: 1,
        pageSize: 10,
        height: 150,
        scrollHeight: '14rem',
        showGoTopBtn: false,
        showPreview: false,
        currentIndex: 1,
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
            this.currentIndex = swiper.activeIndex + 1
          }
        },
        previewImgs: []
      }
    },
    components: {
      CommonHeader,
      Comment,
      MugenScroll,
      Foot,
      BackToTop,
      swiper,
      swiperSlide
    },
    methods: {
      goBack () {
        if (getStore('Comments_goHome')) {
          removeStore('Comments_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      getComments (id, pageIndex, pageSize) {
        this.loading = true
        this.$store.dispatch('commonAction', {
          url: `/v1/products/${id}/comments`,
          method: 'get',
          params: {
            page: pageIndex,
            per_page: pageSize
          },
          target: this,
          resolve: (state, res) => {
            this.commentsLength = res.data.meta.total
            let ids = this.handleFileIds(res.data.comments)
            this.getCommentImgs(ids, res.data.comments)
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      handleFileIds (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr[i].file_ids.length; j++) {
            tmpArr.push(arr[i].file_ids[j])
          }
        }
        return tmpArr
      },
      getCommentImgs (ids, comments) {
        this.$store.dispatch('commonAction', {
          url: '/v1/links/users/order_files',
          method: 'get',
          params: {
            thumbs: ['general'],
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            if (comments.length < this.pageSize) {
              this.loadingText = '没有更多数据了...'
              this.noMore = true
            }
            this.comments = this.pageIndex === 1 ? this.handleComments(comments, res.data.files) : [...this.comments, ...this.handleComments(comments, res.data.files)]
            this.loading = false
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      handleComments (comments, imgs) {
        for (let i = 0; i < comments.length; i++) {
          comments[i] = {...comments[i], imgs: []}
          for (let j = 0; j < comments[i].file_ids.length; j++) {
            for (let m = 0; m < imgs.length; m++) {
              if (comments[i].file_ids[j] === imgs[m].id) {
                comments[i].imgs.push(imgs[m])
              }
            }
          }
        }
        return comments
      },
      loadBottom () {
        if (!this.noMore) {
          this.pageIndex += 1
          this.getComments(this.id, this.pageIndex, this.pageSize)
        }
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.height = Math.round((220 / 75) * parseFloat(rootFontSize + ''))
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      },
      handleScrollTop () {
        showBack((status) => {
          this.showGoTopBtn = status
        }, this.height, this.$refs.comments, 0, 0)
      },
      goScroll (scroll) {
        setScrollTop(scroll, this.$refs.comments)
      },
      closePreview () {
        this.showPreview = false
        this.currentIndex = 1
      },
      showFullScreenPreview (item) {
        this.previewImgs = item.images
        this.currentIndex = item.index + 1
        this.$refs.commentSwiper.swiper.slideTo(item.index, 1, true)
        this.showPreview = true
      }
    },
    created () {
      this.handleScrollHeight()
    },
    mounted () {
      this.handleScrollTop()
      this.getComments(this.id, this.pageIndex, this.pageSize)
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .comments-list {
    @include px2rem(padding-top, 88px);
    position: relative;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 1px;
    box-sizing: border-box;
    .loading {
      @include px2rem(height, 120px);
      @include font-dpr(15px);
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
</style>
