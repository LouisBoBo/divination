import Config from '../config';
import md5 from '@/utils/md5.js'

function request(url, method, data) {
	return new Promise((resolve, reject) => {

		let surl = Config.baseUrl + url + "?" + JSON.stringify(data) + "yunshangshiji"
		if (url === "wxpay/appUinifiedOrderList" || url == "wxpaycx/wapUinifiedOrderList") {
			surl = Config.payUrl + url + "?" + JSON.stringify(data) + "yunshangshiji"
		}
		console.log("url = ", surl)

		let authkey = md5.hex_md5(surl)
		let ii = new Buffer(authkey).toString('base64')
		let token = uni.getStorageSync(Config.storage.token)

		if (token) {
			data["token"] = token
		}

		data["I10o"] = ii
		data["appVersion"] = "V3.8.7"
		data["app_id"] = "wxb798d32090f58f33"
		data["authKey"] = authkey.toUpperCase()
		data["channel"] = "18"
		data["version"] = "V1.32"

		uni.request({
			url: Config.baseUrl + url,
			method: method,
			data: data,
			header: {
				'custom-header': 'hello', //自定义请求头信息
				// 'content-type': 'application/json'
				"Authorization": `Bearer ${token}`
			},
			success: (res) => {
				// 请求成功时，调用resolve函数并传递结果
				console.log("请求结果=")
				resolve(res.data);
			},
			fail: (error) => {
				// 请求失败时，调用reject函数并传递错误信息
				console.log("请求报错=")
				reject(error);
			}
		});
	});
}

function payRequest(url, method, data) {
	return new Promise((resolve, reject) => {

		let surl = Config.payUrl + url + "?" + JSON.stringify(data) + "yunshangshiji"
		console.log("url = ", surl)

		let authkey = md5.hex_md5(surl)
		let ii = new Buffer(authkey).toString('base64')
		let token = uni.getStorageSync(this.$config.storage.token)

		if (token) {
			data["token"] = token
		}

		data["I10o"] = ii
		data["appVersion"] = "V3.8.7"
		data["app_id"] = "wxb798d32090f58f33"
		data["authKey"] = authkey.toUpperCase()
		data["channel"] = "18"
		data["version"] = "V1.32"

		uni.request({
			url: Config.payUrl + url,
			method: method,
			data: data,
			header: {
				'custom-header': 'hello', //自定义请求头信息
				// 'content-type': 'application/json'
			},
			success: (res) => {
				// 请求成功时，调用resolve函数并传递结果
				console.log("请求结果=")
				resolve(res.data);
			},
			fail: (error) => {
				// 请求失败时，调用reject函数并传递错误信息
				console.log("请求报错=")
				reject(error);
			}
		});
	});
}

function getUrl(url) {
	let surl = Config.baseUrl + url + "?" + "yunshangshiji"
	let authkey = md5.hex_md5(surl)
	let ii = new Buffer(authkey).toString('base64')
	let token = uni.getStorageSync(this.$config.storage.token)

	let Url = Config.baseUrl + url
	Url += "?version=V1.32"
	Url += "&channel=18"
	Url += "&authKey=" + authkey.toUpperCase()
	Url += "&app_id=wxb798d32090f58f33"
	Url += "&appVersion=V3.8.7"
	Url += "&I10o=" + ii
	Url += "&token=" + token
	
	return Url
}
module.exports = {
	request,
	payRequest,
	getUrl,
};