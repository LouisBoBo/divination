<template>
	<view>
		<u-popup :show="rightsShow && rightsType == 1" :round="20" mode="bottom" @close="rightsShow = false"
			@open="open">
			<view class="rightsPopupView">
				<view class="rightsPopupView_title">请选择您的权益</view>
				<view class="rightsPopupView_head">
					<view class="cardList">
						<view :class="rightIndex == 1 ? 'card_select' : 'card'" @click="rightClick(1)">
							<view class="content1">
								<view>占卜</view>
								<view>{{ gptLvList[0].number }}次</view>
							</view>
							<view class="content2">￥<text style="font-size: 44rpx; font-weight: 600">{{
                  gptLvList[0].price
                }}</text>
							</view>
							<view class="content3">
								均价￥{{
                  getprePrice(gptLvList[0].price, gptLvList[0].number)
                }}/次
							</view>
						</view>
						<view :class="rightIndex == 2 ? 'card_select' : 'card'" @click="rightClick(2)">
							<view class="content1">
								<view>月卡</view>
								<view>
									<text style="color: #ff5029">{{ gptLvList[1].number }}次</text>占卜
								</view>
							</view>
							<view class="content2">￥<text style="font-size: 44rpx; font-weight: 600">{{
                  gptLvList[1].price
                }}</text>
							</view>
							<view class="content3">
								均价￥{{
                  getprePrice(gptLvList[1].price, gptLvList[1].number)
                }}/次
							</view>
						</view>
						<view :class="rightIndex == 3 ? 'card_select' : 'card'" @click="rightClick(3)">
							<view class="content1">
								<view>年卡</view>
								<view>
									<text style="color: #ff5029">{{ gptLvList[2].number }}次</text>占卜
								</view>
							</view>
							<view class="content2">￥<text style="font-size: 44rpx; font-weight: 600">
									{{ gptLvList[2].price }}</text>
							</view>
							<view class="content3">
								均价￥{{
                  getprePrice(gptLvList[2].price, gptLvList[2].number)
                }}/次
							</view>
						</view>
					</view>
				</view>
				<view class="rightsPopupView_text">
					<text>Luna老师可以为您占卜:<text style="color: #ff5029">感情；复合；事业；财运；寻物；解梦；重大决策；每日运势</text>等各种问题</text>
				</view>
				<button :plain="false" style="background-color: #60b45a" @click="wxPayClick">
					<image style="
              height: 48rpx;
              width: 48rpx;
              margin-top: -6rpx;
              margin-right: 16rpx;
            " src="@/static/pay_wx.png"></image>
					<text>微信支付</text>
				</button>
				<button :plain="false" style="background-color: #3a7eec" @click="zfbPayClick">
					<image style="
              height: 48rpx;
              width: 48rpx;
              margin-top: -6rpx;
              margin-right: 16rpx;
            " src="@/static/pay_zfb.png"></image>
					<text>支付宝支付</text>
				</button>
			</view>
		</u-popup>

		<u-popup :show="rightsShow && rightsType == 2" :round="20" mode="bottom" @close="rightsShow = false"
			@open="open">
			<view class="rightsPopupView" style="height: 840rpx">
				<view class="rightsPopupView_title">你本日的占卜次数已用完</view>
				<view class="rightsPopupView_head">
					<view class="cardList">
						<view :class="rightIndex == 1 ? 'card_select' : 'card'" @click="rightClick(1)">
							<view class="content1">
								<view>继续占卜</view>
								<view>1次</view>
							</view>
							<view class="content2">￥<text style="font-size: 44rpx; font-weight: 600">4.9</text>
							</view>
							<view class="content3" style="text-decoration: line-through">原价￥9.9</view>
						</view>
						<view :class="rightIndex == 2 ? 'card_select' : 'card'" @click="rightClick(2)">
							<view class="content1">
								<view>继续占卜</view>
								<view>2次</view>
							</view>
							<view class="content2">￥<text style="font-size: 44rpx; font-weight: 600">9.9</text>
							</view>
							<view class="content3" style="text-decoration: line-through">原价￥19.9</view>
						</view>
						<view :class="rightIndex == 3 ? 'card_select' : 'card'" @click="rightClick(3)">
							<view class="content1">
								<view>年卡</view>
								<view>
									<text style="color: #ff5029">{{ gptLvList[2].number }}次</text>占卜
								</view>
							</view>
							<view class="content2">￥<text style="font-size: 44rpx; font-weight: 600">{{
                  gptLvList[2].price
                }}</text>
							</view>
							<view class="content3">
								均价￥{{
                  getprePrice(gptLvList[2].price, gptLvList[2].number)
                }}/次
							</view>
						</view>
					</view>
				</view>
				<view class="countdown">{{ formattedTime }}</view>
				<button :plain="false" style="background-color: #60b45a; margin-top: 16rpx" @click="loginClick">
					<image style="
              height: 48rpx;
              width: 48rpx;
              margin-top: -6rpx;
              margin-right: 16rpx;
            " src="@/static/pay_wx.png"></image>
					<text>微信支付</text>
				</button>
				<button :plain="false" style="background-color: #3a7eec" @click="loginClick">
					<image style="
              height: 48rpx;
              width: 48rpx;
              margin-top: -6rpx;
              margin-right: 16rpx;
            " src="@/static/pay_zfb.png"></image>
					<text>支付宝支付</text>
				</button>

				<view class="rightsPopupView_text">
					<text>Luna老师可以为您占卜:<text style="color: #ff5029">感情；复合；事业；财运；寻物；解梦；重大决策；每日运势</text>等各种问题</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>
<script>
	import Api from "@/api/luna/index.js";
	export default {
		name: "rightsView",
		props: {
			rightsShow: {
				type: Boolean,
				default: false,
			},
			rightsType: {
				ttype: Number,
				default: 1,
			},
			rightIndex: {
				type: Number,
				default: 1,
			},
		},
		data() {
			return {
				gptLvList: [],
				timeLeft: 3600, // 单位：秒（1小时=3600秒）
				timer: null,
			};
		},
		mounted() {
			this.getGptLvList();
			if (this.rightsType == 2) {
				this.startTimer();
			}
		},
		beforeDestory() {
			this.clearTimer();
		},
		computed: {
			// 将秒数转换为时分秒格式
			formattedTime() {
				const hours = Math.floor(this.timeLeft / 3600);
				const minutes = Math.floor((this.timeLeft % 3600) / 60);
				const seconds = this.timeLeft % 60;

				// 补零函数
				const pad = (n) => n.toString().padStart(2, "0");

				return `限时优惠 ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
			},
		},
		methods: {
			open() {
				this.$emit("open");
			},
			rightClick(index) {
				this.rightIndex = index;
			},

			// 帐户等级列表
			getGptLvList() {
				this.$http
					.get(Api.gptlvList, {
						params: {
							overlayed: 0,
						},
					})
					.then((res) => {
						console.log("请求结果=", res);
						if (res.status === "1") {
							this.gptLvList = res.list;
							this.rightIndex = res.list[0].id; // 默认选中第一个
						}
					});
			},

			//微信支付 获取订单号
			async wxPayClick() {
				this.$http
					.get(Api.gptLvAdd, {
						params: {
							id: this.rightIndex,
						},
					})
					.then((res) => {
						console.log("请求结果=", res);
						if (res.status === "1") {
							debugger
							console.log("支付请求成功，准备跳转到微信支付");
							this.createPayOrder(res.detail.orderCode);
						}
					});
			},

			//聚合下单
			createPayOrder(orderNumber) {
				// 调用后台接口，获取生成商户订单参数
				this.$http.post(Api.gptOrder, {
						// params: {
						method: "web",
						out_trade_no: orderNumber,
						device: "mobile",
						type: "wxpay",
						return_url: "http://www.pay.com/return_url.php",
						param: "",
						auth_code: "",
						// },
					})
					.then((res) => {
						console.log("请求订单结果=", res);
						var that = this;
						if (res.status === "1") {
							let payInfo = that.getPayInfo(res.xml);
							console.log("请求订单结果=", payInfo);
							// if (payInfo) {
							// 	that.wxPay(payInfo);
							// }
						}
					});
			},

			/*
			 * 生成订单信息
			 * @params orderInfo: any 后端返回的数据，格式和上面一样
			 */
			getPayInfo(orderInfo) {
				console.log("进来了111", orderInfo);
				const res = orderInfo; // 统一下单返回数据
				const time = new Date();
				const timestamp = time.getTime().toString().substr(0, 10); // 时间戳
				const noncestr = this.randomSrt(true, 10, 20); // 随机数
				const key = "B9CB71EC2BAE087D0B9A37BDFABD328D"; // 加密Key，微信支付填写的key
				const payInfo = {
					appid: res.appid,
					noncestr: noncestr,
					package: "Sign=WXPay",
					partnerid: res["mch_id"],
					prepayid: res["prepay_id"],
					timestamp: Number(timestamp),
				};

				// 键值对按照ASCII码从小到大排序生成类似：appid=xxx&body=xx&device_info=1000
				let keyValueStr = this.mapObjToKeyValue(payInfo, true);
				// 插入加密Key到最后
				let strSignTemp = `${keyValueStr}&key=${key}`;
				console.log("进来了444");
				// 真正的二次加密
				let sign = md5.hex_md5(strSignTemp).toUpperCase().substr(0, 32);
				console.log(sign); // 可以去微信支付文档做校验
				payInfo.sign = sign;
				// 返回字符串给uniapp调起支付用
				return payInfo;
			},

			/*
			 * 生成指定的随机字符串
			 * @params isRandomLength: boolean 是否在min ~ max生成随机长度
			 * @params min: number 最小长度
			 * @params max: number 最大长度
			 */
			randomSrt(isRandomLength, min, max) {
				console.log("进来了222");
				let str = "";
				let range = min;
				const arr = [
					"0",
					"1",
					"2",
					"3",
					"4",
					"5",
					"6",
					"7",
					"8",
					"9",
					"a",
					"b",
					"c",
					"d",
					"e",
					"f",
					"g",
					"h",
					"i",
					"j",
					"k",
					"l",
					"m",
					"n",
					"o",
					"p",
					"q",
					"r",
					"s",
					"t",
					"u",
					"v",
					"w",
					"x",
					"y",
					"z",
					"A",
					"B",
					"C",
					"D",
					"E",
					"F",
					"G",
					"H",
					"I",
					"J",
					"K",
					"L",
					"M",
					"N",
					"O",
					"P",
					"Q",
					"R",
					"S",
					"T",
					"U",
					"V",
					"W",
					"X",
					"Y",
					"Z",
				];

				// 随机产生
				if (isRandomLength) {
					range = Math.round(Math.random() * (max - min)) + min;
				}
				for (var i = 0; i < range; i++) {
					let pos = Math.round(Math.random() * (arr.length - 1));
					str += arr[pos];
				}

				return str;
			},

			/*
			 * 根据object生成key value字符串
			 * @params obj: any 要map的对象
			 * @params isSort: boolean 是否根据ASCII字典排序
			 */
			mapObjToKeyValue(obj, isSort = false) {
				console.log("进来了333");
				let keys = Object.keys(obj);
				let str = "";

				if (isSort) keys.sort();
				keys.forEach((key) => {
					if (obj.hasOwnProperty(key)) {
						str += `${key}=${obj[key]}&`;
					}
				});
				return str.replace(/&$/, "");
			},

			async wxPay() {
				try {
					// 1. 获取后端返回的支付链接
					const res = await this.$axios.post("/api/create-order", {
						amount: 100,
						productId: "123",
					});

					// 2. 获取微信支付跳转链接
					const mwebUrl = res.data.mweb_url;

					// 3. 处理 iOS/Android 兼容性问题
					const ua = navigator.userAgent;
					if (ua.indexOf("MicroMessenger") === -1) {
						alert("请在微信客户端打开");
						return;
					}

					// 4. 跳转到微信支付页面
					if (ua.match(/iPhone|iPod|iPad/i)) {
						window.location.href =
							mwebUrl +
							"&redirect_url=" +
							encodeURIComponent(window.location.href);
					} else {
						window.location.href = mwebUrl;
					}

					// 5. 监听支付结果（通过轮询或WebSocket）
					this.checkPaymentStatus();
				} catch (error) {
					console.error("支付失败:", error);
				}
			},
			async checkPaymentStatus() {
				// 轮询后端查询支付状态
				const timer = setInterval(async () => {
					const res = await this.$axios.get(
						`/api/order-status?orderId=ORDER_123`
					);
					if (res.data.status === "paid") {
						clearInterval(timer);
						this.$router.push("/pay-success");
					}
				}, 2000);
			},

			//支付宝支付
			async zfbPayClick() {
				try {
					const res = await axios.post("/api/create-payment");
					this.submitAlipayForm(res.data.data);
				} catch (err) {
					console.error("支付失败:", err);
				}
			},

			submitAlipayForm(formParams) {
				const form = document.createElement("form");
				form.method = "POST";
				form.action = "https://openapi.alipaydev.com/gateway.do"; // 沙箱地址

				Object.keys(formParams).forEach((key) => {
					const input = document.createElement("input");
					input.type = "hidden";
					input.name = key;
					input.value = formParams[key];
					form.appendChild(input);
				});

				document.body.appendChild(form);
				form.submit();
			},

			getprePrice(price, number) {
				// 如果价格或数量为0，则返回0
				if (price === 0 || number === 0) {
					return "0.00";
				}
				// 计算价格
				return (price / number).toFixed(1);
			},

			startTimer() {
				this.timer = setInterval(() => {
					if (this.timeLeft > 0) {
						this.timeLeft--;
					} else {
						this.clearTimer();
						this.$emit("time-end"); // 触发结束事件
					}
				}, 1000);
			},

			clearTimer() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.rightsPopupView {
		width: 100%;
		height: 816rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		image {
			width: 202rpx;
			height: 62rpx;
			margin-top: 114rpx;
		}

		button {
			width: 686rpx;
			height: 104rpx;
			display: flex;
			flex-direction: row;
			margin-top: 32rpx;
			background: #59b143;
			border-width: 0px;
			border: none;
			border-radius: 36rpx;
			font-size: 32rpx;
			font-weight: 500;
			line-height: 104rpx;
			color: #ffffff;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		button::after {
			border: none;
		}

		&_title {
			width: 400rpx;
			height: 84rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: bold;
			font-size: 32rpx;
			color: #354764;
			line-height: 84rpx;
			text-align: center;
			justify-content: center;
			font-style: normal;
			text-transform: none;
			margin-top: 32rpx;
		}

		&_text {
			width: 100%;
			height: 88rpx;
			margin-top: 32rpx;
			display: flex;
			flex-direction: row;
			justify-content: center;

			text {
				width: 686rpx;
				height: 100%;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 26rpx;
				color: #929292;
				line-height: 44rpx;
				text-align: center;
				font-style: normal;
				text-transform: none;
			}
		}

		&_head {
			width: 100%;
			height: 236rpx;
			margin-top: 16rpx;

			.cardList {
				flex: 1;
				height: 100%;
				padding: 0 32rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
			}

			.card_select {
				width: 208rpx;
				height: 100%;
				border-radius: 24rpx 24rpx 24rpx 24rpx;
				display: flex;
				flex-direction: column;
				background-image: url("@/static/rights_bg.png");
				background-repeat: no-repeat; //将图片样式不重复
				background-size: 100% 100%;
			}

			.card {
				width: 208rpx;
				height: 100%;
				background: #f3f4f9;
				border-radius: 24rpx 24rpx 24rpx 24rpx;
				display: flex;
				flex-direction: column;
			}

			.content1 {
				width: 150rpx;
				height: 80rpx;
				margin-top: 20rpx;
				margin-left: 24rpx;
				font-family: Alimama FangYuanTi VF-Bold, Alimama FangYuanTi VF-Bold;
				font-weight: 600;
				font-size: 28rpx;
				color: #354764;
				line-height: 40rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}

			.content2 {
				width: 156rpx;
				height: 40rpx;
				margin-top: 20rpx;
				margin-left: 24rpx;
				font-family: Alimama FangYuanTi VF-SemiBold,
					Alimama FangYuanTi VF-SemiBold;
				font-weight: normal;
				font-size: 28rpx;
				color: #59b143;
				line-height: 40rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}

			.content3 {
				width: 144rpx;
				height: 40rpx;
				margin-top: 12rpx;
				margin-left: 24rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 24rpx;
				color: #686868;
				line-height: 40rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}
		}
	}

	.countdown {
		width: 686rpx;
		height: 44rpx;
		font-family: PingFang SC, PingFang SC;
		font-weight: 400;
		font-size: 26rpx;
		color: #59b143;
		line-height: 44rpx;
		text-align: center;
		font-style: normal;
		text-transform: none;
		margin-top: 16rpx;
	}
</style>