// pages/neworder/neworder.js
var util = require('../../utils/utils');
const app = getApp()
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2020-11-01',
    bigImg: '../../images/plus.png', //默认图片，设置为空也可以
    selImgCloudID: '',
    optype: "add",
    formData: {

    },
    rules: [{
        name: 'name',
        rules: {
          required: true,
          message: '请输入姓名'
        },
      }, {
        name: 'mobile',
        rules: [{
          required: true,
          message: '手机号必填'
        }, {
          mobile: true,
          message: '手机号格式不对'
        }],
      }, {
        name: 'verifycode',
        rules: {
          required: true,
          message: '邀请码必填'
        },
      }

    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.openid)
    console.log(options.optype)
    this.setData({
      optype: options.optype
    })
    if (options.optype == "add") {
      wx.setNavigationBarTitle({
        title: '申请成为被访人'
      })
    } else if (options.optype == "upd") {
      wx.setNavigationBarTitle({
        title: '重新申请成为被访人'
      })
      this.setData({
        formData: {
          name: app.globalData.bfrinfo.PersonName,
          mobile: app.globalData.bfrinfo.PersonPhone,
          verifycode: app.globalData.bfrinfo.VerificationCode
        }
      })
      console.log(this.data.formData)
    }
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
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  submitForm() {
    let that = this;
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })

        }
      } else {
        //把图片存到users集合表


        var curdate = new Date();
        var time1 = util.formatDate(curdate, "yyyy-MM-dd HH:mm:ss");
        curdate.toDateString();
        var senddata = {
          WxOpenid: app.globalData.openid,
          requesttime: time1,
          PersonName: that.data.formData.name,
          PersonPhone: that.data.formData.mobile,
          VerificationCode: that.data.formData.verifycode,
          ApproveStatus: 0,
          MsgReceviced: 0

        };
        if (this.data.optype == "add") {       
          // console.log("senddata")
          // console.log(senddata)
          db.collection("PersonMgrInfo").add({
            data: senddata,
            success: function () {
              wx.showModal({
                title: '提示',
                content: '申请成功',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    wx.navigateBack();
                  }
                }
              })

            },
            fail: function () {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '申请失败',
                success(res) {
                  if (res.confirm) {

                  }
                }
              })
            }
          });
        }else if (this.data.optype == "upd")
        {
          db.collection('PersonMgrInfo').where({
            WxOpenid: app.globalData.openid
          })
          .update({
            data: senddata,
          })
          .then((resupd) => {
            // console.log(resupd)
            wx.showModal({
              title: '提示',
              content: '重新申请成功',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.navigateBack();
                }
              }
            })
          })
          .catch((err) => {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '申请失败',
              success(res) {
                if (res.confirm) {

                }
              }
            })
          })
        }
      }
    })

    // this.selectComponent('#form').validateField('mobile', (valid, errors) => {
    //     console.log('valid', valid, errors)
    // })
  },
  formInputChange(e) {
    const {
      field
    } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })

  }
})