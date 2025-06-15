<template>
	<view class="ch-flex state-list bgwhite">
		<view class="state-list-item" v-for="(item, index) in stateList" :key="item.id"
			:style="{ backgroundColor: item.color }" @click="itemClick(item)">
			<view class="value" :style="{ color: index == 0 ? 'red' : 'white' }">{{ item.value }}</view>
			<view class="name" :style="{ color: index == 0 ? 'black' : 'white' }">{{ item.name }}</view>
		</view>
	</view>
</template>

<script>
import Api from "@/api/device/index.js"
import pApi from "@/api/public/index.js"
import pp from "@/utils/public.js"
export default {
	props: {
		headList: [],
	},
	data() {
		return {
			stateList: [{
				name: this.$t('总数'),
				value: 0,
				color: this.$config.color.normal,
				status: 100
			},
			{
				name: this.$t('运行'),
				value: 0,
				color: this.$config.color.run,
				status: 10
			},
			{
				name: this.$t('停机'),
				value: 0,
				color: this.$config.color.stop,
				status: 30
			},
			{
				name: this.$t('离线'),
				value: 0,
				color: this.$config.color.breakOff,
				status: 0
			},
			],
			stateClass: ['run', 'stop', 'warning', 'danger'],
			total: 0
		};
	},
	methods: {
		itemClick(item) {
			this.$emit('statusClick', item.status)
		},
	
		//重组stateList数据
		handleStateList(data) {
		
			var count0 = data.length //总数
			var count1 = 0 //运行
			var count2 = 0 //停机
			var count3 = 0 //离线

			// status 0: 连接中断，10: 连接正常, 30: 停机
			data.forEach(item => {
				switch (item.status) {
					case 10:
						count1++
						break;
					case 30:
						count2++
						break;
					case 0:
						count3++
						break;
				}
			});

			this.stateList[0].value = count0
			this.stateList[1].value = count1
			this.stateList[2].value = count2
			this.stateList[3].value = count3
		},
	},

	watch: {
		headList: {
			handler(n, o) {
				if (n) {
					// this.stateList = n
					console.log("接收到的数据=", n)
				}
			},
			deep: true, // 深度监听父组件传过来对象变化
			immediate: true, // 初次监听即执行
		},
	}
}
</script>

<style lang="scss" scoped>
.state-list {
	flex-wrap: wrap;
	align-items: center;

	&-item {
		width: 25%;
		text-align: center;
		position: relative;
		padding: 7px 0 9px;

		&:before {
			content: "";
			right: 0;
			height: 100%;
			width: 1px;
			position: absolute;
			top: 0;
			background-color: #f2f2f2;
		}

		.value {
			font-size: 36upx;
			color: #ff3333;
		}

		.name {
			font-size: 26upx;
			color: #333;
		}

		&:nth-child(-n+3) {
			@include after();
		}
	}
}
</style>