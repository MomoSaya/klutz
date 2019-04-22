import Vue from 'vue'
import 'mint-ui/lib/style.css'
import './styles/iconfont.css'
import 'swiper/dist/css/swiper.css'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import store from './vuex/store'
import { AUTH_URL } from './constants/constant'
import { getStore, setStore, mobileClient, removeStore } from './config/mUtils'
import realtime from './config/leancloud'

// 保存添加导购员参数，注册时，带入这些参数，后台将新注册用户添加为指定企业导购员
const saveGuidParams = () => {
  let query = {
    organization_ids: [],
    product_ids: []
  }
  if (window.location.pathname.indexOf('/malls/') > -1) {
    query.organization_ids = [window.location.pathname.split('/malls/')[1]]
  } else if (window.location.pathname.indexOf('/enterprises/') > -1) {
    query.organization_ids = [window.location.pathname.split('/enterprises/')[1]]
  } else if (window.location.pathname.indexOf('/products/') > -1) {
    query.product_ids = [window.location.pathname.split('/products/')[1]]
  }
  if (!getStore('guidParams')) {
    setStore('guidParams', query)
  }
}
saveGuidParams()

router.beforeEach((to, from, next) => {
  const downloadBarRoutes = [
    'Mall',
    'EnterpriseCarte',
    'PersonCarte',
    'ProductDetail',
    'ComityCarte',
    'Class',
    'Card',
    'Zone'
  ]
  const handleDownloadBar = () => {
    let flag = false
    for (let i = 0; i < downloadBarRoutes.length; i++) {
      if (downloadBarRoutes[i] === to.name) {
        flag = true
        break
      }
    }
    // store.dispatch('switchIntegralDialog', {status: flag && !store.getters.hasCloseRegistModal && !(getStore('user') && getStore('user').mobile)})
    if (!flag) {
      store.dispatch('switchRegistBar', {status: flag})
    }
    // store.dispatch('switchRegistBar', {status: flag && !store.getters.hasCloseRegistBar && !(getStore('user') && getStore('user').mobile && !!getStore('shortUuid'))})
    // 暂时隐藏底部下载条
    store.dispatch('switchDownloadBar', {status: false && !store.getters.hasCloseDownloadBar})
  }
  const handleUrlQuery = () => {
    let query = {
      tmpToken: '',
      provider: ''
    }
    if (window.location.search.split('?').length === 1) {
      return query
    } else {
      let params = window.location.search.split('?')[1].split('&')
      for (let i = 0; i < params.length; i++) {
        if (params[i].split('=').length > 1 && params[i].split('=')[0] === 'tmp_token') {
          query.tmpToken = params[i].split('=')[1]
        }
        if (params[i].split('=').length > 1 && params[i].split('=')[0] === 'provider') {
          query.provider = params[i].split('=')[1]
        }
      }
      return query
    }
  }
  const weixinAuth = (token) => {
    store.dispatch('commonAction', {
      url: '/v1/login_info',
      method: 'get',
      params: {
        token: token
      },
      data: {},
      target: this,
      resolve: (state, res) => {
        setStore('device_signature', res.data.sign)
        removeStore('weixinLogin')
        if (!res.data.authentication_token && res.data.id) {
          console.log('需要主控设备授权,App端暂时没有开放绑定第三方账号功能')
        } else if (res.data.authentication_token && res.data.id) {
          setStore('user', res.data)
          getSignature(res.data.authentication_token)
        } else {
          setStore('weixinLogin', 'true')
          console.log('授权登录出错')
        }
      },
      reject: () => {
        setStore('weixinLogin', 'true')
        console.log('授权登录出错')
      }
    })
  }
  const getSignature = (token) => {
    store.dispatch('commonAction', {
      url: '/v1/im/sign',
      method: 'get',
      params: {
        token: token
      },
      target: this,
      resolve: (state, res) => {
        setStore('signature', res.data)
        setStore('provider', 'wechat')
        handleDownloadBar()
        next()
      },
      reject: () => {
      }
    })
  }
  const saveUuid = () => {
    if (window.location.search.split('?').length > 1) {
      let params = window.location.search.split('?')[1].split('&')
      for (let i = 0; i < params.length; i++) {
        if (params[i].split('=').length > 1 && params[i].split('=')[0] === 'sharer_uuid') {
          setStore('shortUuid', params[i].split('=')[1])
          break
        }
      }
    }
  }
  const autoLogin = () => {
    if (!getStore('weixinLogin') && mobileClient() === 'weixin' && handleUrlQuery().provider === 'wechat' && handleUrlQuery().tmpToken && (!getStore('user') || !getStore('user').authentication_token)) {
      weixinAuth(handleUrlQuery().tmpToken)
    } else if (getStore('weixinLogin') && (!getStore('user') || !getStore('user').authentication_token)) {
      console.log('微信授权登录失败')
      handleDownloadBar()
      next()
    } else if (mobileClient() === 'weixin' && (!getStore('user') || !getStore('user').authentication_token) && !getStore('weixinLogin')) {
      window.location.href = `${AUTH_URL}/member/auth/wechat?url=${encodeURIComponent(`${window.location.pathname}${window.location.search}${window.location.search.indexOf('?') > -1 ? '&' : '?'}provider=wechat&tmp_token=`)}`
    } else {
      handleDownloadBar()
      next()
    }
  }
  // 如果是直接输入地址打开指定页面，则保存当前页面直接返回首页标记，在当前页面返回会回到首页。如果是从上一级点击进入某页面后，会保存来源页面标记，刷新页面，判断如果没有返回首页标记，则返回上一页(刷新页面window.history不会丢失)
  setStore('fromName', {name: from.name ? from.name : (getStore('fromName') ? getStore('fromName').name : 'false')})
  if (!getStore('fromName') || getStore('fromName').name === 'false') {
    setStore(`${to.name}_goHome`, 'true')
  }
  saveUuid()
  autoLogin()
})

Vue.use(realtime)
Vue.use(MintUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
