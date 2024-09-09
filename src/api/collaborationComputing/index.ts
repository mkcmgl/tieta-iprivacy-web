import request from '@/utils/request';

// 获取协同计算任务列表
export function getListPage(params: object) {
	return request({
		url: '/api/privacy/computeTask/page',
		method: 'get',
		params,
	});
}
//获取协同计算历史列表
export function getHistoryListPage(params: object) {
	return request({
		url: '/api/privacy/computeRecord/page',
		method: 'get',
		params,
	});
}

//删除协同计算任务
export function deleterListItem(params: object) {
	return request({
		url: '/api/privacy/computeTask/delete',
		method: 'delete',
		params,
	});
}

//协同计算停止
export function ceaseTask(data: object) {
  return request({
    url: '',
		method: 'post',
		data,
  })
}

//新增协同计算任务
export function addTask(data: object) {
  return request({
    url: '/api/privacy/computeTask/add',
		method: 'post',
		data,
  })
}

//编辑协同计算任务
export function editTask(data: object) {
  return request({
    url: '/api/privacy/computeTask/edit',
		method: 'post',
		data,
  })
}

//启动协同计算任务
export function firingTask(data: object) {
  return request({
    url: '/api/privacy/computeTask/start',
		method: 'post',
		data,
  })
}

//获取协同计算任务详情
export function getTaskDetail(params: object) {
  return request({
    url: '/api/privacy/computeTask/detail',
    method: 'get',
    params,
  });
}
//获取协同计算任务实例详情
export function getTaskInstanceDetail(params: object) {
  return request({
    url: '/api/privacy/computeRecord/detail',
    method: 'get',
    params,
  });
}

//日志列表
export function fateBoardLog(data:any) {
	return request({
		url: `/api/privacy/fateboard/log/new/${data.jobId}/${data.role}/${data.partyId}/${data.componentId}`,
		method: 'post',
    data: data,
    headers: { "nodeId": data.partyId },
    
	});
}

//日志数量统计
export function fateBoardLogNumber(data:any) {
	return request({
		url: `/api/privacy/fateboard/log/new/${data.jobId}/${data.role}/${data.partyId}/${data.componentId}`,
		method: 'post',
    data: data,
    headers: { "nodeId": data.partyId },
	});
}

//获取项目列表
export function getProjectList(params: object) {
  return request({
    url: '/api/privacy/project/list',
    method: 'get',
    params,
  })
}

export function getProjectDetail(params: object) {
  return request({
    url: '/api/privacy/project/detail',
    method: 'get',
    params,
  })
}


//获取字段
export function getField(params: object) {
  return request({
    url: '/api/privacy/computeTask/projectDataDetail',
    method: 'get',
    params,
  });
}