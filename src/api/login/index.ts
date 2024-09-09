import request from '@/utils/request';

export function login(data: object) {
	return request({
		url: '/api/system/auth/login',
		method: 'post',
		data,
	})
}

export function logout(data?: object) {
	return request({
		url: '/api/system/auth/logout',
		method: 'post',
		data,
	})
}

export function ssoLogin(data?: object) {
	return request({
		url: '/api/system/auth/cpn/sso/login',
		method: 'post',
		data,
	})
}

export function getCaptchaImage(params?: object) {
	return request({
		url: '/api/system/captchaImage',
		method: 'get',
		params,
	})
}
