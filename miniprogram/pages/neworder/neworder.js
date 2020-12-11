// pages/neworder/neworder.js
var util = require('../../utils/utils');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2020-11-01',
    bigImg: '../../images/plus.png', //默认图片，设置为空也可以
    selImgCloudID: '',
    isinputvalid:false,
    formData: {

    },
    rules: [{
        name: 'name',
        rules: {
          required: true,
          message: '请输入姓名'
        },
      }, {
        name: 'corp',
        rules: {
          required: true,
          message: '请输入公司'
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
      },
      {
        name: 'idcard',
        rules: {
          validator: function (rule, value, param, modeels) {
            console.log(value)
            console.log(rule)
            console.log(param)
            console.log(modeels)
            if (!value || value.length !== 18) {
              return '身份证格式不正确'
            }
          }
        },
      }, {
        name: 'bfrname',
        rules: {
          required: true,
          message: '请输入被访人姓名'
        }
      }, {
        name: 'bfrmobile',
        rules: [{
          required: true,
          message: '被访人手机号必填'
        }, {
          mobile: true,
          message: '被访人手机号格式不对'
        }],
      }
    ]
  },
  changeBigImg() {
    let that = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        });
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let filePath = res.tempFilePaths[0];
        const name = Math.random() * 1000000;
        const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath, //云存储图片名字
          filePath, //临时路径
          success: res => {
            console.log('[上传图片] 成功：', res)
            that.setData({
              bigImg: res.fileID, //云存储图片路径,可以把这个路径存到集合，要用的时候再取出来
              selImgCloudID: res.fileID
            });
            let fileID = res.fileID;

          },
          fail: e => {
            console.error('[上传图片] 失败：', e)
          },
          complete: () => {
            wx.hideLoading()
          }
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var curdate = new Date();
    curdate.setTime(curdate.getTime() + 24 * 60 * 60 * 1000);
    var time = util.formatTime(curdate);
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      date: time,
      isinputvalid:false
    });


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

    //把图片存到users集合表
    const db = wx.cloud.database();
    console.log("that.selImgCloudID")
    console.log(that.data.selImgCloudID)
    if (that.selImgCloudID == '') {
      wx.showToast({
        title: '必须选择照片',
        'icon': 'none',
        duration: 3000
      })
    } else {
      var senddata = {
        wxOpenid: app.globalData.openid,
        createdtime: that.data.date,
        personName: that.data.formData.name,
        personCorp: that.data.formData.corp,
        personPhone: that.data.formData.mobile,
        personIdcard: that.data.formData.idcard,
        personImgCloudID: that.data.selImgCloudID,
        bfrName: that.data.formData.bfrname,
        bfrPhone: that.data.formData.bfrmobile,
        approveStatus: 0

      };
      console.log("senddata")
      console.log(senddata)
      db.collection("VisitorsInfo").add({
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

    }


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
  },
  subscribemsgvisitor() {
    const that = this
        wx.requestSubscribeMessage({
          tmplIds: ['vZXqI0mxDDixhGMlANInkZWUcfSCKqhxwSKjLGP9IKg'],
          success(res) {
            console.log('success')
            console.log(res)
            if (res["vZXqI0mxDDixhGMlANInkZWUcfSCKqhxwSKjLGP9IKg"] == "accept") {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '您已经订阅了消息，等待批复后得到消息',
                success(res) {
                  if (res.confirm) {
                    that.submitForm()
                  }
                }
              })
            } else if (res["vZXqI0mxDDixhGMlANInkZWUcfSCKqhxwSKjLGP9IKg"] == "reject") {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '您选择不订阅消息，请注意查看批复',
                success(res) {
                  if (res.confirm) {
                    that.submitForm()
                  }
                }
              })
            }
          },
          fail(error) {
            console.log('error')
            console.log(error)
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '订阅消息出错，请注意手动查看批复',
              success(res) {
                if (res.confirm) {
                  that.submitForm()
                }
              }
            })
          }
        })  

  },
  validInput()
  {
    const that = this

    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
        this.setData({        
          isinputvalid:false
        });
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })

        }
      } else {
        this.setData({        
          isinputvalid:true
        });
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '校验通过，请点击提交申请',
          success(res) {
            if (res.confirm) {
            
            }
          }
        })
      }
    })
  }
})