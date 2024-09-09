import request from '@/utils/request';

export function dataFilePreview(params: object) {
	return request({
		url: '/api/privacy/data/preview',
		method: 'get',
		params,
	});
}

export function getDataList(params: object) {
	return request({
		url: '/api/privacy/data/page',
		method: 'get',
		params,
	});
}
export function saveData(data: object) {
	return request({
		url: '/api/privacy/data/save',
		method: 'post',
		data,
	});
}
export function editData(data: object) {
	return request({
		url: '/api/privacy/data/edit',
		method: 'post',
		data,
	});
}
export function deleteData(params: object) {
	return request({
		url: '/api/privacy/data/delete',
		method: 'delete',
		params,
	});
}
export function deleteBatch(params: object) {
	return request({
		url: '/api/privacy/data/deleteBatch',
		method: 'delete',
		params,
	});
}

export function dataRegister(data: object) {
	return request({
		url: '/api/privacy/data/dataRegister',
		method: 'post',
		data,
	});
}

export function dataRegisterDetail(params: object) {
	return request({
		url: '/api/privacy/data/dataRegisterDetail',
		method: 'get',
		params,
	});
}
export function dataDetail(params: object) {
	return request({
		url: '/api/privacy/data/detail',
		method: 'get',
		params,
	});
}
export function projectDataDetail(params: object) {
	return request({
		url: '/api/privacy/project/projectDataDetail',
		method: 'get',
		params,
	});
}


export function getDataType(params: object) {
	return request({
		url: '/api/system/dict/get',
		method: 'get',
		params,
	});
}
export function nodeList() {
	return request({
		url: '/api/privacy/node/list',
		method: 'get',
	});
}


export function nodeListEffective() {
	return request({
		url: '/api/privacy/node/listEffective',
		method: 'get',
	});
}



export function getManData(params: object) {
	return request({
		url: '/api/privacy/data/mandate',
		method: 'get',
		params,
	});
}
export function getUseData(params: object) {
	return request({
		url: '/api/privacy/data/useDate',
		method: 'get',
		params,
	});
}

export function checkLinkConnectTables(data: object) {
	return request({
		url: '/api/privacy/data/getConnectTables',
		method: 'post',
		data,
	});
}

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
