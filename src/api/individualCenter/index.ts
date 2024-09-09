import request from '@/utils/request';

export function getUserDetail(params?: object) {
    return request({
		url: '/api/system/user/detail',
		method: 'get',
		params
	})
}

export function changePasswordByUser(data?: object) {
	return request({
		url: '/api/system/user/changePassword',
		method: 'post',
		data
	})
}

export function changePhone(data?: object) {
	return request({
		url: '/api/system/user/changePhone',
		method: 'post',
		data
	})
}

export function sendSmsCodeByUser(data?: object) {
	return request({
		url: '/api/system/smsCode/sendSmsCodeByUser',
		method: 'post',
		data
	})
}

export function sendSmsCodeByPhone(data?: object) {
	return request({
		url: '/api/system/smsCode/sendSmsCodeByPhone',
		method: 'post',
		data
	})
}