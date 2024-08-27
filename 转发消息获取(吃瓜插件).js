
import { segment } from 'icqq'
import fetch from 'node-fetch';
import cfg from '../../lib/config/config.js'
import common from '../../lib/common/common.js'
export class example2 extends plugin {
  constructor () {
    super({
      name: '转发消息',
      dsc: '复读用户发送的内容，然后撤回',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      priority: 8000,
      rule: [
        {
          reg: '^#转发消息$',
          fnc: 'getmsg_ts'
        },
        {
          reg: '',
          fnc: 'getmsg',
          log: false
        },
      ]
    })
  }

  /** 复读 */
  async getmsg_ts (e) {
      console.log('转发并行测试')
  }

  async getmsg (e) {
    let msg_img
    const forward = [
      "这是消息1",
  ]
    let source
    let imageMessages = []
    if (e.isGroup) {
      source = (await e.group.getChatHistory(e.source ?.seq, 1)).pop()
    } else {
      source = (await e.friend.getChatHistory((e.source ?.time + 1), 1)).pop()
    }
    
    if (source) {
      if(source.message[0].type == 'json'){
      let data1 =  source.message[0].data
      let data = JSON.parse(data1);
      let resid = data.meta.detail.resid
      if(!resid){
        return false
      }
      console.log(resid)
      let message = await Bot.getForwardMsg(resid)
       for (let val of message) {
        let messg = val.message[0]
        //有图片就转发
        if(messg.type == 'image'){
          await send(e)
          break
        }    
      }     
    } else return false
  }else return false
  }
}
async function send(e){
  const msg = await common.makeForwardMsg(e, e.message[0])
  console.log(msg)
  //发送给主人会导致图片失效，群聊转发与私聊转发图片格式不一致。
  // Bot.pickUser(cfg.masterQQ[0]).sendMsg(msg_img)
  Bot.pickGroup('945370123').sendMsg(msg)
}