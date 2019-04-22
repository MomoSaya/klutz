<template>
  <section class="full-width message-wrapper">
    <transition-group name="list" tag="div">
      <a
        v-for="(item, index) in messages"
        :key="item._lcattrs.organization_id + item._lcattrs.clazz"
        class="flex message"
        @click.stop="handleClick(item)">
        <div
          class="flex icon-box"
          @click="closeMessage(item)">
          <i class="iconfont icon-guanbi"></i>
        </div>
        <div class="content">
          <p class="title">{{item._lcattrs.title}}</p>
          <p class="info">
            <span class="name">{{item._lcattrs.organization_name}}</span>
            <span>{{item._lctext.replace(':{organization_name}', '')}}</span>
          </p>
        </div>
      </a>
    </transition-group>
  </section>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    name: 'FloatMessage',
    props: ['messages'],
    methods: {
      closeMessage (index) {
        this.$emit('close', index)
      },
      handleClick (item) {
        this.$emit('click', item)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .list-enter, .list-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
  .list-leave-active {
    position: absolute;
  }
  .message-wrapper {
    position: fixed;
    @include px2rem(top, 20px);
    z-index: 1006;
    display: flex;
    flex-direction: column;
    a:active {
      background-color: rgba(0, 0, 0, .7);
    }
    .message {
      @include px2rem(height, 100px);
      width: 96%;
      margin: 0 auto;
      box-sizing: border-box;
      background-color: rgba(0, 0, 0, .8);
      @include px2rem(border-radius, 20px);
      color: $white;
      box-shadow: 2px 2px 4px 0px rgba(80, 69, 69, 0.5);
      @include px2rem(margin-bottom, 10px);
      transition: transform .3s;
      cursor: pointer;
      .icon-box {
        height: inherit;
        @include px2rem(width, 100px);
      }
      .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        flex: 1;
        .title {
          @include px2rem(font-size, 28px);
        }
        .info {
          @include px2rem(font-size, 24px);
          .name {
            color: $green;
          }
        }
      }
    }
  }
</style>
