import request from '@/utils/request';

export function getMenuTree(params: object) {
	return request({
		url: '/api/system/menu/treeList',
		method: 'get',
		params
	})
}

