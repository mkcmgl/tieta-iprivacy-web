import request from '@/utils/request';

export function getNodeList(params: object) {
	return request({
		url: '/api/privacy/node/page',
		method: 'get',
		params,
	});
}

export function addNode(data: object) {
	return request({
		url: '/api/privacy/node/add',
		method: 'post',
		data,
	});
}

export function nodeDetail(params: object) {
	return request({
		url: '/api/privacy/node/detail',
		method: 'get',
		params,
	});
}
export function editNode(data: object) {
	return request({
		url: '/api/privacy/node/update',
		method: 'put',
		data,
	});
}
export function deleteNode(params: object) {
	return request({
		url: '/api/privacy/node/delete',
		method: 'delete',
		params,
	});
}
export function nodeList() {
	return request({
		url: '/api/privacy/node/list',
		method: 'get',
	});
}
export function deleteBatch(data: object) {
	return request({
		url: '/api/privacy/node/deleteBatch',
		method: 'post',
		data,
	});
}
export function extList(params: object) {
	return request({
		url: '/api/system/dict/extList',
		method: 'get',
		params,
	});
}
export function updateActivation(data: object) {
	return request({
		url: '/api/privacy/node/updateActivation',
		method: 'put',
		data,
	});
}
export function nodeOnlineState(params: object) {
	return request({
		url: '/api/system/dict/get',
		method: 'get',
		params,
	});
}

export function updateStatusByIds(data: object) {
	return request({
		url: '/api/privacy/node/updateStatusByIds',
		method: 'post',
		data,
	});
}
// export function getRoleList(data: object) {
//     return request({
//         url: '/api/system/role/list',
//         method: 'post',
//         data
//     })
// }

// export function setRole(data: object) {
//     return request({
//         url: '/api/system/role/save',
//         method: 'post',
//         data
//     })
// }

// export function changeRoleStatus(params: object) {
//     return request({
//         url: '/api/system/role/changeStatus',
//         method: 'get',
//         params
//     })
// }

// export function deleteRole(params: object) {
//     return request({
//         url: '/api/system/role/delete',
//         method: 'get',
//         params
//     })
// }

// export function updateRole(data: object) {
//     return request({
//         url: '/api/system/role/update',
//         method: 'post',
//         data
//     })
// }

// // 不分页列表
// export function getList(data: object) {
//     return request({
//         url: '/api/system/role/getList',
//         method: 'post',
//         data
//     })
// }
