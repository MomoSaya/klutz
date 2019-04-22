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
            <div class="name">
              <div v-if="!!item.promotion && item.promotion.tag !== 'NONE'" class="tag-wrapper">
                <span class="promotion-tag" :class="{'tag-green': item.promotion.tag === '秒杀', 'tag-red': item.promotion.tag === 'HOT', 'tag-orange': item.promotion.tag === 'NEW'}">
                  {{item.promotion.tag}}
                </span>
              </div>
              <span class="text">{{item.name}}</span>
            </div>
            <div class="money">
              <div class="normal-price ellipsis">
                <span class="price-icon">&yen;</span>
                <span v-if="!!item.promotion && item.promotion.rate" class="price-num">
                  {{item | disCountFilter}}
                </span>
                <span v-else class="price-num">
                  {{item.prices.length === 0 ? '定制' : item.prices[0].money}}
                </span>
              </div>
              <del v-if="!!item.promotion" class="ellipsis">
                <span class="price-icon">&yen;</span>
                <span class="discount-price">{{item.prices[0].money}}</span>
              </del>
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
    name: 'ProductListMode',
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
    },
    filters: {
      disCountFilter (item) {
        return (Math.round(parseFloat(item.prices[0].money) * parseFloat(item.promotion.rate) * 100) / 100).toFixed(2)
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
      @include px2rem(height, 140px);
      @include pm2rem(padding, 10px, 10px, 10px, 10px);
      display: flex;
      align-items: center;
      box-sizing: border-box;
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
        height: inherit;
        position: relative;
        box-sizing: border-box;
        .name {
          line-height: 1.2;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: normal;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          .tag-wrapper {
            @include px2rem(height, 40px);
            display: inline-block;
            position: relative;
            @include px2rem(width, 66px);
            vertical-align: top;
          }
          .text {
            color: $primary-dark;
            @include px2rem(font-size, 30px);
          }
          .promotion-tag {
            color: $white;
            display: inline-block;
            @include px2rem(font-size, 24px);
            @include px2rem(width, 66px);
            @include px2rem(min-width, 66px);
            text-align: center;
            position: absolute;
            @include px2rem(top, 4px);
          }
          .tag-green {
            background-color: $green;
          }
          .tag-red {
            background-color: #ff6000;
          }
          .tag-orange {
            background-color: #ffa500;
          }
        }
        .money {
          color: $red;
          @include px2rem(height, 42px);
          @include px2rem(line-height, 36px);
          .normal-price {
            display: inline-block;
            @include px2rem(max-width, 260px);
            vertical-align: middle;
            height: inherit;
            @include px2rem(line-height, 42px);
            .price-icon {
              @include px2rem(font-size, 28px);
              @include px2rem(padding-right, 4px);
            }
            .price-num {
              @include px2rem(font-size, 32px);
              @include px2rem(max-width, 200px);
            }
          }
          del {
            @include px2rem(margin-left, 10px);
            @include px2rem(font-size, 20px);
            color: #999;
            display: inline-block;
            @include px2rem(max-width, 180px);
            height: inherit;
            @include px2rem(line-height, 48px);
            vertical-align: middle;
          }
          .discount-price {
            margin-right: 0;
          }
        }
        .empty-name {
          @include px2rem(width, 400px);
          @include px2rem(height, 30px);
          background-color: $ninth-grey;
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
