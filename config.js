export default {

	name: 'Luna', // 项目名称

	main: '/pages/index/index', // 首页位置

	url: 'http://172.19.5.233',

	url1: 'http://${*}',

	baseURl: "https://www.yssjds.com/",
	loginUrl: "https://www.yssjds.com/cloud-wxcx/",
	payUrl: "https://www.yssjds.com/",
	imgUrl: "http://img.yifuapp.wang/",
	upyUrl: "http://yssj-hebo.test.upcdn.net",

	appId: process.env.NODE_ENV === 'production' ? "wx9f9bef8f5260b25e" : "wx63c17806fbeff596",

	// appId: "wx92ce0621f2f9880b",//测试帐号
	// appId: "wx9f9bef8f5260b25e",//生产帐号

	timeOut: 30 * 1000, // 请求超时时间
	agreement: '', // 用户协议地址
	privacy: '', // 隐私政策地址

	// 缓存key值
	store: {
		user: 'MegaUser', // 用户信息---> 登录帐号所关联的员工信息
		account: 'MegaAccount', // 帐号信息
		userLang: 'MegaLang', // 用户设定的语言
		local: 'MegaLocalData', // 多语言数据缓存
		token: 'MegaToken', // token
		tenant: 'MegaTenant', // 企业id
		tenantUrl: 'MegaTenantUrl', // 企业id
		menu: 'MegaMenu', // 菜单
		baseurls: 'baseurls', // 域名列表
		baseurl: 'baseurl', // 设定的域名
	},

	storage: {
		token: "token",
		userInfo: "userInfo", //用户信息
		jobCount: "jobCount", //历史设计次数
		queryData: "queryData", //分类数据
		code: "code"
	},
	// 派工单状态字典
	dispatchState: {
		NOT_ASSIGN: 0, // 未派工
		ASSIGN: 1, // 已派工
		INSERTION: 3, // 已插单
		PAUSE: 2, // 已暂停
		COMPLETE: 4, // 已结案
	},
	// 机器状态
	machineStatus: {
		BREAK_OFF: 0, // 连接中断
		RUNNING: 10, // 连接正常
		STOP: 30, // 停机
	},
	// 环境代理变量
	proxy: {
		dev: '/cloud-api',
		prod: '/cloud-api',
	},

	// App 主色调
	color: {
		primary: '#FF6600',
		// 设备状态色
		normal: '#f1f1f1', // 总数
		run: '#73ea87', // 0运行
		warning: '#FCCA00', // 1待机
		stop: '#fa3534', // 2停机
		breakOff: '#999999', // 3离线
		noOrders: '#9acafc', // 4无订单
		grey: '#c2c2c2',
	},

	// 语言列表
	langs: [{
		name: 'zh-Hans',
		code: 0,
		title: '中文简体'
	},
	{
		name: 'zh-Hant',
		code: 2,
		title: '中文繁体'
	},
	{
		name: 'en',
		code: 1,
		title: 'English'
	},
	],


	//设计元素
	design: {
		shop_type: {}, //商品类目
		shop_tags: [], //商品标签
		shop_tag_types: [], //其它商品类目
		brand: {}, //参考品牌
		adjust: false, //是否调整
		adjustIndex: null, //调整的任务下标
		startDesign: false, //开始设计
		designInfo: null,
		taskId: null, //任务id
		select_shop_type: "shop_type", //选择的商品类目
		select_shop_tags: "shop_tags", //选择的商品标签
		select_brand: "brand", //选择的参考品牌
		base64Array: "", //垫图
	},

	//绘图类型
	designType: {
		IMAGINE: "imagine",
		CHANGE: "change",
		DESCRIBE: "describe",
		BLEND: "blend"
	},

	//绘图变化
	designAction: {
		UPSCALE: "UPSCALE", //放大
		VARIATION: "VARIATION", //变换
		REROLL: "REROLL", //重新生成
	},

	//绘图比例
	designBlend: {
		PORTRAIT: "PORTRAIT", //2:3
		SQUARE: "SQUARE", //1:1
		LANDSCAPE: "LANDSCAPE" //3:2
	},

	supper_labbles: [
		'ACNE',
		'Alexander Wang',
		'Armani',
		'BALENCIAGA',
		'BANANA BABY',
		'BAPE',
		'BASIC HOUSE',
		'Bershka',
		'C&A',
		'cache cache',
		'Calvin Klein',
		'CHANEL',
		'CHLOE',
		'Dior',
		'Dolce& Gabbana',
		'E-LAND',
		'emu',
		'ESPRIT',
		'Etam',
		'EVISU',
		'EVRIS',
		'FENDI',
		'Five Plus',
		'Forever21',
		'Free People',
		'GAP',
		'GIVENCHY',
		'GU',
		'GUCCI',
		'GUESS',
		'H&M',
		'HEMES',
		'Honeys',
		'I.T',
		'ISSEYMIYAKE',
		'Jucy Judy',
		'KENZO',
		'La Babité',
		'LOUISVUITTON',
		'MAJE',
		'MANGO',
		'Marc Jacobs',
		'Massimo Dutti',
		'Milkcocoa',
		'Miss sixty',
		'miumiu',
		'Mo＆Co',
		'MOUSSY',
		'MURUA',
		'NEW LOOK',
		'Ochirly',
		'Only',
		'PINKO',
		'Ports',
		'PRADA',
		'PRICH',
		'PULL AND BEAR',
		'Roem',
		'SELF PORTRAIT',
		'SNIDEL',
		'STRADIVARIUS',
		'STYLE NANDA',
		'TOPSHOP',
		'UNIQLO',
		'Valentino',
		'VERO MODA',
		'VERSACE',
		"VICORIA'S SECRET",
		'Vivienne Westwood',
		'Yohji Yamamoto',
		'ZARA',
	],
};