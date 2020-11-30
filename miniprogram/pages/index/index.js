// pages/index/index.js
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
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    neworderarray: [],
    hasrecentorder: false,
    initstatus: 0, //0不加载  1加载访客 2加载被访人
    showed: false,
    BFRApprvestatus: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function () {

    wx.showLoading({
      title: '加载中',
    })
    console.log("onload")

    await getApp().getCloudOpenid()


    //console.log("openidstorage:" + app.globalData.openid)
    // 1. 获取数据库引用

    this.getDataInit()

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // console.log("logined")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              // console.log(this.data.userInfo)
            }
          })
        } else {
          console.log("notlogined")
        }
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 4000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady")
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
    console.log("onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
  },
  changetointerviewee() {
    if (this.data.BFRApprvestatus == -1) {
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
    } else if (this.data.BFRApprvestatus == 0) {
      wx.showModal({
        title: '提示',
        content: '您之前成为被访者的申请还未被处理',
        showCancel: false,
        success(resmodal) {
          if (resmodal.confirm) {

          }
        }
      })
    } else if (this.data.BFRApprvestatus == 2) {
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
  },
  getNewOrders() {
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var curdate = new Date();

    // curdate.setTime(curdate.getTime() + 24 * 60 * 60 * 1000 * 5);
    var time = util.formatTime(curdate);
    //console.log(time)
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
            hasrecentorder: true,
            neworderarray: res.data
          })
        } else {
          this.setData({
            hasrecentorder: false,
            neworderarray: []
          })
        }

      }).catch(err => {
        console.error(err)
      });
  },
  setInitStatusOne() {

    this.setData({
      initstatus: 1
    })
    this.getNewOrders()
  },
  onGetUserInfo(e) {
    console.log(e);
    if (e.detail.userInfo) {
      this.setData({

        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  getDataInit() {
    var that=this
    console.log('getDataInit')

    db.collection("PersonMgrInfo")
      .where({
        WxOpenid: app.globalData.openid
      })

      .get()
      .then((res) => {

        //console.log(res.data);
        if (res.data.length > 0) {
          this.setData({
            BFRApprvestatus: res.data[0].ApproveStatus
          })
          app.globalData.bfrinfo = res.data[0]
          // console.log("app.globalData.bfrinfo")
          // console.log(app.globalData.bfrinfo)
          if (res.data[0].ApproveStatus == 2) {
            this.setInitStatusOne()
            wx.setTabBarItem({
              index: 0,
              "text": "访客预约",
              // "iconPath": "images/temps/cam2.png",
              // "selectedIconPath": "images/temps/cam3.png"
            })
            if (res.data[0].MsgReceviced == 0) {
              wx.showModal({
                title: '提示',
                content: '您之前成为被访者的申请已被驳回',
                showCancel: false,
                success(resmodal) {
                  if (resmodal.confirm) {

                    const mgrid = res.data[0]._id
                    delete res.data[0]["_id"]          
                    res.data[0].MsgReceviced =1
                    console.log(res.data[0])
                    db.collection('PersonMgrInfo').doc(mgrid).set({
                      data: res.data[0]
                    }).then(resupd => {
                      wx.showModal({
                        title: '提示',
                        content: "resupd",
                        showCancel: false,
                        success(res1) {

                       
                        }
                      })
                      console.log('更新已读状态成功')
                    }).catch(err => {
                      console.error('更新已读状态失败' + err)
                     
                    })

                  }
                }
              })
            }
          } else if (res.data[0].ApproveStatus == 1) {
            this.setData({
              initstatus: 2
            })




            wx.setTabBarItem({
              index: 0,
              "text": "近期申请",
              // "iconPath": "images/temps/cam2.png",
              // "selectedIconPath": "images/temps/cam3.png"
            })


            if (res.data[0].MsgReceviced == 0) {

              wx.showModal({
                title: '提示',
                content: '您之前成为被访者的申请已被通过',
                showCancel: false,
                success(resmodal) {
                  if (resmodal.confirm) {

                    const mgrid = res.data[0]._id
                    delete res.data[0]["_id"]          
                    res.data[0].MsgReceviced =1
                    console.log(res.data[0])
                    db.collection('PersonMgrInfo').doc(mgrid).set({
                      data: res.data[0]
                    }).then(resupd => {
                      wx.showModal({
                        title: '提示',
                        content: "resupd",
                        showCancel: false,
                        success(res1) {

                       
                        }
                      })
                      console.log('更新已读状态成功')
                    }).catch(err => {
                      console.error('更新已读状态失败' + err)
                     
                    })


                  }
                }
              })
            }
          } else {
            this.setInitStatusOne()
            wx.setTabBarItem({
              index: 0,
              "text": "访客预约",
              // "iconPath": "images/temps/cam2.png",
              // "selectedIconPath": "images/temps/cam3.png"
            })
          }
        } else {
          this.setInitStatusOne()
          wx.setTabBarItem({
            index: 0,
            "text": "访客预约",
            // "iconPath": "images/temps/cam2.png",
            // "selectedIconPath": "images/temps/cam3.png"
          })

        }
      });
  },
  getDataRefresh() {

    console.log('getDataRefresh')
    db.collection("PersonMgrInfo")
      .where({
        WxOpenid: app.globalData.openid
      })

      .get()
      .then((res) => {

        //console.log(res.data);
        if (res.data.length > 0) {
          this.setData({
            BFRApprvestatus: res.data[0].ApproveStatus
          })
          app.globalData.bfrinfo = res.data[0]

          if (res.data[0].ApproveStatus == 2) {
            this.setInitStatusOne()
            wx.setTabBarItem({
              index: 0,
              "text": "访客预约",
              // "iconPath": "images/temps/cam2.png",
              // "selectedIconPath": "images/temps/cam3.png"
            })
            if (res.data[0].MsgReceviced == 0)
              wx.showModal({
                title: '提示',
                content: '您之前成为被访者的申请已被驳回',
                showCancel: false,
                success(resmodal) {
                  if (resmodal.confirm) {

                    const mgrid = res.data[0]._id
                    delete res.data[0]["_id"]          
                    res.data[0].MsgReceviced =1
                    console.log(res.data[0])
                    db.collection('PersonMgrInfo').doc(mgrid).set({
                      data: res.data[0]
                    }).then(resupd => {
                      wx.showModal({
                        title: '提示',
                        content: "resupd",
                        showCancel: false,
                        success(res1) {

                       
                        }
                      })
                      console.log('更新已读状态成功')
                    }).catch(err => {
                      console.error('更新已读状态失败' + err)
                     
                    })

                  }
                }
              })
          } else if (res.data[0].ApproveStatus == 1) {
            this.setData({
              initstatus: 2
            })

            wx.setTabBarItem({
              index: 0,
              "text": "近期申请",
              // "iconPath": "images/temps/cam2.png",
              // "selectedIconPath": "images/temps/cam3.png"
            })


            if (res.data[0].MsgReceviced == 0) {
              wx.showModal({
                title: '提示',
                content: '您之前成为被访者的申请已被通过',
                showCancel: false,
                success(resmodal) {
                  if (resmodal.confirm) {

                    const mgrid = res.data[0]._id
                    delete res.data[0]["_id"]          
                    res.data[0].MsgReceviced =1
                    console.log(res.data[0])
                    db.collection('PersonMgrInfo').doc(mgrid).set({
                      data: res.data[0]
                    }).then(resupd => {
                      wx.showModal({
                        title: '提示',
                        content: "resupd",
                        showCancel: false,
                        success(res1) {

                       
                        }
                      })
                      console.log('更新已读状态成功')
                    }).catch(err => {
                      console.error('更新已读状态失败' + err)
                     
                    })

                  }
                }
              })
            }
          } else {
            this.setInitStatusOne()
            wx.setTabBarItem({
              index: 0,
              "text": "访客预约",
              // "iconPath": "images/temps/cam2.png",
              // "selectedIconPath": "images/temps/cam3.png"
            })
          }
        } else {
          this.setInitStatusOne()
          wx.setTabBarItem({
            index: 0,
            "text": "访客预约",
            // "iconPath": "images/temps/cam2.png",
            // "selectedIconPath": "images/temps/cam3.png"
          })

        }
      });
  },
  slideButtonTap(e) {
    console.log('slide button tap', e.detail.index)
    console.log('slide button tap', e.detail.data)
    const that = this

    wx.showModal({
      title: '提示',
      cancelText: '关闭',
      confirmText: '确定撤销',
      confirmColor: '#ff0000',
      content: '确定要取消申请吗？',
      success(res) {
        if (res.confirm) {
          db.collection('VisitorsInfo').doc(e.detail.data).remove()
            .then((resdel) => {
              wx.showModal({
                title: '提示',
                content: '撤销成功',
                showCancel: false,
                success(res) {

                  if (res.confirm) {
                    that.getDataRefresh()
                  }
                }
              })
            })
            .catch((err) => {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '撤销失败，' + err,
                success(res) {
                  if (res.confirm) {

                  }
                }
              })
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  longpress(e) {
    console.log(e.currentTarget.id)
    console.log(e)

    const that = this

    wx.showModal({
      title: '提示',
      cancelText: '关闭',
      confirmText: '确定撤销',
      confirmColor: '#ff0000',
      content: '确定要取消申请吗？',
      success(res) {
        if (res.confirm) {
          db.collection('VisitorsInfo').doc(e.currentTarget.id).remove()
            .then((resdel) => {
              wx.showModal({
                title: '提示',
                content: '撤销成功',
                showCancel: false,
                success(res) {

                  if (res.confirm) {
                    that.getDataRefresh()
                  }
                }
              })
            })
            .catch((err) => {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '撤销失败，' + err,
                success(res) {
                  if (res.confirm) {

                  }
                }
              })
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  sendmsg() {


    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'sendMsgToBfr',
      // 传递给云函数的event参数
      data: {
        wxopenid: 'oO80M480dnzdPMwWH_Qc-xNq9xtA',
        personname: '陈建军',
        requesttime: '2020-11-30 18:22:23'
      }
    }).then(res => {
      console.log(res)
      // output: res.result === 3
    }).catch(err => {
      console.log(err)
      // handle error
    })
  },
  subscribemsg() {

    wx.requestSubscribeMessage({
      tmplIds: ['zT41ZSW058Iag1XW_-qzkTMEGGZa53A5vgKJ4YVIvIA'],
      success(res) {
        console.log(res)
      },
      fail(error) {
        console.log(error)
      }
    })
  }

})