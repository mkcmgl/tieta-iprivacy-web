import request from '@/utils/request';

export function getIAMConfig(data: object) {
	return request({
		url: '/api/system/sso/iamConfig',
		method: 'post',
		data,
	});
}

export function ssoLogin(data: object) {
	return request({
		url: '/api/system/sso/login',
		method: 'post',
		data,
	});
}

export function ssoLogout(data: object) {
	return request({
		url: '/api/system/sso/logout',
		method: 'post',
		data,
	});
}
