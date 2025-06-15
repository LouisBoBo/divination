<template>
	<view class="ch-title ch-flex" :style="styles">
		<view class="ch-flex-1">
			<view class="ch-title-content">
                <view class="line" :style="'background-color:' + this.linecolor"></view>{{title}}
            </view>
		</view>
		<slot name="right"></slot>
	</view>
</template>

<script>
import Config from "@/config"
	export default {
		name:"zh-title",
		props:{
			title:{
				type:String,
				default(){
					return ""
				}
			},
            linecolor: {
              type: String,
              default: Config.color.primary
            },
			size:{
				type: String ,
				default:"13px"
			},
			color:{
				type:String,
				default: "#2b2d30"
			},
			weight:{
				type:Boolean,
				default:false
			}
		},
		computed:{
			styles: function(){
				return {
					fontSize: this.size,
					color: this.color,
					fontWeight: this.weight ? 600 : 'normal'
				}
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
.ch-title{
	//padding-left: 24upx;
	color: #333;
	justify-content: center;
	align-items: center;
	.ch-title-content{
		position: relative;
		line-height: 1;
		 padding-left: 14upx;
	}
	.line{
		position: absolute;
		content: "";
		width: 2px;
		height: 100%;
		left: -10upx;
		top: 0;
	}
}

</style>
