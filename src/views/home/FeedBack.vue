<template>
  <section class="full-width container">
    <common-header
      :title="title"
      @back="goBack()">
    </common-header>
    <div class="form-wrapper">
      <div class="form-content">
        <div class="title">
          产品反馈意见(必填)
        </div>
        <textarea
          :placeholder="textPlaceholder"
          maxlength="200"
          v-model="content">
        </textarea>
        <div class="title">
          联系方式(选填)
        </div>
        <input :placeholder="inputPlaceholder" v-model="mobile">
      </div>
    </div>
    <a class="flex block-btn" @click="submitFeedBack()">提交</a>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  export default {
    name: 'FeedBack',
    data () {
      return {
        title: '产品反馈',
        textPlaceholder: '如果您有任何对我们产品的建议和反馈，请留言告知我们',
        inputPlaceholder: '请输入手机号或邮箱',
        content: '',
        mobile: ''
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('FeedBack_goHome')) {
          removeStore('FeedBack_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      submitFeedBack () {
        this.$store.dispatch('commonAction', {
          url: '/v1/feedback',
          method: 'post',
          params: {},
          data: {
            token: this.token,
            content: this.content,
            mobile: this.mobile
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              Toast({
                message: '提交成功',
                duration: 500
              })
            } else {
              Toast({
                message: res.data.msg || '提交失败',
                duration: 500
              })
            }
          },
          reject: (state, res) => {
            Toast({
              message: '提交失败，请重试',
              duration: 500
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    background-color: $tenth-grey;
    box-sizing: border-box;
    & a:active {
      opacity: .8;
    }
  }
  .form-wrapper {
    width: 100%;
    @include px2rem(padding-top, 106px);
    .form-content {
      width: 100%;
      background-color: $white;
      .title {
        @include px2rem(height, 100px);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        @include px2rem(font-size, 30px);
        color: $second-dark;
        @include pm2rem(padding, 0px, 30px, 0px, 30px);
        border-top: 1px solid $third-grey;
        border-bottom: 1px solid $third-grey;
      }
      textarea {
        border: none;
        width: 100%;
        @include px2rem(min-height, 210px);
        resize: none;
        @include pm2rem(padding, 20px, 30px, 20px, 30px);
        @include px2rem(font-size, 26px);
        color: $third-dark;
        box-sizing: border-box;
      }
      input {
        width: 100%;
        @include px2rem(height, 100px);
        @include px2rem(font-size, 26px);
        color: $third-dark;
        box-sizing: border-box;
        @include pm2rem(padding, 0px, 30px, 0px, 30px);
        border: none;
        border-bottom: 1px solid $third-grey;
      }
    }
  }
  .block-btn {
    position: fixed;
    bottom: 0;
    @include px2rem(height, 96px);
    width: 100%;
    max-width: 540px;
    line-height: normal;
    color: $white;
    background-color: $second-red;
    @include px2rem(font-size, 36px);
  }
</style>
