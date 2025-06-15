<script>
	import Config from "@/config";
	import httpApi from "@/api/aili/index.js";
	import pp from "@/utils/public.js";
	export default {
		globalData: {
			updated: false,
			design: {
				shop_type: {},
			},
		},
		onLaunch: function() {
			//没有登录就去登录页，登录了没有历史数据去选择类目，有历史数据在tarbar首页
			// let token = uni.getStorageSync(this.$config.storage.token)
			// if (token) {
			// 	this.getLvInfo()
			// 	this.queryDataHttp()
			// } else {
			// 	uni.reLaunch({
			// 		url: '/pages/shouye/clothingDesign',
			// 		success: this.closeSplash
			// 	})
			// }
			// #ifdef APP-PLUS
			// this.updates();
			// #endif
		},
		onShow: function() {
			this.setLang();
			uni.onLocaleChange((e) => {
				this.$config.langs.forEach((item) => {
					if (item.name === e.locale) {
						this.$db.set(this.$config.store.userLang, item);
					}
				});
			});

			console.log("App Show");
			//解决uniapp设置自动登录跳转首页时加载登录页问题
			setTimeout(() => {
				// #ifdef APP-PLUS
				plus.navigator.closeSplashscreen();
				// #endif
			}, 2000);

			// 使用示例
			this.setThemeColor("#F3F7F9");
			this.updateThemeColor()
		},
		onHide: function() {
			console.log("App Hide");
		},
		methods: {
			//获取账户等级
			getLvInfo() {
				pp.getInstence(this).then((res) => {
					console.log("insterest=", res);
					let number = res.detail.number;
					let jobCount = res.jobCount;

					if (number > 0 && jobCount > 0) {
						//有设计次数且有历史数据就到设计界面
						uni.switchTab({
							url: "/pages/shouye/clothingDesign",
						});
					} else {
						uni.reLaunch({
							url: "/pages/shouye/shouye",
							success: this.closeSplash,
						});
					}
				});
			},

			queryDataHttp() {
				this.$http
					.get(httpApi.queryData, {
						params: {
							type_data: "",
							tag_data: "",
							type_tag_data: "",
							supp_label_data: "",
							bool: true,
						},
					})
					.then((res) => {
						console.log("请求结果=", res);
						if (res.status === "1") {
							uni.setStorageSync(this.$config.storage.queryData, res);
						}
					});
			},

			updates(target) {
				let v = uni.$u.sys().appVersion;
				let type = uni.$u.os() === "ios" ? 8 : 7;
				this.$http.get(`${this.$api.base.update}${type}/${v}`).then((result) => {
					console.log("result", result);
					if (result.data) {
						if (type) {
							this.$confirm("程序需要更新, 是否马上更新?", Config.name).then(
								(e) => {
									let url = result.data.url;
									if (uni.$u.os() === "ios") {
										url = Config.iosUrl;
									}
									plus.runtime.openURL(`${url}`);
								}
							);
						}
					} else {
						if (target) {
							this.$ch.sleep(1500).then(() => {
								this.$ch.toast(result.msg);
							});
						}
					}
				});
			},

			setLang() {
				let ulang = this.$getUserLang();
				uni.setLocale(ulang.name);
			},

			// 在 mounted 或需要改变颜色时调用
			setThemeColor(color) {
				const meta = document.querySelector('meta[name="theme-color"]') ||
					document.createElement('meta');

				meta.name = "theme-color";
				meta.content = color;
				document.getElementsByTagName('head')[0].appendChild(meta);
			},
			updateThemeColor() {
			  const meta = document.querySelector('meta[name="theme-color"]');
			  if (meta) {
			    meta.content = "#F3F7F9";
			  } else {
			    const newMeta = document.createElement('meta');
			    newMeta.name = "theme-color";
			    newMeta.content = "#F3F7F9";
			    document.head.appendChild(newMeta);
			  }
			}

		},
	};
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uni_modules/uview-ui/index.scss";
	@import "./styles/common.scss";

	/* 覆盖 uni-app/uView tabBar 顶部线条 */
	.uni-tabbar,
	.u-tabbar,
	.uni-tabbar__container {
		border-top: none !important;
		box-shadow: none !important;
	}

	.order-wrap {
		.order-list {
			@include after();
			padding: 22upx 24upx;
			align-items: center;

			.ch-flex-1 {
				font-size: 28upx;

				.ch-flex {
					margin-bottom: 6upx;
				}
			}

			.label {
				width: 140upx;
				color: #333;

				&.nowwidth {
					width: auto;
				}
			}

			.value {
				color: #5e5e5e;
			}
		}
	}

	.emptyView {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.content {
		padding-top: calc(var(--status-bar-height) + 44px);
	}

	.gridWrap {
		padding-top: 18px;
		background-color: #fff;
		border-top: 1px solid #f2f2f2;

		.ch-grid {
			.u-grid-item {
				margin-bottom: 36upx;

				.grid-text {
					margin-top: 10upx;
					color: #2b2d30;
				}
			}
		}
	}

	.mt20 {
		margin-top: 20upx;
	}
</style>