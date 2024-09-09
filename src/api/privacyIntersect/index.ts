import request from '@/utils/request';

// 获取隐私求交任务列表
export function getPrivacyList(params: object) {
	return request({
		url: '/api/privacy/psiTask/page',
		method: 'get',
		params,
	});
}

// 获取隐私求交历史列表
export function getPrivacyHistoryList(params: object) {
	return request({
		url: '/api/privacy/psiRecord/page',
		method: 'get',
		params,
	});
}

//修改隐私历史状态
export function editHistoryStatus(data: object) {
	return request({
		url: '/api/privacy/psiRecord/updateStatusByIds',
		method: 'post',
		data,
	});
}


//删除隐私求交任务
export function deletePrivacy(data: any) {
  return request({
    url: `/api/privacy/psiTask/delete?taskId=${data.taskId}`,
		method: 'delete',
		data,
  })
}

//停止隐私求交任务
export function stopPrivacy(data: any) {
  return request({
    url: `/api/privacy/psiRecord/stop?recordId=${data.recordId}&componentName=${data.componentName}`,
		method: 'post',
		data,
  })
}

//启动隐私求交任务
export function startPrivacy(data: object) {
  return request({
    url: '/api/privacy/psiTask/start',
		method: 'post',
		data,
  })
}

//新增隐私求交任务
export function addPrivacy(data: object) {
  return request({
    url: '/api/privacy/psiTask/add',
		method: 'post',
		data,
  })
}

//编辑隐私求交任务
export function editPrivacy(data: object) {
  return request({
    url: '/api/privacy/psiTask/edit',
    method: 'post',
    data,
  })
}

//隐私求交任务详情
export function getPrivacyDetail(params: object) {
  return request({
    url: '/api/privacy/psiTask/detail',
    method: 'get',
    params,
  })
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

//隐私求交实例详情
export function getPrivacyInstanceDetail(params: object) {
	return request({
		url: '/api/privacy/psiRecord/detail',
		method: 'get',
		params,
	});
}

//隐私求交项目列表
export function getPrivacyProjectList(params: object) {
  return request({
    url: '/api/privacy/project/list',
    method: 'get',
    params,
  })
}

//隐私求交项目详情
export function getPrivacyProjectDetail(params: object) {
  return request({
    url: '/api/privacy/project/detail',
    method: 'get',
    params,
  })
}



//隐私计算下载结果
export function downloadPrivacyResult(params: object) {
  return request({
    url: '/api/privacy/psiRecord/download',
    method: 'get',
    responseType: 'blob',
    params,
  })
}

//隐私计算查看结果
export function getPrivacyResult(params: object) {
  return request({
    url: '/api/privacy/psiRecord/preview',
    method: 'get',
    params,
  })
}