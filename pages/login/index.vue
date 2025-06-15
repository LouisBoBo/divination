<template>
	<view class="page">

		<!-- <view class="login-img">
			<image src="/static/1024.png"></image>
		</view> -->

		<view class="forms">
			<u--form ref="uForm" :model="form" :rules="rules">
				<u-form-item prop="username">
					<view class="ch-flex">
						<view class="lefticon">
							<image src="/static/account.png"></image>
						</view>
						<view class="ch-flex-1">
							<u-input v-model="form.username" border="bottom" :placeholder="$t('请输入登录帐号')"></u-input>
						</view>
					</view>
				</u-form-item>
				<u-form-item prop="password">
					<view class="ch-flex">
						<view class="lefticon">
							<image src="/static/pwd.png"></image>
						</view>
						<view class="ch-flex-1">
							<u-input v-model="form.password" type="password" border="bottom"
								:placeholder="$t('请输入登录密码')"></u-input>
						</view>
					</view>
				</u-form-item>
			</u--form>

			<view class="ch-flex serverSetting" @click="setServer">{{ $t('server.setting') }} <u-icon name="arrow-right"
					size="14"></u-icon>
			</view>
		</view>

		<view class="btn-submit">
			<u-button :loading="loading" :color="$config.color.primary" class="yellow-btn" @click="onSubmitTap">
				<text class="text-weight">{{ $t('login') }}</text>
			</u-button>
		</view>


		<view class="ch-flex protocol text-26">
			<u-checkbox-group v-model="agreeArr" @change="agreeChange">
				<u-checkbox :name="agree" :activeColor="$config.color.primary"></u-checkbox>
			</u-checkbox-group>
			<view class="zh-flex-1">{{ $t('我已阅读并同意') }}
				<navigator url="/pages/message/webview?type=agreement&title=用户协议">《{{ $t('用户协议') }}》</navigator>
				{{ $t('及') }}
				<navigator url="/pages/message/webview?type=privacy&title=隐私政策">《{{ $t('隐私政策') }}》</navigator>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				username: process.env.NODE_ENV === 'development' ? 'admin' : '',
				password: process.env.NODE_ENV === 'development' ? 'admin123' : '',
				tenantCode: 'main'
			},
			rules: {
				'username': {
					type: 'string',
					required: true,
					message: this.$t('请填写账号'),
					trigger: ['blur', 'change']
				},
				'password': {
					type: 'string',
					required: true,
					message: this.$t('请填写密码'),
					trigger: ['blur', 'change']
				},
			},
			loading: false,
			agreeArr: [],
			agree: false, // 协议checked
		};
	},
	methods: {
		onSubmitTap() {
			console.log(111);
			if (!this.agree) {
				this.$ch.toast(this.$t("请查看并同意用户协议"));
				return
			}
			// #ifdef APP-PLUS
			console.log(this.$db.get(this.$config.store.baseurl))
			if (!this.$db.get(this.$config.store.baseurl)) {
				this.$ch.toast(this.$t("请先设定服务器域名"));
				return
			}
			// #endif
			console.log(222);
			this.$refs.uForm.validate().then(valid => {
				console.log(valid);
				if (valid) {
					// console.log('验证通过');
					// uni.showLoading()
					this.loading = true
					this.$store.dispatch('login', {
						...this.form
					}).then(e => {
						if (e) {
							// let pages = getCurrentPages(); // 当前页面
							// let beforePage = pages[pages.length - 2]; // 上一页
							// if (beforePage) {
							// 	setTimeout(() => {
							// 		uni.navigateBack({
							// 			success: function() {
							// 				beforePage.onLoad(); // 执行上一页的onLoad方法
							// 			}
							// 		})
							// 	}, 500)
							// } else {

							// }

							uni.switchTab({
								url: '/pages/index/home'
							});
						} else {
							this.$ch.toast(this.$t("该帐号无法登录该设备"));
						}
					}).finally(() => {
						this.loading = false
						uni.hideLoading()
					})
				} else {
					console.log('验证失败');
				}
			}).catch(e => {
				console.log('e', e);
			}).finally((e) => {
				console.log('eee', e);
			})
		},
		setServer() {
			this.$nav.to('/pages/login/server', {}, false, res => {
				console.log('res', res)
			});
		},
		agreeChange(v) {
			this.agree = v.length > 0
			console.log("this.agree=", this.agree)
		},
	}
}
</script>

<style lang="scss" scoped>
.page {
	background-color: #fff;
	padding-top: calc(var(--status-bar-height) + 70px + 40px);
}

.login-img {
	$wh: 226upx;
	width: $wh;
	height: $wh;
	border-radius: 50%;
	margin: 0 auto;
	overflow: hidden;

	image {
		width: $wh;
		height: $wh;
		display: block;
	}
}

.forms {
	margin: 89upx 91upx 0;

	.ch-flex {
		margin-bottom: 54upx;
	}

	.lefticon {
		width: 81upx;
		height: 81upx;
		margin-right: 20upx;

		image {
			width: 81upx;
			height: 81upx;
			display: block;
		}
	}

	.u-border-bottom {
		border-color: $ch-theme !important;
	}
}

.serverSetting {
	font-size: 28upx;
	color: #666;
	justify-content: flex-end;
	align-items: center;
}

.btn-submit {
	margin: 70upx 91upx 2upx;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

	.yellow-btn {
		padding: 24upx 12upx;
		border-radius: 10px;
	}

	text {
		font-size: 28upx;
		letter-spacing: 4px;
	}
}

.protocol {
	color: #666;
	margin: 64upx auto;
	padding-left: 30upx;
	text-align: center;
	justify-content: center;

	navigator {
		display: inline;
		color: $ch-theme;
		font-weight: 600;
	}
}
</style>
