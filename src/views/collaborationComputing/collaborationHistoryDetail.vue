<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar">
			<div class="page-title task-title" @click="closeDialog">
				<img src="@/assets/public/back.png" class="mr5" />
				{{ activeName }}
			</div>
		</div>
		<el-tabs class="w100 mt20 mb20" type="border-card" v-model="activeName" @tab-change="tabClick">
			<el-tab-pane class="box-detail" label="任务实例详情" name="任务实例详情">
				<el-form label-width="120px" label-position="left" v-loading="detailLoading">
					<div class="content tab-pane">
						<div class="box-title mb30">基本信息</div>
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="任务实例名称：">
									<span>{{ state.form.name }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="创建者：">
									<span>{{ state.form.createdBy }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="任务实例id：">
									<span>{{ state.form.id }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="所属任务：">
									<span>{{ state.form.taskName }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="开始时间：">
									<span>{{ state.form.startTime }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="结束时间：">
									<span>{{ state.form.endTime }}</span>
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
									</div>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="执行结果：">
									<span>{{ state.form.mpcResult }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="描述：">
									<span>{{ state.form.description }}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<div class="box-title mt20 mb30">参与节点配置</div>
						<el-table :data="state.form.taskRecordFieldList" style="width: 100%">
							<el-table-column type="index" width="70" label="序号" />
							<el-table-column prop="nodeName" label="节点名称" show-overflow-tooltip></el-table-column>
							<el-table-column prop="dataName" label="数据" show-overflow-tooltip></el-table-column>
							<el-table-column prop="colName" label="统计字段" show-overflow-tooltip></el-table-column>
							<el-table-column prop="rowIndex" label="所在行" show-overflow-tooltip></el-table-column>
						</el-table>
					</div>
				</el-form>
			</el-tab-pane>
			<!-- <el-tab-pane label="任务日志" name="任务日志" class="box-detail">
				<div class="content tab-pane" v-loading="logLoading">
					<div class="box-title mb30">日志信息</div>
					<json-viewer :value="log" sort preview-mode> </json-viewer>
				</div>
			</el-tab-pane> -->
		</el-tabs>
	</div>
</template>

<script setup lang="ts" name="historyDetail">
import { defineAsyncComponent, reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { getTaskInstanceDetail, fateBoardLog, fateBoardLogNumber } from '@/api/collaborationComputing';
const route = useRoute();
const router = useRouter();

const log = ref('');

const activeName = ref('任务实例详情');
const detailLoading = ref(false);
const logLoading = ref(false);

const state = reactive({
	form: {
		name: '',
		createdBy: '',
		taskName: '',
		id: '',
		startTime: '',
		endTime: '',
		description: '',
		status: '',
		mpcResult: '',
		taskRecordFieldList: [],
	},
});

//点击tabs
const tabClick = () => {
	if (activeName.value == '任务日志') {
		getTaskLogFun();
	} else {
		getTaskInstanceDetailFun();
	}
};

//获取实例详情
const getTaskInstanceDetailFun = () => {
	detailLoading.value = true;
	getTaskInstanceDetail({
		recordId: route.query.id,
	})
		.then((res) => {
			detailLoading.value = false;
			if (res.resultCode === 0) {
				state.form = res.data;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch(() => {
			detailLoading.value = false;
		});
};

//获取任务日志
const getTaskLogFun = () => {
	// logLoading.value = true;
};

//返回上一级
const closeDialog = () => {
	router.push('/collaborationComputing');
};
onMounted(() => {
	getTaskInstanceDetailFun();
});
</script>

<style scoped lang="scss">
.align-center {
	display: flex;
	align-items: center;
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
	padding: 15px;
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