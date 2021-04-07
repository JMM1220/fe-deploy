const ChatBot = require('dingtalk-robot-sender')

const robot = new ChatBot({
  webhook: 'https://oapi.dingtalk.com/robot/send?access_token=757de5b1a6e5dcf69c8f8f785a9e5273305bdbbac7f23dfe4c6ae958b5f00a04'
})
const Receiver = '@15890030104'

//获取当前时间
function getNowTime() {
    var date = new Date()
    //年 getFullYear()：四位数字返回年份
    var year = date.getFullYear()  //getFullYear()代替getYear()
    //月 getMonth()：0 ~ 11
    var month = date.getMonth() + 1
    //日 getDate()：(1 ~ 31)
    var day = date.getDate()
    //时 getHours()：(0 ~ 23)
    var hour = date.getHours()
    //分 getMinutes()： (0 ~ 59)
    var minute = date.getMinutes()
    //秒 getSeconds()：(0 ~ 59)
    var second = date.getSeconds()

    var time = year + '-' + addZero(month) + '-' + addZero(day) + ' ' + addZero(hour) + ':' + addZero(minute) + ':' + addZero(second)
    return time
}
//小于10的拼接上0字符串
function addZero(s) {
    return s < 10 ? ('0' + s) : s
}

// 发送钉钉消息
const sendDingMessage = async (CONFIG) => {
  let textContent = {
    "msgtype": "markdown",
    "markdown": {
      "title": `${CONFIG.name}`,
      "text": `${CONFIG.env}部署成功✅\n
        部署时间：${getNowTime()} ${Receiver}\n
        变更提交：${CONFIG.content}\n![screenshot](https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.wzsky.net%2Fimgall%2Fimg2017%2F20170809%2F11194512.jpg&refer=http%3A%2F%2Fwww.wzsky.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619840896&t=dc61828af29f17f8ac641d723b4212d7)\n>`,
    },
    "at": {
      "atMobiles": [
        "15890030104"
      ],
      "isAtAll": false
    }
  }
  try {
    await robot.send(textContent)
  } catch (error) {
    console.log(error)
  }
}

module.exports = { sendDingMessage }
