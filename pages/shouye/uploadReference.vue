<template>
	<view class="page">
		<view class="content-title">
			<view class="first">
				<image style="width: 32px;height: 54px;" src="../../static/classSecondCurrent@2x.png"></image>
				<text style="font-size: 16px;color: #272424;font-weight: 500;">上传您要参考的女装图</text>
			</view>
			<view class="second">
				<text style="font-size: 16px;color: #272424;opacity: 0.5;">女装类目</text>
			</view>
		</view>
		<!-- 上传参考 -->
		<view v-if="uploadStatus === 0">
			<view class="content-upload">
				<view @click="addClick">
					<image v-if="imageUrl" :src="imagePathFile" mode="aspectFit"></image>
					<u-icon v-else-if="!imageUrl && !loading" name="plus" size="24px" color="#B8B8B8"></u-icon>
					<u-loading-icon v-else-if="!imageUrl && loading"></u-loading-icon>
				</view>
			</view>
			<view class="content-add">
				<view class="content-add-photo">
					<button @click="addClick">添加1张正面图片</button>
					<text>*建议上传图片时勾选「原图」</text>
				</view>
				<view class="content-add-jump">
					<button @click="nextClick">跳过</button>
				</view>
			</view>
			<view class="content-tips">
				<view></view>
				<text>图片示例</text>
				<view></view>
			</view>
			<view class="content-status">
				<view class="content-status-base" v-for="(item,index) in list" :key="index">
					<image class="content-status-base-bigImg" :src="item.bigIcon"></image>
					<text>{{item.title}}</text>
					<image class="content-status-base-smallImg" :src="item.smallIcon"></image>
				</view>
			</view>
		</view>
		<!-- 上传失败 -->
		<view v-else-if="uploadStatus === 1">
			<view class="content-upload">
				<image :src="imagePathFile" mode="aspectFit"></image>
			</view>
			<view class="content-repitAdd">
				<view>正面图片识别失败</view>
				<text>图片小于3M，尺寸大于200*200，仅支持\n上传PNG/JPG格式的图片</text>
				<!-- <text>图片尺寸小于576*768，建议上传图片时勾选「原图」</text> -->
				<button @click="addClick">重新上传正面图片</button>
			</view>
		</view>
	</view>
</template>

<script>
	import upload from "@/utils/uploadImg.js"
	export default {
		data() {
			return {
				list: [{
					title: "图片清晰",
					bigIcon: "../../static/reference1@2x.png",
					smallIcon: "../../static/reference_success@2x.png"
				}, {
					title: "不是整体",
					bigIcon: "../../static/reference2@2x.png",
					smallIcon: "../../static/reference_fail@2x.png"
				}, {
					title: "有遮挡",
					bigIcon: "../../static/reference3@2x.png",
					smallIcon: "../../static/reference_fail@2x.png"
				}, {
					title: "过于模糊",
					bigIcon: "../../static/reference4@2x.png",
					smallIcon: "../../static/reference_fail@2x.png"
				}],
				uploadStatus: 0,
				imageUrl: null,
				imagePathFile: null,
				testCdnUrl: 'http://yssj-hebo.test.upcdn.net',
				loading: false,
				designInfo: {},
				base64Array: ""
			}
		},
		onLoad(options) {
			if (options.designInfo) {
				this.designInfo = JSON.parse(decodeURIComponent(options.designInfo))
				this.base64Array = this.designInfo.base64Array
				if (this.base64Array && this.base64Array.length > 0) {
					this.imagePathFile = this.$config.upyUrl + this.base64Array
				}
			}

			uni.$on("chooseImg", data => {
				if (data) {
					this.loading = true
				}
			})
		},
		methods: {
			btnClick() {
				this.$config.design.designInfo = this.designInfo
				uni.switchTab({
					url: '/pages/shouye/clothingDesign?' + `startDesign=${JSON.stringify(this.designInfo)}`
				});
			},
			nextClick() {
				this.btnClick()
			},
			addClick() {

				upload.uploadImg().then(res => {
					if (res.code == 200) {
						if (res.url) {
							this.imagePathFile = res.tempFilePath
							this.imageUrl = this.$config.imgUrl + res.url
							this.$forceUpdate()

							var filetype = "JPEG/PNG"
							var type = res["image-type"]
							var heigh = res["image-height"]
							var width = res["image-width"]
							//大小3M以下；分辨率不低于200*200
							if (res.file_size / 1024 / 1024 > 3 || heigh < 200 || width < 200) {
								this.uploadStatus = 1
								this.$u.toast("上传失败")
							} else if (filetype.indexOf(type) === -1) {
								this.uploadStatus = 1
								this.$u.toast("上传失败")
							} else {
								this.uploadStatus = 0
								this.$u.toast("上传成功")

								let base64Array = res.url
								this.$config.design.base64Array = base64Array //保存垫图
								this.$set(this.designInfo, "base64Array", base64Array)
								setTimeout(() => {
									this.btnClick() //图片上传成功后进入到生成图片
								}, 1000)
							}

							this.loading = false
						}
					} else {
						this.$u.toast("上传失败")
						this.loading = false
					}
				})
			},
			// 图片选择上传
			upload() {
				var _self = this;
				// 图片选择，只支持一次选择一张图片
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册、相机选择
					success: function(res) {
						console.log('res:', res)
						// _self.curTotal++;
						// _self.imgList.push(res.tempFilePaths[0]);
						const tempFilePaths = res.tempFilePaths[0];

						_self.tempFilePaths = res.tempFilePaths[0]; //测试用
						// 图片上传
						const token = uni.getStorageSync(this.$config.storage.token)
						const uploadTask = uni.uploadFile({
							url: 'http://v0.api.upyun.com/user/feedBack/1587985/6359cb4e-3528-4f9c-9f53-a7eac295753b.file', // post请求地址
							filePath: tempFilePaths,
							name: 'file', // 待确认
							header: {
								// 'Content-Type': 'multipart/form-data',
								// 'Authorization': `Bearer ${token}`,

								"Authorization": 'UPYUN yssj:razonoSO4yJMPneAng8B2KM97F4=',
								"policy": 'eyJidWNrZXQiOiIveXNzajY2OCIsInNhdmUta2V5IjoiYWlsaS91cGxvYWRfe3JhbmRvbTMyfXsuc3VmZml4fSIsImV4cGlyYXRpb24iOjE3MDAyNjk5MjF9',
							},
							success: function(uploadFileRes) {
								console.log('Success:', uploadFileRes.data);
								console.log('_self.imgsID:', _self.imgsID)
							},
							fail: function(uploadFileFail) {
								console.log('Error:', uploadFileFail.data);
							},
							complete: () => {
								console.log('Complete:');
							}
						});
					},
					error: function(e) {
						console.log(e);
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		width: 100%;
		display: flex;
		flex-direction: column;
		background-color: #fff;
		height: calc(100vh);
	}

	.content-title {
		width: 100%;
		height: 108rpx;
		margin: 38rpx 0 30rpx 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		.first {
			width: auto;
			height: 108rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
		}

		.second {
			width: auto;
			display: flex;
			flex-direction: row;
			align-items: center;
			position: absolute;
			left: 0;
		}
	}

	.content-upload {
		width: 100%;
		height: auto;
		display: flex;
		align-items: center;
		justify-content: center;

		view {
			width: 604rpx;
			height: 604rpx;
			background: #EFEFEF;
			border-radius: 40rpx;
			align-content: center;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		image {
			width: 604rpx;
			height: 604rpx;
			border-radius: 40rpx;
		}
	}

	.content-add {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-top: 34rpx;

		&-photo {
			display: flex;
			flex-direction: column;

			button {
				width: 416rpx;
				height: 92rpx;
				background: #EC3A76;
				border-radius: 46rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				color: #272424;
				line-height: 92rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			button::after {
				border: none;
			}

			text {
				width: 416rpx;
				height: 34rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #858585;
				line-height: 34rpx;
				margin-top: 16rpx;
				display: flex;
				text-align: center;
				align-items: center;
				justify-content: center;
			}
		}

		&-jump {
			button {
				width: 148rpx;
				height: 92rpx;
				border-radius: 46rpx;
				border: 4rpx solid #D8D8D8;
				margin-left: 40rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #858585;
				line-height: 92rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			button::after {
				border: none;
			}
		}
	}

	.content-repitAdd {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		view {
			width: 256rpx;
			height: 44rpx;
			margin-top: 48rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #272424;
			line-height: 44rpx;
		}

		text {
			width: 576rpx;
			height: auto;
			margin-top: 16rpx;
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #858585;
			line-height: 34rpx;
			text-align: center;
		}

		button {
			width: 416rpx;
			height: 92rpx;
			background: #EC3A76;
			border-radius: 52rpx;
			margin-top: 48rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #272424;
		}
	}

	.content-tips {
		height: 40rpx;
		width: 100%;
		margin-top: 80rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		view {
			width: 256rpx;
			height: 1px;
			background-color: #F0F0F0;
		}

		text {
			width: 112rpx;
			height: 40rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #858585;
			line-height: 40rpx;
			margin-left: 24rpx;
			margin-right: 24rpx;
		}
	}

	.content-status {
		height: 238rpx;
		margin: 28rpx 40rpx 0 20rpx;
		display: flex;
		flex-direction: row;

		&-base {
			height: 100%;
			width: 152rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-left: 20rpx;

			&-bigImg {
				width: 152rpx;
				height: 152rpx;
			}

			text {
				width: 96rpx;
				height: 34rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #272424;
				line-height: 34rpx;
				margin-top: 8rpx;
				margin-bottom: 12rpx;
			}

			&-smallImg {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}
</style>