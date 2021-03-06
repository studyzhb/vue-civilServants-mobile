/**
 * Created by admin on 2017/6/28.
 */
/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return
  content = JSON.stringify(content)
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return
  let value = window.localStorage.getItem(name)
  value = JSON.parse(value)
  return value
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
  let target
  // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
  if (attr === 'scrollTop') {
    target = element.scrollTop
  } else if (element.currentStyle) {
    target = element.currentStyle[attr]
  } else {
    target = document.defaultView.getComputedStyle(element, null)[attr]
  }
  //在获取 opactiy 时需要获取小数 parseFloat
  return NumberMode == 'float' ? parseFloat(target) : parseInt(target)
}

/**
 * 页面到达底部，加载更多
 */
export const loadMore = (element, callback) => {
  let windowHeight = window.screen.height
  let height
  let setTop
  let paddingBottom
  let marginBottom
  let requestFram
  let oldScrollTop
  
  document.body.addEventListener('scroll', () => {
    loadMore()
  }, false)
  //运动开始时获取元素 高度 和 offseTop, pading, margin
  element.addEventListener('touchstart', () => {
    height = element.offsetHeight
    setTop = element.offsetTop
    paddingBottom = getStyle(element, 'paddingBottom')
    marginBottom = getStyle(element, 'marginBottom')
  }, {passive: true})
  
  //运动过程中保持监听 scrollTop 的值判断是否到达底部
  element.addEventListener('touchmove', () => {
    loadMore()
  }, {passive: true})
  
  //运动结束时判断是否有惯性运动，惯性运动结束判断是非到达底部
  element.addEventListener('touchend', () => {
    oldScrollTop = document.body.scrollTop
    moveEnd()
  }, {passive: true})
  
  const moveEnd = () => {
    requestFram = requestAnimationFrame(() => {
      if (document.body.scrollTop != oldScrollTop) {
        oldScrollTop = document.body.scrollTop
        loadMore()
        moveEnd()
      } else {
        cancelAnimationFrame(requestFram)
        //为了防止鼠标抬起时已经渲染好数据从而导致重获取数据，应该重新获取dom高度
        height = element.offsetHeight
        loadMore()
      }
    })
  }
  
  const loadMore = () => {
    if (document.body.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom) {
      callback()
    }
  }
}

/**
 * 格式化日期
 */
export function formatDate (date, fmt) {
  if (!date) return
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

/**
 * 播放全屏
 */
export const requestFullScreen = () => {
  var de = document.documentElement
  if (de.requestFullscreen) {
    de.requestFullscreen()
  } else if (de.mozRequestFullScreen) {
    de.mozRequestFullScreen()
  } else if (de.webkitRequestFullScreen) {
    de.webkitRequestFullScreen()
  }
}
/**
 * 退出全屏
 */
export const exitFullscreen = () => {
  var de = document
  if (de.exitFullscreen) {
    de.exitFullscreen()
  } else if (de.mozCancelFullScreen) {
    de.mozCancelFullScreen()
  } else if (de.webkitCancelFullScreen) {
    de.webkitCancelFullScreen()
  }
}
/**
 * 秒转化为时分秒
 */
export const formatTime = (msd) => {
  var time = parseFloat(msd) / 1000
  if (time) {
    if (time > 60 && time < 60 * 60) {
      time = parseInt(time / 60.0) + '分钟' + parseInt((parseFloat(time / 60.0) -
        parseInt(time / 60.0)) * 60) + '秒'
    } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
      time = parseInt(time / 3600.0) + '小时' + parseInt((parseFloat(time / 3600.0) -
        parseInt(time / 3600.0)) * 60) + '分钟' +
        parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
          parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + '秒'
    } else {
      time = parseInt(time) + '秒'
    }
  }
  return time
}
/**
 * h5,mp5时间提交格式化
 */
export const timeFormat = (a) => { //发送的时间格式
  if (a && a > 0) {
    var hh = parseInt(a / 3600)
    if (hh < 10) hh = '0' + hh
    var mm = parseInt((a - hh * 3600) / 60)
    if (mm < 10) mm = '0' + mm
    var ss = parseInt((a - hh * 3600) % 60)
    if (ss < 10) ss = '0' + ss
    var length = hh.toString() + mm.toString() + ss.toString()
  }
  return length
}
/**
 * 检查是否是移动端（Mobile）、ipad、iphone、微信、QQ等
 */
export const userAgent = () => {
  let u = navigator.userAgent
  let browser = {
    trident: u.indexOf('Trident') > -1, //IE内核
    presto: u.indexOf('Presto') > -1, //opera内核
    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1, //是否iPad
    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
    weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
    qq: u.match(/\sQQ/i) == ' qq' //是否QQ
  }
  return browser
}

/**
 * 获取url参数
 */
export const getQueryString = (name) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

/**
 * 数组去重
 */
export const unique = (arr) => {
  let res = []
  let json = {}
  for (let i = 0; i < arr.length; i++) {
    if (!json[arr[i]]) {
      res.push(arr[i])
      json[arr[i]] = 1
    }
  }
  return res
}

/**
 * 字数限制 ...
 */
export const wordLimit = (text, num) => {
  var des = ''
  if (typeof text == 'string') {
    if (text.length > num) {
      des = text.substring(0, num) + '...'
      return des
    } else {
      return text
    }
  }
}
