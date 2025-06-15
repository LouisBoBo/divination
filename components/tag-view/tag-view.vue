<template>
	<view>
		<view class="base" v-for="(item, index) in allTags" :key="index" v-bind:id="getIndexStr(index)">
			<view class="itemView_title" v-if="item.double">{{item.name}}<text
					style="color: #858585;margin-left: 10rpx;">(可多选)</text>
			</view>
			<view class="itemView_title" v-else>{{item.name}}</view>
			<view class="existing_label">
				<view v-for="(citem, cindex) in item.childlist" :key="cindex">
					<view :class="cindex===0?'itemView_title_fu1':'itemView_title_fu2'"
						v-if="citem.childlist.length > 0">
						{{citem.name}}
					</view>
					<view class="existing_label" style="margin-left: 0rpx;" v-if="citem.childlist.length > 0">
						<view class="u-page__tag-item" v-for="(ccitem, ccindex) in citem.childlist" :key="ccindex"
							:style="{ 'background-color': ccitem.checked ? 'rgba(236,58,118,0.2)' : '#F0F2F5','border-color': ccitem.checked ? '#EC3A76':'rgba(0,0,0,0)'}"
							@click="secondTagClick(item,citem,ccitem,index)">
							{{ccitem.name}}
						</view>
					</view>
					<view v-else>
						<view class="u-page__tag-item"
							:style="{ 'background-color': citem.checked ? 'rgba(236,58,118,0.2)' : '#F0F2F5','border-color': citem.checked ? '#EC3A76':'rgba(0,0,0,0)'}"
							@click="TagClick(index, cindex)">
							{{citem.name}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		name: "tag-view",
		props: {
			tags: Array
		},
		data() {
			return {
				indexList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
					'T', 'U', 'V', 'W', 'X', 'Y', 'Z', "AA", "BB", "CC", "DD", "EE", "FF", "GG", "HH", "II", "JJ",
					"KK", "LL", "MM", "NN", "OO", "PP", "QQ", "RR", "SS", "TT", "UU", "WW", "XX", "YY", "ZZ"
				],
				allTags: [],
				childAllTags: [{
						name: '#红头文件',
						checked: false
					},
					{
						name: '#村桂林村红头文件',
						checked: false
					},
					{
						name: '#红头文件',
						checked: false
					},
				],
				is_taotu: false, //头套
				is_changgui: false, //常规
				is_cunshan: false //寸衫
			}
		},
		watch: {
			tags: {
				handler(n, o) {
					if (n) {
						this.allTags = n
						console.log("this.allTags=", this.allTags)
					}
				},
				deep: true, // 深度监听父组件传过来对象变化
				immediate: true, // 初次监听即执行
			},
		},
		methods: {
			getIndexStr(index) {
				var str = 'rightitem' + this.indexList[index]
				console.log("标识id=", str)
				return str
			},
			secondTagClick(item, citem, ccitem, tag_index) {
				console.log("选择的下标=", tag_index)
				if (citem.double) {
					ccitem.checked = !ccitem.checked
				} else {
					citem.childlist.map((obj, index) => {
						obj.checked = obj === ccitem ? true : false
					})
				}

				let checkBrr = citem.childlist.filter(obj => {
					return obj.checked === true
				})
				citem.checked = checkBrr.length > 0

				let checkArr = item.childlist.filter(obj => {
					return obj.checked === true
				})
				item.checked = checkArr.length > 0

				this.$emit('tagClick', tag_index, this.allTags)
			},


			TagClick(tag_index, tag_cindex) {

				let typeItem = this.allTags[0]
				let item = this.allTags[tag_index]
				console.log("选择的下标=", tag_index)

				//如果选择了常规套头无法选择衣门襟
				if (item.id === "104" && this.is_taotu) {
					item.checked = true
					this.$u.toast("常规套头无法选择衣门襟")
					return
				}

				//连衣裙特殊处理
				if (typeItem.id === "23") {
					//点选“常规”后，可选 领型，袖型，袖长 三个项目
					//点选“衬衫式”可选领型，袖型，袖长，衣门襟 四个项目
					//其余连衣裙款式不可选 领型112，袖型113，袖长111，衣门襟104 这四个项目

					let arr = this.tags.filter(obj => {
						return obj.id === "106"
					})

					//连衣裙特殊处理
					if (arr.length > 0) {
						let obj = arr[0]
						obj.childlist.forEach(citem => {
							if (citem.id === "2576" && citem.checked) {
								this.is_changgui = citem.checked
							}

							if (citem.id === "2510" && citem.checked) {
								this.is_cunshan = citem.checked
							}
						})
					}

					if (item.id === "104" && this.is_changgui) {
						item.checked = true
						this.$u.toast("该连衣裙款式不可选择该项目")
						return
					}

					if (item.id === "112" || item.id === "113" || item.id === "111" || item.id === "104") {
						if (!this.is_cunshan && !this.is_changgui) {
							item.checked = true
							this.$u.toast("该连衣裙款式不可选择该项目")
							return
						}
					}
				}


				if (item.double) {
					item.childlist[tag_cindex].checked = !item.childlist[tag_cindex].checked
				} else {
					item.childlist.map((citem, index) => {
						citem.checked = index === tag_cindex ? true : false
					})
				}

				let checkArr = item.childlist.filter(citem => {
					let teshuArr = ["112", "113", "111", "104"]

					//上衣款式-常规套头
					if (item.id === "105" && citem.id === "2193") {
						this.is_taotu = citem.checked
						let yimenArr = this.allTags.filter(obj => {
							return obj.id === "104"
						})
						let yimen_item = yimenArr[0]
						yimen_item.checked = true
						yimen_item.childlist.forEach(obj => {
							obj.checked = false
						})
					} else if (item.id === "106" && (citem.id === "2576" || citem.id === "2510")) { //连衣裙款式-常规
						if (citem.id === "2576") {
							this.is_changgui = citem.checked
						} else if (citem.id === "2510") {
							this.is_cunshan = citem.checked
						}

						let yimenArr = this.allTags.filter(obj => {
							return teshuArr.includes(obj.id)
						})
						yimenArr.forEach(obj => {
							obj.checked = true
							obj.childlist.forEach(cobj => {
								cobj.checked = false
							})
						})

					} else if (item.id === "106" && citem.id === "2510") { //连衣裙款式-寸衫式

						let yimenArr = this.allTags.filter(obj => {
							return teshuArr.includes(obj.id)
						})
						yimenArr.forEach(obj => {
							obj.checked = true
							obj.childlist.forEach(cobj => {
								cobj.checked = false
							})
						})
					}

					return citem.checked === true
				})
				item.checked = checkArr.length > 0 ? true : false

				this.$emit('tagClick', tag_index, this.allTags)
			},
		},
	}
</script>
<style lang="scss" scoped>
	.base {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.itemView_title {
		height: 44rpx;
		font-size: 32rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #272424;
		line-height: 44rpx;
		margin-left: 20rpx;
		margin-top: 32rpx;
		margin-bottom: 24rpx;
		justify-content: center;
	}

	.itemView_title_fu1 {
		height: 40rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #272424;
		line-height: 40rpx;
		margin-left: 0rpx;
		justify-content: center;
		margin-bottom: 16rpx;
	}

	.itemView_title_fu2 {
		height: 40rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #272424;
		line-height: 40rpx;
		margin-left: 0rpx;
		margin-top: 12rpx;
		justify-content: center;
		margin-bottom: 16rpx;
	}

	.existing_label {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: space-between;
		flex-wrap: wrap;
		margin-left: 20rpx;

		.u-page__tag-item {
			margin-top: 0;
			margin-bottom: 16rpx;
			margin-right: 16rpx;
			height: 68rpx;
			line-height: 68rpx;
			min-width: 164rpx;
			text-align: center;
			border-radius: 68rpx;
			border-style: solid;
			border-width: 1px;
			font-size: 24rpx;
			color: #272424;
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
		}

		.u-tag u-tag--circle u-tag--primary--plain u-tag--medium {
			margin-right: 0px !important;
			text-align: center;
			border-radius: 50px;
			min-width: 150rpx;
		}

		::v-deep {
			.u-tag--primary {
				border-radius: 50rpx;
				// background-color: rgba(41, 41, 69, 0.05);
				text-align: center;
				// border-image:linear-gradient(to right,rgba(93, 164, 247, 1), rgba(50, 133, 228, 1))1!important;
			}

			.u-tag-wrapper {
				// background:  rgba(41, 41, 69, 0.05);
				border-radius: 50px;
			}

			.u-tag u-tag--circle u-tag--primary u-tag--medium {
				// background-color: rgba(41, 41, 69, 0.05);
				border-radius: 50rpx;
				text-align: center;
			}

			.u-tag--medium {
				padding: 0rpx 15rpx 5rpx 15rpx;
				background: rgba(41, 41, 69, 0.0);
				border-radius: 50rpx;
				text-align: center;
			}

			.u-tag__close--medium {
				// border: 1px solid rgba(122, 122, 140, 1);
				background: #FFFFFF !important;
			}

			.u-tag__close {
				// background-color: #FFFFFF!important;
				top: 12px;
				right: 18px;
			}

			.u-icon__icon {
				color: rgba(122, 122, 140, 1) !important;
			}

			.u-tag u-tag--circle u-tag--primary--plain u-tag--medium {
				// background: red;
				border-radius: 50rpx;
				text-align: center;
			}
		}
	}
</style>