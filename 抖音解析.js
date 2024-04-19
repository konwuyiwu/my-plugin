import plugin from '../../lib/plugins/plugin.js'
import { segment } from "icqq";
import fetch from 'node-fetch'
import fs from 'node:fs'
import axios from 'axios'
const _path = process.cwd();

if (!fs.existsSync(`./resources/video/`)) {
  fs.mkdirSync(`./resources/video/`);
}
export class jiexi extends plugin {
  constructor () {
    super({
      name: '抖音解析',
      dsc: '发送抖音视频链接即可解析',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^(.*)https(.*)douyin(.*)$',
          fnc: 'jiexi'
        }
      ]
    })
  }
 

  async jiexi (e) {
    const regex = /(https?:\/\/[^\s]+)/;
    const match = e.msg.match(regex);

      let url1 = match[0];
    let url = ` https://api.aagtool.top/api/dywsyjx?url=${url1}`
    let response
    try {
      response = await fetch(url, {
        method: 'get',
      })
    } catch (error) {
      logger.error(error.toString())
      return false
    }
    const res = await response.json()


    
    console.log(res)
    await this.reply(
      '标题:' + res.title + '\n' +
      '链接:' + res.url + '\n' +
      '视频正在解析中，时间可能较长，请耐心等候' +
      '也可以直接点击链接进行观看和下载'
  
    )
   let videourl = res.url
    try {
      let response = await fetch(videourl);
      let buff = await response.arrayBuffer();

      await checkpath(_path.join(__dirname, "/resources/video"))
      fs.writeFile("./resources/video/QwQ.mp4", Buffer.from(buff), "binary", function (err) {
        console.log(err || "下载视频成功");
        if (!err) {
          // e.reply(segment.video(`file:///${_path}/resources/video/QwQ.mp4`));
          e.reply(segment.video(`file:///${__dirname}/resources/video/QwQ.mp4`));
        }
      });
    } catch (err) {
      return false
    }
    return true
  }
}

