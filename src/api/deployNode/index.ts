import request from '@/utils/request';


// 新增可视化部署
export function addDeployNode(data: object) {
	return request({
		url: '/api/privacy/depNodeInfo/add',
		method: 'post',
		data,
	});
}

//可视化部署列表
export function getDeployNodeList(params: object) {
  return request({
		url: '/api/privacy/depNodeInfo/page',
		method: 'get',
		params,
	});
}

//可视化部署详情
export function getDeployNodeDetail(params: object) {
  return request({
		url: '/api/privacy/depNodeInfo/detail',
		method: 'get',
		params,
	});
}

//根据节点名称生成节点id
export function getNodeIdByName(params: object) {
  return request({
		url: '/api/privacy/depNodeInfo/getPartyId',
		method: 'get',
		params,
	});
}

//k8s资源验证
export function k8sResourceValidate(data: object) {
  return request({
		url: '/api/privacy/depNodeInfo/checkK8s',
		method: 'post',
		data,
	});
}

// 获取命名空间
export function getNamespaceList(params: object) {
  return request({
		url: '/api/privacy/depNodeInfo/getNamespaceListByUser',
		method: 'POST',
		params,
	});
}

//资源重启
export function restartResource(data: object) {
  return request({
		url: '/api/privacy/depNodeInfo/update',
		method: 'put',
		data,
	});
}