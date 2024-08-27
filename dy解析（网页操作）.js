// 没有解析api？直接找解析网站进行网页操作
import puppeteer from 'puppeteer';
import plugin from '../../lib/plugins/plugin.js'
import common from'../../lib/common/common.js'
import fetch from 'node-fetch'
import fs from 'node:fs'
import { segment } from "icqq";
const _path=process.cwd()

// 视频保存路径
if (!fs.existsSync(`./resources/video/`)) {
  fs.mkdirSync(`./resources/video/`);
}

export class BaiduSearchPlugin extends plugin {
  constructor () {
    super({
      name: 'dy解析',
      dsc: '使用puppeteer调用网站解析抖音视频',
      event: 'message',
      priority: 4000,
      rule: [
        {
          reg: '^(.*)https(.*)douyin(.*)$',
          fnc: 'searchFlowers'
        }
      ]
    })
  }

  async searchFlowers(e) {
    let msg = e.msg
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // 加载网站（小天短视频在线工具）
    await page.goto('https://www.xtdowner.com/video/douyin/');
    //对网站里的抖音链接输入框进行定位
    const searchInput = await page.$('input[name="detail"]'); 
    //对网站里的搜索按钮进行定位
    const searchButton = await page.$('button[type="submit"]'); 

    if (searchInput && searchButton) {
      console.log("定位成功")
      await searchInput.type(msg); // 在搜索框中输入“链接”
      await searchButton.click(); // 点击搜索按钮
      await page.waitForNavigation();//等待页面加载完成
      //获取视频直链，定位一下获取下载链接的按钮
      let linkElement = await page.$('button.copy.btn.btn-default[data-clipboard-text]');
      // 这是遇到打赏页面后跳过打赏页面的按钮
      let Banbutton = await page.$('button#btn_submit');
// 没遇到打赏
      if (linkElement) {
        const link = await page.evaluate(element => element.getAttribute('data-clipboard-text'), linkElement);
        console.log('获取到的链接:', link);
        // 下载视频然后发送，防止视频过大发送失败
        try {
          let response = await fetch(link);
          let buff = await response.arrayBuffer();
    if(buff){
      await fs.writeFile("./resources/video/dy.mp4", Buffer.from(buff), "binary", function (err) {
        console.log(err || "下载视频成功");
        if (!err) {
          e.reply(segment.video(`./resources/video/dy.mp4`));
        }
      });
    }else{
      await this.reply('解析api出错，无法解析')
      return false
    }
        }
        catch (err) {
          return false
        }
      } else {
        // 查看是否弹出打赏页面
        if(Banbutton){
            console.log('遇到打赏页面，等待16s')
            await common.sleep(16000)
            // 点击按钮跳过打赏
            await Banbutton.click();
            await page.waitForNavigation();//等待页面加载完成
            // const screenshotPath = (_path + '/resources/test.jpg');
            // await page.screenshot({ path: screenshotPath, fullPage: true });
            // console.log('截图成功')
            linkElement = await page.$('button.copy.btn.btn-default[data-clipboard-text]');
           if (linkElement) {
            let link = await page.evaluate(element => element.getAttribute('data-clipboard-text'), linkElement);
            console.log('获取到的链接:', link);
            // 下载视频然后发送，防止视频过大发送失败
            try {
              let response = await fetch(link);
              let buff = await response.arrayBuffer();
        if(buff){
          await fs.writeFile("./resources/video/dy.mp4", Buffer.from(buff), "binary", function (err) {
            console.log(err || "下载视频成功");
            if (!err) {
              e.reply(segment.video(`./resources/video/dy.mp4`));
            }
          });
        }else{
          await this.reply('解析api出错，无法解析')
          return false
        }  
            }
            catch (err) {
              return false
            }
      }
      else{
        console.log('link不见了')
      }
        }else{
          console.log('未加载到跳过打赏页面按钮，出错了');
        }
      }
      await browser.close();
    } else {
      console.log('未找到搜索框或按钮');
      await browser.close();  
    }
  }
}

