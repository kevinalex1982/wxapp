function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
 
 
  return [year, month, day].map(formatNumber).join('-') 
}
 
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


 function formatDate (datecur,fmt) { //author: meizz
  var o = {
    "M+": datecur.getMonth() + 1, //月份
    "d+": datecur.getDate(), //日
    "H+": datecur.getHours(), //小时
    "m+": datecur.getMinutes(), //分
    "s+": datecur.getSeconds(), //秒
    "q+": Math.floor((datecur.getMonth() + 3) / 3), //季度
    "S": datecur.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (datecur.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

 
module.exports = {
  formatTime: formatTime,
  formatDate:formatDate
}