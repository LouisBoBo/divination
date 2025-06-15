import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import Config from '@/config';
export default {
	mixins: [MescrollMixin],
	data() {
		return {
			appStatusBarHeight: 44,
			mescrollHeight: 0,
			downOption: {
				bgColor: '#f2f2f2',
				auto: false,
				textColor: Config.color.primary,
				textInOffset: this.$t('下拉刷新'),
				textOutOffset: this.$t('释放更新'),
				textLoading: this.$t('加载中'),
				textSuccess: this.$t('加载成功'), // 加载成功的文本
				textErr: this.$t('加载失败'),
			},
			upOption: {
				onScroll: false,
				auto: false,
				page: {
					num: 0,
					size: 10,
					time: null,
				},
				empty: {
					use: false,
				},
				noMoreSize: 8,
				textLoading: this.$t('加载中'),
				textNoMore: this.$t('已加载全部数据'),
			},
			isNotData: false, // 是否有下一页数据true/false

			total: 0, // 数据总
			pager: {
				pageNum: 1, // 当前页码
				pageSize: 10, // 每页数量
			},
			list: [],
			method: 'get',
			isGet: true, // 首次获取状态 getList后变为False
			apiUrl: null, // 列表的接口,
			apiType: null, // 1为非常规请求 其它为正常请求
			query: {
				// 查询列表接口的额外参数
			},
		};
	},
	onLoad() {
		this.appStatusBarHeight = uni.$u.sys().statusBarHeight + 44;
		this.mescrollHeight = this.$u.addUnit(this.getMescrollHeight(), 'px');

		this.$nextTick(() => {
			this.getList();
		});
	},
	methods: {
		/**
		 * 获取列表数据
		 * @param target - 0 首次获取或下拉刷新 1 上拉加载
		 */
		async getList(target = 0) {
			this.beforeGetList && this.beforeGetList(); // 获取列表接口前的处理函数
			if (!this.apiUrl) {
				this.mescroll.endSuccess(0, true);
				return;
			}
			console.log('query', this.query);
			let params = {};
			if (this.method === 'get') {
				params = {
					params: {
						...this.query,
						...this.pager,
					},
				};
			} else {
				if (this.apiType === 1) {
					params = {
						...this.query,
					};
				} else {
					params = {
						...this.query,
						...this.pager,
					};
				}
			}
			this.$http[this.method](this.apiUrl, params).then((result) => {
					if (target === 0) {
						this.list = result.data;
						this.total = result.total;
					}

					if (target === 1) {
						this.list = this.list.concat(result.data ?? []);
					}

					// 是否有可能有下一页
					this.isNotData = this.list.length >= this.total;
					this.$ch.sleep(100).then(() => {
						this.mescroll && this.mescroll.endSuccess(result.data.length, !this.isNotData);
					});

					this.afterGetList && this.afterGetList(); // 获取列表接口后的处理函数
				})
				.finally(() => {
					this.isGet = false;
				});
		},
		downCallback() {
			this.pager.pageNum = 1;
			this.getList();
		},
		upCallback() {
			this.pager.pageNum++;
			this.getList(1);
		},
		getMescrollHeight() {
			let heigt = 0;
			heigt += this.appStatusBarHeight;
			// #ifdef APP-PLUS
			heigt += 50;
			// #endif
			// 如果包含搜索，则自动往下移动
			// uni.createSelectorQuery().select(".searchBar").boundingClientRect(function(data) {
			//     console.log('data', data)
			//     if (data && data.height) {
			//         heigt += data.height;
			//     }
			// }).exec();
			return heigt;
		},
	},
};
