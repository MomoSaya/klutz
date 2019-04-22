<template>
  <transition name="slide-down" mode="out-in" :appear="true">
    <section v-if="show" class="filter-wrapper">
      <div v-if="loading">
        <mt-spinner class="loading" type="snake" :size="38">
        </mt-spinner>
      </div>
      <div v-else class="select-wrapper">
        <div class="content">
          <div class="wrapper">
            <a v-for="(item, index) in colors" :key="index" class="item" :class="{'active': selectedColor.id === item.id}" @click="selectColor(item)">
              {{item.name}}
            </a>
          </div>
          <div class="wrapper">
            <a v-for="(item, index) in depth" :key="index" class="item" :class="{'active': selectedDepth.id === item.id}" @click="selectDepth(item)">
              {{item.name}}
            </a>
          </div>
          <div class="wrapper">
            <a v-for="(item, index) in productClasses" :key="index" class="item" :class="{'active': selectedProductClass.id === item.id}" @click="selectProductClass(item)">
              {{item.name}}
            </a>
          </div>
          <div v-if="surfaces.length > 0" class="wrapper">
            <a v-for="(item, index) in surfaces" :key="index" class="item" :class="{'active': selectedSurface.id === item.id}" @click="selectSurface(item)">
              {{item.name}}
            </a>
          </div>
        </div>
        <a class="submit-btn" @click="handleSearch()">
          确定
        </a>
      </div>
    </section>
  </transition>
</template>

<script>
  export default {
    name: 'StoneFilter',
    props: {
      show: {
        type: Boolean,
        required: true,
        default: false
      },
      loading: {
        type: Boolean,
        required: true,
        default: true
      },
      colors: {
        default: () => [],
        type: Array
      },
      depth: {
        default: () => [],
        type: Array
      },
      productClasses: {
        default: () => [],
        type: Array
      },
      surfaces: {
        default: () => [],
        type: Array
      },
      pattern: {
        default: () => [],
        type: Array
      },
      zones: {
        default: () => [],
        type: Array
      },
      prices: {
        default: '0,0',
        type: String
      },
      selectedColor: {
        default: () => ({}),
        type: Object
      },
      selectedDepth: {
        default: () => ({}),
        type: Object
      },
      selectedProductClass: {
        default: () => ({}),
        type: Object
      },
      selectedSurface: {
        default: () => ({}),
        type: Object
      },
      selectedPattern: {
        default: () => ({}),
        type: Object
      },
      selectedZone: {
        default: () => ({}),
        type: Object
      },
      selectedPrice: {
        default: () => ({}),
        type: Object
      }
    },
    data () {
      return {

      }
    },
    methods: {
      selectColor (item) {
        this.$emit('select-color', item)
      },
      selectProductClass (item) {
        this.$emit('select-product-class', item)
      },
      selectDepth (item) {
        this.$emit('select-depth', item)
      },
      selectSurface (item) {
        this.$emit('select-surface', item)
      },
      handleSearch () {
        this.$emit('search')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .filter-wrapper {
    position: fixed;
    @include px2rem(top, 88px);
    width: 100%;
    max-width: 540px;
    background-color: $white;
    height: 90%;
  }
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .select-wrapper {
    .submit-btn {
      @include px2rem(height, 80px);
      @include px2rem(width, 240px);
      @include px2rem(line-height, 80px);
      position: absolute;
      @include px2rem(bottom, 20px);
      left: 50%;
      transform: translateX(-50%);
      background-color: $green;
      color: $white;
      @include px2rem(font-size, 28px);
      text-align: center;
      @include px2rem(border-radius, 10px);
    }
    & .submit-btn:active {
      opacity: .8;
    }
  }
  .content {
    position: relative;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 1px;
    box-sizing: border-box;
  }
  .wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    @include pm2rem(padding, 20px, 0px, 0px, 20px);
    border-bottom: 1px solid $second-grey;
    .item {
      @include px2rem(font-size, 28px);
      @include pm2rem(padding, 10px, 20px, 10px, 20px);
      @include pm2rem(margin, 0px, 20px, 20px, 0px);
      background-color: #DEE2E3;
    }
    & a:active {
      opacity: .8;
    }
    .active {
      background-color: #EDEB8B;
    }
  }
  .slide-down-enter-acitve, .slide-down-leave-active {
    transition: all .2s ease-in-out;
  }
  .slide-down-enter, .slide-down-leave-to {
    transform: translateY(-100%);
  }
</style>
