import Config from '@/config';
import Api from "@/utils/api.js"
import httpApi from "@/api/luna/index.js"
// 获取机器运行状态颜色 0: 连接中断，10: 连接正常, 30: 停机
function getStatusColor(status) {
	let color = Config.color.normal;
	switch (status) {
		case 10:
			color = Config.color.run;
			break;
		case 1:
			color = Config.color.warning;
			break;
		case 30:
			color = Config.color.stop;
			break;
		case 0:
			color = Config.color.breakOff;
			break;
		case 4:
			color = Config.color.noOrders;
			break;
	}
	return color;
}

function getStatusText(status) {
	let str = ""
	switch (status) {
		case 0:
			str = "连接中断";
			break;
		case 10:
			str = "运行正常";
			break;
		case 30:
			str = "停机";
			break;
	}
	return str
}

function request(url, method, data) {
	return new Promise((resolve, reject) => {

		uni.request({
			url: Config.baseUrl + url,
			method: method,
			data: data,
			header: {
				'custom-header': 'hello' //自定义请求头信息
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

function getInstence(that) {
	return new Promise((resolve) => {
		that.$http.get(httpApi.userLvInfo).then(res => {
			console.log("请求结果insterest=", res)
			if (res.status === "1") {
				resolve(res);
			}
		})
	})
}

function test() {
	console.log("我来过了")
	return "我来过了"
}

function upload(options) {

	var Base64 = {
		// private property
		// _keyStr不要修改，不用动，就这样写
		_keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
		// public method for encoding
		encode: function(input) {
			var output = ''
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4
			var i = 0
			input = Base64._utf8_encode(input)
			while (i < input.length) {
				chr1 = input.charCodeAt(i++)
				chr2 = input.charCodeAt(i++)
				chr3 = input.charCodeAt(i++)
				enc1 = chr1 >> 2
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
				enc4 = chr3 & 63
				if (isNaN(chr2)) {
					enc3 = enc4 = 64
				} else if (isNaN(chr3)) {
					enc4 = 64
				}
				output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(
					enc3) + this._keyStr.charAt(enc4)
			}
			return output
		},
		// public method for decoding
		decode: function(input) {
			var output = ''
			var chr1, chr2, chr3
			var enc1, enc2, enc3, enc4
			var i = 0
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
			while (i < input.length) {
				enc1 = this._keyStr.indexOf(input.charAt(i++))
				enc2 = this._keyStr.indexOf(input.charAt(i++))
				enc3 = this._keyStr.indexOf(input.charAt(i++))
				enc4 = this._keyStr.indexOf(input.charAt(i++))
				chr1 = (enc1 << 2) | (enc2 >> 4)
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
				chr3 = ((enc3 & 3) << 6) | enc4
				output = output + String.fromCharCode(chr1)
				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2)
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3)
				}
			}
			output = Base64._utf8_decode(output)
			return output
		},
		// private method for UTF-8 encoding
		_utf8_encode: function(string) {
			string = string.replace(/\r\n/g, '\n')
			var utftext = ''
			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n)
				if (c < 128) {
					utftext += String.fromCharCode(c)
				} else if (c > 127 && c < 2048) {
					utftext += String.fromCharCode((c >> 6) | 192)
					utftext += String.fromCharCode((c & 63) | 128)
				} else {
					utftext += String.fromCharCode((c >> 12) | 224)
					utftext += String.fromCharCode(((c >> 6) & 63) | 128)
					utftext += String.fromCharCode((c & 63) | 128)
				}
			}
			return utftext
		},
		// private method for UTF-8 decoding
		_utf8_decode: function(utftext) {
			var string = ''
			var i = 0
			var c = (c1 = c2 = 0)
			while (i < utftext.length) {
				c = utftext.charCodeAt(i)
				if (c < 128) {
					string += String.fromCharCode(c)
					i++
				} else if (c > 191 && c < 224) {
					c2 = utftext.charCodeAt(i + 1)
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
					i += 2
				} else {
					c2 = utftext.charCodeAt(i + 1)
					c3 = utftext.charCodeAt(i + 2)
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
					i += 3
				}
			}
			return string
		},
	}
	var bucket = "yssj668"
	var operator = "yssj"
	var getSignatureUrl = 'https://img.yifuapp.wang/'
	var token = uni.getStorageSync(Config.storage.token)

	uni.getImageInfo({
		src: options.localPath,
		success: function(image) {
			console.log(image.width);
			console.log(image.height);
			var imglength = image.width * image.height

			uni.$u.http.get(httpApi.fileSign + "?length=" + imglength + "&fileType=file" +
				"&type=userFeedBack" +
				"&method=PUT").then(res => {
				console.log('result', res);
				if (res.status === "1") {
					let remotePath = res.data.url
					if (remotePath) {
						remotePath = remotePath.split('//')[1]
					}
					var date = new Date().toGMTString()
					var opts = {
						'save-key': remotePath,
						bucket: bucket,
						expiration: Math.round(new Date().getTime() / 1000) + 3600,
						date: date,
					}
					var policy = Base64.encode(JSON.stringify(opts))


					// const policyObj = {
					// 	bucket: bucket,
					// 	'save-key': remotePath,
					// 	expiration: new Date().getTime() + 600,
					// 	/* 过期时间，在当前时间+10分钟 */
					// }
					// const policy = btoa(JSON.stringify(policyObj))
					console.log("policy=", policy)

					const uploadData = {
						authorization: res.data.Authorization,
						policy: policy,
						file: options.localPath
					}

					uni.uploadFile({
						url: `https://v0.api.upyun.com/${bucket}`, //仅为示例，非真实的接口地址
						filePath: options.localPath,
						name: 'file',
						formData: {
							...uploadData
						},
						success: (uploadFileRes) => {
							console.log("upload=", JSON.parse(uploadFileRes.data))
							let data = JSON.parse(uploadFileRes.data)
							data.tempFilePath = tempFilePaths[0]
							resolve(data)
						},
						error: function(e) {
							console.log(e);
							reject(error);
						}
					});

					// uni.uploadFile({
					// 	url: res.data.url,
					// 	filePath: options.localPath,
					// 	name: 'file',
					// 	header: {
					// 		'Content-Type': 'multipart/form-data',
					// 		"Authorization": `Bearer ${token}`,
					// 	},
					// 	formData: {
					// 		// 1.这个authorization和policy是根据签名接口地址getSignatureUrl生成的，这个地址是后台开的，如果没有这个地址（比如我们就没有这个地址），可以在upyun网址上输入服务名，密码，过期时间等自动获取；如果有签名地址，就把下面这两行代码放开，让它自动计算authorization和policy；要是没有，就跟下面这样写死；获取的位数不用管，有的长，有的短，正常现象；
					// 		authorization: res.data.Authorization,
					// 		policy: policy,
					// 	},
					// 	success: options.success,
					// 	fail: options.fail,
					// 	complete: options.complete
					// });
				}
			}).catch(er => {
				console.log('er', er);
			}).finally(() => {

			})

			// Api.request(httpApi.fileSign, "GET", {
			// 	length: imglength,
			// 	method: "PUT",
			// 	fileType: "png",
			// 	type: "userFeedBack"
			// }).then(res => {
			// 	console.log("请求结果=", res.data)
			// 	if (res.status === "1") {
			// 		uni.uploadFile({
			// 			url: res.data.url,
			// 			filePath: options.localPath,
			// 			name: 'file',
			// 			header: {
			// 				'Content-Type': 'multipart/form-data',
			// 				"date": res.data.date,
			// 				"Authorization": res.data.Authorization,
			// 				"method": res.data.method,
			// 				"Content-Length": res.data["Content-Length"],
			// 				"mkdir": res.data.mkdir,
			// 			},
			// 			success: options.success,
			// 			fail: options.fail,
			// 			complete: options.complete
			// 		});
			// 	}
			// })
		}
	});


	// uni.request({
	// 	url: getSignatureUrl,
	// 	method: "GET",
	// 	data: data,
	// 	header: {
	// 		// 'custom-header': 'hello', //自定义请求头信息
	// 		'content-type': 'application/json'
	// 	},
	// 	success: (res) => {
	// 		// 请求成功时，调用resolve函数并传递结果
	// 		console.log("上传成功", res)
	// 		uni.uploadFile({
	// 			//这里的url不用修改，不可以修改；直接用即可，这是官网的接收地址，不要修改；
	// 			url: `https://v0.api.upyun.com/${bucket}`,
	// 			filePath: options.localPath,
	// 			name: 'file',
	// 			formData: {
	// 				// 1.这个authorization和policy是根据签名接口地址getSignatureUrl生成的，这个地址是后台开的，如果没有这个地址（比如我们就没有这个地址），可以在upyun网址上输入服务名，密码，过期时间等自动获取；如果有签名地址，就把下面这两行代码放开，让它自动计算authorization和policy；要是没有，就跟下面这样写死；获取的位数不用管，有的长，有的短，正常现象；
	// 				// authorization: `UPYUN ${operator}:${res.data.signature}`,
	// 				// policy: policy,

	// 				authorization: 'UPYUN yssj:razonoSO4yJMPneAng8B2KM97F4=',
	// 				policy: 'eyJidWNrZXQiOiIveXNzajY2OCIsInNhdmUta2V5IjoiYWlsaS91cGxvYWRfe3JhbmRvbTMyfXsuc3VmZml4fSIsImV4cGlyYXRpb24iOjE3MDAyNjk5MjF9',
	// 			},
	// 			success: options.success,
	// 			fail: options.fail,
	// 			complete: options.complete,
	// 		})
	// 	},
	// 	fail: (error) => {
	// 		// 请求失败时，调用reject函数并传递错误信息
	// 		console.log("上传失败", err)
	// 	}
	// });
}


module.exports = {
	getStatusColor,
	getStatusText,
	request,
	test,
	upload,
	getInstence,
};