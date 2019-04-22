<template>
  <section>
    <div v-if="loading && store.length === 0" class="gallery">
      <div v-for="(item, index) in num" :key="item" class="box" :class="{'no-margin': index % 2 !== 0}">
        <div class="loading-box">
          <div class="img-loading"></div>
          <div class="text-area">
            <div class="name-loading"></div>
            <div class="money-loading"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="gallery">
      <div class="box" v-for="(item, index) in store" :key="index" @click.stop.prevent="handleClick(item)" :class="{'no-margin': index % 2 !== 0}">
        <div class="img-box white-bg">
          <img v-lazy="{
              src: item.logo_url,
              error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
              loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
            }" class="normal">
          <div class="cover">
            <div class="wraper">
              <div class="name ellipsis">
                <div v-if="item.promotion && item.promotion.tag !== 'NONE'" class="tag-wrapper">
                  <span class="promotion-tag" :class="{'tag-green': item.promotion.tag === '秒杀', 'tag-red': item.promotion.tag === 'HOT', 'tag-orange': item.promotion.tag === 'NEW'}">{{item.promotion.tag}}</span>
                </div>
                <span>{{item.name}}</span>
              </div>
              <div class="flex info">
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
                <div class="flex icon-box" @click.stop="handleFavorite(item)">
                  <i v-if="item.favorable" class="iconfont icon-xuanzhong1 active"></i>
                  <i v-else class="iconfont icon-shoucang2"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    name: 'ProductThumbnail',
    props: ['store', 'loading', 'num'],
    methods: {
      handleClick (item) {
        this.$emit('click', item)
      },
      handleFavorite (item) {
        this.$emit('favorite', item)
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
  @import "../../styles/mixin";

  .gallery {
    @include px2rem(min-height, 600px);
    display: flex;
    flex-wrap: wrap;
    .box {
      @include px2rem(width, 370px);
      @include pm2rem(margin, 0px, 10px, 10px, 0px);
    }
    .no-margin {
      margin-right: 0;
    }
    .img-box {
      width: 100%;
      @include px2rem(height, 520px);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      box-sizing: border-box;
      img[lazy="loading"] {
        @include px2rem(height, 384px);
        width: 100%;
        background-position: center center !important;
        background: url("../../assets/imgLoading3.jpg");
        background-repeat: no-repeat;
        background-size: cover;
      }
      img[lazy="error"] {
        @include px2rem(height, 384px);
        width: 100%;
        background-position: center center !important;
        background: url("../../assets/imgLoadingError.png");
        background-repeat: no-repeat;
        background-size: cover;
      }
      img[lazy="loaded"] {
        @include px2rem(height, 384px);
        width: 100%;
      }
      .normal {
        @include px2rem(height, 384px);
        width: 100%;
      }
      .empty {
        @include px2rem(height, 384px);
        @include px2rem(width, 346px);
      }
      .cover {
        @include px2rem(height, 135px);
        display: block;
        color: $primary-dark;
        @include px2rem(font-size, 28px);
        width: inherit;
        .wraper {
          width: inherit;
          height: inherit;
          box-sizing: border-box;
          position: relative;
          .name {
            @include pm2rem(padding, 0px, 0px, 0px, 20px);
            @include px2rem(font-size, 28px);
            @include px2rem(height, 68px);
            display: inline-block;
            @include px2rem(line-height, 68px);
            vertical-align: middle;
            width: 94%;
            .tag-wrapper {
              @include px2rem(height, 68px);
              display: inline-block;
              position: relative;
              @include px2rem(width, 66px);
              vertical-align: top;
            }
            .promotion-tag {
              color: $white;
              @include px2rem(font-size, 20px);
              @include px2rem(margin-right, 10px);
              display: inline-block;
              padding-top: 1px;
              @include px2rem(height, 30px);
              @include px2rem(width, 66px);
              @include px2rem(min-width, 66px);
              @include px2rem(border-radius, 2px);
              @include px2rem(line-height, 30px);
              text-align: center;
              position: absolute;
              top: 46%;
              transform: translateY(-50%);
            }
            .tag-green {
              background-color: $green;
              @include px2rem(font-size, 22px);
            }
            .tag-red {
              background-color: #ff6000;
            }
            .tag-orange {
              background-color: #ffa500;
            }
          }
          .info {
            position: absolute;
            bottom: 0;
            @include px2rem(height, 64px);
            flex: 1;
            box-sizing: border-box;
            color: #ff0000;
            line-height: normal;
            justify-content: space-between;
            right: 0;
            width: inherit;
            .money {
              display: inline-flex;
              align-items: baseline;
              justify-content: flex-start;
              @include px2rem(max-width, 300px);
              .normal-price {
                display: inline-block;
                @include px2rem(max-width, 240px);
                @include px2rem(padding-left, 20px);
                .price-icon {
                  @include px2rem(font-size, 20px);
                  @include px2rem(padding-right, 4px);
                }
                .price-num {
                  @include px2rem(font-size, 32px);
                  @include px2rem(max-width, 200px);
                }
              }
              del {
                @include px2rem(margin-left, 10px);
                @include px2rem(font-size, 24px);
                color: #999;
                display: inline-block;
                @include px2rem(max-width, 100px);
              }
              .discount-price {
                margin-right: 0;
              }
            }
            .icon-box {
              height: 100%;
              @include px2rem(width, 80px);
              line-height: normal;
              color: $second-grey;
              i {
                @include font-dpr(18px);
              }
              .active {
                color: $second-red;
              }
            }
          }
        }
      }
    }

    .loading-box {
      width: 100%;
      @include px2rem(height, 520px);
      box-sizing: border-box;
      border: 1px solid $tenth-grey;
      background-color: $white;
      .img-loading {
        width: inherit;
        background-color: $ninth-grey;
        @include px2rem(height, 384px);
      }
      .text-area {
        position: relative;
        @include px2rem(height, 135px);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-around;
        @include px2rem(padding-left, 20px);
        width: inherit;
        .name-loading {
          @include px2rem(width, 200px);
          @include px2rem(height, 34px);
          background-color: $ninth-grey;
        }
        .money-loading {
          @include px2rem(width, 120px);
          @include px2rem(height, 32px);
          background-color: $ninth-grey;
        }
      }
    }
  }
</style>
