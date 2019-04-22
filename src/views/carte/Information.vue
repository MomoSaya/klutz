<template>
  <section class="wrapper">
    <common-header
      :title="header"
      :icon-class="iconClass"
      :right-text="rightBtnText"
      @right-click="goReport()"
      @back="goBack()">
    </common-header>
    <div class="gallery-container">
      <div v-if="loading || (enterpriseInfoFiles && enterpriseInfoFiles.length > 0)">
        <information-list
          key="information"
          :loading="loading"
          :num="10"
          :store="enterpriseInfoFiles"
          ref="list"
          @click="openInformationFolders">
        </information-list>
        <foot v-show="!footFixed" :has-link="false"></foot>
      </div>
      <div v-else key="information1">
        <div class="no-data">
          <img src="../../assets/noInformation.png">
        </div>
      </div>
    </div>
    <div class="foot-component">
      <foot v-show="footFixed" :has-link="false"></foot>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  import InformationList from '../../components/common/InformationList'
  import Foot from '../../components/footer/Foot'
  export default {
    name: 'Information',
    data () {
      return {
        header: '资讯',
        id: this.$route.params.id,
        rightBtnText: '投诉',
        iconClass: 'icon-jubao',
        loading: true,
        enterpriseInfoFiles: [],
        footFixed: false
      }
    },
    components: {
      CommonHeader,
      InformationList,
      Foot
    },
    methods: {
      goBack () {
        if (getStore('Information_goHome')) {
          removeStore('Information_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      goReport () {
        this.$router.push({name: 'Report', query: {resourceId: this.id, resourceClass: 'product'}})
      },
      // 获取指定组织已发布的公司档分类概况(公司/企业名片资讯)
      getEnterpriseDocument (teamId) {
        this.loading = true
        this.$store.dispatch('commonAction', {
          url: '/v1/archives/stat/types',
          method: 'get',
          params: {
            team_id: this.id
          },
          target: this,
          resolve: (state, res) => {
            this.enterpriseDocuments = res.data.types.filter(i => i.file_id !== null)
            this.getInformation(this.handleDocumentIds(this.enterpriseDocuments))
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      handleDocumentIds (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push(arr[i].file_id)
        }
        return tmpArr
      },
      getInformation (ids) {
        this.$store.dispatch('commonAction', {
          url: '/v1/links/files/publisheds',
          method: 'get',
          params: {
            type: 'document',
            team_id: this.id,
            thumbs: ['general'],
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            this.enterpriseInfoFiles = this.handleEnterpriseInfoFiles(this.enterpriseDocuments, res.data.files)
            this.loading = false
            this.$nextTick(() => {
              this.handleFootPosition()
            })
          },
          reject: () => {
            this.loading = false
          }
        })
      },
      // 手机QQ浏览器及UC浏览器不支持array.findIndex方法
      handleEnterpriseInfoFiles (enterpriseDocuments, files) {
        for (let i = 0; i < files.length; i++) {
          for (let j = 0; j < enterpriseDocuments.length; j++) {
            if (files[i].id === enterpriseDocuments[j].file_id) {
              files[i].name = enterpriseDocuments[j].name
              files[i].count = enterpriseDocuments[j].count
              switch (enterpriseDocuments[j].name) {
                case null:
                  files[i].cnname = '其他'
                  break
                case 'Certificate':
                  files[i].cnname = '社会身份'
                  break
                case 'Case':
                  files[i].cnname = '案例'
                  break
                case 'Trend':
                  files[i].cnname = '活动'
                  break
                case 'Constitution':
                  files[i].cnname = '章程'
                  break
                case 'Special':
                  files[i].cnname = '专题'
                  break
                case 'Culture':
                  files[i].cnname = '文化'
                  break
                case 'Glory':
                  files[i].cnname = '荣誉'
                  break
                case 'Information':
                  files[i].cnname = '资料'
                  break
                case 'Notice':
                  files[i].cnname = '公告'
                  break
                case 'Notification':
                  files[i].cnname = '通知'
                  break
                case 'SaleCertificate':
                  files[i].cnname = '销售资质'
                  break
                case 'Other':
                  files[i].cnname = '其它'
                  break
                default:
                  files[i].cnname = '其他'
                  break
              }
            }
          }
        }
        return files
      },
      openInformationFolders (item) {
        this.$router.push({name: 'InformationFolders', params: {id: this.id}, query: {type: item.name || 'Null'}})
      },
      handleFootPosition () {
        if (this.$refs.list) {
          let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
          let footHeight = Math.round((273 / 75) * parseFloat(rootFontSize + ''))
          this.footFixed = this.$refs.list.$el.offsetTop + this.$refs.list.$el.offsetHeight + footHeight < window.screen.availHeight
        }
      }
    },
    mounted () {
      this.getEnterpriseDocument()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .wrapper {
    position: relative;
    height: 100%;
  }
  .gallery-container {
    overflow-y: scroll;
    padding-bottom: 1px; // 避免安卓手机QQ浏览器，滑动到底部后第一次不能直接上滑的bug
    -webkit-overflow-scrolling: touch;
    @include px2rem(padding-top, 88px);
    height: 100%;
    box-sizing: border-box;
  }
  .foot-component {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
</style>
