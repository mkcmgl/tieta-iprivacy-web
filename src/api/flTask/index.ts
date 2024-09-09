import request from '@/utils/request';

export function editFlTask(data?: object) {
	return request({
		url: '/api/privacy/flTask/edit',
		method: 'post',
		data,
	});
}

export function getFlTaskList(params?: object) {
	return request({
		url: '/api/privacy/flTask/page',
		method: 'get',
		params,
	});
}

export function getFlTaskDetail(params?: object) {
	return request({
		url: '/api/privacy/flTask/detail',
		method: 'get',
		params,
	});
}

export function addFlTask(data?: object) {
	return request({
		url: '/api/privacy/flTask/add',
		method: 'post',
		data,
	});
}

export function checkFlTask(data?: object) {
	return request({
		url: '/api/privacy/flTask/check',
		method: 'post',
		data,
	});
}

export function getFlRecordList(params?: object) {
	return request({
		url: '/api/privacy/flRecord/page',
		method: 'get',
		params,
	});
}

export function getDataListEffective(params? :object) {
	return request({
		url:'/api/privacy/data/dataListEffective',
		method:'get',
		params
	})
}
export function getNodeListEffective(params? :object) {
	return request({
		url:'/api/privacy/node/listEffective',
		method:'get',
		params
	})
}
export function startFlTask(data?: object) {
	return request({
		url: '/api/privacy/flTask/start',
		method: 'post',
		data,
	});
}

export function stopFlTask(params?: object) {
	return request({
		url: '/api/privacy/flRecord/stop',
		method: 'get',
		params,
	});
}


//模型提交
export function modelAdd(data?: object) {
	return request({
		url: `/api/privacy/model/add`,
		method: 'post',
		data: data,
	});
}

export function deleteFlTask(params?: object) {
	return request({
		url: '/api/privacy/flTask/delete',
		method: 'get',
		params,
	});
}

export function flRecordDownload(params?:object) {
	return request({
		url:'/api/privacy/flRecord/download',
		method:'get',
		params
	})
}