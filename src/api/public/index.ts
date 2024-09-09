import request from '@/utils/request';
import { setAjaxUrl } from '@/utils/PlatformName';

export function sendSmsCode(data: object) {
	return request({
		url: '/api/system/smsCode/sendSmsCode',
		method: 'post',
		data
	})
}

export function sendSmsCodeByPhone(data: object) {
	return request({
		url: '/api/system/smsCode/sendSmsCodeByPhone',
		method: 'post',
		data
	})
}

export function forgetPassword(data: object) {
	return request({
		url: '/api/system/user/forgetPassword',
		method: 'post',
		data
	})
}

export function getZoneInfo(params: object) {
	return request({
		url: '/api/system/zone/getZoneInfo',
		method: 'get',
		params
	})
}

export function getIndustryCategoryNew(params: object) {
	return request({
		url: '/api/base/industry/getIndustryCategoryNew',
		method: 'get',
		params,
	})
}

// 查询字典值
export function getDict(params?: object) {
	return request({
		url: '/api/base/dict/get',
		method: 'get',
		params
	})
}

// 上传文件
export function upload(data: object) {
	return request({
		url: setAjaxUrl(),
		method: 'post',
		headers: { "Content-Type": "multipart/form-data" },
		data
	})
}

// 修改密码
export function changePassword(data: object) {
	return request({
		url: '/api/system/user/changePassword',
		method: 'post',
		data
	})
}

// 获取组织机构不分页
export function getOrgList() {
    return request({
        url: '/api/system/org/list',
		method: 'get',
    })
}

export function getOrgListBylevel() {
    return request({
        url: '/api/system/org/listWithLevel',
		method: 'get',
    })
}

// 图片下载
export function downloadImg(data: object) {
	return request({
		url: '/api/system/file/download',
		method: 'post',
		responseType: 'blob',
		data
	})
}

