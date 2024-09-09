import request from '@/utils/request';

// openApi认证申请列表
export function getApplyList(params: object) {
	return request({
		url: '/api/privacy/openapi/server/page',
		method: 'get',
		params,
	});
}

// / openApi认证申请详情
export function getApplyDetail(params: object) {
  return request({
		url: '/api/privacy/openapi/server/detail',
		method: 'get',
		params,
	});
}

//openApi认证申请操作手册下载
export function getApplyManual(params: object) {
  return request({
		url: '',
		method: 'get',
		params,
	});
}

//openApi认证申请新增
export function addApply(data: object) {
  return request({
		url: '/api/privacy/openapi/server/add',
		method: 'post',
		data,
	});
}

// openApi认证审核列表
export function getExamineList(params: object) {
  return request({
		url: '/api/privacy/openapi/server/page',
		method: 'get',
		params,
	});
}

//openApi认证审核详情
export function getExamineDetail(params: object) {
  return request({
		url: '/api/privacy/openapi/server/detail',
		method: 'get',
		params,
	});
}

//openApi认证审核审批
export function examineApply(data: object) {
  return request({
		url: '/api/privacy/openapi/server/audit',
		method: 'post',
		data,
	});
}


//获取节点列表
export function getNodeList(params: object) {
  return request({
		url: '/api/privacy/openapi/server/nodeList',
		method: 'get',
		params,
	});
}