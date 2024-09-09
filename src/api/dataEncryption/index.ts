import request from '@/utils/request';


//加密任务列表
export function getEncryptionTaskList(params: object) {
  return request({
    url: '/api/privacy/encryptionTask/page',
    method: 'get',
    params
  });
}

//加密任务启动
export function encryptionTaskStart(params: object) {
  return request({
    url: '/api/privacy/encryptionTask/start',
    method: 'get',
    params
  });
}

//加密任务删除
export function encryptionTaskDelete(params: object) {
  return request({
    url: '/api/privacy/encryptionTask/delete',
    method: 'delete',
    params
  });
}

//加密任务详情
export function encryptionTaskDetail(params: object) {
  return request({
    url: '/api/privacy/encryptionTask/detail',
    method: 'get',
    params
  });
}

//加密任务新增
export function encryptionTaskAdd(data: object) {
  return request({
    url: '/api/privacy/encryptionTask/add',
    method: 'post',
    data
  });
}

//加密任务编辑
export function encryptionTaskEdit(data: object) {
  return request({
    url: '/api/privacy/encryptionTask/edit',
    method: 'put',
    data
  });
}

//加密策略列表
export function getDataTacticsList(params: object) {
  return request({
		url: '/api/privacy/encryptionStrategy/list',
		method: 'get',
		params,
	})
}


// 加密数据列表
export function getDataList(params: object) {
  return request({
		url: '/api/privacy/data/dataListEffective',
		method: 'get',
		params,
	})
}

//加密数据结果保存位置列表
export function savePositionList(params: object) {
  return request({
		url: '',
		method: 'get',
		params,
	})
}


//加密策略列表
export function dataTacticsList(params: object) {
  return request({
		url: '/api/privacy/encryptionStrategy/page',
		method: 'get',
		params,
	})
}

//加密策略启动
export function dataTacticsStart(data: object) {
  return request({
		url: '',
		method: 'post',
		data,
	})
}

//加密策略删除
export function dataTacticsDelete(params: object) {
  return request({
		url: '/api/privacy/encryptionStrategy',
		method: 'delete',
		params,
	})
}

//加密策略新增
export function dataTacticsAdd(data: object) {
  return request({
		url: '/api/privacy/encryptionStrategy/add',
		method: 'post',
		data,
	})
}

//加密策略编辑
export function dataTacticsEdit(data: object) {
  return request({
		url: '/api/privacy/encryptionStrategy/edit',
		method: 'put',
		data,
	})
}

//加密策略生成密钥
export function dataTacticsGenerateKey(params: object) {
  return request({
		url: '/api/privacy/encryptionStrategy/generateKey',
		method: 'get',
		params,
	})
}

//加密策略测试数据
export function dataTacticsTestData(params: object) {
  return request({
		url: '/api/privacy/encryptionStrategy/generateTestData',
		method: 'get',
		params,
	})
}

//加密策略非对称
export function dataTacticsAsymmetric(params: object) {
  return request({
		url: '/api/privacy/encryptionStrategy/asymmetric',
		method: 'get',
		params,
	})
}

//加密策略详情
export function dataTacticsDetail(params: object) {
  return request({
		url: '/api/privacy/encryptionStrategy/detail',
		method: 'get',
		params,
	})
}

//下载
export function dataTacticsDownload(params: object) {
  return request({
		url: '/api/privacy/encryptionTask/download',
		method: 'get',
    responseType: 'blob',
		params,
	})
}