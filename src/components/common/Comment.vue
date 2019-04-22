<template>
  <section class="wrapper">
    <div class="total">商品评价 ({{num}})</div>
    <div v-for="(item, index) in store" :key="index" class="comment-item">
      <div class="item-wrapper">
        <div class="header">
          <img class="logo" :src="item.user.avatar_url">
          <span class="name">{{item.user.home_name}}</span>
        </div>
        <div class="content">
          <p class="text">{{item.content}}</p>
          <div v-if="item.imgs && item.imgs.length > 0" class="img-list">
            <img v-for="(i, indexI) in item.imgs" :key="indexI" :src="i.thumb_urls[0]" class="image" :class="{'no-margin': (indexI + 1) % 3 === 0}" @click="handleClick(indexI, item.imgs)">
          </div>
        </div>
        <div class="date">
          <span class="time">{{item.created_at}}</span>
        </div>
        <div v-if="item.children && item.children.length > 0" class="other-commnets">
          <div v-if="item.children[0].content && item.children[0].clazz === 'seller'" class="seller-comments">
            <p class="title">店家回复</p>
            <p class="content">{{item.children[0].content}}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'Comment',
    props: {
      store: {
        type: Array,
        required: true,
        default: () => ([])
      },
      num: {
        type: Number,
        required: true,
        default: 0
      }
    },
    data () {
      return {

      }
    },
    methods: {
      handleClick (index, arr) {
        this.$emit('click', {index: index, images: arr})
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .comment-item {
    border-bottom: 1px solid $second-grey;
    @include pm2rem(margin, 0px, 30px, 0px, 30px);
    position: relative;
    .item-wrapper {
      @include pm2rem(margin, 0px, -30px, 0px, -30px);
    }
  }
  .wrapper {
    background-color: $white;
    & :last-child {
      border-bottom: none;
    }
  }
  .total {
    @include px2rem(font-size, 27px);
    color: #333;
    @include pm2rem(padding, 20px, 0px, 10px, 25px);
  }
  .header {
    @include px2rem(height, 90px);
    @include pm2rem(padding, 10px, 25px, 0px, 25px);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .logo {
      @include px2rem(width, 70px);
      @include px2rem(height, 70px);
      border-radius: 50%;
      @include px2rem(margin-right, 15px);
    }
    .name {
      @include px2rem(font-size, 27px);
      color: #777;
    }
  }
  .content {
    .text {
      @include px2rem(font-size, 27px);
      color: #333;
      @include pm2rem(padding, 0px, 25px, 14px, 25px);
    }
    .img-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      @include pm2rem(padding, 0px, 20px, 20px, 20px);
      width: 100%;
      box-sizing: border-box;
      .image {
        @include px2rem(width, 230px);
        @include px2rem(height, 230px);
        @include pm2rem(margin, 0px, 10px, 10px, 0px);
      }
      .no-margin {
        margin-right: 0;
      }
    }
  }
  .date {
    @include pm2rem(margin, 0px, 30px, 0px, 30px);
    position: relative;
    @include px2rem(height, 60px);
    .time {
      position: absolute;
      @include px2rem(font-size, 25px);
      top: 0;
      @include px2rem(left, -5px);
      color: $third-dark;
    }
  }
  .other-commnets {
    .seller-comments {
      .title {
        @include px2rem(font-size, 27px);
        color: #333;
        @include pm2rem(padding, 0px, 25px, 14px, 25px);
      }
      .content {
        @include px2rem(font-size, 27px);
        color: #333;
        @include pm2rem(padding, 0px, 25px, 14px, 25px);
      }
    }
  }
</style>
