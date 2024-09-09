import request from '@/utils/request';

export function getRoleList(params?: object) {
	return request({
		url: '/api/system/role/list',
		method: 'get',
		params
	})
}

export function setRole(data: object) {
	return request({
		url: '/api/system/role/save',
		method: 'post',
		data
	})
}

export function changeRoleStatus(params: object) {
	return request({
		url: '/api/system/role/changeStatus',
		method: 'get',
		params
	})
}

export function deleteRole(params: object) {
	return request({
		url: '/api/system/role/delete',
		method: 'delete',
		params
	})
}

export function updateRole(data: object) {
	return request({
		url: '/api/system/role/update',
		method: 'post',
		data
	})
}

// 不分页列表
export function getList(params: object) {
	return request({
		url: '/api/system/role/getList',
		method: 'get',
		params
	})
}