import { defineStore } from 'pinia';
import { Session } from '@/utils/storage';
import { getUserPermissions } from '@/api/system/user'

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosState => ({
		userInfos: {
			userName: '',
			photo: '',
			roles: [],
			permissions: [],
			positions: [],
			menus: [],
			userId: ''
		},
	}),
	actions: {
		async setUserInfos() {
			// 存储用户信息到浏览器缓存
			if (Session.get('userInfo')) {
				this.userInfos = Session.get('userInfo');
			} else {
				const userInfos: any = await this.getApiUserInfo();
				this.userInfos = userInfos;
			}
		},
		async getApiUserInfo() {
			return new Promise((resolve) => {
				getUserPermissions().then(res => {
					const userInfos = {
						userName: res.data.loginName,
						photo: '',
						roles: res.data.roles,
						permissions: res.data.permissions,
						positions: res.data.positions,
						menus: res.data.menus,
						userId: res.data.userId,
						enterpriseName:res.data.enterpriseName,
						enterpriseId:res.data.enterpriseId
					}
					resolve(userInfos)
				}).catch(err => console.error(err))
			})
		}
	},
});
