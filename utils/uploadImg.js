import hash from "@/utils/upyn-hash-vue.js"
import md5 from '@/utils/md5.js'
import base64 from '@/node_modules/base-64/base64.js'
function uploadImg() {
	return new Promise((resolve, reject) => {

		// const bucket = 'yssj-hebo'
		// const username = 'test'
		// const password = 'D8ZP65OZgJeRAzFR2MAxFOCiK601k791'
		// const path = '/img'
		// const testCdnUrl = 'http://yssj-hebo.test.upcdn.net'
		// const url = `https://v0.api.upyun.com/${bucket}`

		const bucket = 'yssj668'
		const username = 'yssj'
		const password = 'yssj8888'
		const path = '/img'
		const testCdnUrl = 'http://yssj668.yssj.upcdn.net'
		const url = `https://v0.api.upyun.com/${bucket}`

		/* 创建FormData */
		const uploadData = {
			policy: "",
			authorization: "",
			file: ""
		}

		/* 计算policy */
		const policyObj = {
			bucket: bucket,
			'save-key': `${path}/{filename}{.suffix}`,
			expiration: new Date().getTime() + 600,
			/* 过期时间，在当前时间+10分钟 */
		}
		var policy = ""
		// #ifdef APP-PLUS | H5
		policy = base64.encode(JSON.stringify(policyObj))
		// #endif
		// #ifdef MP-WEIXIN
		policy = base64.encode(JSON.stringify(policyObj))
		// #endif
		console.log("policy=", policy)
		uploadData.policy = policy
		
		/* 计算 Authorization */
		const passwordMd5 = hash.HexMD5.MD5(password).toString(hash.HexMD5.enc.Hex)

		/* [Method-请求方法, URI-请求路径, policy] */
		const arr = ['POST', `/${bucket}`, policy]

		const authorization = `UPYUN ${username}:${hash.b64hamcsha1(passwordMd5, arr.join('&'))}`
		uploadData.authorization = authorization

		uni.chooseImage({
			count: 1,
			success: (chooseImageRes) => {
				const tempFilePaths = chooseImageRes.tempFilePaths;
				uploadData.file = tempFilePaths[0]
				console.log("uploadData=", uploadData)
				uni.$emit("chooseImg", "success")

				uni.uploadFile({
					url: url, //仅为示例，非真实的接口地址
					filePath: tempFilePaths[0],
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
			}
		});

	});
}

//压缩图片
function zipImg() {
	// src: 压缩转换原始图片的路径// _this: 当前的this，如果不想传递this可将该函数改为箭头函数// callback: 回调函数，详情chooseImage方法function compressImage(src, _this, callback) {
	var dstname = "_doc/IMG-" + (new Date()).valueOf() + ".jpg"; //设置压缩后图片的路径 
	var width, height, quality;
	width = "80%";
	height = "80%";
	quality = 80;
	// 具体情况可查看HTML5+文档 ===> http://www.html5plus.org/doc/zh_cn/zip.html#plus.zip.compressImage
	plus.zip.compressImage({
			src: src,
			dst: dstname,
			overwrite: true,
			quality: quality,
			width: width,
			height: height
		},
		function(event) {
			callback(event.target, dstname, _this);
		},
		function(error) {
			return src;
		});
}
//删除图片
function delImg(i, imgList, imgsID) {
	uni.showModal({
		title: '提示',
		content: '确定要删除照片吗？',
		cancelText: '取消',
		confirmText: '确定',
		success: res => {
			if (res.confirm) {
				imgList.splice(i, 1);
				imgsID.splice(i, 1);
				this.curTotal--;
			}
		}
	})
}
//浏览图片
function viewImage(i, imgList) {
	let imgurl = []
	imgList.forEach(item => imgurl.push(item))
	uni.previewImage({
		urls: imgurl,
		current: imgList[i]
	});
}

module.exports = {
	uploadImg,
}