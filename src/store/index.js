import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
  userInfo: {},
  userAgent:{},
  weLoginUrl:'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf24d72db02fede73&redirect_uri=http%3a%2f%2ftest10.jy365.net%2fwechat%2fpages%2flogin.html&response_type=code&scope=snsapi_base#wechat_redirect',
  weIndexUrl:'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf24d72db02fede73&redirect_uri=http%3a%2f%2ftest10.jy365.net%2fwechat%2findex.html&response_type=code&scope=snsapi_base#wechat_redirect'
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
})
