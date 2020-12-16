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
    BFRApprvestatus: -1,
    neworderforbfrarray: [],
    neworderbfrarray: [],
    mgrPhone: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function () {


    console.log("onload")

 


    //console.log("openidstorage:" + app.globalData.openid)
    // 1. 获取数据库引用

    this.getDataInit()

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // console.log("logined")
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo
    //           })
    //           // console.log(this.data.userInfo)
    //         }
    //       })
    //     } else {
    //       console.log("notlogined")
    //     }
    //   }
    // })
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
  setInitStatusTwo() {
    this.setData({
      initstatus: 2
    })
    this.getNewOrdersForBFR()
  },
  getNewOrdersForBFR() {
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var curdate = new Date();
    const that = this
    // curdate.setTime(curdate.getTime() + 24 * 60 * 60 * 1000 * 5);
    var time = util.formatTime(curdate);
    //console.log(time)
    db.collection("VisitorsInfo")
      .where({
        bfrPhone: that.data.mgrPhone,
        createdtime: _.gte(time)
      })
      .orderBy("createdtime", "asc")
      .get()
      .then((res) => {
        console.log("order")
        console.log(res.data)
        wx.hideLoading()
        if (res.data.length > 0) {

          this.setData({
            hasrecentorderforbfr: true,
            neworderforbfrarray: res.data
          })
        } else {
          this.setData({
            hasrecentorderforbfr: false,
            neworderforbfrarray: []
          })
        }

      }).catch(err => {
        console.error(err)
      });
  },
  getDataInit() {
    var that = this
    console.log('getDataInit')
    this.getDataRefresh()

  },
  getDataRefresh() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
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
          wx.hideLoading()
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
                    res.data[0].MsgReceviced = 1
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
              mgrPhone: res.data[0].PersonPhone
            })
            this.setInitStatusTwo()
            wx.setTabBarItem({
              index: 0,
              "text": "近期申请",
              // "iconPath": "images/temps/cam2.png",
              // "selectedIconPath": "images/temps/cam3.png"
            })


            // 不去看是否订阅了
            // wx.getSetting({
            //   withSubscriptions: true,
            //   success(res) {

            //     console.log(res.subscriptionsSetting)
            //     if (res.subscriptionsSetting.mainSwitch == false) {
            //       wx.showModal({
            //         title: '提示',
            //         content: '请点击右上角第二个设置按钮，设置该小程序的接收消息为接收',
            //         showCancel: false,
            //         success(resmodal) {
            //           if (resmodal.confirm) {


            //           }
            //         }
            //       })
            //     } else {
            //       if (res.subscriptionsSetting.itemSettings != null) {
            //         if (res.subscriptionsSetting.itemSettings["zT41ZSW058Iag1XW_-qzkTMEGGZa53A5vgKJ4YVIvIA"] != null) {
            //           if (res.subscriptionsSetting.itemSettings["zT41ZSW058Iag1XW_-qzkTMEGGZa53A5vgKJ4YVIvIA"] == "reject" ||
            //             res.subscriptionsSetting.itemSettings["zT41ZSW058Iag1XW_-qzkTMEGGZa53A5vgKJ4YVIvIA"] == "ban") {
            //             wx.showModal({
            //               title: '提示',
            //               content: '为了您能按时接收到访客消息，请手动点击订阅消息按钮',
            //               showCancel: false,
            //               success(resmodal) {
            //                 if (resmodal.confirm) {


            //                 }
            //               }
            //             })
            //           }
            //         } else {
            //           wx.showModal({
            //             title: '提示',
            //             content: '为了您能按时接收到访客消息，请手动点击订阅消息按钮',
            //             showCancel: false,
            //             success(resmodal) {
            //               if (resmodal.confirm) {


            //               }
            //             }
            //           })
            //         }

            //       } else {
            //         wx.showModal({
            //           title: '提示',
            //           showCancel: false,
            //           content: '为了您能按时接收到访客消息，请手动点击订阅消息按钮，选择<总是保持以上选择>会减少提醒',
            //           success(res) {
            //             if (res.confirm) {

            //             }
            //           }
            //         })
            //       }

            //     }

            //   }
            // })


            if (res.data[0].MsgReceviced == 0) {}
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
  visitordetail(e) {
    console.log(e.currentTarget.id)
    console.log(e)

    wx.navigateTo({
      url: '../visitordetail/visitordetail?visitorid='+e.currentTarget.id,
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
  // longpressbfr(e) {
  //   console.log(e.currentTarget.id)
  //   console.log(e)

  //   const that = this
  //   wx.showActionSheet({
  //     itemList: ['通过审核', '拒绝'],
  //     success(res) {
  //       console.log(res.tapIndex)
  //       if (res.tapIndex == 0) {
  //         db.collection('VisitorsInfo').doc(e.currentTarget.id).update({
  //             // data 传入需要局部更新的数据
  //             data: {
  //               // 表示将 done 字段置为 true
  //               approveStatus: 1
  //             }
  //           })
  //           .then(res => {
  //             console.log(res)

  //             wx.showModal({
  //               title: '提示',
  //               showCancel: false,
  //               content: '批准成功',
  //               success(res) {
  //                 if (res.confirm) {
  //                   that.getDataRefresh()
  //                 }
  //               }
  //             })

  //             // output: res.result === 3
  //           }).catch(err => {
  //             console.log(err)
  //             // handle error
  //           })
  //       }else if(res.tapIndex==1)
  //       {
  //         db.collection('VisitorsInfo').doc(e.currentTarget.id).update({
  //           // data 传入需要局部更新的数据
  //           data: {
  //             // 表示将 done 字段置为 true
  //             approveStatus: 2
  //           }
  //         })
  //         .then(res => {
  //           console.log(res)

  //           wx.showModal({
  //             title: '提示',
  //             showCancel: false,
  //             content: '您拒绝他访问',
  //             success(res) {
  //               if (res.confirm) {
  //                 that.getDataRefresh()
  //               }
  //             }
  //           })

  //           // output: res.result === 3
  //         }).catch(err => {
  //           console.log(err)
  //           // handle error
  //         })
  //       }
  //     },
  //     fail(res) {
  //       console.log(res.errMsg)
  //     }
  //   })

  // },
  sendmsg() {
    var curdate = new Date();
    var time1 = util.formatDate(curdate, "yyyy-MM-dd HH:mm:ss");
    console.log(curdate)
    console.log(time1)

    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'sendMsgToBfr',
      // 传递给云函数的event参数
      data: {
        wxopenid: 'oO80M451LDhnZeVHJyT6JnQy5EFc',
        personname: '陈建军',
        requesttime: time1
      }
    }).then(res => {
      console.log(res)
      if (res.result.errCode != 0) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '对方并没有实时接收到这个消息，您最好微信或者电话通知对方批准您的申请',
          success(res) {
            if (res.confirm) {

            }
          }
        })
      }
      // output: res.result === 3
    }).catch(err => {
      console.log(err)
      // handle error
    })
  },
  subscribemsgbfr() {

    wx.requestSubscribeMessage({
      tmplIds: ['zT41ZSW058Iag1XW_-qzkTMEGGZa53A5vgKJ4YVIvIA'],
      success(res) {
        console.log(res)
        if (res["zT41ZSW058Iag1XW_-qzkTMEGGZa53A5vgKJ4YVIvIA"] == "accept") {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '您已经订阅了消息',
            success(res) {
              if (res.confirm) {

              }
            }
          })
        }
      },
      fail(error) {
        console.log(error)
      }
    })
  },

  // guideOpenSubscribeMessage() {
  //   //引导用户，手动引导用户去设置页开启，
  //   this.$invoke('Modals', '__modalConfirm__', [
  //     '检测到您没有开启订阅消息的权限，是否去设置？',
  //     'openSetting',
  //     //用户点击了确定按钮，进入设置页的回调
  //     res => {
  //       console.log('openSetting的回调数据：', res);
  //       this.guidSubscribeMessageAuthAfter();
  //     },
  //     //用户点击了取消按钮
  //     () => {
  //       // console.log("取消了")
  //       this.$invoke('Toast', '__warning__', [
  //         `您已拒绝订阅消息授权，无法预约领取`
  //       ]);
  //     }
  //   ]);
  // }
})