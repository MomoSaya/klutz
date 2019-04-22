<template>
  <section>
    <transition name="fade" mode="out-in">
      <div v-if="loading && store.length === 0" class="gallery">
        <div v-for="item in num" :key="item" class="item">
          <div class="img-cover">
            <div class="empty-img"></div>
          </div>
          <div class="cover">
            <p class="name empty-name"></p>
            <p class="count empty-count"></p>
          </div>
        </div>
      </div>
      <div v-else class="gallery">
        <div v-for="(item, index) in store" :key="index" class="item" @click.stop.prevent="handleClick(item)">
          <div class="img-cover">
            <img v-lazy="{
              src: item.last_photo,
              error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
              loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
            }">
          </div>
          <div class="cover">
            <p class="name">{{item.name}}</p>
            <p class="count">共有{{item.count}}张照片</p>
          </div>
        </div>
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
    props: {
      store: {
        default: () => [],
        required: true,
        type: Array
      },
      num: {
        default: 5,
        required: false,
        type: Number
      },
      loading: {
        default: true,
        required: false,
        type: Boolean
      }
    },
    methods: {
      handleClick (item) {
        this.$emit('click', {id: item.id, name: item.name})
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .gallery {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    @include pm2rem(padding, 0px, 0px, 0px, 16px);
    box-sizing: border-box;
    .item {
      @include px2rem(height, 451px);
      @include px2rem(width, 351px);
      @include pm2rem(margin, 0px, 16px, 16px, 0px);
      box-sizing: border-box;
      .img-cover {
        @include px2rem(height, 351px);
        width: inherit;
        .empty-img {
          @include px2rem(border-radius, 6px);
          width: 100%;
          height: 100%;
          background-color: $ninth-grey;
        }
        img {
          @include px2rem(border-radius, 6px);
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
      .cover {
        @include px2rem(height, 100px);
        width: inherit;
        position: relative;
        .name {
          position: absolute;
          @include px2rem(top, 10px);
          @include px2rem(font-size, 25px);
          color: #333;
        }
        .count {
          position: absolute;
          @include px2rem(bottom, 12px);
          @include px2rem(font-size, 24px);
          color: $third-dark;
        }
        .empty-name {
          @include px2rem(height, 25px);
          @include px2rem(width, 200px);
          background-color: $ninth-grey;
        }
        .empty-count {
          @include px2rem(width, 300px);
          @include px2rem(height, 24px);
          background-color: $ninth-grey;
        }
      }
    }
  }
</style>
