<template>
	<view class="page">
		<ch-right-header :title="$t('机器状态')" path="/pages/machine/search"></ch-right-header>

		<view class="content bgwhite" :style="'padding-top:' + 44 + 'px'">
			<statusHeader v-show="list.length > 0" ref="statusHeader" @statusClick="statusClick"></statusHeader>
			<view v-if="!isGet">
				<view class="bgwhite">
					<mescroll-uni v-if="list.length > 0" ref="mescrollRef" @init="mescrollInit" :topbar="false"
						:fixed="false" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
						<view class="machine bgwhite">
							<view class="machine-item ch-flex" v-for="item in dataList" :key="item.id"
								@click="itemClick(item)">
								<image class="machine-item-image" src="../../static/jqzt.png" mode="aspectFit"
									:style="{ backgroundColor: getColor(item.status ? item.status : 0) }">
								</image>
								<view class="ch-flex-1 machine-item-msg">
									<view class="ch-flex">
										<view class="ch-flex-1 name">{{ item.machineNo }}</view>
										<view class="state" :style="{ color: getColor(item.status ? item.status : 0) }">
											{{ getText(item.status ? item.status : 0) }}
										</view>
									</view>
									<view class="text">
										{{ $t('工单号') }}：{{ item.params.dispatchOrder ? item.params.dispatchOrder.orderNo :
											"" }}
									</view>
									<view class="text">
										{{ $t('产品名称') }}：{{ item.params.dispatchOrder ? item.params.dispatchOrder.itemName :
											"" }}
									</view>
									<view class="text">{{ $t('良品数') }}：{{ item.params.dispatchOrder ?
										item.params.dispatchOrder.goodQty : "" }}</view>
								</view>
							</view>
						</view>
					</mescroll-uni>
					<view class="emptyView" v-else>
						<u-empty :text="$t('数据为空')" mode="list"></u-empty>
					</view>
				</view>
			</view>
			<template v-else>
				<u-loading-icon text="loading"></u-loading-icon>
			</template>
		</view>
	</view>
</template>

<script>
import listScroll from "@/mixins/listScroll"
import statusHeader from "@/components/status-header/status-header.vue"
import Api from "@/api/machine/index.js"
import pp from "@/utils/public.js"
export default {
	mixins: [listScroll],
	components: {
		statusHeader
	},
	data() {
		return {
			apiUrl: Api.list,
			method: 'get',
			query: {},
			queryParams: {
				wsCode: null,
				machineState: null,
				machineNo: null
			},
			stateList: [],
			machineStatus: [],
			stateClass: ['run', 'stop', 'warning', 'danger'],
			dataList: [],
			searchList: [],
			isSearch: false,
			scrollHeight: 44
		};
	},
	onLoad() {
		//搜索功能
		uni.$on('returnMachineData', data => {
			console.log('details发出的值===>', data);
			if (data) {
				this.isGet = true
				this.isSearch = true
				this.refreshUI(data);
			}
		});
		console.log('uni.$u.sys().statusBarHeight', uni.$u.sys());
		this.scrollHeight = uni.$u.sys().statusBarHeight + 44

	},
	onUnload() {
		uni.$off('returnMachineData')
	},
	methods: {
		//请求后组合参数
		afterGetList() {
			if (this.isGet && this.list.length > 0) {
				if (this.isSearch) {
					this.searchList = this.query.machineState != null ? this.list.filter(item => item.status === this.query.machineState) : this.list.slice();
					this.dataList = this.searchList.slice()
				} else {
					this.dataList = this.list.slice();
				}

				this.$refs["statusHeader"].handleStateList(this.dataList)
			}
		},

		//获取颜色
		getColor(state) {
			return pp.getStatusColor(state)
		},
		getText(state) {
			return pp.getStatusText(state)
		},

		//机器状态菜单点击
		statusClick(state) {
			if (this.isSearch) {
				this.dataList = state == 100 ? this.searchList.slice() : this.searchList.filter(item => item.status === state)
			} else {
				this.dataList = state == 100 ? this.list.slice() : this.list.filter(item => item.status === state)
			}
		},

		//刷新界面
		refreshUI(data) {
			this.query = data
			this.pager.pageNum = 1 //如果是搜索从第一页开始
			this.getList();
		},

		//跳转派工单列表
		itemClick(item) {
			if (this.$store.state.machine?.id !== item.id) {
				this.$store.dispatch('setCurrentDevice', item)
			}
			uni.navigateTo({
				url: "/pages/workbench/dispatchList?machineNo=" + item.machineNo,
			})
		},
	}
}
</script>

<style lang="scss" scoped>
.machine {
	&-item {
		padding: 28upx 20upx;
		justify-content: center;
		@include after();

		&-image {
			width: 182upx;
			height: 162upx;
			background-color: #f2f2f2;
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
			margin-right: 35upx;
			src: "/static/jqzt.png";
		}

		&-msg {
			.ch-flex {
				align-items: center;
				margin-bottom: 2upx;
			}

			.name {
				font-size: 32upx;
				color: #333;
				font-weight: 600;
			}

			.state {
				font-size: 26upx;

				&.run {
					color: #018100;
				}

				&.stop {
					color: #818181;
				}

				&.warning {
					color: #adb518;
				}

				&.danger {
					color: #ff3333;
				}
			}

			.text {
				color: #6c6c6c;
				font-size: 26upx;
				margin-bottom: 4upx;
			}
		}
	}
}
</style>
