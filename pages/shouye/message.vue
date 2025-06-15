<template>
	<view>
		<div id="app">
			<ChatWindow ref="chatWindow" @notNumber="notNumber" @unlogin="loginShow = true" />
		</div>
		<view>
			<view v-if="token">
				<RightsView :rightsShow="rightsShow" :rightsType="rightsType"></RightsView>
			</view>

			<u-popup :show="loginShow" :round="20" mode="bottom" @close="loginShow = false" @open="open">
				<view class="popupView">
					<button :plain="false" style="color: #ffffff" @click="loginClick">
						微信登录
					</button>
					<view class="popupView_xieyi">
						<image @click="selectClick" :src="
                xieyiSelect
                  ? '../../static/select@2x.png'
                  : '../../static/unselect.png'
              ">
						</image>
						<text>我同意《用户服务协议》和《隐私政策》</text>
					</view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	import ChatWindow from "@/components/chatWindow/chatWindow.vue";
	import RightsView from "@/components/rightsView/rightsView.vue";
	import md5 from "@/utils/md5.js";
	import Api from "@/api/luna/index.js";
	import Config from "@/config";
	export default {
		components: {
			ChatWindow,
			RightsView,
		},
		data() {
			return {
				loginShow: false,
				rightsShow: false,
				rightsType: 2, //1第一次购买 2、续购买
				xieyiSelect: false,
				token: null,
			};
		},

		created() {},

		onload() {
			
		},

		onShow() {
			this.checkLogin();
		},
		mounted() {
			const query = this.$route.query;
			if (query) {
				// 处理微信授权回调
				const code = query.code;
				const state = query.state;
				const savedState = uni.getStorageSync("wx_state");
				if (code && state) {
					debugger;
					this.submitCodeHttp(code);
				} else if (code) {
					console.error("CSRF攻击，state不匹配");
				}

				//支付宝支付回调
				if (query.trade_status === "TRADE_SUCCESS") {
					this.payStatus = "success";
				}
			}

			this.checkLogin();
		},

		beforeDestroy() {
			this.clearTimer();
		},

		methods: {
			checkLogin() {
				this.token = uni.getStorageSync(this.$config.storage.token);
				if ((!this.token || this.token == "")&& this.loginShow === false) {
					this.loginShow = true;
				} else {
					this.$refs.chatWindow.initSEE(true);
				}
			},

			selectClick() {
				this.xieyiSelect = !this.xieyiSelect;
			},

			//微信登录
			loginClick() {
				if (!this.xieyiSelect) {
					this.$ch.toast("请先勾选协议");
					return;
				}

				// 判断当前环境，动态设置回调域名
				const isLocal =
					window.location.origin.includes("192.168.") ||
					window.location.origin.includes("localhost");
				const redirectHost = isLocal ?
					"https://aafb-240e-3ba-348b-7d30-dc43-6770-9658-a80a.ngrok-free.app/" :
					Config.baseURl; // 替换为你的正式域名

				const redirectPath = isLocal ? "#/pages/shouye/message" : "luna.html#/pages/shouye/message";
				const redirectUri = encodeURIComponent(`${redirectHost}${redirectPath}`);
				const state =
					Math.random().toString(36).substr(2, 15) + Date.now().toString(36); // 建议随机生成防CSRF
				uni.setStorageSync("wx_state", state); // 替换 localStorage

				const scope = "snsapi_userinfo";

				const authUrl =
					`https://open.weixin.qq.com/connect/qrconnect?appid=${Config.appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;

				// const authUrl =
				// 	`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${Config.appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;

				window.location.href = authUrl;
			},

			// 处理微信登录回调
			async submitCodeHttp(code) {
				console.log("我来过了code=", code);
				var that = this;
				uni.request({
					method: "GET",
					url: Api.submitCode,
					data: {
						version: "V1.31",
						channel: "68",
						code: code,
						app_id: Config.appId,
					},
					// 这里请求头配置请自己决定
					header: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					success: function(res) {
						console.log("我来了4=", res.data);
						if (res.data.status == "1") {
							that.xcxLoginHttp(code);
						}
					},
				});
			},

			//H5登录
			async xcxLoginHttp(code) {
				var that = this;
				var newurl =
					Config.baseURl +
					"/cloud-wxcx/user/userLogin?device=4" +
					"&version=V1.31&channel=68&app_id=" +
					Config.appId +
					"&code=" +
					code +
					"&v_type";
				let authkey = md5.hex_md5(newurl);
				let ii = new Buffer(authkey).toString("base64");

				console.log("当前时间2222222=", new Date());

				uni.request({
					method: "GET",
					url: Api.login,
					data: {
						device: 4,
						code: code,
						systime: new Date().getTime(),
						v_type: "",
						version: "V1.31",
						channel: "68",
						app_id: Config.appId,
						I10o: ii,
						authKey: authkey.toUpperCase(),
					},
					// 这里请求头配置请自己决定
					header: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					success: (res) => {
						console.log("res=", res);
						if (res.statusCode == 200 && res.data.status == "1") {
							this.$ch.toast("登录成功");
							res.data.userinfo["nickname"] =
								res.data.userinfo["nickname"] + res.data.userinfo["user_id"];
							this.token = res.data.token; //登录成功
							this.loginShow = false;

							this.saveInfo(res.data, code);
							
							this.$refs.chatWindow.getHisttory();
							this.$refs.chatWindow.initSEE(false);
						} else {
							this.$ch.toast("该帐号无法登录该设备");
						}
					},
				});
			},

			//保存数据
			saveInfo(res, code) {
				uni.setStorageSync(this.$config.storage.token, res.token);
				uni.setStorageSync(this.$config.storage.userInfo, res.userinfo);
				uni.setStorageSync(this.$config.storage.code, code);

				this.$store.commit("setToken", res.token);
				this.$store.commit("setUserInfo", res.userinfo);
			},

			//次数不足
			notNumber(number) {
				this.rightsShow = true;
				this.rightsType = number;
			},
		},
	};
</script>

<style lang="scss" scoped>
	body {
		margin: 0;
		padding: 0;
		background: greenyellow;
		height: 100vh;
	}

	.popupView {
		width: 100%;
		height: 332rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		image {
			width: 202rpx;
			height: 62rpx;
			margin-top: 114rpx;
		}

		button {
			width: 536rpx;
			height: 104rpx;
			margin-top: 88rpx;
			background: #59b143;
			border-width: 0px;
			border: none;
			border-radius: 36rpx;
			font-size: 32rpx;
			font-weight: 500;
			line-height: 104rpx;
			color: #ffffff;
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
</style>