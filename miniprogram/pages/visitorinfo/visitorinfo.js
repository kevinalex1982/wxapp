// pages/visitorinfo/visitorinfo.js
var util = require('../../utils/utils');

var base64 = require("../../images/sliderleft/base64");
const app = getApp()
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selindex: 0,
    txtselcls: "bottombaritemseltxt",
    txtnotselcls: "bottombaritemnotseltxt",
    successstatuscls:"successstatuscls",
    errorstatuscls:"errorstatuscls",
    normalstatuscls:"normalstatuscls",
  },
  tabChange(e) {
    let index = e.detail.index;
    this.setData({
      tabbarIndex: index
    })
    console.log('tab change', e.detail.index)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataRefresh()
     },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  clickleftbottombar() {
    if (this.data.selindex == 0) {

    } else if (this.data.selindex == 1) {
      this.setData({
        selindex: 0
      })
      wx.setNavigationBarTitle({
        title: '待出发行程'
      })
    }
  },
  clickrightbottombar() {
    if (this.data.selindex == 0) {
      this.setData({
        selindex: 1
      })
      wx.setNavigationBarTitle({
        title: '历史记录'
      })
    } else if (this.data.selindex == 1) {

    }
  },
  getDataRefresh() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    console.log('getDataRefresh')
  // 调用函数时，传入new Date()参数，返回值是日期和时间
  var curdate = new Date();

  //curdate.setTime(curdate.getTime() -24 * 60 * 60 * 1000 * 60);
  var time = util.formatTime(curdate);
  console.log(time)
  db.collection("VisitorsInfo")
    .where({
      wxOpenid: app.globalData.openid,
      createdtime: _.gte(time)
    })
    .orderBy("createdtime", "asc")
    .get()
    .then((res) => {
      console.log("order")
      console.log(res.data)
      wx.hideLoading()
      if (res.data.length > 0) {


        for (let item of res.data) {
          item.slideButtons = [{ // 这里我只设置了一个按键
            type: 'warn',
            text: '删除',
            extClass: 'test',
            src: '/images/sliderleft/icon_del.svg', // icon的路径
            data: item._id
          }];
        }
        this.setData({        
          neworderarray: res.data
        })
      } else {
        this.setData({
      
          neworderarray: []
        })
      }

    }).catch(err => {
      wx.hideLoading()
      console.error(err)
    });
    setTimeout(function () {
      wx.hideLoading()
    }, 8000)
  },
  buildNewOrder() {
    wx.navigateTo({
      url: '../neworder/neworder',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
        someEvent: function (data) {
          console.log(data)
        }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: 'test'
        })
      }
    })
  }
})