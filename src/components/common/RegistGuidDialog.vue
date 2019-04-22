<template>
  <transition name="router-fade">
    <section v-if="show" class="container full-width">
      <div class="dialog-bg full-width"></div>
      <div class="dialog-wrapper">
        <div class="content">
          <div class="dialog-title">
            <p class="point">奖励{{num}}云积分</p>
            <p class="tips">注：可换购{{money}}元的积分商品</p>
          </div>
          <div class="dialog-body">
            <div class="flex info-wrapper">
              <img class="logo" :src="detail.logo">
              <div class="info">
                <p class="name ellipsis">{{detail.name}}</p>
                <svg class="icon large" aria-hidden="true">
                  <use xlink:href="#icon-zhenshi4"></use>
                </svg>
              </div>
              <div class="seal">
                <img v-if="detail.type === 'Mall'" src="../../assets/member.png">
                <img v-else src="../../assets/guide.png">
              </div>
            </div>
            <div class="tips-title">
              <hr>
              <span>{{detail.type === 'Mall' ? '会员权益' : '导购员权益'}}</span>
              <hr>
            </div>
            <div v-if="detail.type === 'Mall'" class="tips-content">
              <p>1、会员或者会员客户在商城购买均有返点优惠；</p>
              <p>2、会员有返点，最高可达5%；</p>
            </div>
            <div v-else class="tips-content">
              <p>1、厂家厂价直购；</p>
              <p>2、企业奖励导购员的提成最高可达50%；</p>
              <p>3、导购员购买也可享有导购提成优惠；</p>
              <p>4、次月15日发放导购提成。</p>
            </div>
            <p class="tips-footer">注：邀请客户请先下载App</p>
          </div>
          <div class="button">
            <img src="../../assets/invite.png" @click="invitePeople()">
          </div>
          <div class="close" @click="close">
            <img src="../../assets/registClose.png">
          </div>
        </div>
      </div>
    </section>
  </transition>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    props: ['num', 'money', 'show', 'detail'],
    methods: {
      close () {
        this.$emit('close')
      },
      help () {
        this.$emit('help')
      },
      invitePeople () {
        this.$emit('download')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

   .container {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 1007; // 覆盖云视首页的tabbar
    .dialog-bg {
      position: fixed;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, .45);
    }
    .dialog-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      .dialog-title {
        position: relative;
        @include px2rem(width, 562px);
        @include px2rem(height, 292px);
        background: url("../../assets/congratulations.png") no-repeat;
        background-size: contain;
        p {
          width: inherit;
        }
        .point {
          color: #d200ff;
          text-align: center;
          position: absolute;
          @include px2rem(bottom, 70px);
          @include px2rem(font-size, 30px);
        }
        .tips {
          color: #796215;
          text-align: right;
          position: absolute;
          @include px2rem(bottom, 10px);
          box-sizing: border-box;
          @include px2rem(padding-right, 17px);
          @include px2rem(font-size, 20px);
        }
      }
      .dialog-body {
        position: relative;
        @include px2rem(width, 562px);
        @include px2rem(height, 600px);
        background-color: $white;
        @include px2rem(border-radius, 10px);
        .info-wrapper {
          align-items: flex-start;
          width: inherit;
          position: relative;
          @include px2rem(height, 260px);
          @include pm2rem(padding, 40px, 30px, 0px, 30px);
          box-sizing: border-box;
          .logo {
            @include px2rem(width, 96px);
            @include px2rem(height, 96px);
            @include px2rem(border-radius, 10px);
            @include px2rem(margin-right, 33px);
          }
          .info {
            flex: 1;
            .name {
              @include px2rem(font-size, 26px);
              @include px2rem(width, 370px);
              color: #383733;
              @include px2rem(margin-bottom, 14px);
            }
            svg {
              @include px2rem(font-size, 36px);
            }
          }
          .seal {
            position: absolute;
            @include px2rem(right, 47px);
            @include px2rem(top, 92px);
            img {
              @include px2rem(width, 177px);
              @include px2rem(height, 139px);
            }
          }
        }
        .tips-title {
          display: flex;
          justify-content: center;
          align-items: center;
          color: $third-dark;
          @include px2rem(font-size, 26px);
          hr {
            @include px2rem(width, 100px);
            background-color: $fifth-grey;
            border-top: 1px solid $fifth-grey;
            border-bottom: none;
          }
          span {
            @include pm2rem(margin, 0px, 30px, 0px, 30px);
          }
        }
        .tips-content {
          @include pm2rem(padding, 30px, 20px, 0px, 30px);
          p {
            @include px2rem(font-size, 22px);
            color: $primary-dark;
          }
        }
        .tips-footer {
          position: absolute;
          width: inherit;
          @include px2rem(font-size, 20px);
          @include px2rem(bottom, 32px);
          color: #65635d;
          text-align: center;
        }
      }
      .button {
        @include pm2rem(margin, 32px, 0px, 0px, 0px);
        text-align: center;
        img {
          @include px2rem(width, 335px);
          @include px2rem(height, 70px);
        }
      }
      .close {
        position: absolute;
        @include px2rem(top, 40px);
        @include px2rem(right, -40px);
        text-align: center;
        img {
          @include px2rem(width, 58px);
          @include px2rem(height, 58px);
          margin: 0 auto;
        }
      }
    }
  }
</style>
