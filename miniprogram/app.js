//app.js
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'wxvisitors-5gcbnadq17e42a94',
        traceUser: true,
      })
    }

    this.globalData = {
      openid: "",
      bfrinfo: [],
      ishide: false
    }
  },
  getCloudOpenid: async function () {
    return this.globalData.openid = this.globalData.openid || (await wx.cloud.callFunction({
      name: 'login'
    })).result.openid
  },
  //最佳方案。
  getOpenid: async function () {
    (this.globalData.openid = this.globalData.openid || wx.getStorageSync('openid')) || wx.setStorageSync('openid', await this.getCloudOpenid())
    return this.globalData.openid
  },
  onHide() {

    console.log('onhide')
    this.globalData.ishide = true
  },
  onShow(ddd) {
    console.log('onshow')
console.log(ddd)
    if (this.globalData.ishide == true) {
      this.globalData.ishide = false
      if (ddd.path != 'pages/proshow/proshow'&&ddd.path!= "pages/neworder/neworder") {
        wx.reLaunch({
          url: '/pages/proshow/proshow'
        });
      }
    }
  },
  getCurrentPages: function () {
    var pages = getCurrentPages(); //获取加载的页面
    var currentPage = pages[pages.length - 1]; //获取当前页面的对象
    var url = currentPage.route; //当前页面url
    var options = currentPage.options; //获取url中所带的参数
    //拼接url的参数
    var currentPage = url + '?';
    for (var key in options) {
      var value = options[key]
      currentPage += key + '=' + value + '&';
    }
    currentPage = currentPage.substring(0, currentPage.length - 1);
    return currentPage;
  }
})