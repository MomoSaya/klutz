<template>
  <section>
    <transition name="fade" mode="out-in">
      <div v-if="loading && store.length === 0" class="grid-wrapper">
        <a
          v-for="(item, index) in num"
          :key="index"
          class="item empty">
          <div class="empty-img"></div>
          <p class="empty-name"></p>
        </a>
      </div>
      <div v-else class="grid-wrapper">
        <a
          v-for="(item, index) in store"
          :key="index"
          class="item"
          @click="handleClick(item)">
          <div
            v-lazy:background-image="{
              src: item.thumb || item.logo,
              error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
              loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
            }"
            class="image">
          </div>
          <p class="name ellipsis">{{item.name}}</p>
        </a>
      </div>
    </transition>
  </section>
</template>

<script>
  export default {
    name: 'SeeGrid',
    props: ['num', 'store', 'loading'],
    data () {
      return {

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
  @import "../../styles/mixin";

  .grid-wrapper {
    @include pm2rem(padding, 28px, 2px, 16px, 14px);
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    .item {
      @include px2rem(width, 170px);
      @include px2rem(height, 170px);
      background-color: #F7F7F7;
      position: relative;
      @include pm2rem(margin, 0px, 12px, 12px, 0px);
      .image {
        @include px2rem(width, 140px);
        @include px2rem(height, 106px);
        @include px2rem(top, 12px);
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        background-position: center center!important;
        background-repeat: no-repeat;
        background-size: cover;
      }
      .image[lazy=loading] {
        @include px2rem(width, 140px);
        @include px2rem(height, 106px);
        @include px2rem(top, 12px);
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        background-position: center center!important;
        background: url("../../assets/imgLoading3.jpg");
        background-repeat: no-repeat;
        background-size: cover;
      }
      .image[lazy=error] {
        @include px2rem(width, 140px);
        @include px2rem(height, 106px);
        @include px2rem(top, 12px);
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        background-position: center center!important;
        background: url("../../assets/imgLoadingError.png");
        background-repeat: no-repeat;
        background-size: cover;
      }
      .image[lazy=loaded] {
        @include px2rem(width, 140px);
        @include px2rem(height, 106px);
        @include px2rem(top, 12px);
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
      .empty-img {
        @include px2rem(width, 140px);
        @include px2rem(height, 106px);
        @include px2rem(top, 12px);
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        background-color: $ninth-grey;
      }
      .name {
        position: absolute;
        @include px2rem(bottom, 8px);
        left: 50%;
        transform: translateX(-50%);
        @include px2rem(font-size, 24px);
        @include px2rem(width, 170px);
        text-align: center;
        color: $primary-dark;
      }
      .empty-name {
        @include px2rem(width, 120px);
        @include px2rem(height, 22px);
        background-color: $ninth-grey;
        position: absolute;
        @include px2rem(bottom, 12px);
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .empty {
      background-color: $white;
    }
    & a:active {
      background-color: rgba(239, 234, 234, .5);
    }
  }
</style>

