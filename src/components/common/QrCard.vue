<template>
  <section class="card-wrapper">
    <div class="card" @click.stop="handleClick(store)">
      <div class="top">
        <img class="logo" v-if="store && store.logo" :src="store.logo" />
        <div v-else class="empty-logo"></div>
        <div class="info">
          <p v-if="store && store.company" class="org-name ellipsis">
            {{store.company}}
          </p>
          <div v-else class="empty-name"></div>
          <div class="content">
            <div class="content-info">
              <div class="icon-container">
                <div v-if="!store || !store.state" class="svg"></div>
                <template v-else-if="store && store.state && store.state !== 'approved'">
                  <svg class="icon large" aria-hidden="true">
                    <use xlink:href="#icon-zhenshi3"></use>
                  </svg>
                </template>
                <template v-else-if="store && store.state && store.state === 'approved'">
                  <svg class="icon large" aria-hidden="true">
                    <use xlink:href="#icon-zhenshi4"></use>
                  </svg>
                </template>
                <div v-if="store && store.service && store.service.name" class="flex tag">
                  {{store.service.name | serviceFilter}}
                </div>
                <div v-else class="empty-tag"></div>
              </div>
              <div class="owner-info">
                <div class="name ellipsis" v-if="sharer && sharer.role">
                  <img src="../../assets/qrName.png">
                  <span>
                    {{sharer.name}}
                  </span>
                </div>
                <div class="type" v-if="sharer && sharer.role">
                  <img src="../../assets/qrRole.png">
                  <span>{{sharer.role}}</span>
                </div>
              </div>
            </div>
            <a class="qr-icon" @click.stop="clickQrCodeBtn(store)">
              <i class="iconfont icon-erweima"></i>
            </a>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="icon-wrapper">
          <a v-if="products && products.length > 0 && store && store.service && store.service.name !== '协会' && store.service.name !== '校友会' && store.service.name !== '班级'" @click.stop="handleIconClick({type: 'chat', value: products[0].id})" class="icon-box flex">
            <img src="../../assets/huihua.png">
          </a>
          <a v-if="isOnPc(store && store.mobile)" @click.stop="stopBubble" :href="'tel:' + store.mobile" class="icon-box flex">
            <img src="../../assets/dianhua.png">
          </a>
          <a v-if="store && store.qq" @click.stop="handleIconClick({type: 'qq', value: store.qq})" class="icon-box flex">
            <img src="../../assets/qqIcon.png">
          </a>
          <a v-if="store && store.email" @click.stop="handleIconClick({type: 'email', value: store.email})" class="icon-box flex">
            <img src="../../assets/youxiang.png">
          </a>
          <a v-if="store && (store.address || store.longitude && store.latitude)" @click.stop="handleIconClick({type:'address', value: {longitude: store.longitude, latitude: store.latitude, address: store.address}})" class="icon-box flex">
            <img src="../../assets/dingwei.png">
          </a>
          <a v-if="store && store.website" @click.stop="handleIconClick({type: 'website', value: store.website})" class="icon-box flex">
            <img src="../../assets/wangzhi.png">
          </a>
          <div v-else-if="!store" class="tips">&nbsp;</div>
          <div v-else-if="!hasLink" class="tips">暂无联系方式</div>
        </div>
        <div class="navs">
          <div class="nav-wrapper no-padding">
            <a class="nav-bar flex" @click.stop="navClick(store.id, store.service.name, 0)">资讯</a>
            <div class="vertical-line"></div>
          </div>
          <div v-if="store && store.service && (store.service.name === '协会' || store.service.name === '校友会' || store.service.name === '班级')" class="nav-wrapper">
            <a class="nav-bar flex" @click.stop="navClick(store.id, store.service.name, 1)">
              {{store.service.name | nameFilter}}
            </a>
            <div class="vertical-line"></div>
          </div>
          <div v-if="store && store.service && (store.service.name === '协会' || store.service.name === '校友会' || store.service.name === '班级')" class="nav-wrapper">
            <a class="nav-bar flex" @click.stop="navClick(store.id, store.service.name, 2)">
              {{store.service.name | orgFilter}}
            </a>
            <div class="vertical-line"></div>
          </div>
          <div v-if="store && store.service && store.service.name === '校友会'" class="nav-wrapper">
            <a class="nav-bar flex" @click.stop="navClick(store.id, store.service.name, 3)">时光轴</a>
            <div class="vertical-line"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import {isPc} from '../../config/mUtils'
  export default {
    name: 'QrCard',
    props: ['store', 'products', 'sharer'],
    data () {
      return {}
    },
    methods: {
      stopBubble (e) {
        e.stopPropagation()
      },
      handleClick (item) {
        this.$emit('click', item.enterprise_id)
      },
      clickQrCodeBtn (obj) {
        this.$emit('qr-code', obj)
      },
      handleIconClick (obj) {
        this.$emit('icon-click', obj)
      },
      isOnPc (bool) {
        return !isPc() && bool
      },
      navClick (id, type, index) {
        this.$emit('nav', {id, type, index})
      }
    },
    filters: {
      nameFilter (val) {
        switch (val) {
          case '协会':
            return '个人会员'
          case '班级':
            return '班级成员'
          case '校友会':
            return '校友班级'
          default:
            return '个人会员'
        }
      },
      orgFilter (val) {
        switch (val) {
          case '协会':
            return '企业会员'
          case '班级':
            return '同学企业'
          case '校友会':
            return '校友企业'
          default:
            return '企业会员'
        }
      },
      serviceFilter (val) {
        return (val !== '班级' && val !== '校友会' && val !== '协会') ? '企业' : val
      }
    },
    computed: {
      hasLink () {
        // 机构中，只有企业与商城支持与客服会话
        return (
          !!this.store.id &&
          ((this.products &&
            this.products.length > 0 &&
            this.store.service.name !== '协会' &&
            this.store.service.name !== '校友会' &&
            this.store.service.name !== '班级') ||
            ((!!this.store.mobile && !isPc()) ||
              !!this.store.email ||
              !!this.store.address ||
              !!this.store.longitude ||
              !!this.store.latitude ||
              !!this.store.wechat ||
              !!this.store.website ||
              !!this.store.qq))
        )
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .card-wrapper {
    @include pm2rem(padding, 12px, 16px, 30px, 16px);
    box-sizing: border-box;
    .card {
      @include px2rem(width, 718px);
      @include px2rem(height, 380px);
      box-sizing: border-box;
      background-color: $white;
      position: relative;
      @include px2rem(border-radius, 14px);
      box-shadow: -8px 0px 10px -4px rgba(220, 220, 220, 0.4), 8px 0px 10px -4px rgba(220, 220, 220, 0.4),
        0px 10px 10px -2px rgba(216, 216, 216, 0.4);
      .top {
        @include px2rem(height, 180px);
        @include pm2rem(padding, 24px, 0px, 0px, 28px);
        width: 100%;
        box-sizing: border-box;
        display: flex;
        .logo {
          @include px2rem(width, 138px);
          @include px2rem(height, 138px);
          @include px2rem(border-radius, 69px);
          display: flex;
          align-self: center;
        }
        .empty-logo {
          @include px2rem(width, 138px);
          @include px2rem(height, 138px);
          @include px2rem(border-radius, 69px);
          background-color: $ninth-grey;
          display: flex;
          align-self: center;
        }
        .info {
          display: flex;
          flex-direction: column;
          flex: 1;
          @include px2rem(padding-left, 30px);
          .org-name {
            @include px2rem(font-size, 32px);
            color: $primary-dark;
            @include px2rem(width, 460px);
            line-height: normal;
            font-weight: bold;
          }
          .empty-name {
            @include px2rem(width, 300px);
            @include px2rem(height, 32px);
            background-color: $ninth-grey;
            @include pm2rem(margin, 6px, 0px, 6px, 0px);
          }
          .content {
            display: flex;
            flex: 1;
            position: relative;
            & a:active {
              background-color: rgba(239, 234, 234, 0.5);
            }
            .qr-icon {
              position: absolute;
              @include px2rem(right, 25px);
              top: 50%;
              line-height: 1;
              transform: translateY(-50%);
              @include pm2rem(padding, 20px, 20px, 20px, 20px);
              cursor: pointer;
              i {
                @include px2rem(font-size, 64px);
                color: $third-dark;
              }
            }
            .content-info {
              height: inherit;
              width: 100%;
              position: relative;
              .icon-container {
                position: absolute;
                @include px2rem(top, 10px);
                display: flex;
                align-items: center;
                line-height: normal;
                .large {
                  @include px2rem(font-size, 36px);
                  @include px2rem(margin-right, 34px);
                }
              }
              .tag {
                @include px2rem(font-size, 24px);
                @include px2rem(height, 38px);
                @include px2rem(border-radius, 6px);
                @include pm2rem(padding, 0px, 20px, 0px, 20px);
                background-color: #fcddcb;
                line-height: normal;
                color: #ff6000;
              }
              .empty-tag {
                @include px2rem(height, 38px);
                @include px2rem(width, 80px);
                @include px2rem(border-radius, 6px);
                background-color: $ninth-grey;
              }
              .owner-info {
                position: absolute;
                bottom: 0;
                line-height: normal;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                div {
                  color: $second-dark;
                  display: inline-flex;
                  align-items: center;
                  justify-content: flex-start;
                }
                img {
                  @include px2rem(width, 26px);
                  @include px2rem(height, 26px);
                  @include px2rem(margin-right, 10px);
                }
                .name {
                  @include px2rem(margin-right, 20px);
                  @include px2rem(max-width, 400px);
                  span {
                    @include px2rem(font-size, 24px);
                  }
                }
                .type {
                  span {
                    @include px2rem(font-size, 24px);
                  }
                }
              }
            }
          }
          .svg {
            display: block;
            @include px2rem(height, 36px);
            @include px2rem(width, 36px);
            @include px2rem(margin-right, 34px);
            @include px2rem(border-radius, 18px);
            background-color: $ninth-grey;
          }
        }
      }
      .bottom {
        @include px2rem(height, 200px);
        width: inherit;
        @include pm2rem(margin, 0px, 0px, 0px, 0px);
        .icon-wrapper {
          @include pm2rem(padding, 20px, 44px, 6px, 44px);
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .icon-box {
            cursor: pointer;
            @include px2rem(width, 98px);
            @include px2rem(height, 86px);
            img {
              @include px2rem(width, 40px);
              @include px2rem(height, 40px);
            }
          }
          .tips {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            width: inherit;
            line-height: normal;
            @include px2rem(font-size, 26px);
            @include px2rem(height, 86px);
            color: $third-dark;
          }
          & a:active {
            background-color: rgba(239, 234, 234, 0.5);
          }
        }
        .navs {
          .nav-wrapper {
            display: inline-flex;
            justify-content: flex-start;
            align-items: center;
            @include px2rem(width, 168px);
            @include pm2rem(padding, 6px, 0px, 25px, 0px);
            .nav-bar {
              flex: 1;
              cursor: pointer;
              @include px2rem(height, 60px);
              line-height: normal;
              @include px2rem(font-size, 28px);
              box-sizing: border-box;
              font-weight: bold;
              color: #696969;
            }
            .vertical-line {
              display: flex;
              align-items: center;
              justify-content: center;
              @include px2rem(border-right-width, 1px);
              @include px2rem(padding-left, 11px);
              border-right-color: $fifth-grey;
              border-right-style: solid;
              @include px2rem(height, 24px);
              overflow: visible;
            }
            & a:active {
              background-color: rgba(239, 234, 234, 0.5);
            }
          }
          .no-padding {
            @include px2rem(padding-left, 12px);
          }
          & :last-child {
            .vertical-line {
              display: none;
            }
          }
        }
      }
    }
    .qr-wrapper {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1003;
    }
  }
</style>
