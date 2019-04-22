<template>
  <div>
    <transition name="fade" mode="out-in">
      <section v-if="loading && store.length === 0" class="space-list">
        <a v-for="item in num" :key="item" class="item">
          <p class="name empty-name ellipsis"></p>
          <div class="info ellipsis">
            <div class="level">
              <div class="empty-svg"></div>
            </div>
            <div class="others">
              <span class="type-tag empty-tag"></span>
            </div>
          </div>
        </a>
      </section>
      <section v-else class="space-list">
        <a v-for="(item, index) in store" :key="index" class="item" @click="handleClick(item)">
          <p class="name ellipsis">{{item.name}}</p>
          <div class="info ellipsis">
            <div class="level">
              <svg  v-if="item.type !== 'personal' && item.organization_state === 'approved'" class="icon" aria-hidden="true">
                <use xlink:href="#icon-zhenshi4"></use>
              </svg>
              <svg  v-else-if="item.type === 'personal' && userApproved" class="icon" aria-hidden="true">
                <use xlink:href="#icon-zhenshi"></use>
              </svg>
              <svg  v-else class="icon" aria-hidden="true">
                <use xlink:href="#icon-zhenshi3"></use>
              </svg>
            </div>
            <div v-if="item.groups && item.groups.length > 0" class="others">
              <span class="type-tag">{{item.type | typeFilter}}</span>
              <div v-for="(i, indexI) in item.groups" :key="indexI" class="role-tags">
                <span class="tag">{{i.name}}</span>
              </div>
            </div>
          </div>
        </a>
      </section>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SpaceList',
  props: {
    store: {
      default: () => [],
      required: true,
      type: Array
    },
    num: {
      default: 10,
      required: false,
      type: Number
    },
    loading: {
      default: true,
      required: false,
      type: Boolean
    },
    userApproved: {
      default: true,
      required: true,
      type: Boolean
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handleClick (item) {
      this.$emit('click', item)
    }
  },
  filters: {
    typeFilter: (val) => {
      switch (val) {
        case 'personal':
          return '私人空间'
        case 'mall':
          return '商城'
        case 'company':
          return '企业'
        case 'association':
          return '协会'
        case 'school':
          return '校友会'
        default:
          return '企业'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .space-list {
    background-color: $white;
    & :last-child.item {
      border-bottom: none;
    }
    & a:active {
      background-color: rgba(239, 234, 234, .5);
    }
    .item {
      border-bottom: 1px solid $second-grey;
      @include pm2rem(padding, 0px, 0px, 16px, 36px);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      box-sizing: border-box;
      .name {
        @include px2rem(font-size, 30px);
        @include pm2rem(margin, 10px, 0px, 14px, 0px);
        color: #333;
        font-weight: bold;
        width: 100%;
      }
      .empty-name {
        @include px2rem(height, 30px);
        @include px2rem(width, 240px);
        background-color: $ninth-grey;
      }
      .info {
        display: inline-flex;
        align-items: center;
        width: 100%;
        .level {
          @include px2rem(margin-right, 22px);
          svg {
            @include px2rem(font-size, 36px);
          }
          .empty-svg {
            @include px2rem(width, 36px);
            @include px2rem(height, 36px);
            border-radius: 50%;
            background-color: $ninth-grey;
          }
        }
        .others {
          display: inline-flex;
          align-items: center;
          .type-tag {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #ffe3d1;
            @include px2rem(border-radius, 20px);
            @include px2rem(font-size, 24px);
            color: #FF6000;
            @include pm2rem(padding, 4px, 14px, 4px, 14px);
            @include px2rem(margin-right, 22px);
          }
          .empty-tag {
            background-color: $ninth-grey;
            @include px2rem(width, 120px);
            @include px2rem(height, 40px);
            @include px2rem(border-radius, 20px);
          }
          .role-tags {
            display: inline-flex;
            align-items: center;
            justify-content: flex-start;
            .tag {
              @include px2rem(font-size, 24px);
              color: #777;
              background-color: #E8E8E8;
              @include px2rem(border-radius, 6px);
              @include pm2rem(padding, 4px, 14px, 4px, 14px);
              @include px2rem(margin-right, 22px);
            }
          }
        }
      }
    }
  }
</style>
