import Config from '../config';
import store from '@/store';
import md5 from '@/utils/md5.js'
import {
	getToken
} from "@/utils"
import {
	getLanguage,
} from './index';

module.exports = (vm) => {

	// 初始化请求配置
	uni.$u.http.setConfig((config) => {
		/* config 为默认全局配置*/
		// #ifdef APP-PLUS
		config.baseURL = Config.baseURl;
		// #endif

		// #ifdef MP-WEIXIN
		config.baseURL = Config.baseURl;
		if (config.url == "user/userLogin") {
			// #ifdef MP-WEIXIN
			config.baseURL = Config.loginUrl
			// #endif
		}
		// #endif

		// #ifdef H5
		// config.baseURL = '';
		// if (process.env.NODE_ENV === 'development') {
		// 	config.baseURL += '/prod_api' + Config.proxy.dev;
		// } else {
		// 	config.baseURL = Config.proxy.prod;
		// }
		// #endif




		config.timeout = Config.timeOut;
		config.dataType = 'json';
		config.responseType = 'text';
		config.custom = {
			auth: true,
			type: '',
		}; // 默认验证token
		return config;
	});

	// 请求拦截
	uni.$u.http.interceptors.request.use((config) => {
		console.log("config=", config)
		if (!config.custom.isGetFirm) {
			// config.baseURL = getToken(Config.store.baseurl) + Config.proxy.prod;//调试用后面打开
		}
		// if (config.url === "wxpay/appUinifiedOrderList" || config.url == "wxpaycx/wapUinifiedOrderList") {
		// 	config.baseURL = Config.payUrl
		// }
		if (config.url == "/user/userLogin") {
			// #ifdef MP-WEIXIN
			config.baseURL = Config.loginUrl
			console.log("登录测试url = ", config.baseURL)
			// #endif
		}
		console.log('config', config);
		// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
		config.data = config.data || {};

		let token = uni.getStorageSync(Config.storage.token)
		if (config?.url) {
			let surl = config.baseURL + config.url + "?" + JSON.stringify(config.params) + "yunshangshiji"
			console.log("测试url = ", surl)

			let authkey = md5.hex_md5(surl)
			let ii = new Buffer(authkey).toString('base64')

			let data = {}
			if (token) {
				data["token"] = token
			}
			data["I10o"] = ii
			data["authKey"] = authkey.toUpperCase()
			
			// #ifdef APP-PLUS | H5
			data["app_id"] = Config.appId;
			data["appVersion"] = "V3.8.7"
			data["version"] = "V1.32"
			data["channel"] = "18"
			// #endif
			
			// #ifdef MP-WEIXIN
			data["app_id"] = Config.appId;
			data["channel"] = "68"
			if (config.url == "/user/userLogin") {
				data["version"] = "V1.31"
			} else {
				data["appVersion"] = "V3.8.7"
				data["version"] = "V1.32"
			}
			// #endif

			let newData = {
				...data,
				...config.data
			}
			config.data = newData
		}



		// 根据custom参数中配置的是否需要token，添加对应的请求头   custom: {auth: false}} 不验证token
		if (config?.custom?.auth) {
			// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
			// 需要token时, 带上固定参数 帐号, 用户ID ,手机,和租户标识码
			config.header.Authorization = `Bearer ${vm.$store.state.access_token}`;
			config.header['Tenant-Id'] = vm.$store.state.domain_name;
		}

		// 添加访问类型
		config.header['source-type'] = 1;
		// 语言标识
		config.header['Language-Type'] = getLanguage().code;
		

		config.header.Authorization = `Bearer ${token}`;
		// config.header['Language-Type'] = 0;
		//  改变参数模式为 表单模式, 默认json
		if (config?.custom?.ContentType) {
			config.header['Content-Type'] = 'application/x-www-form-urlencoded';
		}





		return config;
	}, (config) => { // 可使用async await 做异步操作
		return Promise.reject(config);
	});

	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => {
		console.log('response', response);

		if (response.config.custom.isGetFirm) {
			return Promise.resolve(response.data);
			return;
		}

		const data = response.data;
		const custom = response.config?.custom; // 自定义参数
		// type=login  不会判断code
		if (custom.type === 'login') {
			// 特殊页面响应处理方式

		} else {
			if (data.status === "1") {
				// 正确响应
				return Promise.resolve(data);
			} else if (data.status === "10030") {
				// 登录过期
				uni.switchTab({
					url: "/pages/shouye/message",
				});
			} else {
				// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
				// if ((data.message || data.msg) && custom.toast !== false) {
				// 	uni.$u.toast(data.message || data.msg);
				// 	return Promise.reject(data);
				// }
				return Promise.reject(data);
			}
		}
	}, (response) => {
		if (response.statusCode === 500) {
			uni.showToast({
				icon: 'error',
				title: response.data.msg || '服务器错误',

			});
		}

		// 对响应错误做点什么 （statusCode !== 200）
		return Promise.reject(response);
	});
};