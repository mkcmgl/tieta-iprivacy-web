<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar mb20">
			<div class="page-title task-title" @click="closeDialog">
				<img src="@/assets/public/back.png" class="mr5" />
				任务详情
			</div>
		</div>
		<el-form label-width="120px" label-position="left" v-loading="loading">
			<el-card shadow="never" class="w100 box-detail mb20">
				<div class="content">
					<div class="box-title mb30">基本信息</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="任务名称：">
								<span>{{ state.infoForm.name }}</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="创建者：">
								<span>{{ state.infoForm.organizeName }}</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="所属项目：">
								<span>{{ state.infoForm.projectName }}</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="任务发起节点：">
								<span>{{ state.infoForm.leadNode }}</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="任务描述：">
								<span>{{ state.infoForm.description }}</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="结果保存格式：">
								<span>csv</span>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card shadow="never" class="w100 box-detail mb20">
				<div class="content">
					<div class="box-title mb30">调度信息</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="超时时间：">
								<span>{{ state.infoForm.timeout }}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card shadow="never" class="w100 box-detail mb20">
				<div class="content">
					<div class="box-title mb30">参与节点配置</div>
					<el-table :data="state.infoForm.fieldEntityList" style="width: 100%">
						<el-table-column type="index" width="70" label="序号" />
						<el-table-column prop="nodeName" label="节点名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="dataName" label="数据" show-overflow-tooltip></el-table-column>
						<el-table-column prop="colName" label="统计字段" show-overflow-tooltip></el-table-column>
						<el-table-column prop="rowIndex" label="所在行" show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
			</el-card>
			<el-card shadow="never" class="w100 box-detail mb20">
				<div class="content">
					<div class="box-title mb30">统计函数配置</div>
					<el-row :column="2">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="函数类型：">
								<span v-if="state.infoForm.algorithmType === '+'">MPCAdd</span>
								<span v-else-if="state.infoForm.algorithmType === '*'">MPCMul</span>
								<span v-else-if="state.infoForm.algorithmType === '-'">MPCSub</span>
								<span v-else-if="state.infoForm.algorithmType === '/'">MPCDiv</span>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
		</el-form>
	</div>
</template>

<script setup lang="ts" name="taskDetail">
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { getTaskDetail } from '@/api/collaborationComputing';
const route = useRoute();
const router = useRouter();

const loading = ref(false);

const state = reactive({
	infoForm: {
		name: '',
		timeout: null as number | null,
		organizeName: '',
		projectName: '',
		node: '',
		algorithmType: '',
		description: '',
		taskName: '',
		leadNode: '',
		fieldEntityList: [] as any,
	}, //基本信息
});
const getTaskDetailData = () => {
	loading.value = true;
	getTaskDetail({
		taskId: route.query.id,
	})
		.then((res) => {
			loading.value = false;
			if (res.resultCode === 0) {
				state.infoForm = res.data;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err) => {
			console.log(err);
			loading.value = false;
		});
};
onMounted(() => {
	getTaskDetailData();
});

//返回上一级
const closeDialog = () => {
	router.push('/collaborationComputing');
};
</script>

<style scoped lang="scss">
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