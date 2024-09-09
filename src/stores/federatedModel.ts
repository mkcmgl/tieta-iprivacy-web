import { defineStore } from 'pinia';
import { Session } from '@/utils/storage';
import { fateBoardProgress } from '@/api/fateBoard';
import dagExplaination from '@/packages/fate-board/src/utils/dagExplaination';

/**
 * 联邦建模信息
 * @methods setUserInfos 设置联邦建模信息
 */
export const flTaskInfo = defineStore('flTaskInfo', {
	state: (): FlPanelState => ({
		flTaskInfos: {
			jobId: '',
			role: '',
			partyId: '',
			pageSize: 20,
			currentPage: 1,
			details: {},
			dataset: {},
			dag: {},
		},
	}),
	actions: {
		async setFlTaskInfos(job_id:string,role:string,party_id:string) {
			// 存储信息到浏览器缓存
			if (Session.get('flTaskInfo')) {
				this.flTaskInfos = Session.get('flTaskInfo');
			} else {
				const flTaskInfo: any = await this.getFlTaskInfos(job_id,role,party_id);
				this.flTaskInfos = flTaskInfo;
			}
		},
		async getFlTaskInfos(job_id:string,role:string,party_id:string) {
			return new Promise((resolve) => {
				fateBoardProgress(job_id,role,party_id)
					.then((res) => {
						const flTaskInfos = {
							jobId: res.data.job_id,
							role: res.data.role,
							partyId: res.data.party_id,
							pageSize: 20,
							currentPage: 1,
							details: res.data.summary_date.job,
							dataset: res.data.summary_date.dataset,
							dag: dagExplaination(res.data.dependency_data),
						};
						resolve(flTaskInfos);
					})
					.catch((err) => console.log(err));
			});
		},
	},
});
