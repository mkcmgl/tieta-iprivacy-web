import request from '@/utils/request';

export function register(data: object) {
	return request({
		url: '/api/system/user/register',
		method: 'post',
		data
	})
}
