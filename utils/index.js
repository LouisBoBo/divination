/**
 * 通用方法集
 */

import Config from '../config';
import moment from 'moment';


export const getToken = (storeKey) => {
    return uni.getStorageSync(storeKey);
};

export const setToken = (storeKey, data) => {
    return uni.setStorageSync(storeKey, data);
};

export const removeToken = (storeKey) => {
    return uni.removeStorageSync(storeKey);
};

export const getLanguage = () => {
    let ulang = getToken(Config.store.userLang)
    if(ulang){
        return ulang
    }
    return getSystemLang()
}

/**
 * 获取相应该的客户端语言标识
 * 无法部分别, 默认为英文
 * @returns {Object}
 */
export function getSystemLang(){
    let lang = uni.getLocale(), nowlang = {};
    switch (lang) {
        case 'zh-Hans' :
            nowlang.name = 'zh-Hans'
            nowlang.code = 0
            break;
        case 'zh-Hant' :
            nowlang.name = 'zh-Hant'
            nowlang.code = 2
            break;
        default :
            nowlang.name = 'en'
            nowlang.code = 1
            break;
    }
    return nowlang;
}
