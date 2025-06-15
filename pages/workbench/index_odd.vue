<template>
	<view class="page">
        <mescroll-uni ref="mescrollRef" @init="mescrollInit" :top="0" :topbar="false" :fixed="true" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
            <view class="board-body flex-row">
                <view class="flex-col" v-for="item in 6" :key="item">
                    <view class="machine-item shadow-warp">
                        两列布局
                    </view>
                </view>
            </view>
        </mescroll-uni>
	</view>
</template>

<script>
import listScroll from "@/mixins/listScroll"
	export default {
        mixins:[listScroll],
        data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
.board-body{
    padding: 0 24upx;
    box-sizing: border-box;
    padding-top: 20upx;

}
.flex-row{
    display: flex;
    //justify-content: space-between;
    //align-content: space-between;
    flex-wrap: wrap;
}
.flex-col{
    width: calc(50vw - 12px);
    margin-bottom: 20upx;
    box-sizing: border-box;
    &:nth-child(even){
        padding-left: 12upx;
    }
    &:nth-child(odd){
        padding-right: 12upx;
    }
}
.machine-item{
    background-color: #fff;
    border-radius: 10upx;
    min-height: 300upx;
}
</style>
