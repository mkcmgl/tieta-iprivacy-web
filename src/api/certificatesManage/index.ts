import request from '@/utils/request';



export function getCertList(params: object) {
	return request({
		url: '/api/privacy/cert/page',
		method: 'get',
		params,
	});
}
export function addCertList(data: object) {
	return request({
		url: '/api/privacy/cert/add',
		method: 'post',
		data,
	});
}

export function certRenewal(data: object) {
	return request({
		url: '/api/privacy/cert/renewal',
		method: 'post',
		data,
	});
}


export function certRevoke(data: object) {
	return request({
		url: '/api/privacy/cert/revoke',
		method: 'post',
		data,
	});
}

export function deleteCert(params: object) {
	return request({
		url: '/api/privacy/cert/delete',
		method: 'delete',
		params,
	});
}
