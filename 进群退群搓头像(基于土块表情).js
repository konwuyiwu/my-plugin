import plugin from '../../lib/plugins/plugin.js';
import {segment} from "icqq";
import fetch, { File, FormData } from 'node-fetch'
import fs from "fs"
import _ from 'lodash'
const _path=process.cwd()
let args
let kg = 1
let msg
const messages1 = ['二次元入口', '添乱', '一直', '阿尼亚喜欢','继续干活','高血压','波奇手稿','大鸭鸭举牌','草神啃','咖波画','咖波蹭','兑换券','恐龙','管人痴','垃圾桶','闪瞎','锤','胡桃啃','踢球','可莉吃','敲','小天使','旅行伙伴加入','结婚申请','需要','猫猫举牌','亚名','我推的网友','小画家','拍','顶','捣','舔屏','捶','紧贴','搓'];
const messages2= ['二次元入口', '添乱', '一直','防诱拐', '波奇手稿','草神啃','咖波撕','咖波撞','追火车','离婚协议','吃','锤','抱紧','胡桃啃','踢球','可莉吃','敲','这像画吗','拍','顶','捣','撕','怒撕','贴贴','砸','丢','抛','捶','紧贴','搓'];
let resultFileLoc = './data/1.jpg'

export class example2 extends plugin {
  constructor() {
    super({
      name: '搓新人',
      dsc: '新人入群欢迎',
      event: 'notice.group.increase',
      priority: 50,

    })
  }

  async accept(e) {
    if (this.e.user_id == Bot.uin) return
// 需要什么表情就加
// 获取一个随机的表情
    const index = Math.floor(Math.random() * messages1.length);
// 从 messages 数组中获取对应的元素
    const keyword = messages1[index];
    let res
    try{
        res = fs.readFileSync(_path + 'plugins/earth-k-plugin/resources/bq.json')
        res= await JSON.parse(res);
    }catch{
        try{
            res = fs.readFileSync(_path + '/resources/bq.json')
            res= await JSON.parse(res);
        }catch{
            this.e.reply("搓头像失败，未找到bq.json文件")
            return false
        }
    }
    console.log(keyword)
    const resultBuffer = await deal(e,res,keyword)
    fs.writeFileSync(resultFileLoc, resultBuffer)
    msg =  [segment.at(e.user_id),`欢迎入群`, segment.image(resultBuffer)]
    await e.reply(msg)
    return false
  }
}

export class example3 extends plugin {
    constructor() {
      super({
        name: '搓新人',
        dsc: '退群表情',
        event: 'notice.group.decrease',
        priority: 50,
  
      })
    }
  
    async accept(e) {
      if (this.e.user_id == Bot.uin) return
  // 获取一个随机的表情
      const index = Math.floor(Math.random() * messages2.length); 
  // 从 messages 数组中获取对应的元素
      const keyword = messages2[index];
      let res
      try{
          res = fs.readFileSync(_path + 'plugins/earth-k-plugin/resources/bq.json')
          res= await JSON.parse(res);
      }catch{
          try{
              res = fs.readFileSync(_path + '/resources/bq.json')
              res= await JSON.parse(res);
          }catch{
            this.e.reply("搓头像失败，未找到bq.json文件")
            return false
          }
      }
      console.log(keyword)
      const resultBuffer = await deal(e,res,keyword)
      fs.writeFileSync(resultFileLoc, resultBuffer)   
      msg =  [segment.at(e.user_id),`退群了`, segment.image(resultBuffer)]
      await e.reply(msg)
      return false
        
  
    }
  }
  
function deal(e,res,keyword){
    return new Promise(async (resolve, reject) => {
            // 遍历jsonObj的键
            Object.values(res).forEach(async item => {
                // 检查当前项的keywords是否包含目标关键词
                if (item.keywords.includes(keyword)) {
                  console.log('使用表情:' + keyword)
                    // 输出对应的key和params
                    msg = `该表情至少需要${item.params.min_images}张图片,${item.params.min_texts}个文字描述`
                    let url = `http://datukuai.top:2233/memes/${item.key}/`
                    
                    let formData = new FormData()
      
                    let reply;
                    let imgUrl
                    if (e.source) {
                        if (e.isGroup) {
                            reply = (await e.group.getChatHistory(e.source.seq, 1)).pop()?.message;
                        } else {
                            reply = (await e.friend.getChatHistory(e.source.time, 1)).pop()
                                ?.message;
                        }
                        if (reply) {
                            for (let val of reply) {
                                if (val.type == "image") {
                                    e.img = [val.url];
                                    break;
                                }
                            }
                        }
                    }
                    let base64
                    if (!e.img) {
                        if (!e.img) {
                            let user_id2 = e.user_id
      
                            imgUrl = 'http://q2.qlogo.cn/headimg_dl?dst_uin=' + user_id2 + '&spec=5'
                        }
                    } else {
      
                        imgUrl = e.img[0]
                    }           
                    const imageResponse = await fetch(imgUrl)
                    const fileType = imageResponse.headers.get('Content-Type').split('/')[1]
                    const blob = await imageResponse.blob()
                    const arrayBuffer = await blob.arrayBuffer()
                    const buffer = Buffer.from(arrayBuffer)
                    await fs.writeFileSync('./data/render1.jpg', buffer)
                    let user_id2 = e.user_id
                    let name = await Bot.pickMember(e.group_id, user_id2).card          
                    if (item.params.min_images == 2) {
                        let  imgUrl = 'http://q2.qlogo.cn/headimg_dl?dst_uin=' + e.user_id + '&spec=5'
                        const imageResponse = await fetch(imgUrl)
                        const fileType = imageResponse.headers.get('Content-Type').split('/')[1]
                        const blob = await imageResponse.blob()
                        const arrayBuffer = await blob.arrayBuffer()
                        const buffer2 = Buffer.from(arrayBuffer)
                        await fs.writeFileSync('./data/render2.jpg', buffer)
                        formData.append('images', new File([buffer2], `avatar_${2}.jpg`, { type: 'image/jpeg' }))
                    }
                    if(item.params.min_images !=0){
                        formData.append('images', new File([buffer], `avatar_${1}.jpg`, { type: 'image/jpeg' }))
                    }
                    if(item.params.min_texts != 0){
                       
                        for(let i=0;i<nr.length-1;i++){
                            formData.append('texts', nr[i+1])
                        }
                    }
                    args = handleArgs(item.key, '', [{ text: name, gender: 'unknown' }])
                    if (args) {
                        formData.set('args', args)
                    }
                    await sleep(1000)
                    let response = await fetch(url, {
                        method: 'POST',
                        body: formData
                        // headers: {
                        // 'Content-Type': 'multipart/form-data'
                        // }
                    })
                    // console.log(response.status)
                    if (response.status > 299) {
                        await e.reply(msg, true)
                        return false
                    }

                    const resultBlob = await response.blob()
                    const resultArrayBuffer = await resultBlob.arrayBuffer()
                    const resultBuffer = Buffer.from(resultArrayBuffer)                  
                    // fs.writeFileSync(resultFileLoc, resultBuffer)     
                    resolve(resultBuffer)          
                }
            });
        });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
function handleArgs(key, args, userInfos) {
  if (!args) {
      args = ''
  }
  let argsObj = {}
  switch (key) {
      case 'look_flat': {
          argsObj = { ratio: parseInt(args || '2') }
          break
      }
      case 'crawl': {
          argsObj = { number: parseInt(args) ? parseInt(args) : _.random(1, 92, false) }
          break
      }
      case 'symmetric': {
          let directionMap = {
              左: 'left',
              右: 'right',
              上: 'top',
              下: 'bottom'
          }
          argsObj = { direction: directionMap[args.trim()] || 'left' }
          break
      }
      case 'petpet':
      case 'jiji_king':
      case 'kirby_hammer': {
          argsObj = { circle: args.startsWith('圆') }
          break
      }
      case 'my_friend': {
          if (!args) {
              args = _.trim(userInfos[0].text, '@')
          }
          argsObj = { name: args }
          break
      }
      case 'looklook': {
          argsObj = { mirror: args === '翻转' }
          break
      }
      case 'always': {
          let modeMap = {
              '': 'normal',
              循环: 'loop',
              套娃: 'circle'
          }
          argsObj = { mode: modeMap[args] || 'normal' }
          break
      }
      case 'gun':
      case 'bubble_tea': {
          let directionMap = {
              左: 'left',
              右: 'right',
              两边: 'both'
          }
          argsObj = { position: directionMap[args.trim()] || 'right' }
          break
      }
  }
  argsObj.user_infos = userInfos.map(u => {
      return {
          name: _.trim(u.text, '@'),
          gender: u.gender
      }
  })
  return JSON.stringify(argsObj)
}
