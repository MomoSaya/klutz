<template>
  <section>
    <div v-if="loading || store.length === 0" class="list-container">
      <a v-for="item in num" :key="item" class="item empty">
        <div class="empty-img"></div>
        <p class="empty-name"></p>
      </a>
    </div>
    <div v-else class="list-container">
      <a v-for="(item, index) in store" :key="index" @click="handleClick(item.user.id)" class="item">
        <img v-lazy="{
              src: item.user.avatar_url,
              error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
              loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
            }">
        <p>{{item.user.name}}</p>
      </a>
    </div>
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
        default: []
      },
      loading: {
        default: true
      },
      num: {
        default: 20
      }
    },
    methods: {
      handleClick (id) {
        this.$emit('click', id)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .list-container {
    .item {
      display: flex;
      align-items: center;
      color: $second-dark;
      border-bottom: 1px solid $third-grey;
      background-color: $white;
      @include px2rem(height, 140px);
      box-sizing: border-box;
      @include pm2rem(padding, 10px, 20px, 10px, 20px);
      p {
        @include px2rem(font-size, 34px);
      }
    }
    .empty {
      .empty-img {
        @include px2rem(width, 118px);
        @include px2rem(height, 118px);
        @include px2rem(margin-right, 30px);
        background-color: $ninth-grey;
      }
      .empty-name {
        @include px2rem(height, 36px);
        @include px2rem(width, 200px);
        background-color: $ninth-grey;
      }
    }
    a {
      text-decoration: none;
    }
    a:active {
      background-color: $tenth-grey;
    }
    img {
      @include px2rem(width, 118px);
      @include px2rem(height, 118px);
      @include px2rem(margin-right, 30px);
    }
    img[lazy="loading"] {
      @include px2rem(width, 118px);
      @include px2rem(height, 118px);
      @include px2rem(margin-right, 30px);
      background-position: center center !important;
      background: url("../../assets/imgLoading3.jpg");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy="error"] {
      @include px2rem(width, 118px);
      @include px2rem(height, 118px);
      @include px2rem(margin-right, 30px);
      background-position: center center !important;
      background: url("../../assets/imgLoadingError.png");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy="loaded"] {
      @include px2rem(width, 118px);
      @include px2rem(height, 118px);
      @include px2rem(margin-right, 30px);
    }
  }
</style>
