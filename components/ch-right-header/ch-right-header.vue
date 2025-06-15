<template>
	<u-navbar autoBack :title="navTitle" :bgColor="$config.color.primary" :titleStyle="{color:'#FFF'}">
		<view slot="left">
			<u-icon name="arrow-left" color="#f1f1f1" size="20"></u-icon>
		</view>
		<view slot="right" @click="$nav.to(navPath)">
			<u-icon name="search" color="#f1f1f1" size="24"></u-icon>
		</view>
	</u-navbar>
</template>

<script>
	export default {
		name: "ch-right-header",
		props: {
			title: String,
			path: String
		},
		data() {
			return {
				navTitle: null,
				navPath: null
			};
		},
		watch: {
			title: {
				handler(n, o) {
					if (n) {
						this.navTitle = n
					}
				},
				deep: true, // 深度监听父组件传过来对象变化
				immediate: true, // 初次监听即执行
			},
			path: {
				handler(n, o) {
					if (n) {
						this.navPath = n
					}
				},
				deep: true, // 深度监听父组件传过来对象变化
				immediate: true, // 初次监听即执行
			},
		}
	}
</script>

<style lang="scss" scoped>
	.lefticon {
		image {
			width: 43upx;
			height: 43upx;
			display: block;
		}
	}

	.righticon {
		image {
			width: 44upx;
			height: 40upx;
			display: block;
		}
	}
</style>