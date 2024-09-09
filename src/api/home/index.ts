import request from '@/utils/request';

export function getDeviceIndex(params?: object) {
	return request({
		url: '/api/device/device/deviceIndex',
		method: 'get',
		params
	})
}

export function getResourceOverview(params?: object) {
	return request({
		url: '/api/privacy/gather/resourceOverview',
		method: 'get',
	})
}