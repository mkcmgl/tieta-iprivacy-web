import request from '@/utils/request';

export function getMainPage(params: object) {
	return request({
		url: '/api/base/dict/getMainPage',
		method: 'get',
		params,
	});
}

export function newMainDict(data: object) {
	return request({
		url: '/api/base/dict/saveOrUpdateMain',
		method: 'post',
		data,
	});
}

export function getDetailMain(params: object) {
	return request({
		url: '/api/base/dict/detailMain',
		method: 'get',
		params,
	});
}

export function deleteMain(params: object) {
	return request({
		url: '/api/base/dict/deleteMain',
		method: 'get',
		params,
	});
}

export function extList(params: object) {
	return request({
		url: '/api/base/dict/extList',
		method: 'get',
		params,
	});
}

export function newExtDict(data: object) {
	return request({
		url: '/api/base/dict/saveOrUpdateExt',
		method: 'post',
		data,
	});
}

export function getDetailExt(params: object) {
	return request({
		url: '/api/base/dict/detailExt',
		method: 'get',
		params,
	});
}

export function deleteExt(params: object) {
	return request({
		url: '/api/base/dict/deleteExt',
		method: 'get',
		params,
	});
}

export function changeExtState(data: object) {
	return request({
		url: '/api/base/dict/changeExtState',
		method: 'post',
		data,
	});
}
