// pages/hisinfo/hisinfo.js
var util = require('../../utils/utils');
const app = getApp()
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showed: false,
    neworderarray: [],
    roletype: 0
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
    console.log("onShow")
    if (this.data.showed == false) {

      this.setData({
        showed: true
      })
    } else {
      this.getDataRefresh()
    }

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
  getDataRefresh() {

    wx.showLoading({
      title: '加载中',
    })
    const that = this
    db.collection("PersonMgrInfo")
      .where({
        WxOpenid: app.globalData.openid
      })

      .get()
      .then((res) => {

        console.log(res)
        if (res.data.length > 0) {

          app.globalData.bfrinfo = res.data[0]

          if (res.data[0].ApproveStatus == 2) {
            that.setData({
              roletype: 2
            })
          } else if (res.data[0].ApproveStatus == 1) {
            that.setData({
              roletype: 1
            })

          } else {
            that.setData({
              roletype: 2
            })
          }
        } else {
          that.setData({
            roletype: 2
          })
        }
        console.log(that.data.roletype)
        if (that.data.roletype == 2) {
          console.log("here")
          var curdate = new Date();

          curdate.setTime(curdate.getTime() - 24 * 60 * 60 * 1000 * 30);
          var time = util.formatTime(curdate);
          //console.log(time)
          db.collection("VisitorsInfo")
            .where({
              wxOpenid: app.globalData.openid,
              createdtime: _.gte(time)
            })
            .orderBy("createdtime", "asc")
            .get()
            .then((resvisitor) => {
              console.log("order")
              console.log(resvisitor.data)
              wx.hideLoading()
              if (resvisitor.data.length > 0) {
                this.setData({
                  neworderarray: resvisitor.data
                })
              } else {
                this.setData({
                  neworderarray: []
                })
              }

            }).catch(err => {
              wx.hideLoading()
              console.error(err)
              this.setData({
                neworderarray: []
              })
            });
        }else if (that.data.roletype == 1) {
          console.log("here")
          var curdate = new Date();

          curdate.setTime(curdate.getTime() - 24 * 60 * 60 * 1000 * 30);
          var time = util.formatTime(curdate);
          //console.log(time)
          db.collection("VisitorsInfo")
            .where({
              bfrPhone: app.globalData.bfrinfo.bfrPhone,
              createdtime: _.gte(time)
            })
            .orderBy("createdtime", "asc")
            .get()
            .then((resvisitor) => {
              console.log("order")
              console.log(resvisitor.data)
              wx.hideLoading()
              if (resvisitor.data.length > 0) {
                this.setData({
                  neworderarray: resvisitor.data
                })
              } else {
                this.setData({
                  neworderarray: []
                })
              }

            }).catch(err => {
              wx.hideLoading()
              console.error(err)
              this.setData({
                neworderarray: []
              })
            });
        }

      });
  }
})