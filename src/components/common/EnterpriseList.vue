<template>
  <section>
    <div class="list-container">
      <div v-if="loading || store.length === 0">
        <a v-for="item in num" :key="item" class="flex item white-bg">
          <div class="empty-img"></div>
          <div class="flex-between content">
            <p class="empty-name"></p>
            <div class="flex empty-row">
              <div class="flex-1">
                <p class="empty-service"></p>
              </div>
              <div class="flex-1">
                <p class="empty-zone"></p>
              </div>
            </div>
          </div>
        </a>
      </div>
      <div v-else>
        <a v-for="(item, index) in store" :key="index" @click="handleClick(item.organization.id, item.organization.service_name || '企业')" class="flex-between item white-bg primary-text">
          <img v-lazy="{
                src: item.organization.logo,
                error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
                loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
              }">
          <div class="flex-between content flex-1 ellipsis">
            <p class="name ellipsis">{{item.organization.name}}</p>
            <div class="flex info">
              <span class="flex-1 third-text">
                {{item.organization.service_name || item.organization.service.name}}
              </span>
              <span class="flex-1 second">
                {{item.organization.zone_name || item.organization.display_zone}}
              </span>
            </div>
          </div>
        </a>
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
      handleClick (id, type) {
        this.$emit('click', {id, type})
      }
    },
    mounted () {

    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .list-container {
    border-top: 1px solid $third-grey;
    a:active {
      background-color: rgba(239, 234, 234, 0.5);
    }
    .item {
      align-items: center;
      border-bottom: 1px solid $third-grey;
      @include pm2rem(padding, 10px, 20px, 10px, 20px);
      @include px2rem(height, 140px);
      box-sizing: border-box;
      .content {
        line-height: normal;
        flex-direction: column;
        flex: 1;
        height: inherit;
        .name {
          @include px2rem(margin-top, 20px);
          @include px2rem(font-size, 30px);
        }
        .info {
          @include px2rem(font-size, 26px);
          @include px2rem(margin-bottom, 20px);
        }
      }
      .empty-content {
        flex-direction: column;
        flex: 1;
        height: inherit;
      }
      .empty-img {
        @include px2rem(width, 118px);
        @include px2rem(height, 118px);
        @include px2rem(margin-right, 30px);
        background-color: $ninth-grey;
      }
      .empty-row {
        justify-content: flex-start;
        @include px2rem(margin-bottom, 20px);
      }
      .empty-name {
        @include px2rem(margin-top, 20px);
        @include px2rem(height, 40px);
        @include px2rem(width, 360px);
        background-color: $ninth-grey;
      }
      .empty-service {
        @include px2rem(height, 32px);
        @include px2rem(width, 80px);
        background-color: $ninth-grey;
      }
      .empty-zone {
        @include px2rem(height, 32px);
        @include px2rem(width, 120px);
        background-color: $ninth-grey;
      }
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
