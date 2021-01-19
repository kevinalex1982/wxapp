// pages/bfrinfo/bfrinfo.js
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
    successstatuscls: "successstatuscls",
    errorstatuscls: "errorstatuscls",
    normalstatuscls: "normalstatuscls",
    deniedcls: "../../images/pageimg/visitorinfo/denied.png",
    approvedcls: "../../images/pageimg/visitorinfo/approved.png",
    waitcls: "../../images/pageimg/visitorinfo/waitcheck.png",
    neworderforbfrarray: [],
    visitorwxopenid: '',
    curapproveStatus: 0,
    visitor_id: '',
    mgrPhone: "",
    show: false,
    buttons: [

      {
        type: 'primary',
        className: '',
        text: '同意',
        value: 0
      }, {
        type: 'warn',
        className: '',
        text: '拒绝',
        value: 1
      }
    ],
    imageurl: "",
    showPopup: false,
    hasrecentorderforbfr:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getNewOrdersForBFR()
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
  getNewOrdersForBFR() {


    wx.showLoading({
      title: '加载中',
    })
    var that = this
    
    
    
    db.collection("PersonMgrInfo")
      .where({
        WxOpenid: app.globalData.openid,

      })

      .get()
      .then((resmng) => {

        if (resmng.data.length > 0) {
          app.globalData.bfrinfo = resmng.data[0]
          that.setData({
            mgrPhone: resmng.data[0].PersonPhone
          })


          // 调用函数时，传入new Date()参数，返回值是日期和时间
          var curdate = new Date();

           // curdate.setTime(curdate.getTime() - 24 * 60 * 60 * 1000 * 5);
          var time = util.formatTime(curdate);
       

          wx.cloud.callFunction({
            // 要调用的云函数名称
            name: 'getVisitorByBfr',
            // 传递给云函数的event参数
            data: {
              bfrPhone: that.data.mgrPhone,
              time: time
            }
          }).then(resfunc => {
           console.log("resfunc:")
           console.log(resfunc)
            wx.hideLoading()
              if (resfunc.result.data.length > 0) {
                this.setData({              
                  hasrecentorderforbfr: true,
                  neworderforbfrarray: resfunc.result.data
                })
              } else {
                this.setData({
                   hasrecentorderforbfr: false,
                   neworderforbfrarray: []
                })
              }
          })

        } else {

          wx.hideLoading()
        }
      });


      setTimeout(function () {
        wx.hideLoading()
      }, 8000)

  },
  tabChange(e) {
    let index = e.detail.index;
    this.setData({
      tabbarIndex: index
    })
    console.log('tab change', e.detail.index)
  },
  clickleftbottombar() {
    if (this.data.selindex == 0) {

    } else if (this.data.selindex == 1) {
      this.setData({
        selindex: 0
      })
      wx.setNavigationBarTitle({
        title: '预约'
      })
      this.getNewOrdersForBFR()
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
      this.gethisDataRefresh()
    } else if (this.data.selindex == 1) {

    }
  },
  visitordetail(e) {

    console.log(e.currentTarget.id)
    console.log(e)
    this.data.neworderforbfrarray.forEach(element => {
      if (element._id == e.currentTarget.id) {
        this.setData({
          visitorwxopenid: element.wxOpenid,
          visitor_id: element._id,
          curapproveStatus: element.approveStatus
        })
      }
    });
    const that = this

    wx.showModal({
      title: '提示',
      cancelText: '拒绝',
      confirmText: '同意',
      confirmColor: '#ff0000',
      content: '是否同意访客预约申请？',
      success(res) {
        if (res.confirm) {

          that.approveIT(that.data.visitor_id)

        } else if (res.cancel) {

          that.refuseIT(that.data.visitor_id)


        }
      }
    })
  },
  approveIT(visitorid) {
    const that = this

    wx.requestSubscribeMessage({
      tmplIds: ['zT41ZSW058Iag1XW_-qzkTMEGGZa53A5vgKJ4YVIvIA'],
      success(res) {
        console.log(res)
        if (res["zT41ZSW058Iag1XW_-qzkTMEGGZa53A5vgKJ4YVIvIA"] == "accept") {

        }
      },
      fail(error) {
        console.log(error)
      }
    })


    db.collection('VisitorsInfo').doc(visitorid).update({
        // data 传入需要局部更新的数据
        data: {
          // 表示将 done 字段置为 true
          approveStatus: 1
        }
      })
      .then(res => {
        console.log(res)

        that.sendmsg('同意', "同意您的访问", "无")
      
        // output: res.result === 3
      }).catch(err => {
        console.log(err)
        that.setData({
          show: false
        })
        // handle error
      })
  },
  refuseIT(visitorid) {
    const that = this

    wx.requestSubscribeMessage({
      tmplIds: ['zT41ZSW058Iag1XW_-qzkTMEGGZa53A5vgKJ4YVIvIA'],
      success(res) {
        console.log(res)
        if (res["zT41ZSW058Iag1XW_-qzkTMEGGZa53A5vgKJ4YVIvIA"] == "accept") {

        }
      },
      fail(error) {
        console.log(error)
      }
    })


    db.collection('VisitorsInfo').doc(visitorid).update({
        // data 传入需要局部更新的数据
        data: {
          // 表示将 done 字段置为 true
          approveStatus: 2
        }
      })
      .then(res => {
        console.log(res)

        that.sendmsg('拒绝', "拒绝您的访问", "无")
     
        // output: res.result === 3
      }).catch(err => {
        console.log(err)
        that.setData({
          show: false
        })
        // handle error
      })
  },
  sendmsg(isapprovedornot, shenpicontent, reasonfordis) {
    const that = this
    var curdate = new Date();
    var time1 = util.formatDate(curdate, "yyyy-MM-dd HH:mm:ss");
    console.log(curdate)
    console.log(time1)
    var datasend = {
      wxopenid: that.data.visitorwxopenid,
      shenpiresult: isapprovedornot,
      bfrname: app.globalData.bfrinfo.PersonName,
      shenpitime: time1,
      shenpicontent: shenpicontent,
      notapprovereason: reasonfordis
    }
    console.log(datasend)
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'SendMsgToVistor',
      // 传递给云函数的event参数
      data: datasend
    }).then(res => {
      console.log(res)
      if (res.result.errCode != 0) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '对方并没有订阅消息，您可以微信或者电话通知对方',
          success(res) {
            if (res.confirm) {
              that.setData({
                show: false
              })
            
              that.getNewOrdersForBFR()
            }
          }
        })
      } else {
        that.setData({
          show: false
        })
        that.getNewOrdersForBFR()
      }
      // output: res.result === 3
    }).catch(err => {
      console.log(err)
      // handle error
    })
  },
  open: function (e) {
    console.log(e.currentTarget.id)
    console.log(e)
    this.data.neworderforbfrarray.forEach(element => {
      if (element._id == e.currentTarget.id) {
        this.setData({
          visitorwxopenid: element.wxOpenid,
          visitor_id: element._id,
          curapproveStatus: element.approveStatus
        })
      }
    });
    const that = this
    if (that.data.curapproveStatus == 0) {
      this.setData({
        show: true
      })
    }
  },
  buttontap(e) {
    var that = this
    console.log(e.detail.index)
    console.log(that.data.curapproveStatus)
    if (e.detail.index == 0) {
      if (that.data.curapproveStatus != 1) {
        console.log('try approve')
        that.approveIT(that.data.visitor_id)
      } else {
        that.setData({
          show: false
        })
      }
    } else if (e.detail.index == 1) {
      if (that.data.curapproveStatus != 2) {
        console.log('try deny')
        that.refuseIT(that.data.visitor_id)
      } else {
        that.setData({
          show: false
        })
      }
    }
  },
  /**   
   * 预览图片  
   */
  togglePopup: function (event) {
    var image_path = event.currentTarget.dataset.id;
    console.log(image_path)
    this.setData({
      imageurl: image_path,
      showPopup: !this.data.showPopup
    });
  },
  modalConfirm() {
    this.setData({
      imageurl: "",
      showPopup: !this.data.showPopup
    });
  },
  modalCandel() {
    this.setData({
      imageurl: "",
      showPopup: !this.data.showPopup
    });
  },
  gethisDataRefresh() {
    var that=this
    this.setData({

      neworderforbfrarray: []
    })
    wx.showLoading({
      title: '加载中',
    })
    var curdate = new Date();

    curdate.setTime(curdate.getTime() - 24 * 60 * 60 * 1000 * 30);
    var time = util.formatTime(curdate);
    console.log(time)
    

    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'getVisitorByBfr',
      // 传递给云函数的event参数
      data: {
        bfrPhone: that.data.mgrPhone,
        time: time
      }
    }).then(resfunc => {
     console.log("resfunc:")
     console.log(resfunc)
      wx.hideLoading()
        if (resfunc.result.data.length > 0) {
          this.setData({
            hasrecentorderforbfr: true,
            neworderforbfrarray: resfunc.result.data
          })
        } else {
          this.setData({
           
            hasrecentorderforbfr: false,
            neworderforbfrarray: []
          })
        }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 8000)
  }
})