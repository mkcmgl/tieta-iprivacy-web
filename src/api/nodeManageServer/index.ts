import request from '@/utils/request';

export function getNodeList(params: object) {
	return request({
		url: '/api/privacy/snode/page',
		method: 'get',
		params,
	});
}

export function updateStatus(data: object) {
	return request({
		url: '/api/privacy/snode/updateStatus',
		method: 'post',
		data,
	});
}

export function audit(data: object) {
	return request({
		url: '/api/privacy/snode/audit',
		method: 'post',
		data,
	});
}

export function snodeDetail(params: object) {
	return request({
		url: '/api/privacy/snode/detail',
		method: 'get',
		params,
	});
}
