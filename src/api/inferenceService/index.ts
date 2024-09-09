import request from '@/utils/request';

export function getModelPage(params: object) {
    return request({
        url: '/api/privacy/model/page',
		method: 'get',
		params
    })
}

export function getOfflineServicePage(params: object) {
    return request({
        url: '/api/privacy/offlineService/page',
		method: 'get',
		params
    })
}

export function getModelDetail(params: object) {
    return request({
        url: '/api/privacy/model/detail',
		method: 'get',
		params
    })
}

export function getProjectDetail(params: object) {
    return request({
        url: '/api/privacy/project/detail',
		method: 'get',
		params
    })
}

export function modelDel(params: object) {
    return request({
        url: '/api/privacy/model/delete',
		method: 'get',
		params
    })
}

export function serviceStop(params: object) {
    return request({
        url: '/api/privacy/offlineService/stop',
		method: 'get',
		params
    })
}

export function offlineServiceStart(data: object) {
    return request({
        url: '/api/privacy/model/offlineServiceStart',
		method: 'post',
		data
    })
}

export function offlineServiceDownload(params?: object) {
    return request({
        url: '/api/privacy/offlineService/download',
		method: 'get',
		params,
        responseType: 'blob'
    })
}

export function getOfflineServiceDetail(params: object) {
    return request({
        url: '/api/privacy/offlineService/detail',
		method: 'get',
		params
    })
}