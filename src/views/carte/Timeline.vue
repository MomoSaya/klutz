<template>
  <section>
    <common-header :title="header" @back="goBack()">
    </common-header>
    <div class="container">
      <div class="time-box half-border" :class="{'no-border': period.length === 0}">
        <div class="top-content">
          <div class="content">
            <p class="content-title ellipsis" :class="{'full-title': !classCount && !mateCount && !teacherCount && !organizationCount}">
              {{name}}
            </p>
            <div v-if="classCount || mateCount || teacherCount || organizationCount" class="info">
              <span v-if="classCount">班级{{classCount}}</span>
              <span v-if="mateCount">同学{{mateCount}}</span>
              <span v-if="teacherCount">老师{{teacherCount}}</span>
              <span v-if="organizationCount">企业{{organizationCount}}</span>
            </div>
            <img class="big-img" :class="{'middle': !classCount && !mateCount && !teacherCount && !organizationCount}" src="../../assets/timeline_big.png">
          </div>
        </div>
      </div>
      <div v-for="(item, index) in period" :key="index" class="time-box" :class="{'no-bottom-border': index + 1 === period.length}">
        <p class="title">
          <span class="year">{{item.leave_year}} </span>
          <span>(</span>
          <span class="tilte-info">{{item.leave_year.slice(2, 4)}}届 </span>
          <span> 院系{{item.department.length}}个)</span>
        </p>
        <div class="content">
          <div class="nav-wrapper">
            <div class="nav-scroll">
              <div class="nav-bar">
                <a v-for="(i, indexI) in item.department" :key="indexI" class="nav" :class="{'nav-active': i.department_name === item.activeDepartment}" @click="selectDepartment(i.department_name, item.leave_year)">
                  <div class="item flex">
                    <span>{{i.department_name}}</span>
                    <div class="border"></div>
                  </div>
                </a>
              </div>
            </div>
            <a class="nav-more flex" @click="openMoreDepartment(item)">
              <i class="iconfont icon-zuo"></i>
            </a>
          </div>
          <div class="nav-content">
            <a v-for="(j, indexJ) in item.activeClasses" :key="indexJ" class="nav-item" @click="goRoute(j.id)">
              <div class="name ellipsis">{{j.name}}</div>
              <div v-if="j.mate_count || j.teacher_count" class="count">
                <span v-if="j.mate_count">同学{{j.mate_count}}</span>
                <span v-if="j.teacher_count">老师{{j.teacher_count}}</span>
              </div>
            </a>
            <a class="nav-item button" @click="addClass()">
              <i class="iconfont icon-renmai"></i>
              <span class="btn-text">创建班级</span>
            </a>
          </div>
          <img class="sm-img" src="../../assets/timeline_sm.png">
        </div>
      </div>
      <div class="time-box no-border">
        <div class="tips">亲爱的同学们，是否还记得离校时的洋洋洒洒！</div>
      </div>
    </div>
    <transition name="router-fade" mode="out-in">
      <div v-show="moreDepartment" class="more-bg" @click="closeMore()"></div>
    </transition>
    <transition name="slide-in-left" mode="out-in">
      <div v-show="moreDepartment" class="more-department">
        <div class="title">
          <div class="name">{{year}}届全部院系</div>
          <a class="flex close-btn" @click="closeMore()">
            <i class="iconfont icon-guanbi"></i>
          </a>
        </div>
        <div class="department-wrapper">
          <div class="scroll-wrapper">
            <a v-for="(item, index) in departments" :key="index" class="item ellipsis" :class="{'item-active': activeDepartment === item.department_name}" @click="selectDepartment(item.department_name, year)">
              {{item.department_name}}
            </a>
          </div>
        </div>
      </div>
    </transition>
    <transition name="router-fade" mode="out-in">
      <div v-show="showConfirm" class="more-bg"></div>
    </transition>
    <transition name="fade" mode="out-in">
      <div v-show="showConfirm" class="confirm-wrapper">
        <div class="title">提醒</div>
        <div class="content">
          创建班级需要下载云庐App，您可以在App中创建班级。
        </div>
        <div class="btn-group">
          <a @click="showConfirm = false">取消</a>
          <a @click="goDownload()">去下载</a>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import {getStore, removeStore} from '../../config/mUtils'
  export default {
    name: 'Timeline',
    data () {
      return {
        header: '时光轴',
        id: this.$route.params.id,
        name: this.$route.query.name || '校友会',
        loading: true,
        period: [],
        classCount: 0,
        organizationCount: 0,
        mateCount: 0,
        teacherCount: 0,
        departments: [],
        activeDepartment: '',
        year: null,
        moreDepartment: false,
        showConfirm: false
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('Timeline_goHome')) {
          removeStore('Timeline_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      // 设置默认选中的院系和该院系下面的班级
      handleActiveDepartment (arr) {
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr[i].department.length; j++) {
            arr[i].activeDepartment = arr[i].department[0].department_name
            arr[i].activeClasses = arr[i].department[0].classes
          }
        }
        return arr
      },
      selectDepartment (name, year) {
        this.closeMore()
        for (let i = 0; i < this.period.length; i++) {
          if (year === this.period[i].leave_year) {
            for (let j = 0; j < this.period[i].department.length; j++) {
              if (name === this.period[i].department[j].department_name) {
                this.period[i].activeDepartment = name
                this.activeDepartment = name
                this.period[i].activeClasses = this.period[i].department[j].classes
              }
            }
          }
        }
      },
      goRoute (id) {
        this.$router.push({name: 'Class', params: {id: id}})
      },
      getTimeline (id) {
        this.loading = true
        this.$store.dispatch('commonAction', {
          url: `/v1/team/${id}/time_line`,
          method: 'get',
          params: {},
          target: this,
          resolve: (state, res) => {
            this.period = this.handleActiveDepartment(res.data.period)
            this.classCount = res.data.total_info.class_count
            this.organizationCount = res.data.total_info.fellow_organization_count
            this.mateCount = res.data.total_info.mate_count
            this.teacherCount = res.data.total_info.teacher_count
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      handleMoreDepartment (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push({})
        }
      },
      openMoreDepartment (item) {
        this.year = item.leave_year
        this.departments = item.department
        this.activeDepartment = item.activeDepartment
        this.moreDepartment = true
      },
      closeMore () {
        this.moreDepartment = false
      },
      addClass () {
        this.showConfirm = true
      },
      goDownload () {
        this.showConfirm = false
        this.$router.push({name: 'Download'})
      }
    },
    mounted () {
      this.getTimeline(this.id)
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    @include px2rem(padding-top, 88px);
    background-color: $tenth-grey;
    .time-box {
      @include px2rem(padding-left, 38px);
      @include px2rem(margin-left, 38px);
      border-left: 1px solid #8DD257;
      @include px2rem(border-width, 6px);
      position: relative;
      .title {
        @include pm2rem(padding, 20px, 0px, 10px, 0px);
        @include px2rem(font-size, 28px);
        color: #777;
        .year {
          color: #555;
          @include px2rem(font-size, 30px);
        }
        .tilte-info {
          color: #6DBE29;
        }
      }
      .top-content {
        @include px2rem(padding-top, 30px);
        .content {
          @include px2rem(height, 117px);
          position: relative;
          .content-title {
            @include pm2rem(padding, 20px, 30px, 10px, 30px);
            @include px2rem(font-size, 30px);
            @include px2rem(max-width, 676px);
            box-sizing: border-box;
            color: #555;
            font-weight: 800;
          }
          .full-title {
            padding-top: 0;
            padding-bottom: 0;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: inherit;
          }
          .info {
            @include px2rem(font-size, 26px);
            @include pm2rem(padding, 0px, 30px, 20px, 30px);
            color: $third-dark;
            span {
              @include px2rem(margin-right, 10px);
            }
            & :last-child {
              margin-right: 0;
            }
          }
          .big-img {
            @include px2rem(width, 42px);
            @include px2rem(height, 42px);
            position: absolute;
            @include px2rem(left, -62px);
            @include px2rem(top, 22px);
          }
          .middle {
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
      .content {
        background-color: $white;
        @include px2rem(border-top-left-radius, 10px);
        @include px2rem(border-bottom-left-radius, 10px);
        .nav-wrapper {
          position: relative;
          border-bottom: 1px solid $second-grey;
          box-sizing: border-box;
          @include px2rem(height, 86px);
        }
        .nav-scroll {
          overflow-x: scroll;
          position: relative;
          @include px2rem(margin-right, 100px);
        }
        .nav-bar {
          @include pm2rem(padding, 0px, 0px, 0px, 10px);
          @include px2rem(height, 86px);
          box-sizing: border-box;
          white-space: nowrap;
          .nav {
            display: inline-block;
            height: 100%;
            @include px2rem(line-height, 86px);
            box-sizing: border-box;
            cursor: pointer;
            @include pm2rem(padding, 0px, 20px, 0px, 20px);
            color: #777;
            position: relative;
            .item {
              height: inherit;
              @include px2rem(max-width, 180px);
              position: relative;
              box-sizing: border-box;
              span {
                line-height: 1.5;
                display: flex;
                height: 100%;
                align-items: center;
                @include px2rem(font-size, 28px);
              }
              .border {
                position: absolute;
                @include px2rem(height, 6px);
                bottom: 0;
                margin: 0 auto;
                width: 100%;
              }
            }
          }
          .nav-active {
            span {
              color: #FF9126;
            }
            .border {
              background-color: #FF9126;
            }
          }
          & a:active {
            background-color: rgba(239, 234, 234, .5);
          }
        }
        .nav-more {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          @include px2rem(width, 86px);
          box-sizing: border-box;
          color: $third-dark;
          background-color: $white;
          cursor: pointer;
          box-shadow: -8px 0px 10px -8px rgba(113, 111, 111, 0.3);
        }
        & a:active {
          background-color: rgba(239, 234, 234, .5);
        }
        .nav-content {
          @include pm2rem(padding, 20px, 0px, 0px, 29px);
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: flex-start;
          .nav-item {
            @include px2rem(width, 290px);
            @include pm2rem(margin, 0px, 28px, 20px, 0px);
            @include px2rem(height, 88px);
            @include px2rem(border-radius, 4px);
            box-sizing: border-box;
            cursor: pointer;
            background-color: $tenth-grey;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: flex-start;
            .name {
              line-height: normal;
              width: inherit;
              box-sizing: border-box;
              @include px2rem(font-size, 26px);
              color: #777;
              @include pm2rem(padding, 4px, 20px, 0px, 20px);
            }
            .count {
              line-height: normal;
              @include px2rem(font-size, 24px);
              color: $third-dark;
              @include pm2rem(padding, 0px, 20px, 0px, 20px);
            }
          }
          & a:active {
            background-color: rgba(239, 234, 234, .5);
          }
          .button {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            color: #777;
            line-height: normal;
            @include px2rem(padding-left, 20px);
            i {
              @include px2rem(font-size, 40px);
              @include px2rem(margin-right, 20px);
            }
            span {
              @include px2rem(font-size, 26px);
            }
          }
        }
        .sm-img {
          @include px2rem(width, 36px);
          @include px2rem(height, 36px);
          position: absolute;
          @include px2rem(left, -22px);
          @include px2rem(top, 24px);
        }
      }
      .tips {
        color: #4EC27E;
        text-align: center;
        @include px2rem(font-size, 28px);
        @include pm2rem(padding, 30px, 0px, 30px, 0px);
      }
    }
    .half-border::before {
      content: "";
      position: absolute;
      height: 50%;
      @include px2rem(width, 10px);
      background-color: $tenth-grey;
      @include px2rem(left, -8px);
    }
    .no-border::before {
      height: 100%;
    }
    .no-bottom-border::before {
      content: "";
      position: absolute;
      height: 90%;
      @include px2rem(top, 40px);
      @include px2rem(width, 10px);
      background-color: $tenth-grey;
      @include px2rem(left, -8px);
    }
    .no-border {
      border-color: transparent;
    }
  }
  .more-bg {
    position: fixed;
    width: 100%;
    max-width: 540px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
  }
  .more-department {
    box-sizing: border-box;
    position: fixed;
    width: 100%;
    max-width: 540px;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20%;
    .title {
      @include px2rem(height, 86px);
      border-bottom: 1px solid $second-grey;
      border-top: 1px solid $second-grey;
      box-sizing: border-box;
      position: relative;
      @include px2rem(padding-left, 30px);
      background-color: $white;
      z-index: 2;
      .name {
        height: inherit;
        @include px2rem(line-height, 86px);
        @include px2rem(font-size, 30px);
        color: $primary-dark;
      }
      .close-btn {
        position: absolute;
        right: 0;
        top: 0;
        @include px2rem(width, 86px);
        height: 100%;
        background-color: $white;
        cursor: pointer;
        box-shadow: -8px 0px 10px -8px rgba(113, 111, 111, 0.3);
        i {
          @include px2rem(font-size, 40px);
          color: $second-dark;
        }
      }
      & a:active {
        background-color: rgba(239, 234, 234, .5);
      }
    }
    .department-wrapper {
      background-color: rgba(255, 255, 255, .8);
      overflow-y: scroll;
      height: 100%;
      box-sizing: border-box;
      @include px2rem(padding-top, 86px);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
      .scroll-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        @include pm2rem(padding, 20px, 0px, 0px, 24px);
        box-sizing: border-box;
      }
      .item {
        @include px2rem(line-height, 86px);
        text-align: center;
        @include px2rem(width, 218px);
        @include px2rem(height, 86px);
        @include pm2rem(margin, 0px, 24px, 20px, 0px);
        @include px2rem(border-radius, 10px);
        box-sizing: border-box;
        color: $second-dark;
        cursor: pointer;
        @include px2rem(font-size, 28px);
      }
      .item-active {
        color: #FF6000;
      }
      & a:active {
        background-color: rgba(185, 180, 180, .5);
      }
    }
  }
  .slide-in-left-enter-active, .slide-in-left-leave-active {
    transition: all .3s;
  }
  .slide-in-left-enter, .slide-in-left-leave-active {
    transform: translateX(100%);
  }
  .confirm-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    @include px2rem(width, 560px);
    @include px2rem(height, 400px);
    @include px2rem(border-radius, 10px);
    background-color: $white;
    .title {
      @include px2rem(font-size, 36px);
      color: $primary-dark;
      @include pm2rem(padding, 20px, 0px, 20px, 0px);
      text-align: center;
    }
    .content {
      @include pm2rem(padding, 20px, 40px, 20px, 40px);
      color: $primary-dark;
      @include px2rem(font-size, 32px);
    }
    .btn-group {
      position: absolute;
      bottom: 0;
      width: 100%;
      @include px2rem(height, 90px);
      box-sizing: border-box;
      display: inline-flex;
      border-top: 1px solid $second-grey;
      a {
        width: 50%;
        height: 100%;
        text-align: center;
        display: inline-block;
        @include px2rem(line-height, 90px);
        @include px2rem(font-size, 28px);
        cursor: pointer;
        color: #FF6000;
      }
      & :first-child {
        border-right: 1px solid $second-grey;
        color: $second-dark;
      }
      & a:active {
        background-color: rgba(239, 234, 234, .5);
      }
    }
  }
</style>

