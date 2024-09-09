import request from '@/utils/request';

export function getOrganizeList(params: object) {
	return request({
		url: '/api/system/server/organize/page',
		method: 'get',
		params
	})
}

export function getOrganizeDetail(params: object) {
	return request({
		url: '/api/system/server/organize/detail',
		method: 'get',
		params
	})
}

export function auditOrganize(data: object) {
	return request({
		url: '/api/system/server/organize/audit',
		method: 'post',
		data,
	})
}
