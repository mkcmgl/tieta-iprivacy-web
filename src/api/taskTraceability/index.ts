import request from '@/utils/request';

//列表
export function getCalculatePage(params: object) {
    return request({
        url: '/api/privacy/calculate/page',
		method: 'get',
		params
    })
}

//隐私求交溯源 1
//联邦建模溯源 0
export function getCalculateDetail(params: object) {
    return request({
        url: '/api/privacy/calculate/detail',
		method: 'get',
		params
    })
}

export function exportCalculate(params: object) {
    return request({
        url:'/api/privacy/calculate/download',
        method:'get',
        params
    })
}
