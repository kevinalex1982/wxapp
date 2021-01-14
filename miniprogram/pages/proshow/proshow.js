// pages/proshow/proshow.js

const app = getApp()
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    userrole: 0, //0不是被访人也没有申请 1被访人 2被拒绝 3已经申请无回复
    isloadcompleted: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await getApp().getCloudOpenid()

    this.getDataRefresh()
    setTimeout(function () {
      wx.hideLoading()
    }, 8000)
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
        that.tobfr()
      },
      fail(error) {
        console.log(error)
        that.tobfr()
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

          app.globalData.bfrinfo = res.data[0]
          wx.hideLoading()
          that.setData({
            isloadcompleted: true

          })
          if (res.data[0].ApproveStatus == 2) { //已经被拒绝
            that.setData({
              userrole: 2
            })
          } else if (res.data[0].ApproveStatus == 1) { //已经是被访人
            that.setData({
              userrole: 1
            })

          } else if (res.data[0].ApproveStatus == 0) { //还在审核被访人状态
            that.setData({
              userrole: 3
            })
          }
        } else { //没有申请过做被访人
          that.setData({
            userrole: 0
          })
        }
      });
  },
  tobfr() {
    if (this.data.userrole == 0) {
      wx.navigateTo({
        url: '../iminterviewee/iminterviewee?optype=add',
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
     
    } else if (this.data.userrole == 1) {
      wx.switchTab({
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
    } else if (this.data.userrole == 2) {
      wx.showModal({
        title: '提示',
        content: '您的申请之前被驳回了',
        showCancel: false,
        success(resmodal) {
          if (resmodal.confirm) {
            wx.navigateTo({
              url: '../iminterviewee/iminterviewee?optype=upd',
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
        }
      })
    } else if (this.data.userrole == 3) {
      wx.showModal({
        title: '提示',
        content: '您的申请还没有回复，您可以修改自己的申请',
        showCancel: false,
        success(resmodal) {
          if (resmodal.confirm) {
            wx.navigateTo({
              url: '../iminterviewee/iminterviewee?optype=upd',
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
        }
      })
    }
   
  },
  tovisitor() {
    wx.reLaunch({
      url: '../visitorinfo/visitorinfo',
    })
  },
  subscribemsgvisitor() {
    const that = this
    wx.requestSubscribeMessage({
      tmplIds: ['vZXqI0mxDDixhGMlANInkZWUcfSCKqhxwSKjLGP9IKg'],
      success(res) {
        that.tovisitor()
        if (res["vZXqI0mxDDixhGMlANInkZWUcfSCKqhxwSKjLGP9IKg"] == "accept") {

        } else if (res["vZXqI0mxDDixhGMlANInkZWUcfSCKqhxwSKjLGP9IKg"] == "reject") {

        }

      },
      fail(error) {
        that.tovisitor()
        console.log('error')
        console.log(error)

      }
    })

  }
})