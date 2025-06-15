import Config from "@/config"

import { getToken, setToken, removeToken } from "@/utils"
import { getLanguage, getSystemLang } from "./index";


const files = require.context("../api", true, /\index.js$/);
const modules = {};

files.keys().forEach((key) => {
    modules[key.replace(/(\.\/|\/index.js)/g, "")] = files(key).default || files(key);
});

const setUrlParams = (path, query = {}) => {
    let params = {},
        p = uni.$u.queryParams(query, false);

    path.indexOf('?') > 0 ? path += '&' + p : path += '?' + p

    return path;
}
const install = (Vue) => {

    Vue.prototype.$nav = {
        /**
         * @param url  跳转的路径url  可以直接?后加参数, 会和query合并
         * @param query  携带的参数 如果与url参数重名, 则会合并
         * @param redirect  是否重定向
         * @param callFn  监听对象
         * @returns {string}
         */
        to: (url = "", query = {}, redirect = false, callFn) => {
            if (!url) return '';
            url = setUrlParams(url, query);
            if (redirect) {
                uni.redirectTo({ url })
            } else {
                if (typeof callFn === 'function') {
                    // 有事件监听
                    uni.navigateTo({
                        url,
                        events: {
                            callInPage: typeof callFn === 'function' ? callFn : () => { }
                        }
                    })
                } else {
                    uni.navigateTo({ url });
                }
            }
        },
        back: delta => {
            delta = delta ?? 1
            uni.navigateBack({ delta });
        },
        tab: url => {
            uni.switchTab({ url })
        },
        goHome: () => {
            uni.switchTab({ url: Config.main })
        }
    }

    Vue.prototype.$barHeight = (num) => {
        let appStatusBarHeight = 44;
        return uni.$u.sys().statusBarHeight + appStatusBarHeight + (num || 0)
    }

    Vue.prototype.$ch = uni.$u
    Vue.prototype.$api = modules
    Vue.prototype.$http = uni.$u.http

    Vue.prototype.$db = {
        set: setToken,
        get: getToken,
        remove: removeToken
    }

    Vue.prototype.$confirm = (content, title, showcancle = true, btnName = ['取消', '确认']) => {
    	return new Promise((resolve, reject)=>{
    		uni.showModal({
    			title: title??Config.name,
    			content: content??"消息",
    			showCancel: showcancle,
    			cancelText: btnName[0],
    			confirmText: btnName[1],
    			confirmColor: '#007eb8',
    			success(res){
    				res.confirm && resolve() || reject()
    			},
    		})
    	})
    }

    Vue.prototype.$config = Config

    Vue.prototype.$lang = getLanguage;

    Vue.prototype.$getUserLang = () => {
        return getToken(Config.store.userLang) || getLanguage();
    }
}


export default {
    install
}
