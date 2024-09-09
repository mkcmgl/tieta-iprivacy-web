import request from '@/utils/request';


// 数据脱敏任务列表
export function dataTaskList(params: object) {
	return request({
		url: '/api/privacy/desensitizeTask/page',
		method: 'get',
		params,
	})
}

//数据脱敏任务启动
export function dataTaskStart(params: object) {
  return request({
		url: '/api/privacy/desensitizeTask/start',
		method: 'get',
		params,
	})
}

//数据脱敏任务删除
export function dataTaskDelete(params: object) {
  return request({
		url: '/api/privacy/desensitizeTask/delete',
		method: 'delete',
		params,
	})
}

// 数据脱敏任务详情
export function dataTaskDetail(params: object) {
  return request({
		url: '/api/privacy/desensitizeTask/detail	',
		method: 'get',
		params,
	})
}

// 数据脱敏任务新增
export function dataTaskAdd(data: object) {
  return request({
		url: '/api/privacy/desensitizeTask/add',
		method: 'post',
		data,
	})
}

// 数据脱敏任务编辑
export function dataTaskEdit(data: object) {
  return request({
		url: '/api/privacy/desensitizeTask/edit',
		method: 'put',
		data,
	})
}

//脱敏策略列表
export function getDataTacticsList(params: object) {
  return request({
		url: '/api/privacy/desensitizeStrategy/list',
		method: 'get',
		params,
	})
}

// 脱敏数据列表
export function getDataList(params: object) {
  return request({
		url: '/api/privacy/data/dataListEffective',
		method: 'get',
		params,
	})
}

//脱密数据结果保存位置列表
export function savePositionList(params: object) {
  return request({
		url: '',
		method: 'get',
		params,
	})
}

// 数据脱敏策略列表
export function dataTacticsList(params: object) {
  return request({
		url: '/api/privacy/desensitizeStrategy/page',
		method: 'get',
		params,
	})
}

//脱敏数据策略启动
export function dataTacticsStart(params: object) {
  return request({
		url: '',
		method: 'post',
		params,
	})
}

//脱敏数据策略删除
export function dataTacticsDelete(params: object) {
  return request({
		url: '/api/privacy/desensitizeStrategy/delete',
		method: 'delete',
		params,
	})
}

//脱敏策略新增
export function dataTacticsAdd(data: object) {
  return request({
		url: '/api/privacy/desensitizeStrategy/add',
		method: 'post',
		data,
	})
}

//脱敏策略编辑 
export function dataTacticsEdit(data: object) {
  return request({
		url: '/api/privacy/desensitizeStrategy/edit',
		method: 'put',
		data,
	})
}

//脱敏策略数据测试
export function dataTacticsTest(params: object) {
  return request({
		url: '/api/privacy/desensitizeStrategy/generateTestsData',
		method: 'get',
		params,
	})
}

//脱敏策略详情
export function dataTacticsDetail(params: object) {
  return request({
		url: '/api/privacy/desensitizeStrategy/detail',
		method: 'get',
		params,
	})
}

//下载
export function dataTacticsDownload(params: object) {
  return request({
		url: '/api/privacy/desensitizeTask/download',
		method: 'get',
    responseType: 'blob',
		params,
	})
}