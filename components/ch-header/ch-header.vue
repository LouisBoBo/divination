<template>
	<u-navbar autoBack  :title="$config.name" :bgColor="$config.color.primary" :titleStyle="{color:'#FFF'}">
        <view slot="left">
<!--            <view class="lefticon"><image src="/static/user.png"></image></view>-->
        </view>
        <view slot="right" @click="$nav.to('/pages/message/warning')">
            <view class="righticon"><image src="/static/warning.png"></image></view>
        </view>
	</u-navbar>
</template>

<script>
	export default {
		name:"ch-header",
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
.lefticon{
    image{
        width: 43upx;
        height: 43upx;
        display: block;
    }
}
.righticon{
    image{
        width: 44upx;
        height: 40upx;
        display: block;
    }
}
</style>
