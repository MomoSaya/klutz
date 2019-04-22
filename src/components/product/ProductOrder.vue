<template>
  <section>
    <div class="option-bar" :class="{'active': show}">
      <div class="item left">
        <div class="text" @click="noOrder()" :class="{'active': orderUp === 0}">
          综合
        </div>
      </div>
      <div class="item">
        <div
          class="text"
          @click="changeOrder(orderUp)"
          :class="{'active': orderUp !== 0}">
          价格
        </div>
        <div class="order-icon">
          <div class="icon-box">
            <i
              class="iconfont icon-shang up"
              :class="{'icon-active': orderUp === 1, 'icon-inactive': orderUp !== 1}"></i>
          </div>
          <div class="icon-box">
            <i
              class="iconfont icon-xia down"
              :class="{'icon-active': orderUp === -1, 'icon-inactive': orderUp !== -1}"></i>
          </div>
        </div>
      </div>
      <div class="item right">
        <i
          class="iconfont icon-liebiao"
          :class="{'icon-liebiao1': showList}"
          @click="swithList(showList)"></i>
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
    name: 'ProductOrder',
    props: ['orderUp', 'showList', 'show'],
    methods: {
      changeOrder (val) {
        let tmpVal = 0
        if (val === 0) {
          tmpVal = 1
        } else if (val === -1) {
          tmpVal = 1
        } else if (val === 1) {
          tmpVal = -1
        }
        this.$emit('order-change', tmpVal)
      },
      swithList (val) {
        this.$emit('switch', !val)
      },
      noOrder () {
        this.$emit('no-order', 0)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin.scss';

  .option-bar {
    @include px2rem(height, 90px);
    border-bottom: 1px solid $third-grey;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    @include px2rem(top, 198px);
    background-color: $white;
    z-index: 1001;
    width: 100%;
    max-width: 540px;
    transform: translateY(-210px);
    transition: all .3s ease-in-out;
    .item {
      height: inherit;
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      .order-icon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .text {
        @include font-dpr(16px);
        line-height: normal;
        @include px2rem(padding-right, 50px);
        @include px2rem(margin-right, -40px);
        color: $second-dark;
      }
      .active {
        color: #FF6000;
      }
    }
    .left {
      justify-content: flex-start;
      @include px2rem(padding-left, 29px);
    }
    .right {
      justify-content: flex-end;
      @include px2rem(padding-right, 29px);
    }
    .icon-box {
      @include px2rem(width, 24px);
      @include px2rem(height, 22px);
      position: relative;
      i {
        position: absolute;
        @include px2rem(font-size, 20px);
        line-height: 1;
      }
    }
    .up {
      @include px2rem(bottom, -4px);
    }
    .down {
      top: 0;
    }
    .icon-active {
      color: #FF6000;;
      transition: color .3s;
    }
    .icon-inactive {
      color: $third-dark;
      transition: color .3s;
    }
    &.active {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
