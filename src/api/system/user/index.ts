import request from '@/utils/request';

export function getUserPermissions(data?: object) {
	return request({
		url: '/api/system/auth/getUserPermissions',
		method: 'post',
		data
	})
}

export function getUserList(params?: object) {
	return request({
		url: '/api/system/user/list',
		method: 'get',
		params
	})
}

export function changeUserStatus(data: object) {
	return request({
		url: '/api/system/user/editStatus',
		method: 'post',
		data
	})
}

export function deleteUser(params: object) {
	return request({
		url: '/api/system/user/delete',
		method: 'put',
		params
	})
}

export function addUser(data?: object) {
	return request({
		url: '/api/system/user/add',
		method: 'post',
		data
	})
}

export function editUser(data: object) {
	return request({
		url: '/api/system/user/edit',
		method: 'post',
		data
	})
}

export function getUserDetail(params: object) {
	return request({
		url: '/api/system/user/detailById',
		method: 'get',
		params
	})
}