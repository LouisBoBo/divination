<template>
	<view class="page">
		<view class="base">
			<scroll-view class="scrollView" scroll-y="true" :scroll-with-animation="true" :scroll-into-view="toview">
				<view class="head">
					<u-swiper :list="list1" height="932rpx" @change="change" @click="click" interval="5000"
						:circular="true"></u-swiper>
					<image style="width: 100%;height: 120rpx;position: absolute;top: 813rpx;"
						src="../../static/mengceng@2x.png">
					</image>
				</view>
				<view class="step">
					<image class="step-content0" src="https://img.yifuapp.wang/img/step@2x.png"></image>
					<view class="step-content3">
						<view class="step-content3-view1">
							<image src="../../static/setting@2x.png" @click="settingClick"></image>
						</view>
						<view class="step-content3-view2">
							<button @click="startClick" :plain="false" style="color: #272424;">开始设计</button>
						</view>
						<view class="step-content3-view3">
							<image @click="standClick" src="../../static/about_aili@2x.png"></image>
						</view>
					</view>

				</view>
				<view class="bottom"></view>
				<u-popup :show="show" :round="20" mode="bottom" @close="close" @open="open">
					<view class="popupView">
						<image
							style="height: 48rpx;width: 48rpx;position: absolute;top: 40rpx;right: 30rpx;margin-top: 0;"
							src="../../static/close@2x.png" @click="show=false"></image>
						<image src="../../static/login_logo@2x.png"></image>
						<button :plain="false" style="color: #272424;" @click="loginClick">微信登录</button>
						<view class="popupView_xieyi">
							<image @click="selectClick"
								:src="xieyiSelect?'../../static/select@2x.png':'../../static/unselect.png'"></image>
							<text>我同意《用户服务协议》和《隐私政策》</text>
						</view>
					</view>
				</u-popup>
				<view class="bottomLine" id="tobottom" style="height: 1px;"></view>
			</scroll-view>

		</view>
	</view>
</template>

<script>
	import httpApi from "../../api/aili/index.js"
	import Api from "@/utils/api.js"
	import Config from '@/config';
	import md5 from '@/utils/md5.js'
	import pp from "@/utils/public.js"
	import {
		getToken
	} from "@/utils"
	export default {
		data() {
			return {
				list1: [
					'https://img.yifuapp.wang/img/swiper1@2x.png',
					'https://img.yifuapp.wang/img/swiper2@2x.png',
					'https://img.yifuapp.wang/img/swiper3@2x.png',
					'https://img.yifuapp.wang/img/swiper4@2x.png',
				],
				shopTops: [],
				show: false,
				xieyiSelect: false,
				token: null,
				hasHistoty: 0,
				insterest: null,
				insterestCount: 0,
				toview: null
			}
		},

		onShow() {
			this.token = uni.getStorageSync(this.$config.storage.token)
			console.log("取到的值1====", this.token)
			if (this.token) {
				this.getLvInfo()
			}
		},
		onLoad() {
			this.getShopTop()
			setTimeout(() => {
				this.toview = "tobottom"
			}, 2000)
		},
		methods: {
			getShopTop() {
				this.$http.get(httpApi.shopTop).then(res => {
					console.log("请求结果=", res)
					if (res.status === "1") {
						let datas = res.centShops
						this.shopTops = datas.filter(item => {
							return item.type === 2
						})
						console.log("urls=", this.shopTops)
					}
				})
			},
			settingClick() {
				if (!this.token) {
					this.show = true
				} else {
					this.$nav.to('/pages/shouye/Feedback', false)
				}
			},
			standClick() {
				console.log("了解")
				this.$nav.to('/pages/shouye/understand', false)
			},
			startClick() {
				if (!this.token) {
					this.show = true
				} else {
					if (this.hasHistoty > 0) { //有历史数据就到设计界面
						uni.switchTab({
							url: '/pages/shouye/clothingDesign'
						});
					} else { //没历史数据就去选择类目
						this.$config.design.startDesign = true
						this.$nav.to('/pages/shouye/selectClass', false)
					}
				}
			},

			loginClick() {
				if (this.xieyiSelect) {
					this.show = false
					this.newLogin()
				} else {
					this.$ch.toast(this.$t("请先同意协议类型"));
				}
			},
			//获取账户等级
			getLvInfo() {
				pp.getInstence(this).then(res => {
					console.log("insterest=", res)
					this.insterest = "Plus"
					this.insterestCount = res.detail.number
					this.hasHistoty = res.jobCount

					if (this.hasHistoty > 0) { //有历史数据就到设计界面
						uni.switchTab({
							url: '/pages/shouye/clothingDesign'
						});
					} else { //没历史数据就去选择类目
						this.$config.design.startDesign = true
						this.$nav.to('/pages/shouye/selectClass', false)
					}
				})
			},
			selectClick() {
				this.xieyiSelect = !this.xieyiSelect
			},
			open() {

			},
			close() {
				this.show = false
			},
			change() {

			},
			click() {

			},
			//保存数据
			saveInfo(res, code) {
				uni.setStorageSync(this.$config.storage.token, res.token);
				uni.setStorageSync(this.$config.storage.userInfo, res.userinfo);
				uni.setStorageSync(this.$config.storage.code, code)

				this.getLvInfo()
			},

			//第三方登录
			newLogin() {
				var that = this
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						//支持微信、qq和微博等
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									// 获取用户信息
									uni.getUserInfo({
										provider: 'weixin',
										success: function(infoRes) {
											if (loginRes) {
												// #ifdef APP-PLUS | H5
												console.log("我来了1", infoRes)
												that.loginHttp(loginRes, infoRes)
												// #endif
												// #ifdef MP-WEIXIN
												console.log("我来了2", infoRes)
												console.log("我来了3", loginRes)
												that.submitCodeHttp(loginRes, infoRes)
												// #endif
											}
										},
										fail: function(err) {
											uni.hideLoading();
											uni.showToast({
												icon: 'none',
												title: err
											})
										}
									});
								},
								fail(err) {
									this.$u.toast(err)
								}
							});
						}
					},
					fail(err) {
						this.$u.toast(err)
					}
				})
			},

			//平台登录
			loginHttp(loginRes, infoRes) {
				var that = this

				let token = '';
				// #ifdef APP-PLUS | H5
				token = loginRes.authResult.access_token
				// #endif
				// #ifdef MP-WEIXIN
				token = loginRes.code
				// #endif

				let parameter = {
					device: 1,
					deviceToken: "",
					imei: "",
					mac: "",
					unionid: infoRes.userInfo.unionId,
					openid: infoRes.userInfo.openId,
					nickname: infoRes.userInfo.nickName,
					pic: infoRes.userInfo.avatarUrl,
					gender: infoRes.userInfo.gender,
					usertype: 5,
					token: token
				}

				that.$store.dispatch('newlogin', {
					...parameter
				}).then(res => {
					console.log("返回的数据=", res.status)
					if (res.status === "1") {
						that.$ch.toast("登录成功");
						res.userinfo['nickname'] = infoRes.userInfo.nickName
						that.token = res.token //登录成功
						// that.saveInfo(res, token) //保存数据

						that.queryDataHttp(res, token)
					} else { //登录失败
						that.$ch.toast("该帐号无法登录该设备");
					}

				}).finally((e) => {
					uni.hideLoading()
				})
			},

			//小程序登录
			xcxLoginHttp(loginRes, infoRes) {
				var that = this
				var rawData = (infoRes.rawData);
				var signature = (infoRes.signature);
				var encryptedData = (infoRes.encryptedData);
				var iv = (infoRes.iv)
				//newurl = config.Host + 'user/userLogin?device=4' + config.Version + '&rawData=' + rawData + '&signature=' + signature + '&code=' + code + '&encryptedData=' + encryptedData + '&iv=' + iv + "&parent_id=" + mParent_id + '&' + v_type;
				let parameter = {
					device: 4,
					rawData: rawData,
					signature: signature,
					encryptedData: encryptedData,
					iv: iv,
					code: loginRes.code,
					systime: new Date().getTime(),
					v_type: ""
				}

				var newurl = 'https://yssjds.com/cloud-wxcx/user/userLogin?device=4' +
					'&version=V1.31&channel=68&app_id=wxc211367f634ba3e9' + '&rawData=' + rawData + '&signature=' +
					signature + '&code=' + loginRes.code + '&encryptedData=' + encryptedData + '&iv=' + iv + '&' +
					'v_type';
				let authkey = md5.hex_md5(newurl)
				let ii = new Buffer(authkey).toString('base64')

				uni.request({
					method: 'GET',
					url: 'https://yssjds.com/cloud-wxcx/user/userLogin',
					data: {
						device: 4,
						rawData: rawData,
						signature: signature,
						encryptedData: encryptedData,
						iv: iv,
						code: loginRes.code,
						systime: new Date().getTime(),
						v_type: "",
						version: "V1.31",
						channel: "68",
						app_id: "wxc211367f634ba3e9",
						I10o: ii,
						authKey: authkey.toUpperCase()
					},
					// 这里请求头配置请自己决定
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: function(res) {
						console.log("res=", res);
						if (res.statusCode == 200) {
							that.$ch.toast("登录成功");
							res.data.userinfo['nickname'] = res.data.userinfo['nickname'] + res.data.userinfo[
								'user_id']
							that.token = res.data.token //登录成功
							// that.saveInfo(res.data, loginRes.code) //保存数据

							that.queryDataHttp(res.data, loginRes.code)
						} else {
							that.$ch.toast("该帐号无法登录该设备");
						}
					}
				})
			},

			queryDataHttp(ress, code) {
				if (this.token) {
					this.$http.get(httpApi.queryData, {
						params: {
							type_data: "",
							tag_data: "",
							type_tag_data: "",
							supp_label_data: "",
							bool: true
						},
					}).then(res => {
						console.log("请求结果=", res)
						if (res.status === "1") {
							uni.setStorageSync(this.$config.storage.queryData, res)

							this.saveInfo(ress, code) //保存数据
						}
					})
				}
			},

			submitCodeHttp(loginRes, infoRes) {
				var that = this
				uni.request({
					method: 'GET',
					url: 'https://yssjds.com/cloud-wxcx/user/submitcode',
					data: {
						version: "V1.31",
						channel: "68",
						code: loginRes.code,
						app_id: 'wxc211367f634ba3e9'
					},
					// 这里请求头配置请自己决定
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: function(res) {
						console.log("我来了4=", res.data);
						that.xcxLoginHttp(loginRes, infoRes)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.base {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: white;
		overflow: hidden;
	}

	.scrollView {
		height: calc(100vh);
	}

	.head {
		width: auto;
		height: 932rpx;
		border-spacing: 20rpx;
		// border-bottom: 0.5px dashed gray;
	}

	.step {
		width: 100%;
		height: 584rpx;
		margin-top: 12rpx;
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;

		&-content1 {
			width: 100%;
			height: 396rpx;
			display: flex;
			justify-content: center;
			flex-direction: row;
			background-color: #FFFFFF;
			padding-top: 1px;

			&-child {
				width: 208rpx;
				height: 396rpx;
				display: flex;
				flex-direction: column;
				border-radius: 142rpx;
				box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, .2);

				image {
					width: 100%;
					height: 284rpx;
					background-color: #272424;
				}

				text {
					width: 200rpx;
					height: 40rpx;
					font-size: 28rpx;
					margin-top: 16rpx;
					text-align: center;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #272424;
					line-height: 40rpx;
				}
			}
		}

		&-content2 {
			width: 100%;
			height: 48rpx;
			display: flex;
			justify-content: center;
			flex-direction: row;
			position: absolute;
			margin-top: 368rpx;

			&-child {
				width: 208rpx;
				height: 100%;

				text {
					width: 116rpx;
					height: 48rpx;
					font-size: 40rpx;
					font-family: FZY4K--GBK1-0, FZY4K--GBK1;
					font-weight: 500;
					color: #272424;
					line-height: 48rpx;

					text {
						font-size: 40rpx;
						font-family: FZY4K--GBK1-0, FZY4K--GBK1;
						font-weight: 500;
						color: #EC3A76;
						margin-left: 8rpx;
					}
				}
			}
		}

		&-content0 {
			width: 100%;
			height: 460rpx;
		}

		&-content3 {
			width: 100%;
			height: 92rpx;
			display: flex;
			flex-direction: row;
			margin-top: 32rpx;

			&-view1 {
				flex: 1;
				display: flex;
				align-items: center;

				image {
					width: 48rpx;
					height: 48rpx;
					margin-left: 40rpx;
				}
			}

			&-view2 {
				flex: 3;

				button {
					width: 444rpx;
					height: 92rpx;
					background: #EC3A76;
					box-shadow: 0px 3px 7px 0px rgba(255, 25, 111, 0.36), 0px 2px 10px 0px rgba(95, 99, 105, 0.18);
					border-radius: 52rpx;
					border-width: 0px;
					font-size: 32rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #272424;
					line-height: 92rpx;
					text-shadow: 0px 6px 14px rgba(255, 25, 111, 0.36);
				}
			}

			&-view3 {
				flex: 1;

				image {
					width: 92rpx;
					height: 104rpx;
					float: right;
					display: flex;
					flex-direction: column;
					justify-content: center;
					margin-top: -6rpx;
				}
			}
		}
	}

	.popupView {
		width: 100%;
		height: 588rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		image {
			width: 202rpx;
			height: 62rpx;
			margin-top: 114rpx;
		}

		button {
			width: 444rpx;
			height: 92rpx;
			margin-top: 122rpx;
			background: #EC3A76;
			box-shadow: 0rpx 6rpx 14rpx 0rpx rgba(255, 25, 111, 0.36);
			border-width: 0px;
			border: none;
			border-radius: 52rpx;
			font-size: 28rpx;
			font-weight: 500;
			line-height: 46rpx;
			color: #272424;
			display: flex;
			text-align: center;
			align-items: center;
			justify-content: center;
		}

		button::after {
			border: none;
		}

		&_xieyi {
			width: 100%;
			height: 34rpx;
			margin-top: 48rpx;
			display: flex;
			flex-direction: row;
			justify-content: center;

			image {
				width: 32rpx;
				height: 32rpx;
				margin-top: 0;
				margin-right: 16rpx;
			}

			text {
				width: 432rpx;
				height: 34rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #858585;
				line-height: 34rpx;
			}
		}

	}

	.bottom {
		width: 100%;
		height: 68rpx;
		background-color: white;
	}
</style>