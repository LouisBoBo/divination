// vue.config.js 配置说明
// 官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
const fs = require('fs')
const path = require('path')
const proxyTag = process.env.NODE_ENV === 'development' ? '/cloud-api' : 'https://www.yssjds.com/cloud-api/';
module.exports = {
	// transpileDependencies: ['uview-ui'],
	// 部署生产环境和开发环境下的URL。
	// 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
	// #ifdef H5
	// webpack-dev-server 相关配置
	// devServer: {
	// 	port: 80,
	// 	disableHostCheck: true,
	// 	allowedHosts: ["cc5d-240e-3b9-34c4-c230-d5c0-ac12-cb05-c81b.ngrok-free.app","www.yssjds.com"],
	// 	proxy: {
	// 		[proxyTag]: {
	// 			target: 'https://www.www.yssjds.com/prod_api/cloud-api/', // wang
	// 			changeOrigin: true,
	// 			secure: false,
	// 			logLevel: 'debug',
	// 			pathRewrite: {
	// 				[`^${proxyTag}`]: '',
	// 			},
	// 		},
	// 	},
	// },



	devServer: {

		// https: {
		// 	key: fs.readFileSync(path.resolve(__dirname, 'www.yssjds.com-key.pem')),
		// 	cert: fs.readFileSync(path.resolve(__dirname, 'www.yssjds.com.pem')),
		// },
		// host: 'www.yssjds.com', // 绑定 Host
		// port: 443, // HTTPS 默认端口


		host: '0.0.0.0', // 允许局域网访问（或指定 '192.168.1.5'）
		port: 8080, // 确保端口与项目一致
		disableHostCheck: true, // 关闭主机检查（避免Host绑定验证失败）
		allowedHosts: ["aafb-240e-3ba-348b-7d30-dc43-6770-9658-a80a.ngrok-free.app", "www.yssjds.com"],
		proxy: {
			'/prod_api': {
				target: 'https://www.yssjds.com',
				changeOrigin: true,
				pathRewrite: {
					'^/prod_api': ''
				}
			}
		}
	},

	// 生产环境下生成 source map
	productionSourceMap: true,

	// 其他生产环境配置
	configureWebpack: (config) => {
		if (process.env.NODE_ENV === 'production') {
			// 保留 console 日志
			// config.optimization.minimizer[0].options.terserOptions.compress.drop_console = false;
		}
	}
};