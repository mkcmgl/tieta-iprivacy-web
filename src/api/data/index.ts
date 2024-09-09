import request from '@/utils/request';

export function baseInfo(params: object) {
	return request({
		url: '/api/handle/handle/statistics/baseInfo',
		method: 'get',
		params,
	})
}

export function registerStatistics(data: object) {
	return request({
		url: '/api/handle/handle/statistics/registerStatistics',
		method: 'post',
		data,
	})
}

export function analysisStatistics(data: object) {
	return request({
		url: '/api/handle/handle/statistics/analysisStatistics',
		method: 'post',
		data,
	})
}