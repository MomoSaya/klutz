<template>
  <section>
    <div v-if="loading && store.length === 0" class="list-wrapper">
      <div v-for="item in num" :key="item" class="item empty">
        <div class="empty-logo"></div>
        <div class="cover">
          <p class="empty-name"></p>
        </div>
      </div>
    </div>
    <div v-else class="list-wrapper">
      <a v-for="(item, index) in store" :key="index" class="item" @click="handleClick(item)">
        <img v-lazy="{
              src: item.file_thumb_urls,
              error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
              loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
            }">
        <div class="cover ellipsis">
          {{item.name}}
        </div>
      </a>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'TaxonomyGrid',
    props: {
      loading: {
        type: Boolean,
        default: true
      },
      num: {
        type: Number,
        default: 24
      },
      store: {
        required: true,
        type: Array,
        default: () => []
      }
    },
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
  @import "../../styles/mixin.scss";

  .list-wrapper {
    display: flex;
    flex-wrap: wrap;
    @include pm2rem(padding, 10px, 10px, 0px, 20px);
    align-items: flex-start;
    justify-content: flex-start;
    .item {
      @include px2rem(width, 230px);
      @include px2rem(height, 230px);
      box-sizing: border-box;
      @include pm2rem(margin, 0px, 10px, 10px, 0px);
      position: relative;
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
      .empty-logo {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: $ninth-grey;
      }
      .cover {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
        @include px2rem(height, 60px);
        @include px2rem(line-height, 60px);
        @include px2rem(font-size, 26px);
        color: $second-dark;
        background-color: rgba(255, 255, 255, .8);
        text-align: center;
        .empty-name {
          background-color: $ninth-grey;
          @include px2rem(height, 42px);
          @include px2rem(width, 160px);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
</style>
