import Vue from "vue"
import VueI18n from 'vue-i18n'
import base  from "@/api/base"
import Config from "@/config"
import { getSystemLang, getToken, setToken } from "@/utils"

import en from "./en.json"
import cn from "./zh-Hans.json"
import tc from "./zh-Hant.json"

let proxyTag = process.env.NODE_ENV === 'development' ? Config.proxy.dev : Config.proxy.prod

const messages = {
    'zh-Hans': cn,   //简体中文
    'en': en,  	//英语
    'zh-Hant': tc,  // 繁体
};


let i18nConfig = {
    locale: getSystemLang().name,
    messages
}
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)

async function getServerLang () {
    let local = getToken(Config.store.local);
    if( local ){
        return new Promise((resolve, reject) => resolve(local));
    }else{
        /**
         * 这里的请求没有从统一配置里发送. 必须要自行判断
         */
        return new Promise((resolve, reject) => {
			let url = '';
			// #ifdef APP-PLUS | MP-WEIXIN
			url = Config.baseURl
			// #endif
			// #ifdef H5
			url = proxyTag
			// #endif

   //          uni.$u.http.get(`${url}${base.locale}`).then(result => {
			// 	console.log('result', result);
   //              if( result.statusCode === 200 ){
   //                  let { code, data } = result.data;
   //                  if( code === 200 ){
   //                      setToken(Config.store.local, data);
   //                      resolve(data)
   //                  }
   //              }
   //          }).catch(er => {
			// 	console.log('er',  er);
			// })
        })
    }
}

getServerLang().then(result => {
    i18n.mergeLocaleMessage('zh-Hans', result.language_0)
    i18n.mergeLocaleMessage('en', result.language_1)
    i18n.mergeLocaleMessage('zh-Hant', result.language_2)
});




export default i18n;
