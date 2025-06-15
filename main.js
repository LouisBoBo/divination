import App from './App';

// #ifndef VUE3
import Vue from 'vue';
import Vuex from 'vuex';
import store from './store';
import './uni.promisify.adaptor';
import onfire from './utils/onfire';
import uView from '@/uni_modules/uview-ui';

import plugins from './utils/plugins';
import VueQuillEditor from 'vue-quill-editor'

// 导入并挂载全局的分享方法
import share from './utils/share.js'
Vue.mixin(share)

Vue.config.productionTip = false;
App.mpType = 'app';

Vue.use(uView);
Vue.use(plugins);
Vue.use(Vuex);
Vue.use(VueQuillEditor)

Vue.prototype.$onfire = onfire;
Vue.prototype.$store = store;

// 多语言
import i18n from '@/locale';

const app = new Vue({
	i18n,
	...App,
	store,
});
require('./utils/request.js')(app);
app.$mount();
// #endif

// #ifdef VUE3
import {
	createSSRApp,
} from 'vue';
export function createApp() {
	const app = createSSRApp(App);
	return {
		app,
	};
}
// #endif
