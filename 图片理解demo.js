/*1.领取免费资源地址，领取图像内容理解接口
https://console.bce.baidu.com/ai/#/ai/imagerecognition/overview/resource/getFree
接口公测中，如需要更多识别次数可直接去提交工单申请提额
  2.创建应用选择图像识别里的图像内容理解（图像内容理解-提交请求、图像内容理解-获取结果、图像内容理解）
  3.复制API KEY和Secret Key填写在AK和SK处
  */

import plugin from '../../lib/plugins/plugin.js';
import fetch from 'node-fetch';

const AK = "API KEY"
const SK = "Secret Key"

let question = '这张图片里有什么'
export class example2 extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: '图片理解',
      /** 功能描述 */
      dsc: '图片理解',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 1000,
      rule: [
        {
          reg: "^#*图片理解|理解图片|图片解析|解析图片(.*)$", //匹配消息正则，命令正则
          fnc: 'PothoUnders'
        },
      ]
    });
  }

  async PothoUnders(e) {

    if (e.source) {
      // console.log(e);
      let reply;
      if (e.isGroup) {
        reply = (await e.group.getChatHistory(e.source.seq, 1)).pop()?.message;
      } else {
        reply = (await e.friend.getChatHistory(e.source.time, 1)).pop()?.message;
      }
      if (reply) {
        for (let val of reply) {
          if (val.type == "image") {
            e.img = [val.url];
            console.log(e.img)
            break;
          }
        }
      }
    }
    if (!e.img) {
      e.reply(["未检测到图片"]);
      return true;
    }
    let r = e.msg
    let match = r.match(/(?:#*图片理解|理解图片)?(.*)/)
    console.log(match)
    if(match[1] !== ''){
      question = match[1]
    }
    
    let res = await fetch(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${AK}&client_secret=${SK}`)
    res = await res.json()
    let acc_token = res.access_token
    let imgUrl = e.img[0]
    console.log(acc_token)
  let task_id = await getId(acc_token, imgUrl,question,e)
  console.log(task_id)
  if(!task_id){
    return false
  }
  let msg = await checkResult(acc_token, task_id)
  e.reply(msg)
}
}

async function getId(acc_token, imgUrl,question,e) {
  let GETAPI = `https://aip.baidubce.com/rest/2.0/image-classify/v1/image-understanding/request?access_token=${acc_token}`
  let jieguo = await fetch(GETAPI, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        url: imgUrl,
        question: question,
        output_CHN: true
    })
});
jieguo = await jieguo.json()
console.log(jieguo)
if(jieguo.error_msg == 'image size error'){
  e.reply('图片过大或图片过小')
  return false
}
else if(jieguo.result){
  let task_id = jieguo.result.task_id
return task_id
}
else{
  e.reply('不支持格式或其他错误，反正就是出错了！寄！！！')
  return false
}
}


async function checkResult(acc_token, task_id) {
  let RESAPI = `https://aip.baidubce.com/rest/2.0/image-classify/v1/image-understanding/get-result?access_token=${acc_token}`;
  let r_msg = await fetch(RESAPI, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          task_id: task_id
      })
  });
  r_msg = await r_msg.json();
  if (r_msg.result.ret_code == '0') {
      let msg = r_msg.result.description
      console.log(r_msg.result.description)
      return msg
  } else if(r_msg.result.ret_code == '1') {
      // 如果任务尚未完成，则等待一段时间后再次检查
      await new Promise(resolve => setTimeout(resolve, 200)); // 等待
      return await checkResult(acc_token, task_id); // 递归调用自身继续检查结果
  }
  else{
    console.log(r_msg.result)
    return false
  }
}
