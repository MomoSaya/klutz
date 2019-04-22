<template>
  <section>
    <transition name="fade" mode="out-in">
      <div v-if="loading && store.length === 0" class="gallery-list">
        <a
          v-for="(item, index) in num"
          :key="index"
          class="item">
          <div class="img-box empty-img">
          </div>
          <div class="content">
            <p class="name empty-name"></p>
            <div class="money empty-money"></div>
          </div>
        </a>
      </div>
      <div v-else class="gallery-list">
        <a
          v-for="(item, index) in store"
          :key="index"
          @click.stop="handleClick(item)"
          class="item">
          <div class="img-box">
            <img
              v-if="item.file_thumb_urls"
              v-lazy="{
                src: item.file_thumb_urls,
                error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
                loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
              }">
            <img
              v-else
              src="../../assets/imgLoadingError.png">
          </div>
          <div class="content">
            <span class="name">{{item.name}}</span>
            <div class="money">
              <span class="font-12">&yen;</span>
              <span class="font-16">
                {{item.product_kind === '定制' ? '定制' : (item.product_kind === '赠品' ? '赠品' : item.price_range[0])}}
              </span>
            </div>
          </div>
        </a>
      </div>
    </transition>
  </section>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    name: 'CoverList',
    props: {
      store: {
        required: true
      },
      num: {
        default: 20
      },
      loading: {
        default: false
      }
    },
    methods: {
      handleClick (item) {
        this.$emit('click', item)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .gallery-list {
    background-color: $white;
    a:active {
      background-color: rgba(239, 234, 234, .5);
    }
    .item {
      border-bottom: 1px solid $third-grey;
      @include pm2rem(padding, 10px, 10px, 10px, 10px);
      display: flex;
      align-items: center;
      .img-box {
        @include px2rem(width, 118px);
        @include px2rem(height, 118px);
        @include px2rem(margin-right, 30px);
        display: block;
        img {
          width: 100%;
          height: 100%;
        }
        img[lazy=loading] {
          width: 100%;
          height: 100%;
          background-position: center center!important;
          background: url("../../assets/imgLoading3.jpg");
          background-repeat: no-repeat;
          background-size: cover;
        }
        img[lazy=error] {
          width: 100%;
          height: 100%;
          background-position: center center!important;
          background: url("../../assets/imgLoadingError.png");
          background-repeat: no-repeat;
          background-size: cover;
        }
        img[lazy=loaded] {
          width: 100%;
          height: 100%;
        }
      }
      .empty-img {
        background-color: $ninth-grey;
      }
      .content {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        flex: 1;
        .name {
          @include font-dpr(15px);
          color: $primary-dark;
          @include px2rem(margin-bottom, 22px);
          line-height: 1;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: normal;
          -webkit-box-orient: vertical;
          display: -webkit-box;
        }
        .empty-name {
          @include px2rem(width, 400px);
          @include px2rem(height, 30px);
          background-color: $ninth-grey;
        }
        .money {
          line-height: 1;
          color: $red;
        }
        .empty-money {
          @include px2rem(width, 100px);
          @include px2rem(height, 32px);
          background-color: $ninth-grey;
        }
      }
    }
  }
</style>
