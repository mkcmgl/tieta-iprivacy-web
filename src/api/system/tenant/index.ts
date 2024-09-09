import request from '@/utils/request';

export function getTenantTreeList() {
    return request({
        url: '/api/system/tenant/getTree',
		method: 'get',
    })
}

export function getTenantDetail(params: object) {
    return request({
        url: '/api/system/tenant/detail',
		method: 'get',
		params
    })
}

export function saveTenant(data: object) {
    return request({
        url: '/api/system/tenant/save',
		method: 'post',
		data
    })
}

export function updateTenant(data: object) {
    return request({
        url: '/api/system/tenant/update',
		method: 'post',
		data
    })
}