export default {
	// 获取语言文件
	locale: '/system/language/dict',
	// 登录
	// login: '/auth/login',
	login: "/user/userLogin",
	// 获取域名
	getFirm: "/system/tenant/domain/",
	// 检测更新/mega-base/mobile/machine/app/{type}/{version}
	update: '/mega-base/mobile/machine/app/',
	// 开始刷卡
	startEvent: "/mega-qms/mobile/cardrecord/start",
	// 结束刷卡   /mega-qms/mobile/cardrecord/end/{id}
	endEvent: '/mega-qms/mobile/cardrecord/end/',

};
