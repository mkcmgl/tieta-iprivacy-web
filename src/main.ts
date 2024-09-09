import { createApp, defineAsyncComponent } from 'vue';
import pinia from '@/stores/index';
import App from '@/App.vue';
import router from '@/router';
import { directive } from '@/directive/index';
import other from '@/utils/other';

import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import '@/theme/index.scss';
import md5 from 'js-md5';
import $ from 'jquery';
import JsonViewer from 'vue-json-viewer';
import { hiPrintPlugin } from 'vue-plugin-hiprint';
import dagGraphic from '@/packages/fate-visualization/lib/DAGGraphic';
hiPrintPlugin.disAutoConnect();

const app = createApp(App);
app.config.globalProperties.$md5 = md5;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component);
}

directive(app);
other.elSvg(app);
dagGraphic(app);

app.use(pinia).use(router).use(ElementPlus).use(hiPrintPlugin).mount('#app');
app.use(JsonViewer)
other.pagination(app);

export { default as FDag } from '@/packages/fate-visualization/lib/DAGGraphic/DAG.vue';
