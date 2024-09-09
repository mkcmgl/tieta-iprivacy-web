import request from '@/utils/request';


//获取溯源节点列表
export function getNodePage(params: object) {
    return request({
        url: '/api/privacy/nodeBehavior/nodePage',
		method: 'get',
		params
    })
}
//获取溯源节点操作记录
export function getNodeBehaviorList(params: object) {
    return request({
        url: '/api/privacy/nodeBehavior/list',
		method: 'get',
		params
    })
}
//获取溯源节点操作记录详情
export function getNodeBehaviorDetail(params: object) {
    return request({
        url: '/api/privacy/nodeBehavior/detail',
		method: 'get',
		params
    })
}
//溯源节点操作记录导出
export function exportNodeList(params: object) {
    return request({
        url: '/api/privacy/nodeBehavior/exportList',
		method: 'get',
		params
    })
}


//获取溯源审计数据列表
export function getDataPage(params: object) {
    return request({
        url: '/api/privacy/dataBehavior/dataPage',
		method: 'get',
		params
    })
}
//获取溯源数据操作记录
export function getDataBehaviorList(params: object) {
    return request({
        url: '/api/privacy/dataBehavior/list',
		method: 'get',
		params
    })
}
//获取溯源数据操作记录详情
export function getDataBehaviorDetail(params: object) {
    return request({
        url: '/api/privacy/dataBehavior/detail',
		method: 'get',
		params
    })
}
//溯源数据操作记录导出
export function exportDataList(params: object) {
    return request({
        url: '/api/privacy/dataBehavior/exportList',
		method: 'get',
		params
    })
}


//获取溯源审计项目列表
export function getProjectPage(params: object) {
    return request({
        url: '/api/privacy/projectBehavior/projectPage',
		method: 'get',
		params
    })
}
//获取溯源项目操作记录
export function getProjectBehaviorList(params: object) {
    return request({
        url: '/api/privacy/projectBehavior/list',
		method: 'get',
		params
    })
}
//获取溯源项目操作记录详情
export function getProjectBehaviorDetail(params: object) {
    return request({
        url: '/api/privacy/projectBehavior/detail',
		method: 'get',
		params
    })
}
//溯源项目操作记录导出
export function exportProjectList(params: object) {
    return request({
        url: '/api/privacy/projectBehavior/exportList',
		method: 'get',
		params
    })
}