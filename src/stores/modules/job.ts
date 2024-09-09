import API from '@/packages/fate-board/src/api';
import dagExplaination from '@/packages/fate-board/src/utils/dagExplaination';
import { ElMessage } from 'element-plus';
import { WSConnect } from '@/packages/fate-tools';
import { merge, throttle } from 'lodash';

export default {
	state: {
		jobId: '',
		role: '',
		partyId: '',
		pageSize: 20,
		currentPage: 1,

		details: {},
		dataset: {},
		dag: {},
		_ws_: undefined,
		_rerun_: false,

		_blank_: true,
	},

	mutations: {
		SET_JOBID(state: any, jobId: string) {
			state.jobId = jobId;
		},
		SET_JOB_ROLE(state: any, role: string) {
			state.role = role;
		},
		SET_PARTYID(state: any, partyId: string) {
			state.partyId = partyId;
		},
		SET_PAGESIZE(state: any, pageSize: number) {
			state.pageSize = pageSize;
		},
		SET_CURRENTPAGE(state: any, currentPage: number) {
			state.currentPage = currentPage;
		},
		SET_DAG(state: any, dag: object) {
			state.dag = merge(state.dag, dag);
		},
		SET_DETAILS(state: any, details: object) {
			state.details = merge(state.details, details);
		},
		SET_DATASET(state: any, dataset: object) {
			state.dataset = merge(state.dataset, dataset);
		},
		SET_WS(state: any, ws: any) {
			state._ws_ = ws;
		},
	},

	actions: {
		async JOB_INFORMATION({ state, commit }: any) {
			if (state._ws_) return true;

			// 首次加载标识
			let firstTimeHandle = true;
			const handler = (data1: any) => {
			let data = {
				duration: 28656,
				summary_date: {
					job: {
						fCreateTime: 1719805801355,
						fDescription: '',
						fElapsed: 28656,
						fEndTime: 1719805839281,
						fInitiatorPartyId: '9999',
						fJobId: '202407011149587195020',
						fPartyId: '10000',
						fProgress: 20,
						fRole: 'host',
						fStartTime: 1719805810625,
						fStatus: 'canceled',
						fTag: 'job_end',
						fUpdateTime: 1719805839281,
						partners: ['9999'],
					},
					dataset: {
						model_version: '0',
						memory: 0,
						role: 'host',
						resource_in_use: false,
						user_name: '',
						remaining_cores: 4,
						description: '',
						inheritance: {},
						engine_name: 'eggroll',
						dag: {
							schema_version: '2.0.0.alpha',
							kind: 'fate',
							dag: {
								stage: 'train',
								party_tasks: {
									guest_9999: {
										parties: [{ role: 'guest', party_id: ['9999'] }],
										conf: {},
										tasks: {
											reader_0: {
												parameters: {
													name: 'breast_hetero_guest',
													namespace: 'experiment',
												},
											},
										},
									},
									host_10000: {
										parties: [{ role: 'host', party_id: ['10000'] }],
										conf: {},
										tasks: {
											reader_0: {
												parameters: {
													name: 'breast_hetero_host',
													namespace: 'experiment',
												},
											},
										},
									},
								},
								parties: [
									{ role: 'guest', party_id: ['9999'] },
									{ role: 'host', party_id: ['10000'] },
									{ role: 'arbiter', party_id: ['9999'] },
								],
								conf: {
									model_version: '0',
									scheduler_party_id: '9999',
									sync_type: 'callback',
									auto_retries: 0,
									model_id: '202407011149587195020',
									initiator_party_id: '9999',
									computing_partitions: 8,
								},
								tasks: {
									lr_0: {
										inputs: {
											data: {
												train_data: {
													task_output_artifact: {
														output_artifact_key: 'train_output_data',
														producer_task: 'scale_0',
														parties: [
															{ role: 'guest', party_id: ['9999'] },
															{ role: 'host', party_id: ['10000'] },
														],
													},
												},
											},
											model: {},
										},
										component_ref: 'coordinated_lr',
										dependent_tasks: ['scale_0'],
										parameters: {
											tol: 0.0001,
											output_cv_data: true,
											floating_point_precision: 23,
											early_stop: 'diff',
											threshold: 0.5,
											epochs: 10,
										},
									},
									reader_0: {
										stage: 'default',
										parties: [
											{ role: 'guest', party_id: ['9999'] },
											{ role: 'host', party_id: ['10000'] },
										],
										component_ref: 'reader',
									},
									psi_0: {
										stage: 'default',
										inputs: {
											data: {
												input_data: {
													task_output_artifact: {
														output_artifact_key: 'output_data',
														producer_task: 'reader_0',
													},
												},
											},
										},
										parties: [
											{ role: 'guest', party_id: ['9999'] },
											{ role: 'host', party_id: ['10000'] },
										],
										component_ref: 'psi',
										parameters: {},
									},
									evaluation_0: {
										stage: 'default',
										inputs: {
											data: {
												input_datas: {
													task_output_artifact: {
														output_artifact_key: 'train_output_data',
														producer_task: 'lr_0',
														parties: [{ role: 'guest', party_id: ['9999'] }],
													},
												},
											},
											model: {},
										},
										parties: [{ role: 'guest', party_id: ['9999'] }],
										component_ref: 'evaluation',
										dependent_tasks: ['lr_0'],
										parameters: {
											default_eval_setting: 'binary',
											label_column_name: 'y',
										},
									},
									scale_0: {
										inputs: {
											data: {
												train_data: {
													task_output_artifact: {
														output_artifact_key: 'output_data',
														producer_task: 'psi_0',
													},
												},
											},
											model: {},
										},
										parties: [
											{ role: 'guest', party_id: ['9999'] },
											{ role: 'host', party_id: ['10000'] },
										],
										component_ref: 'feature_scale',
										dependent_tasks: ['psi_0'],
										parameters: {
											method: 'standard',
											use_anonymous: false,
											strict_range: true,
										},
									},
								},
							},
						},
						elapsed: 28656,
						protocol: 'fate',
						update_time: 1719805839281,
						cores: 4,
						flow_id: '',
						tag: 'job_end',
						scheduler_party_id: '9999',
						create_time: 1719805801355,
						remaining_memory: 0,
						end_time: 1719805839281,
						model_id: '202407011149587195020',
						apply_resource_time: 1719805808951,
						start_time: 1719805810625,
						initiator_party_id: '9999',
						job_id: '202407011149587195020',
						party_id: '10000',
						parties: [
							{ role: 'guest', party_id: ['9999'] },
							{ role: 'host', party_id: ['10000'] },
							{ role: 'arbiter', party_id: ['9999'] },
						],
						progress: 20,
						return_resource_time: 1719805828986,
						dataset: {
							arbiter: { '9999': [] },
							host: {
								'10000': [{ name: 'breast_hetero_host', namespace: 'experiment' }],
							},
							guest: {
								'9999': [{ name: 'breast_hetero_guest', namespace: 'experiment' }],
							},
						},
						status: 'canceled',
					},
				},
				process: 20,
				dependency_data: {
					component_module: {
						lr_0: 'coordinated_lr',
						reader_0: 'reader',
						psi_0: 'psi',
						scale_0: 'feature_scale',
					},
					component_stage: {
						lr_0: 'train',
						reader_0: 'default',
						psi_0: 'default',
						scale_0: 'train',
					},
					component_list: [
						{
							component_name: 'reader_0',
							time: 1719805817967,
							status: 'success',
						},
						{ component_name: 'psi_0', status: 'waiting' },
						{ component_name: 'scale_0', status: 'waiting' },
						{ component_name: 'lr_0', status: 'waiting' },
					],
					dependencies: {
						lr_0: [
							{
								component_name: 'scale_0',
								model_type: 'data',
								up_output_info: ['train_output_data'],
								type: 'train_data',
							},
						],
						reader_0: [{ up_output_info: [] }],
						psi_0: [
							{
								component_name: 'reader_0',
								model_type: 'data',
								up_output_info: ['output_data'],
								type: 'input_data',
							},
						],
						scale_0: [
							{
								component_name: 'psi_0',
								model_type: 'data',
								up_output_info: ['output_data'],
								type: 'train_data',
							},
						],
					},
				},
				status: 'canceled',
			};
			dagExplaination(data.dependency_data, (res: any) => {
				commit('SET_DAG', res);
			});
			commit('SET_DATASET', data.summary_date.dataset);
			commit('SET_DETAILS', data.summary_date.job);
			if (data.status && !data.status.match(/running|waiting/)) {
				if (!state._rerun_ && state._ws_) {
					state._ws_.close();
					commit('SET_WS', undefined);
				}
			} else if (data.status.match(/running|waiting/)) {
				if (state._rerun_) state._rerun_ = false;
			}
			};
			const throttleHandler = throttle(handler, 10000);
			if (!state.role || !state.jobId || !state.partyId) {
				return false;
			} else {
				const ws: any = new WSConnect(`/websocket/progress/${state.jobId}/${state.role}/${state.partyId}`);
				ws.addEventListener('message', (event: any) => {
					let data;
					try {
						data = JSON.parse(event.data);
						if (firstTimeHandle) {
							handler(data);
							firstTimeHandle = false;
						} else {
							throttleHandler(data);
						}
					} catch (error) {
						state._ws_.close();
						data = null;
						ElMessage({
							showClose: true,
							message: `This job socket has error`,
							center: true,
							type: 'error',
						});
					}
				});
				commit('SET_WS', ws);
				return true;
			}
		},

		async retryJob({ state }: any, info: any) {
			if (info?.job_id || state.jobId) {
				const responseData = await API.retryJob(
					Object.assign(
						{
							job_id: info?.job_id || state.jobId,
							component_name: 'pipeline',
						},
						info
					)
				);
				if (responseData) {
					ElMessage({
						showClose: true,
						message: `Job: ${state.jobId} is retrying`,
						center: true,
					});
				} else {
					ElMessage({
						type: 'error',
						showClose: true,
						message: `Job: ${state.jobId} has retried failly`,
						center: true,
					});
				}
				return responseData;
			}
			return false;
		},

		async killJob({ state }: any, info: any) {
			if (info?.job_id || state.jobId) {
				const responseData = await API.killJob(
					Object.assign(
						{
							job_id: info?.job_id || state.jobId,
							component_name: 'pipeline',
						},
						info
					)
				);
				if (responseData) {
					ElMessage({
						showClose: true,
						message: `Job: ${state.jobId} is canceling`,
						center: true,
					});
				} else {
					ElMessage({
						type: 'error',
						showClose: true,
						message: `Job: ${state.jobId} has canceled failly`,
						center: true,
					});
				}
				return responseData;
			}
			return false;
		},

		SET_BASIC({ state, commit, dispatch }: any, INFO: any) {
			let changed = false;
			if (INFO?.jobId && state.jobId !== INFO?.jobId) {
				commit('SET_JOBID', INFO.jobId);
				changed = true;
			}
			if (INFO?.role && state.role !== INFO?.role) {
				commit('SET_JOB_ROLE', INFO.role);
				changed = true;
			}
			if (INFO?.partyId && state.partyId !== INFO?.partyId) {
				commit('SET_PARTYID', INFO.partyId);
				changed = true;
			}
			commit('SET_PAGESIZE', INFO.pageSize || 20);
			commit('SET_CURRENTPAGE', INFO.currentPage || 1);
			if (INFO?.rerun) {
				state._rerun_ = !!INFO?.rerun;
			}
			if (changed || !state._ws_) {
				if (state._ws_) {
					state._ws_.close();
					state._ws_ = undefined;
				}
				state.dag = {};
				dispatch('JOB_INFORMATION');
			}
		},
		GET_JOBID({ state }: any) {
			return state.jobId;
		},
		GET_JOB_ROLE({ state }: any) {
			return state.role;
		},
		GET_PARTYID({ state }: any) {
			return state.partyId;
		},
	},
};
