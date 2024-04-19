import plugin from'../../lib/plugins/plugin.js'
import common from'../../lib/common/common.js'
import YAML from "yaml"
import fs from 'fs'
import path from 'path';
const _path=process.cwd()
const __dirname = path.resolve();
import {segment} from "icqq";
import fetch, { File, FormData } from 'node-fetch'
import _ from 'lodash'
let args
const messages1 = ['二次元入口', '添乱', '一直', '阿尼亚喜欢','继续干活','高血压','波奇手稿','大鸭鸭举牌','草神啃','咖波画','咖波蹭','兑换券','恐龙','管人痴','垃圾桶','闪瞎','锤','胡桃啃','踢球','可莉吃','敲','小天使','旅行伙伴加入','结婚申请','需要','猫猫举牌','亚名','我推的网友','小画家','拍','顶','捣','舔屏','捶','紧贴','搓'];
let res
try{
    res = fs.readFileSync(_path + '/resources/bq.json')
    res= await JSON.parse(res);

}catch{

}

let Blackstr = fs.readFileSync(__dirname + "/config/config/other.yaml", "utf8");
Blackstr = YAML.parse(Blackstr)

//在这里设置事件概率,请保证概率加起来小于1，少于1的部分会触发反击
let reply_text = 0 //文字回复概率
let reply_img = 0 //图片回复概率
let mutepick = 0 //禁言概率
let  zhitu = 0  //api制图概率
let  lahei = 0 // 拉黑概率
let  txpy = 1 //制图概率
//剩余概率为戳一戳
  

//定义图片存放路径 默认是Yunzai-Bot/resources/才不是小寄祥，没有请自行创建
const chuo_path=_path+'/resources/才不是小寄祥/';

//文件夹内jpg图片和gif图片数量
let jpg_number =  22 //输入jpg图片数量
let gif_number = 1 //输入gif图片数量
 
//回复文本内容
let word_list=['才不是什么小寄祥！',
'只有笨蛋才会这样叫我！',
'歪掉吧~歪掉吧~小保底全都歪掉吧！',
'哼！强化圣遗物诅咒你歪掉！',
'我会保佑你下次强化圣遗物防御力和生命值拉满的！',
'我叫小吉祥啦！！气气！！！',
'真不想理你这个名字都能叫错的笨蛋！',
'是小吉祥好叭！',
'小吉祥也是会生气哒！！！',
'哼！早晚拉黑你！',
'诅咒你小保底全都歪掉！',
'我——叫——小——吉——祥——啦!!!',
'不许叫！不许叫！不许叫！！！',
'快看！这里有个笨蛋',
'不许叫我小寄祥！！！']

export class example extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '才不是小寄祥',
      /** 功能描述 */
      dsc: '简单开发示例',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: -2903109068,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^(.*)小寄祥(.*)',
          /** 执行方法 */
          fnc: 'xiaojixiang'
        },
        {
          /** 命令正则匹配 */
          reg: '^#*(邦|帮)(.*)道歉$',
          /** 执行方法 */
          fnc: 'delBlacklist'
        }
      ]
    })
  }
 

  async lh_user(e) {

 
    
    var msg = '', qq = 0, type = '';
 
    try{
    msg = e.msg.split("#用户设置")[1]; //获取到后续的指令
    var reg = /[1-9][0-9]*/g; //正则取数字部分
          if(e.at){ 
            qq = e.at;
            msg = msg + qq;
          }
     qq = msg.match(reg)[0];
    type = msg.split(qq)[0]; //根据取出的数字部分分割出type
    }
    catch(err) {} 
          if (msg.length < 2 ||type.length < 2 ||qq == 0) {
       e.reply( errhelp )
       return true;
     }
    io(type, Number(qq), e)
  }


  /** 
   * @param e oicq传递的事件参数e
   */
async xiaojixiang (e) {


        let random_type = Math.random()
        
//回复文字部分
        if(random_type < reply_text){
                         let text_number = Math.ceil(Math.random() * word_list['length'])
            await e.reply(word_list[text_number-1])
        }else if(random_type < (reply_text + reply_img)){

            let photo_number = Math.ceil(Math.random() * (jpg_number + gif_number))
            
            if(photo_number<=jpg_number){
                e.reply(segment.image('file:///' + _path + '/resources/才不是小寄祥/'+ photo_number + '.jpg'))
            }
            else{
                photo_number = photo_number - jpg_number
                e.reply(segment.image('file:///' + _path + '/resources/才不是小寄祥/'+ photo_number + '.gif'))
            }
}


//禁言部分
 
        else if(random_type < (reply_text + reply_img + mutepick)){
            let mutetype = Math.ceil(Math.random() * 2)
            if(mutetype == 1){
                e.reply('说了不要再叫了！')
                await common.sleep(1000)
                await e.group.muteMember(e.user_id,60);
                await common.sleep(3000)
                e.reply('哼！')
                //有这个路径的图话可以加上
                //await e.reply(segment.image('file:///' + path + '/resources/chuochuo/'+'laugh.jpg'))
            }else if (mutetype == 2){
                e.reply('不！！')
                await common.sleep(500);
                e.reply('准！！')
                await common.sleep(500);
                e.reply('叫！！')
                await common.sleep(1000);
                await e.group.muteMember(e.user_id,60)
                await common.sleep(1000);
                e.reply('哼！')
            }
}
//制作表情部分
else if(random_type < (reply_text + reply_img + mutepick + zhitu)){
		let zt = Math.ceil(Math.random() * 9)
            if(zt == 1){
        e.reply(segment.image(`http://ovooa.com/API/si/?QQ=${e.user_id}`))
    }
else if (zt == 2){
	e.reply(segment.image(`http://ovooa.com/API/face_pound/?QQ=${e.user_id}`))
}else if (zt == 3){
	e.reply(segment.image(`http://ovooa.com/API/face_pat/?QQ=${e.user_id}`))
}else if (zt == 4){
	e.reply(segment.image(`http://ovooa.com/API/chi/?QQ=${e.user_id}`))
}else if (zt == 5){
	e.reply(segment.image(`http://ovooa.com/API/pa/api.php?QQ=${e.user_id}`))
}else if (zt == 6){
	e.reply(segment.image(`http://ovooa.com/API/diu/api.php?QQ=${e.user_id}`))
}else if (zt == 7){
	e.reply(segment.image(`https://xiaobai.klizi.cn/API/gif/roll.php?qq=${e.user_id}`))
}else if (zt == 8){
	e.reply(segment.image(`https://xiaobai.klizi.cn/API/gif/tightly.php?qq=${e.user_id}`))
}else if (zt == 9){
	e.reply(segment.image(`https://xiaobai.klizi.cn/API/gif/erotic.php?qq=${e.user_id}`))
}

      //返回true 阻挡消息不再往下
      return true;
}  
 //拉黑部分
else if(random_type < (reply_text + reply_img + mutepick + zhitu + lahei)){

    
    let qq =e.user_id
   
    if(!cheak_str(Blackstr.blackQQ,qq)){
      Blackstr.blackQQ.push(qq)
      e.reply(`哼！这次真的生气了！你不找个人帮你道歉我就再也不理你了！`)
      e.reply(`发送(帮@**道歉)可帮忙道歉)！`)
    }else{
      e.reply(`咋回事，我也不明白了`)
      return true;
    }
    fs.writeFile(__dirname + '/config/config/other.yaml',YAML.stringify(Blackstr) , 'utf8', (err) => {
      if (err) throw err;
      //e.reply(`用户设置:\n${type}${qq}成功~`)
    });
  
   
}





//头像表情包制作部分
else if(random_type < (reply_text + reply_img + mutepick + zhitu + lahei + txpy)){
  if (e.user_id === Bot.uin) return
  accept(e)
  



}
//戳一戳部分
         else {
            e.reply('再叫我就戳死你！')
            await common.sleep(1000)
            await e.group.pokeMember(e.user_id)
      }
  }
  async delBlacklist (e) {
    let qq = e.at
 
    
    if(cheak_str(Blackstr.blackQQ,qq)){
      del_str(Blackstr.blackQQ, qq)
      e.reply(`哼！,这次就勉强原谅你了`)
    }else{
      e.reply(`你这是给谁道歉呢~`)
      return true;
    }
    fs.writeFile(__dirname + '/config/config/other.yaml',YAML.stringify(Blackstr) , 'utf8', (err) => {
      if (err) throw err;
      //e.reply(`用户设置:\n${type}${qq}成功~`)
    });
  
  
  }
}

function accept(e) {
// 需要什么表情就加
// 获取一个随机的表情
console.log(e)
  const index = Math.floor(Math.random() * messages1.length);

// 从 messages 数组中获取对应的元素
  const keyword = messages1[index];
console.log('新人入群:' + keyword)



      // 遍历jsonObj的键
      Object.values(res).forEach(async item => {
        // 检查当前项的keywords是否包含目标关键词
        if (item.keywords.includes(keyword)) {
            // 输出对应的key和params
          
            let msg = `该表情至少需要${item.params.min_images}张图片,${item.params.min_texts}个文字描述`
            let url = `http://124.70.4.227:8085/memes/${item.key}/`
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
                    let user_id2 = this.e.user_id

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
            let user_id2 = this.e.user_id
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
            let resultFileLoc = './data/1.jpg'
            fs.writeFileSync(resultFileLoc, resultBuffer)
            await e.reply(segment.image(resultFileLoc))
         
            return false



        }
    });
    return false

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

function del_str(valArray, delVal) {
	//数组数据 valArray
	//删除的值 delVal
	//删除元素
	for (var i = 0; i < valArray.length; i++) {
		//数据比对
		if (valArray[i] == delVal) {
			//删除值
			valArray.splice(i, 1);
			//下标递减
			i--;
		}
	}
	return valArray;
}

function cheak_str(valArray, delVal) {
	//数组数据 valArray
	//删除的值 delVal
	//删除元素
	for (var i = 0; i < valArray.length; i++) {
		//数据比对
		if (valArray[i] == delVal) {
		return true;
		}
	}
	return false;
}






