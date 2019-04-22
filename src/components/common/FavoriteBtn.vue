<template>
  <section>
    <div
      class="float-btn"
      :class="{'up': single}">
      <div
        class="cirlce-btn"
        @click="handleClick()">
        <i v-if="active" class="iconfont icon-shoucang"></i>
        <i v-else class="iconfont icon-shoucang1"></i>
        <p v-if="count">{{likeCount}}</p>
        <p v-else>0</p>
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
      count: {
        default: 0,
        type: Number
      },
      active: {
        default: false,
        type: Boolean
      },
      single: {
        default: true,
        type: Boolean
      }
    },
    methods: {
      handleClick () {
        this.$emit('click')
      }
    },
    computed: {
      likeCount () {
        return this.count > 99 ? '99+' : this.count
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .float-btn {
    position: fixed;
    @include px2rem(bottom, 180px);
    @include px2rem(height, 0px);
    display: block;
    width: 100%;
    max-width: 540px;
    transition: all .3s cubic-bezier(0, 0, 0, 1);
    .cirlce-btn {
      right: 0;
      bottom: 0;
      @include px2rem(width, 90px);
      @include px2rem(height, 90px);
      border-radius: 50%;
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      @include px2rem(margin-right, 20px);
      color: $white;
      background-color: rgba(254, 104, 48, 0.8);
      line-height: 1;
      z-index: 1004;
      box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.14), 0 1px 18px rgba(0, 0, 0, 0.12);
      i {
        @include px2rem(font-size, 40px);
        line-height: normal;
      }
      p {
        @include px2rem(font-size, 24px);
      }
    }
  }

  .up {
    @include px2rem(bottom, 70px);
  }
</style>
