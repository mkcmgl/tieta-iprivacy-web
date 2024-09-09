import request from '@/utils/request';

export function getOrganizeDetail(params?: object) {
	return request({
		url: '/api/system/organize/detail',
		method: 'get',
		params
	})
}

export function organizeAdd(data: object) {
	return request({
		url: '/api/system/organize/add',
		method: 'post',
		data,
	})
}

export function organizeUpdate(data: object) {
	return request({
		url: '/api/system/organize/update',
		method: 'post',
		data,
	})
}
