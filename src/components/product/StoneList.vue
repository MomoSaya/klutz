<template>
  <section class="wrapper">
    <a v-for="(item, index) in store" :key="index" class="item" @click="handleClick(item)">
      <img :src="item.logo" class="logo">
      <div class="content">
        <p class="ellipsis name">{{item.name}}</p>
        <div class="bottom">
          <p class="address">{{item.address}}</p>
          <div class="buttons">
            <a class="flex icon-box" @click.stop="handleFavorite(store, item)">
              <i v-if="item.favorable" class="iconfont icon-xuanzhong1 active"></i>
              <i v-else class="iconfont icon-shoucang2"></i>
            </a>
          </div>
        </div>
      </div>
    </a>
  </section>
</template>

<script>
  export default {
    name: 'StoneList',
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
        default: 3
      }
    },
    data () {
      return {
      }
    },
    methods: {
      handleClick (item) {
        this.$emit('click', item)
      },
      handleFavorite (store, item) {
        this.$emit('favorite-action', {store, item})
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .wrapper {
    background-color: $white;
    .item {
      display: flex;
      @include px2rem(height, 130px);
      align-items: center;
      justify-content: flex-start;
      @include pm2rem(padding, 0px, 20px, 0px, 20px);
      box-sizing: border-box;
      border-bottom: 1px solid $second-grey;
      .logo {
        @include px2rem(height, 90px);
        @include px2rem(width, 90px);
        @include px2rem(margin-right, 20px);
        @include px2rem(border-radius, 4px);
      }
      .content {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        height: inherit;
        overflow: hidden;
        .name {
          @include px2rem(font-size, 28px);
          color: #333;
          width: 100%;
        }
        .bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          .address {
            @include px2rem(font-size, 26px);
            @include px2rem(padding-top, 10px);
            color: $third-dark;
          }
          .buttons {
            .icon-box {
              display: inline-flex;
              @include px2rem(height, 48px);
              @include px2rem(width, 48px);
              i {
                width: 100%;
                text-align: center;
                @include px2rem(font-size, 42px);
                color: $third-dark;
              }
              .active {
                color: $second-red;
              }
            }
            & a:active {
              background-color: rgba(239, 234, 234, .5);
            }
          }
        }
      }
    }
    & a:active {
      background-color: rgba(239, 234, 234, .5);
    }
  }
</style>

