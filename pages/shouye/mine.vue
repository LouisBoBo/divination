<template>
	<view class="page">
		<view class="head">
			<image class="headImage" :src="headImage"></image>
			<text class="headMark">{{ insterest }}</text>
		</view>
		<view class="mineContent">
			<view class="itemView" v-for="item in list" :key="item.title" @click="itemClick(item)">
				<view class="itemView_left">
					<image class="title_img" :src="item.icon"></image>
					<view class="title_txt">{{ item.title }}</view>
				</view>
				<view class="itemView_right">
					<u-icon class="icon" name="arrow-right" color="#858585" width="24rpx" height="24rpx"></u-icon>
				</view>
			</view>
		</view>
		<view class="modal">
			<u-modal :show="show" :showCancelButton="true" @cancel="show = false" @close="show = false"
				@confirm="confirm" ref="uModal" :asyncClose="true" :closeOnClickOverlay="true">
				<view class="slot-content">
					<rich-text nodes="确定退出账号"></rich-text>
				</view>
			</u-modal>
		</view>
	</view>
</template>

<script>
	import Api from "@/utils/api.js";
	import httpApi from "@/api/aili/index.js";
	import pp from "@/utils/public.js";
	export default {
		data() {
			return {
				sex: 2, //0其他 1男 2女
				insterest: "",
				userInfo: {},
				list: [{
						path: "/pages/shouye/residualInterest",
						icon: "../../static/my_rights.png",
						title: "我的权益",
					},
					{
						path: "",
						icon: "../../static/change_picture.png",
						title: "修改头像",
					},
					{
						path: "",
						icon: "../../static/login_out.png",
						title: "退出登录",
					},
				],
				show: false,
			};
		},
		computed: {
			headImage() {
				if (this.userInfo.pic) {
					return this.userInfo.pic
				}
				if (this.sex === 1) {
					return "../../static/icon_boy@2x.png";
				} else {
					return "../../static/icon_girl@2x.png";
				}
			},
			headMark() {
				if (this.insterest === "Max") {
					return "../../static/max@2x.png";
				} else if (this.insterest === "Plus") {
					return "../../static/plus@2x.png";
				} else {
					return "../../static/pro@2x.png";
				}
			},
		},
		onShow() {
			this.token = uni.getStorageSync(this.$config.storage.token);
			if (this.token) {
				this.getUserInfo()
				this.getLvInfo();
			} else {
				uni.switchTab({
					url: "/pages/shouye/message",
				});
			}
		},
		onLoad() {
			// 开启小程序原生右上角分享按钮
			uni.showShareMenu({
				// https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html
				withShareTicket: true,
				menus: ["shareAppMessage", "shareTimeline"], //开启转发好友和转发朋友圈按钮
			});
		},
		methods: {
			itemClick(item) {
				if (item.title === "退出登录") {
					this.show = true;
				} else {
					this.$nav.to(item.path);
				}
			},
			confirm() {
				console.log("退出登录");
				this.loginoutHttp();
			},
			//清除数据
			clearInfo() {
				console.log("清除存储数据");
				uni.setStorageSync(this.$config.storage.token, null);
				uni.setStorageSync(this.$config.storage.userInfo, null);
				uni.setStorageSync(this.$config.storage.jobCount, null);
				uni.setStorageSync(this.$config.storage.code, null);
			},

			getUserInfo() {
				this.userInfo = uni.getStorageSync(this.$config.storage.userInfo)
				this.sex = this.userInfo["gender"];
			},
			getLvInfo() {
				pp.getInstence(this).then((res) => {
					console.log("insterest=", res);
					if (res && res.detail) {
						this.insterest = res.detail["lvName"];
					}
				});
			},
			loginoutHttp() {
				this.$store
					.dispatch("newloginout", {})
					.then((res) => {
						console.log("返回的数据=", res.status);
						if (res.status === "1") {
							this.clearInfo();

							uni.switchTab({
								url: "/pages/shouye/message",
							});
						}
					})
					.finally(() => {
						this.show = false;
					});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.page {
		width: 100%;
		height: calc(100vh);
		display: flex;
		flex-direction: column;
		align-items: center;
		// background-color: #fff;
		background: linear-gradient(133deg, #ccfff5 0%, #ffffff 100%);
		position: relative;

		.head {
			position: absolute;
			top: 140rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.headImage {
				width: 152rpx;
				height: 152rpx;
				border-radius: 8px;
				left: auto;
				right: auto;
				z-index: 0;
			}

			.headMark {
				width: 88rpx;
				height: 48rpx;
				margin-top: -20rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background: linear-gradient(133deg, #29d35c 0%, #72f1ff 100%);
				border-radius: 24rpx 24rpx 24rpx 24rpx;
				border: 2rpx solid rgba(255, 255, 255, 0.6);
				color: white;
				font-size: 24rpx;
				z-index: 1;
			}
		}

		.mineContent {
			width: 100%;
			height: 100%;
			margin-top: 238rpx;
			padding-top: 140rpx;
			border-radius: 60rpx 60rpx 0rpx 0rpx;
			background-color: #ffffff;

			.itemView {
				height: 112rpx;
				margin-left: 40rpx;
				margin-right: 40rpx;
				border-bottom: 2rpx solid #f0f0f0;

				&_left {
					height: 100%;
					float: left;
					display: flex;
					flex-direction: row;
					align-items: center;
				}

				&_right {
					height: 100%;
					float: right;
					display: flex;
					flex-direction: row;
					align-items: center;
				}
			}

			.cell {
				height: 112rpx;
				width: 100vw;
				display: flex;
				justify-content: center;
				padding: 0;
				margin: 0;
				border-bottom: 1rpx solid #f3f3f3;
			}

			.title {
				display: flex;
				flex-direction: row;
				align-items: center;
			}

			.title_img {
				height: 48rpx;
				width: 48rpx;
				margin-right: 16rpx;
			}

			.title_txt {
				font-size: 28rpx;
			}

			.icon {
				width: 12rpx;
				height: 24rpx;
				display: flex;
				float: right;
				padding: 10rpx;
				color: #858585;
			}
		}
	}
</style>