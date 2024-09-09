import request from '@/utils/request';

// 获取匿踪查询任务列表
export function getHiddenList(params: object) {
	return request({
		url: '',
		method: 'get',
		params,
	});
}

//匿踪查询历史任务停止
export function stopHiddenTask(params: object) {
  return request({
    url: '',
    method: 'get',
    params,
  });
}

//获取匿踪查询历史人物列表
export function getHiddenHistoryList(params: object) {
  return request({
    url: '',
    method: 'get',
    params,
  });
}

//匿踪任务启动
export function startHiddenTask(data: object) {
  return request({
    url: '',
    method: 'post',
    data,
  });
}

//匿踪任务删除
export function deleteHiddenTask(params: object) {
  return request({
    url: '',
    method: 'delete',
    params,
  });
}

//匿踪查询新增
export function addHiddenTask(data: object) {
  return request({
    url: '',
    method: 'post',
    data,
  });
}

//匿踪查询修改
export function updateHiddenTask(data: object) {
  return request({
    url: '',
    method: 'post',
    data,
  });
}

//匿踪查询任务详情
export function getHiddenTaskDetail(params: object) {
  return request({
    url: '',
    method: 'get',
    params,
  });
}

// 匿踪查询历史任务详情
export function getHiddenHistoryTaskDetail(params: object) {
  return request({
    url: '',
    method: 'get',
    params,
  });
}
//匿踪查询日志
export function getHiddenTaskLog(params: object) {
  return request({
    url: '',
    method: 'get',
    params,
  });
}

//获取项目列表
export function getProjectList(params: object) {
  return request({
    url: '',
    method: 'get',
    params,
  });
}

//获取节点列表
export function getNodeList(params: object) {
  return request({
    url: '',
    method: 'get',
    params,
  });
}

//获取数据列表
export function getDataList(params: object) {
  return request({
    url: '',
    method: 'get',
    params,
  });
}

//获取字段列表
export function getFieldList(params: object) {
  return request({
    url: '',
    method: 'get',
    params,
  });
}

//匿踪查询结果下载
export function downloadHiddenResult(params: object) {
  return request({
    url: '',
    method: 'get',
    responseType:'blob',
    params,
  });
}

//匿踪查询结果查看
export function getHiddenResult(params: object) {
  return request({
    url: '',
    method: 'get',
    params,
  });
}