<template>
	<view class="page">
		<u-collapse :value="opens">
			<u-collapse-item class="collapseItem" v-for="(item, index) in cardList" :key="item.id" :name="item.title">
				<ch-title slot="title" :title="item.title" weight></ch-title>
				<view class="gridWrap" v-if="list.length > 0">
					<u-grid :border="false" col="4" class="ch-grid">
						<u-grid-item v-for="(item, cindex) in list" :key="cindex">
							<u--image :showLoading="true" :src="item.icon" width="35px" height="35px"
								@click="toPage(item)"></u--image>
							<text class="grid-text text-26">{{ item.name }}</text>
						</u-grid-item>
					</u-grid>
				</view>
			</u-collapse-item>
		</u-collapse>
	</view>
</template>

<script>
export default {
	data() {
		return {
			cardList: [
				{ title: "首页应用", id: 0 },
				{ title: "看板监视", id: 1 },
				{ title: "维护保养", id: 2 },
				{ title: "生产管理", id: 3 },
				{ title: "质量管理", id: 4 },
				{ title: "设备管理", id: 5 },
				{ title: "仓储管理", id: 6 }
			],
			list: [
				{ name: "机器监视", route: 'machineList', icon: "/static/device.png" },
				{ name: "工单监视", route: 'dispatchList', icon: "/static/device.png" },
				{ name: "机器监视", route: '', icon: "/static/device.png" },
				{ name: "机器监视", route: '', icon: "/static/device.png" },
				{ name: "机器监视", route: '', icon: "/static/device.png" },
				{ name: "机器监视", route: '', icon: "/static/device.png" },
				{ name: "机器监视", route: '', icon: "/static/device.png" },
				{ name: "机器监视", route: '', icon: "/static/device.png" },
			],
			opens: ["首页应用"]
		};
	},
	onLoad() {

	},
	onNavigationBarButtonTap(e) {

		// #ifdef APP-PLUS
		var webView = this.$mp.page.$getAppWebview();
		webView.setTitleNViewButtonStyle(0, {
			text: '保存',
		});

		// #endif
		// #ifdef H5
		let doms = document.querySelectorAll('.uni-btn-icon');
		doms[doms.length - 1].innerHTML = '保存'
		// #endif

	},
	methods: {
		toPage(item) {
			item.route && this.$u.toast(item.name)
			this.$nav.to(item.route)
		}
	},
}
</script>

<style lang="scss" scoped>
.collapseItem {
	background-color: white;
}

.gridWrap {
	border-top: 0;
}
</style>
