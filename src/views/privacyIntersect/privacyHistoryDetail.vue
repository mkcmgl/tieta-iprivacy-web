<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar mb20">
			<div class="page-title task-title" @click="closeDialog">
				<img src="@/assets/public/back.png" class="mr5" />
				{{ activeName }}
			</div>
		</div>
		<el-tabs type="border-card" v-model="activeName" @tab-change="tabClick">
			<el-tab-pane class="box-detail" label="任务实例详情" name="任务实例详情">
				<el-form label-width="120px" label-position="left">
					<div class="content tab-pane" v-loading="detailLoading">
						<div class="box-title mb30">基本信息</div>
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="任务实例名称：">
									<span>{{ state.form?.name }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="创建者：">
									<span>{{ state.form?.createdBy }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="任务实例id：">
									<span>{{ state.form?.id }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="所属任务：">
									<span>{{ state.form?.taskName }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="开始时间：">
									<span>{{ state.form?.startTime }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="结束时间：">
									<span>{{ state.form?.endTime }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="状态：">
									<div class="status-box">
										<div>
											<span
												v-if="state.form?.status !== 'running'"
												:class="{
													'status-drop-success': state.form?.status === 'success',
													'status-drop-failed': state.form?.status === 'failed' || state.form?.status === 'canceled',
												}"
											></span>
											<el-icon class="mr3 is-loading" :size="14" v-else>
												<ele-Loading />
											</el-icon>
											<span v-if="state.form?.status === 'success'">执行成功</span>
											<span v-else-if="state.form?.status === 'failed'">执行失败</span>
											<span v-else-if="state.form?.status === 'canceled'">执行中止</span>
											<span v-else-if="state.form?.status === 'running'">执行中</span>
										</div>
										<el-link
											v-if="state.form?.status !== 'running' && state.form?.userType !== 'host'"
											:underline="false"
											size="small"
											type="primary"
											@click="downloadPrivacyResultFun"
											>下载结果</el-link
										>
										<el-link
											v-if="state.form?.status !== 'running' && state.form?.userType !== 'host'"
											:underline="false"
											size="small"
											type="primary"
											@click="getPrivacyResultFun"
											>查看结果</el-link
										>
									</div>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="描述：">
									<span>{{ state.form?.description }}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<div class="box-title mt20 mb30">参与节点配置</div>
						<el-table :data="state.form.taskRecordFieldList" style="width: 100%">
							<el-table-column type="index" width="70" label="序号" />
							<el-table-column prop="nodeName" label="节点名称" show-overflow-tooltip></el-table-column>
							<el-table-column prop="dataName" label="数据" show-overflow-tooltip></el-table-column>
							<!-- <el-table-column prop="sharding" label="是否分片" show-overflow-tooltip>
								<template #default="scope">
									<span v-if="scope.row.sharding === '1'">是</span>
									<span v-else>否</span>
								</template>
							</el-table-column> -->
						</el-table>
					</div>
				</el-form>
			</el-tab-pane>
			<el-tab-pane class="box-detail" label="任务日志" name="任务日志">
				<div class="content tab-pane" v-loading="logLoading">
					<div class="box-title mb30">日志信息</div>
					<!-- <p class="ml30" v-html="log" style="white-space: pre-line"></p> -->
					<json-viewer :value="log" sort> </json-viewer>
				</div>
			</el-tab-pane>
		</el-tabs>
		<!-- 查看结果弹窗 -->
		<privacyResult ref="privacyResultRef" />
	</div>
</template>

<script setup lang="ts" name="privacyHistoryDetail">
import { defineAsyncComponent, reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { getPrivacyInstanceDetail, fateBoardLog, fateBoardLogNumber, downloadPrivacyResult, getPrivacyResult } from '@/api/privacyIntersect';

const route = useRoute();
const router = useRouter();

const privacyResult = defineAsyncComponent(() => import('@/views/privacyIntersect/privacyResultDialog.vue'));

const privacyResultRef = ref();
const log = ref({});

const detailLoading = ref(false);
const logLoading = ref(false);

const activeName = ref('任务实例详情');
const state = reactive({
	form: {} as any,
});

//tab点击
const tabClick = () => {
	// console.log('activeName.value', activeName.value);
	// if (activeName.value === '任务实例详情') {
	// 	getPrivacyInstanceDetailFun();
	// } else {
	// 	getPrivacyLogFun();
	// }
};

//任务实例详情
const getPrivacyInstanceDetailFun = () => {
	detailLoading.value = true;
	getPrivacyInstanceDetail({
		recordId: route.query.taskId,
	})
		.then((res) => {
			detailLoading.value = false;
			if (res.resultCode === 0) {
				state.form = res.data;
				getPrivacyLogFun();
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch(() => {
			detailLoading.value = false;
		});
};

//日志详情
const getPrivacyLogFun = () => {
	logLoading.value = true;
	var role = [] as any;
	if (state.form.taskRecordFieldList.length > 0) {
		role = state.form.taskRecordFieldList.filter((obj: any) => {
			return obj.nodeId === state.form.nodeId;
		});
	}
	fateBoardLogNumber({
		type: 'logSize',
		jobId: state.form.jobId,
		role: role[0].role,
		partyId: state.form.nodeId,
		componentId: 'default',
	})
		.then((resp) => {
			// if (resp.resultCode === 402) return ElMessage.warning(resp.resultDesc);
			if (resp.resultCode === 0) {
				fateBoardLog({
					type: 'partyInfo',
					begin: '0',
					end: resp.data.page.partyInfo,
					jobId: state.form.jobId,
					role: role[0].role,
					partyId: state.form.nodeId,
					componentId: 'default',
				})
					.then((res) => {
						logLoading.value = false;
						// if (res.resultCode === 402) return ElMessage.warning(res.resultDesc);
						if (res.resultCode === 0) {
							log.value = JSON.parse(JSON.stringify(res.data.content.data));
						} else {
							ElMessage.error(res.resultDesc);
						}
					})
					.catch(() => {
						logLoading.value = false;
					});
			} else {
				ElMessage.error(resp.resultDesc);
			}
		})
		.catch((err) => {
			console.log(err, '11');
			logLoading.value = false;
		});
};

//结果下载
const downloadPrivacyResultFun = () => {
	detailLoading.value = true;
	downloadPrivacyResult({
		recordId: route.query.taskId,
	})
		.then((res: any) => {
			detailLoading.value = false;
			const blob = new Blob([res]);
			const downloadElement = document.createElement('a');
			const href = window.URL.createObjectURL(blob);
			downloadElement.href = href;
			downloadElement.download = state.form?.name + '.tar.gz';
			document.body.appendChild(downloadElement);
			downloadElement.click();
			document.body.removeChild(downloadElement);
			window.URL.revokeObjectURL(href);
		})
		.catch(() => {
			detailLoading.value = false;
		});
};

//查看结果
const getPrivacyResultFun = () => {
	privacyResultRef.value?.openDialog(route.query.taskId);
};

//返回上一级
const closeDialog = () => {
	router.push('/privacyIntersect');
};

onMounted(() => {
	console.log(route.query);
	getPrivacyInstanceDetailFun();
});
</script>

<style scoped lang="scss">
.is-loading {
	vertical-align: middle;
}
.status-box {
	display: flex;
	align-items: center;
	gap: 10px;
	.status-drop-success {
		display: inline-block;
		vertical-align: middle;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: #00b42a;
		margin-right: 5px;
	}
	.status-drop-failed {
		display: inline-block;
		vertical-align: middle;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: #ed4014;
		margin-right: 5px;
	}
}
.flex-row-item {
	display: flex;
	margin-left: 30px;
	.item-label {
		// color: #999999;
		text-align: left;
		font-size: 14px;
		width: 120px;
		font-weight: 400;
	}
	.item-contont {
		flex: 1;
		font-size: 14px;
		// color: #333333;
		text-align: left;
	}
}
.m10 {
	margin: 0 0 10px 0;
}
.tab-pane {
	padding: 15px !important;
}
.tab-pane {
	padding: 15px !important;
}
.goback {
	vertical-align: middle;
}
.task-title {
	cursor: pointer;
}
.box-title {
	font-weight: 700;
	margin-left: 10px;
	font-size: 16px;
	margin-bottom: 20px;

	&::before {
		content: '';
		display: inline-block;
		position: relative;
		top: 3px;
		right: 10px;
		width: 5px;
		height: 18px;
		background-color: #eb4b4b;
		border-radius: 5px;
	}
}
</style>