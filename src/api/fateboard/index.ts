import request from '@/utils/request';

//日志列表
export function fateBoardLog(jobId: string, role: string, partyId: string, componentId: string,data?:object,nodeId?: string) {
	return request({
		url: `/api/privacy/fateboard/log/new/${jobId}/${role}/${partyId}/${componentId}`,
		method: 'post',
		headers:{ "nodeId" : nodeId},
		data:data
	});
}

//日志数量统计
export function fateBoardLogNumber(jobId: string, role: string, partyId: string, componentId: string,data?:object,nodeId?: string) {
	return request({
		url: `/api/privacy/fateboard/log/new/${jobId}/${role}/${partyId}/${componentId}_1720591415825`,
		method: 'post',
		headers:{ "nodeId" : nodeId},
		data:data
	});
}

//任务详情
export function fateBoardProgress(jobId: string, role: string, partyId: string,nodeId?: string) {
	return request({
		url: `/api/privacy/fateboard/progress/${jobId}/${role}/${partyId}`,
		headers:{ "nodeId" : nodeId},
		method: 'get',
	});
}

//获取parameters
export function fateBoardParameters(data?: object,nodeId?: string) {
	return request({
		url: `/api/privacy/fateboard/v1/tracking/component/parameters`,
		method: 'post',
		headers:{ "nodeId" : nodeId},
		data: data,
	});
}
//获取parameters
export function fateBoardPortData(component_name?: string,nodeId?: string) {
	return request({
		url: `/api/privacy/fateboard/v1/tracking/component/config?componentName=${component_name}`,
		method: 'get',
		headers:{ "nodeId" : nodeId}
	});
}

//获取data
export function fateBoardData(data?: object,nodeId?: string) {
	return request({
		url: `/api/privacy/fateboard/v1/tracking/component/output/data`,
		method: 'post',
		headers:{ "nodeId" : nodeId},
		data: data,
	});
}
//下载dag文件
export function fateBoardDagDownload(data?: object,nodeId?: string) {
	return request({
		url: `/api/privacy/fateboard/job/download`,
		method: 'post',
		headers:{ "nodeId" : nodeId},
		data: data,
	});
}

//任务列表
export function fateBoardJob(data?: object,nodeId?: string) {
	return request({
		url: `/api/privacy/fateboard/job/query/page/new`,
		method: 'post',
		headers:{ "nodeId" : nodeId},
		data: data,
	});
}
//获取任务基本信息
export function fateBoardJobQuery(jobId?: string,nodeId?: string) {
	return request({
		url: `/api/privacy/fateboard/job/query/${jobId}`,
		headers:{ "nodeId" : nodeId},
		method: 'get',
	});
}
//获取port output数据
// export function fateBoardPortData(data?: object,nodeId?: string) {
// 	return request({
// 		url: '/api/privacy/fateboard/v1/tracking/component/config',
// 		method: 'get',
// 		headers:{ "nodeId" :nodeId},
// 		params: data,
// 	});
// }

//重启任务
export function rerunJob(data? : object,nodeId?: string) {
	return request({
		url:"/api/privacy/fateboard/job/v1/rerun",
		method:"post",
		headers:{ "nodeId" : nodeId},
		data: data
	})
}
