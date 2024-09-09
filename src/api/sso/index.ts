import request from '@/utils/request';

export function ssoLogin(data: object) {
	return request({
		url: '/api/system/auth/sso/login',
		method: 'post',
		data,
	});
}
