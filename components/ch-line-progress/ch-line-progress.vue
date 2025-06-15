<template>
	<view>
		<view class="line-custom-progress" :style="wrapStyle">
			<view class="lineProgress" :style="[lineStyle, 'width:'+width]" ></view>
			<slot name="linetips"></slot>
			<!-- <view class="zh-flex progressTips">
				<view>{{item.order}}工单</view>
				<view>{{item.value}}%达标率</view>
			</view> -->
		</view>
	</view>

</template>

<script>
	export default {
		name:"zh-line-progress",
		props:{
			height: {
				type: Number,
				default: 42
			},
			progress: {
				type: Number,
				default: 0
			},
			lineColor: {
				type: String,
				default: "#1a80df"
			},
			bgColor: {
				type: String,
				default: "#45474b"
			}
		},
		computed: {
			wrapStyle: function(){
				let h = this.height + 'upx';
				return {
					height: h,
					backgroundColor: this.bgColor,
					borderTopRightRadius: h,
					borderBottomRightRadius: h,

				}
			},
			lineStyle: function(){
				let h = this.height + 'upx';
				return {
					height: h,
					backgroundColor: this.lineColor,
					borderTopRightRadius: h,
					borderBottomRightRadius: h,
					width: this.width+'%'

				}
			}
		},
		data() {
			return {
				width: 0
			};
		},
		mounted() {
			uni.$u.sleep(1000).then(() => {
				this.width = this.progress
			})
		}
	}
</script>

<style lang="scss" scoped>
.line-custom-progress{
	width: 100%;
	// height: 42upx;
	// background-color: $zh-deepPrimary;
	// border-top-right-radius: 42upx;
	// border-bottom-right-radius: 42upx;
	overflow: hidden;
	position: relative;
	.lineProgress{
		position: absolute;
		width: 0%;
		// height: 42upx;
		left: 0;
		top: 0;
		// border-top-right-radius: 42upx;
		// border-bottom-right-radius: 42upx;
		@include trans-ition(width 1s);
		z-index: 1;
	}
	// .progressTips{
	// 	position: relative;
	// 	z-index: 10;
	// 	font-size: 25upx;
	// 	color: $uni-bg-color;
	// 	padding-left: 20upx;
	// 	view:first-child{
	// 		margin-right: 24upx;
	// 	}
	// }
}
</style>
