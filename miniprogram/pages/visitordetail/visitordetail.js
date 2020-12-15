// pages/visitordetail/visitordetail.js
var util = require('../../utils/utils');
const app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apprvestatus: '待审批',
    apprvecls: 'kevinwarn',
    visitorname: '',
    visitorcorp: '',
    visitorphone: '',
    visitorwxopenid: '',
    visitorid: '',
    visittime: '',
    showbtn: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.visitorid)
    const that = this
    this.setData({
      visitorid: options.visitorid
    })

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
  approveIT() {
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


    db.collection('VisitorsInfo').doc(that.data.visitorid).update({
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
        // handle error
      })
  },
  refuseIT() {
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


    db.collection('VisitorsInfo').doc(that.data.visitorid).update({
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
        // handle error
      })
  },
  getDataRefresh() {
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    db.collection('VisitorsInfo').doc(this.data.visitorid).get()
      .then(res => {
        wx.hideLoading()
        console.log(res.data)
        that.setData({
          visitorname: res.data.personName,
          visitorcorp: res.data.personCorp,
          visitorphone: res.data.personPhone,
          visitorwxopenid: res.data.wxOpenid,
          visittime: res.data.createdtime,
        })
        if (res.data.approveStatus == 0) {
          that.setData({
            apprvestatus: '待审批',
            apprvecls: 'kevinwarn',
            showbtn: true
          })
        } else if (res.data.approveStatus == 1) {
          that.setData({
            apprvestatus: '已同意',
            apprvecls: 'kevinsuc',
            showbtn: false
          })
        }
        if (res.data.approveStatus == 2) {
          that.setData({
            apprvestatus: '已拒绝',
            apprvecls: 'kevinerr',
            showbtn: true
          })
        }
        wx.hideLoading()

      }).catch((err) => {
        wx.hideLoading()
        wx.showModal({
          title: '加载错误',
          showCancel: false,
          content: err,
          success(res) {
            if (res.confirm) {

            }
          }
        })
      })


    setTimeout(function () {
      wx.hideLoading()
    }, 4000)
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
              that.getDataRefresh()
            }
          }
        })
      } else {
        that.getDataRefresh()
      }
      // output: res.result === 3
    }).catch(err => {
      console.log(err)
      // handle error
    })
  }
})