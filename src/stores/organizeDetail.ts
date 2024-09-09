import { defineStore } from 'pinia';
import { Session } from '@/utils/storage';
import { getOrganizeDetail } from '@/api/system/enterpriseinfo'
import { ElMessage } from 'element-plus';

/**
 * 企业信息
 * @methods setOrganizeDetail 设置企业信息
 */
export const useOrganizeDetail = defineStore('organizeDetail', {
	state: (): OrganizeDetailState => ({
		organizeDetail: {
			orgRegisterState: 0,
			auditState:''
		},
	}),
	actions: {
		async setOrganizeDetail() {
			// 存储企业信息到浏览器缓存
			if (Session.get('organizeDetail')) {
				this.organizeDetail = Session.get('organizeDetail');
			} else {
				const organizeDetail: any = await this.getApiOrganizeDetail();
				this.organizeDetail = organizeDetail;
			}
		},
		async getApiOrganizeDetail() {
			return new Promise((resolve) => {
				getOrganizeDetail().then(res => {
					if (res.resultCode === 0) {
						const organizeDetail = {
							orgRegisterState: res.data.orgRegisterState,
							auditState: res.data.auditState,
						}
						resolve(organizeDetail)
					} else {
						ElMessage.warning(res.resultDesc)
						Session.clear()
						window.location.reload()
					}
				}).catch(err => {
					console.log(err)
					Session.clear()
					window.location.reload()
				})
			})
		}
	},
});
