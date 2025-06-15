import Vue from 'vue';
import Vuex from 'vuex';
import Config from '@/config';
import loginApi from '@/api/luna';
import authApi from '@/api/auth';
import Api from "@/utils/api.js"
import {
	getToken,
	removeToken,
	setToken,
} from '@/utils';
Vue.use(Vuex);
const a = getToken(Config.store.account);
const t = getToken(Config.store.token);
const store = new Vuex.Store({
	state: {
		test: 'test',
		user: {}, // 帐号关联的员工信息
		account: a?.account || {}, // 帐号信息
		access_token: t?.access_token || '',
		expires_in: t?.expires_in || '', // token到期时间
		tenant_id: t?.tenant_id || '', // 企业编码
		domain_name: t?.domain_name || '', // 企业url
		tenantName: a?.tenantName || '', // 企业名称
		menu: getToken(Config.store.menu) || [], // 路由菜单
		machine: {},
		permission: [],

		token: ""
	},

	strict: process.env.NODE_ENV !== 'production',
	mutations: {
		setData: (state, data) => {
			Object.keys(data).forEach((key) => {
				state[key] = data[key];
			});
		},
		modifyInfo(state, data) {
			state.deviceToken = data.deviceToken
		}
	},
	actions: {

		newlogin: async ({
			commit,
			dispatch,
		}, userForm) => {

			let data = uni.$u.http.get(loginApi.login, {
				params: userForm
			})

			// let data = uni.$u.http.post(loginApi.login, {
			// 	...userForm
			// })
			return data
		},

		newloginout: async ({
			commit,
			dispatch,
		}, userForm) => {

			let data = uni.$u.http.get(loginApi.loginout, {
				params: userForm
			})

			return data
		},








		// 登录
		login: async ({
			commit,
			dispatch,
		}, userForm) => {
			const result = await uni.$u.http.post(Api.login, {
				...userForm,
			}, {
				custom: {
					auth: false,
				},
			});


			if (result.data) {
				commit('setData', result.data);
				setToken(Config.store.token, {
					...result.data,
					time: Number(new Date()),
				});
			}

			const isLogin = await dispatch('getAccountInfo');
			if (isLogin) {
				await dispatch('getRoute');
			}
			return isLogin;
		},

		getAccountInfo: async ({
			commit,
		}) => {
			const result = await uni.$u.http.get(authApi.getInfo);
			if (result.user.employeeId && result.user.employeeId > 0) {
				setToken(Config.store.account, {
					account: result.user,
					tenantName: result.tenantName,
				});
				commit('setData', {
					account: result.user,
					tenantName: result.tenantName,
				});
				return true;
			}
			return false;
		},
		getRoute: async ({
			commit,
		}) => {
			const result = await uni.$u.http.get(authApi.getRoute);
			if (result.data.length > 0) {
				const menu = result.data[0].children;
				setToken(Config.store.menu, menu);
				commit('setData', {
					menu,
				});
			}
		},
		getUserInfor: async ({
			commit,
			state,
		}) => {
			if (state.user.id) {
				return state.user;
			} else {
				const result = await uni.$u.http.get(authApi.getUserInfo);
				commit('setData', {
					user: result.data,
				});
				setToken(Config.store.user, result.data);
				return result.data;
			}
		},

		// 设定当前选择的设备
		setCurrentDevice: async ({
			commit,
			state
		}, machine) => {
			let data = {
				machine
			}
			if (state.permission.length === 0) {
				let result = await uni.$u.http.get(authApi.authority, {
					params: {
						pageSize: 9999,
						pageNum: 1
					}
				});
				data['permission'] = result.data
			}
			commit('setData', data)
			return true
		},

		// 登出
		logout: async ({
			commit,
		}, state) => {
			commit('setData', {
				account: {},
				access_token: '',
				expires_in: '',
				tenant_id: '',
				domain_name: '',
				tenantName: '',
				menu: [],
				permission: [],
				machine: {}
			});
			for (const key in Config.store) {
				// 退出的时候, 不清空用户设定的语言和语言数据缓存
				if (key !== 'userLang' && key !== 'local') {
					removeToken(Config.store[key]);
				}
			}
			return true;
		},
	},

});


export default store;