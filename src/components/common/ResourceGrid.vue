<template>
  <section>
    <div v-if="store.length !== 0 || !loading" class="wrapper">
      <a v-for="(item, index) in store" :key="index" class="item" @click="handleClick(item)">
        <img class="logo" :src="item.logo">
        <div class="ellipsis cover">{{item.name}}</div>
      </a>
    </div>
    <div v-else class="wrapper">
      <a v-for="item in num" :key="item" class="item empty">
        <div class="logo empty-logo"></div>
        <div class="cover">
          <p class="empty-name"></p>
        </div>
      </a>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'ResourceGrid',
    props: {
      store: {
        required: true,
        type: Array,
        default: () => []
      },
      loading: {
        type: Boolean,
        default: true
      },
      num: {
        type: Number,
        default: 6
      }
    },
    data () {
      return {
        handleClick (item) {
          this.$emit('click', item)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    @include pm2rem(padding, 20px, 5px, 0px, 25px);
    box-sizing: border-box;
    .item {
      @include pm2rem(margin, 0px, 20px, 20px, 0px);
      @include px2rem(width, 220px);
      @include px2rem(height, 220px);
      position: relative;
      cursor: pointer;
      .logo {
        position: relative;
        width: 100%;
        height: 100%;
      }
      .empty-logo {
        background-color: $ninth-grey;
      }
      .cover {
        position: absolute;
        @include px2rem(bottom, -1px); // 有误差，会在底部留缝隙，向下偏移1px
        width: 100%;
        left: 0;
        box-sizing: border-box;
        @include px2rem(height, 64px);
        @include pm2rem(padding, 0px, 8px, 0px, 8px);
        background-color: rgba(255, 255, 255, .8);
        @include px2rem(font-size, 24px);
        color: $second-dark;
        @include px2rem(line-height, 64px);
        text-align: center;
      }
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
</style>
