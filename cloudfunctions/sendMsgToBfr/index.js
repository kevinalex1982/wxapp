'use strict';


const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.wxopenid,
        page: 'pages/index/index',
        lang: 'zh_CN',
        data: {
          name1: {
            value: event.personname
          },
          phrase2: {
            value: '申请访问您'
          },
          phrase3: {
            value: '请您确认'
          },
          time4: {
            value: event.requesttime
          }
        },
        templateId: 'zT41ZSW058Iag1XW_-qzkTMEGGZa53A5vgKJ4YVIvIA',
        miniprogramState: 'trial'
      })
    return result
  } catch (err) {
    return err
  }
}