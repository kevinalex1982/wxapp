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
          phrase5: {
            value: event.shenpiresult
          },
          thing7: {
            value: event.bfrname
          },
          time8: {
            value: event.shenpitime
          },
          thing9: {
            value: event.shenpicontent
          },
          thing11: {
            value: event.notapprovereason
          }
        },
        templateId: 'vZXqI0mxDDixhGMlANInkZWUcfSCKqhxwSKjLGP9IKg',
        miniprogramState: 'trial'
      })
    return result
  } catch (err) {
    return err
  }
}