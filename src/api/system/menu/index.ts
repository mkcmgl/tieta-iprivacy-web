import request from '@/utils/request';

/**
 * 以下为模拟接口地址，gitee 的不通，就换自己的真实接口地址
 *
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 后端控制菜单模拟json
 * 后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
 * @method getAdminMenu 获取后端动态路由菜单(admin)
 * @method getTestMenu 获取后端动态路由菜单(test)
 */
export function useMenuApi() {
	return {
		getAdminMenu: (params?: object) => {
			return request({
				url: '',
				method: 'get',
				params,
			});
		},
		getTestMenu: (params?: object) => {
			return request({
				url: '',
				method: 'get',
				params,
			});
		},
	};
}

export function menuList(params: object) {
	return request({
		url: '/api/system/menu/list',
		method: 'get',
		params,
	})
}

export function menuTreeList(params: object) {
	return request({
		url: '/api/system/menu/treeList',
		method: 'get',
		params,
	})
}

export function menuSave(data: object) {
	return request({
		url: '/api/system/menu/save',
		method: 'post',
		data,
	})
}

export function menuUpdate(data: object) {
	return request({
		url: '/api/system/menu/update',
		method: 'post',
		data,
	})
}

export function menuDelete(params: object) {
	return request({
		url: '/api/system/menu/delete',
		method: 'delete',
		params,
	})
}