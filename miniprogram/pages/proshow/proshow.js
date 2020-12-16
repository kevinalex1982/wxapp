// pages/proshow/proshow.js

const app = getApp()
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    showbtn:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    await getApp().getCloudOpenid()
    this.getDataRefresh()
    setTimeout(function () {
      wx.hideLoading()
    }, 4000)
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
  subscribemsgbfr() {
    const that = this
   
      wx.requestSubscribeMessage({
        tmplIds: ['zT41ZSW058Iag1XW_-qzkTMEGGZa53A5vgKJ4YVIvIA'],
        success(res) {
          console.log(res)
          if (res["zT41ZSW058Iag1XW_-qzkTMEGGZa53A5vgKJ4YVIvIA"] == "accept") {

          }
          that.tomain()
        },
        fail(error) {
          console.log(error)
          that.tomain()
        }
      })
  
  },
  getDataRefresh() {

    wx.showLoading({
      title: '加载中',
    })
    var that = this
    db.collection("PersonMgrInfo")
      .where({
        WxOpenid: app.globalData.openid
      })

      .get()
      .then((res) => {

        if (res.data.length > 0) {
          this.setData({
            BFRApprvestatus: res.data[0].ApproveStatus
          })
          app.globalData.bfrinfo = res.data[0]
          wx.hideLoading()
          if (res.data[0].ApproveStatus == 2) {
            that.setData({
              showbtn: 2
            })
          } else if (res.data[0].ApproveStatus == 1) {
            that.setData({
              showbtn: 1
            })

          } else {
            that.setData({
              showbtn: 2
            })
          }
        } else {
          that.setData({
            showbtn: 2
          })
        }
      });
  },
  tomain() {
    wx.reLaunch({
      url: '../index/index',
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

      }
    })
  },
  subscribemsgvisitor() {
    const that = this
    wx.requestSubscribeMessage({
      tmplIds: ['vZXqI0mxDDixhGMlANInkZWUcfSCKqhxwSKjLGP9IKg'],
      success(res) {
        that.tomain()
        if (res["vZXqI0mxDDixhGMlANInkZWUcfSCKqhxwSKjLGP9IKg"] == "accept") {

        } else if (res["vZXqI0mxDDixhGMlANInkZWUcfSCKqhxwSKjLGP9IKg"] == "reject") {

        }
      
      },
      fail(error) {
        that.tomain()
        console.log('error')
        console.log(error)
    
      }
    })

  }
})