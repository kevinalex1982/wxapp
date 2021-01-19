// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'wxvisitors-5gcbnadq17e42a94'
})
const db = cloud.database()
const $ = db.command.aggregate
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event.wxopenid)
  console.log(event.time)
  // return await db.collection('VisitorsInfo')
  // .where({    
  // }) 
  // .limit(100)
  // .get()
  return await db.collection('VisitorsInfo').where({
    wxOpenid: event.wxopenid,
    createdtime: _.gte(event.time)

  }).orderBy("createdtime","desc") .limit(1000).get()
}