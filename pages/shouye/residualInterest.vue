<template>
	<view class="page">
		<view :class="insterest === 'Max' ? 'head_max' : 'head'" :style="{ backgroundColor: insterestInfo.color }">
			<view class="first">
				<text :class="insterest === 'Max' ? 'text_max' : 'text'">{{
          insterestInfo.lvName ? insterestInfo.lvName : "普通卡"
        }}</text>
			</view>
			<view class="second">
				<text :class="insterest === 'Max' ? 'text1_max' : 'text1'">剩余占卜次数:</text>
				<text class="text2"
					:style="{ color: insterest === 'Max' ? '#FF9224' : '#272424' }">{{ insterestInfo.number }}次</text>
			</view>
			<view class="three">
				<text :class="insterest === 'Max' ? 'text1_max' : 'text1'">剩余有效期:</text>
				<text class="text2"
					:style="{ color: insterest === 'Max' ? '#FF9224' : '#272424' }">{{ dateDiff(insterestInfo.endTime) }}天</text>
			</view>
		</view>

		<RightsView :rightsShow="rightsShow" :rightsType="rightsType"></RightsView>
	</view>
</template>

<script>
	import httpApi from "@/api/aili/index.js";
	import Api from "@/utils/api.js";
	import pp from "@/utils/public.js";
	import RightsView from "@/components/rightsView/rightsView.vue";
	export default {
		components: {
			RightsView,
		},
		data() {
			return {
				insterest: "",
				insterestInfo: {},
				rightsShow: true,
				rightsType: 2,
			};
		},
		onLoad() {
			// this.getList();
			this.getLvInfo();
		},
		methods: {
			getList() {
				console.log("api=", httpApi.userLvInfo);
				this.$http.get(httpApi.userLvInfo).then((res) => {
					console.log("请求结果=", res);
					if (res.status === "1") {
						this.insterest = res.detail.lvName;
						this.insterestInfo = res.detail;

						this.getInsterestInfo();
					}
				});
			},
			getLvInfo() {
				pp.getInstence(this).then((res) => {
					console.log("insterest=", res);
					if (res && res.detail) {
						this.insterest = res.detail["lvName"];
						this.insterestInfo = res.detail;
						this.getInsterestInfo();

						//次数不足提示购买
						if (this.insterestInfo.number <= 0) {
							this.rightsShow = true;
							this.rightsType = 2;
						}
					}
				});
			},
			getInsterestInfo() {
				if (this.insterest == "Plus") {
					this.insterestInfo.icon = "../../static/plus@2x.png";
					this.insterestInfo.color = "#ccfff5";
				} else if (this.insterest == "Pro") {
					this.insterestInfo.icon = "../../static/pro@2x.png";
					this.insterestInfo.color = "#ccfff5";
				} else if (this.insterest == "Max") {
					this.insterestInfo.icon = "../../static/max@2x.png";
					this.insterestInfo.color = "#ccfff5";
				}
			},

			dateDiff(sDate) {
				console.log("当前时间=", new Date().getTime());
				console.log("结束时间=", new Date(sDate).getTime());

				var iDays = 0;
				var currentDate = new Date();
				var lastDate = new Date(sDate);
				if (lastDate.getTime() > currentDate.getTime()) {
					iDays = Math.ceil(
						(lastDate.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24
					);
				}
				return iDays;
			},

			getIcon(lvName) {
				let icon = "";
				if (lvName === "Pro") {
					icon = "../../static/pro@2x.png";
				} else if (lvName === "Plus") {
					icon = "../../static/plus@2x.png";
				} else if (lvName === "Max") {
					icon = "../../static/max@2x.png";
				}
				return icon;
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
		background-color: #fff;
	}

	.head {
		width: 670rpx;
		height: 262rpx;
		margin-top: 32rpx;
		box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(95, 99, 105, 0.18);
		border-radius: 40rpx;
		border: 3rpx solid rgba(0, 0, 0, 0.05);
	}

	.head_max {
		width: 718rpx;
		height: 310rpx;
		margin-top: 12rpx;
		background-image: url("https://img.yifuapp.wang/img/base_max@2x.png");
		background-repeat: no-repeat; //将图片样式不重复
		background-size: 100% 100%;
	}

	.first {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 30rpx;
		margin-left: 28rpx;

		.text_max {
			width: 144rpx;
			height: 36rpx;
			font-size: 34rpx;
			font-family: AlimamaFangYuanTiVF-Bold-Square, AlimamaFangYuanTiVF-Bold;
			font-weight: bold;
			color: #ff9224;
			line-height: 36rpx;
			margin-left: 24rpx;
			margin-top: 20rpx;
		}

		.text {
			width: 144rpx;
			height: 36rpx;
			font-size: 34rpx;
			font-family: AlimamaFangYuanTiVF-Bold-Square, AlimamaFangYuanTiVF-Bold;
			font-weight: bold;
			color: #272424;
			line-height: 36rpx;
		}

		.img_max {
			width: 90rpx;
			height: 40rpx;
			margin-left: 20rpx;
			margin-top: 20rpx;
			display: flex;
			align-items: center;
		}

		.img {
			width: 90rpx;
			height: 40rpx;
			margin-left: 20rpx;
			display: flex;
			align-items: center;
		}

		.img_pro {
			width: 78rpx;
			height: 40rpx;
			margin-left: 20rpx;
		}

		.img_plus {
			width: 90rpx;
			height: 40rpx;
			margin-left: 20rpx;
		}

		.img_max {
			width: 92rpx;
			height: 40rpx;
			margin-left: 20rpx;
			margin-top: 20rpx;
		}
	}

	.second {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 50rpx;
		margin-left: 28rpx;

		.text1_max {
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #ff9224;
			line-height: 40rpx;
			margin-left: 24rpx;
		}

		.text1 {
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #272424;
			line-height: 40rpx;
		}

		.text2 {
			width: auto;
			height: 44rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #272424;
			line-height: 44rpx;
			margin-left: 28rpx;
		}
	}

	.three {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 32rpx;
		margin-left: 28rpx;

		.text1_max {
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #ff9224;
			line-height: 40rpx;
			margin-left: 24rpx;
		}

		.text1 {
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #272424;
			line-height: 40rpx;
		}

		.text2 {
			width: auto;
			height: 44rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #272424;
			line-height: 44rpx;
			margin-left: 28rpx;
		}
	}
</style>