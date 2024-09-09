import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import pinia from '@/stores/index';
import { storeToRefs } from 'pinia';
import { useKeepALiveNames } from '@/stores/keepAliveNames';
import { useRoutesList } from '@/stores/routesList';
import { useOrganizeDetail } from '@/stores/organizeDetail';
import { Session, tokenName } from '@/utils/storage';
import { staticRoutes, notFoundAndNoPower } from '@/router/route';
import { initFrontEndControlRoutes } from '@/router/frontEnd';

// 读取 `/src/stores/organizeDetail.ts` 判断当前用户是否提交过申请 0未提交  1已提交 为0则限制相关业务
const storesOrganizeDetail = useOrganizeDetail(pinia);
const { organizeDetail } = storeToRefs(storesOrganizeDetail);

/**
 * 创建一个可以被 Vue 应用程序使用的路由实例
 * @method createRouter(options: RouterOptions): Router
 * @link 参考：https://next.router.vuejs.org/zh/api/#createrouter
 */
export const router = createRouter({
	history: createWebHashHistory(),
	/**
	 * 说明：
	 * 1、notFoundAndNoPower 默认添加 404、401 界面，防止一直提示 No match found for location with path 'xxx'
	 * 2、backEnd.ts(后端控制路由)、frontEnd.ts(前端控制路由) 中也需要加 notFoundAndNoPower 404、401 界面。
	 *    防止 404、401 不在 layout 布局中，不设置的话，404、401 界面将全屏显示
	 */
	routes: [...notFoundAndNoPower, ...staticRoutes],
});

/**
 * 路由多级嵌套数组处理成一维数组
 * @param arr 传入路由菜单数据数组
 * @returns 返回处理后的一维路由菜单数组
 */
export function formatFlatteningRoutes(arr: any) {
	if (arr.length <= 0) return false;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].children) {
			arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1));
		}
	}
	return arr;
}

/**
 * 一维数组处理成多级嵌套数组（只保留二级：也就是二级以上全部处理成只有二级，keep-alive 支持二级缓存）
 * @description isKeepAlive 处理 `name` 值，进行缓存。顶级关闭，全部不缓存
 * @link 参考：https://v3.cn.vuejs.org/api/built-in-components.html#keep-alive
 * @param arr 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成 `定义动态路由（dynamicRoutes）` 的格式
 */
export function formatTwoStageRoutes(arr: any) {
	if (arr.length <= 0) return false;
	const newArr: any = [];
	const cacheList: Array<string> = [];
	arr.forEach((v: any) => {
		if (v.path === '/') {
			newArr.push({ component: v.component, name: v.name, path: v.path, redirect: v.redirect, meta: v.meta, children: [] });
		} else {
			// 判断是否是动态路由（xx/:id/:name），用于 tagsView 等中使用
			if (v.path.indexOf('/:') > -1) {
				v.meta['isDynamic'] = true;
				v.meta['isDynamicPath'] = v.path;
			}
			newArr[0].children.push({ ...v });
			// 存 name 值，keep-alive 中 include 使用，实现路由的缓存
			// 路径：@/layout/routerView/parent.vue
			if (newArr[0].meta.isKeepAlive && v.meta.isKeepAlive) {
				cacheList.push(v.name);
				const stores = useKeepALiveNames(pinia);
				stores.setCacheKeepAlive(cacheList);
			}
		}
	});
	return newArr;
}

// 路由加载前
// 路由加载前
router.beforeEach(async (to, from, next) => {
	NProgress.configure({ showSpinner: false });
	if (to.meta.title) NProgress.start();
	const token = Session.get(tokenName);
	const whitePath = ['/login', '/register', '/forgotPwd'];
	if (whitePath.includes(to.path) && !token) {
		next();
		NProgress.done();
	} else {
		if (!token) {
			next('/login');
			Session.clear();
			NProgress.done();
		} else if (token && to.path === '/login') {
			next('/home');
			NProgress.done();
		} else {
			const storesRoutesList = useRoutesList(pinia);
			const { routesList } = storeToRefs(storesRoutesList);
			if (routesList.value.length === 0) {
				await initFrontEndControlRoutes();
				next({ path: to.path, query: to.query });
			} else {
				if (organizeDetail.value.orgRegisterState === 1 && organizeDetail.value.auditState === '1') {
					next();
				} else {
					if (
						to.fullPath === '/system/enterpriseinfo' ||
						to.fullPath === '/system/enterpriseinfo/add?type=edit' ||
						to.fullPath === '/system/enterpriseinfo/add?type=add' || to.fullPath === '/openApi/apply'
					) {
						next();
					} else {
						next('/system/enterpriseinfo');
					}
				}
			}
		}
	}
});

// 路由加载后
router.afterEach(() => {
	NProgress.done();
});

// 导出路由
export default router;
