<template>
	<div class="system-task-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="850px" v-loading="state.loading">
			<el-alert class="mb30" title="请确认信息无误后，启动该任务" type="warning" show-icon :closable="false" />
			<div class="box-title mb30">基本信息</div>
			<el-form
				ref="taskDialogFormRef"
				:model="state.startForm"
				v-loading="state.loading"
				:rules="rules"
				size="default"
				label-width="120px"
				:label-position="labelPosition"
			>
				<el-row :gutter="35">
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="任务名称" prop="name">
							<el-input v-model="state.startForm.name" clearable disabled size="large"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="创建者" prop="createdBy">
							<el-input v-model="state.startForm.createdBy" clearable disabled size="large"></el-input>
						</el-form-item>
					</el-col>

					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="所属项目" prop="projectName">
							<el-input v-model="state.startForm.projectName" clearable disabled size="large"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="任务实例名称" prop="taskName">
							<el-input v-model="state.startForm.taskName" clearable size="large"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="任务描述" prop="description">
							<el-input type="textarea" v-model="state.startForm.description" clearable size="large" :rows="2" disabled></el-input>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<div class="form-header">参与节点配置</div>
						<el-table :data="state.startForm.fieldEntityList">
							<el-table-column prop="nodeId" label="节点ID"></el-table-column>
							<el-table-column prop="nodeName" label="节点名称"></el-table-column>
							<el-table-column prop="dataName" label="数据" width="170"></el-table-column>
							<el-table-column prop="tableName" label="tableName" width="170"></el-table-column>
							<el-table-column prop="dataNamespace" label="namespace"></el-table-column>
						</el-table>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="DAG配置" prop="dagContent">
							<json-viewer :value="state.startForm.dagContent" copyable boxed sort style="width: 100%"></json-viewer>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" type="info" plain size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">确 定</el-button>
				</span>
			</template>
		</el-dialog>
		<el-dialog v-model="state.dialog.isShowSuccessDialog" :title="state.dialog.title" width="450px">
			<div class="success-dialog">
				<div class="dialog-line">
					<img src="@/assets/public/success.png" style="width: 84px; height: 93px" />
				</div>
				<div class="dialog-line" style="font-weight: 400; font-size: 24px; color: #333333">启动成功</div>
				<div class="dialog-line">
					<span style="font-weight: 400; font-size: 14px; color: #999999">还剩{{ state.successTime }}s,页面自动跳转至</span>
					<span @click="goTaskHistory" style="font-weight: 400; font-size: 14px; color: #547cd9; cursor: pointer">任务历史</span>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemTaskDialog">
import { reactive, ref, getCurrentInstance } from 'vue';
import { getFlTaskDetail, addFlTask, editFlTask, checkFlTask, getDataListEffective, getNodeListEffective, startFlTask } from '@/api/flTask';
import { getProjectList, projectDetail } from '@/api/projectManage';
import { getList } from '@/api/system/role';
import { ElMessage, FormInstance, FormRules, FormProps } from 'element-plus';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['goTaskHistory']);

// 定义变量内容
const taskDialogFormRef = ref<FormInstance>();
const state = reactive({
	loading: false,
	successTime: 5,
	timer: null as any,
	id: '',
	startForm: {
		name: '',
		createdBy: '',
		dagContent: '',
		description: '',
		fieldEntityList: [],
		projectId: '',
		projectName: '',
		taskName: '',
	},
	roleList: [] as any,
	dialog: {
		isShowDialog: false,
		isShowSuccessDialog: false,
		title: '',
	},
	props: {
		value: 'id',
		label: 'name',
		children: 'children',
		checkStrictly: true,
		expandTrigger: 'hover',
		emitPath: false,
	},
});
const rules = reactive<FormRules>({
	name: [
		{ required: true, message: '请输入任务名称', trigger: 'blur' },
		{ min: 6, max: 32, message: '6-32个字符' },
	],
	createdBy: [{ required: true, message: '请输入创建者', trigger: 'blur' }],
	projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
	taskName: [{ required: true, message: '请输入任务实例名称', trigger: 'blur' }],
	dagContent: [
		{
			required: true,
			message: '请上传并验证DAG配置文件',
		},
	],
});
const projectList = ref<ProjectStateType[]>([]);
const labelPosition = ref<FormProps['labelPosition']>('right');

const getRoleList = () => {
	getList({
		status: '0',
	})
		.then((res) => {
			state.roleList = res.data;
		})
		.catch((err) => {
			console.log(err);
		});
};

const formReset = () => {};

//获取项目列表
const getProjectListData = () => {
	getProjectList({
		pageNum: 1,
		pageSize: 100,
	}).then((res) => {
		if (res.resultCode == 0) {
			projectList.value = res.data.data;
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};

// 打开弹窗
const openDialog = (id: string) => {
	taskDialogFormRef.value?.clearValidate();
	formReset();
	getRoleList();

	state.dialog.title = '启动任务';
	state.id = id;
	state.loading = true;
	getFlTaskDetail({
		taskId: id,
	})
		.then((res) => {
			state.startForm = res.data;
			state.loading = false;
		})
		.catch((err) => {
			console.log(err);
		});
	// getProjectList();
	state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
	state.dialog.isShowSuccessDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};
const goTaskHistory = () => {
	emit('goTaskHistory', state.id);
	if (state.timer) {
		clearInterval(state.timer);
	}
	closeDialog();
};
// 提交
const onSubmit = () => {
	taskDialogFormRef.value?.validate((valid) => {
		if (valid) {
			state.loading = true;
			startFlTask({
				taskId: state.id,
				name: state.startForm.taskName,
			}).then((res) => {
				if (res.resultCode === 0) {
					ElMessage.success('任务启动成功');
					state.loading = false;
					state.dialog.isShowDialog = false;
					state.dialog.isShowSuccessDialog = true;
					state.successTime = 5;
					state.timer = setInterval(() => {
						state.successTime = state.successTime - 1;

						if (state.successTime === 0) {
							goTaskHistory();
						}
					}, 1000);
				} else {
					ElMessage.error(res.resultDesc);
					state.loading = false;
				}
			});
		}
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.Hidden {
	display: none;
}
.flTask-dialog-form-text {
	color: gray;
	font-size: 12px;
}
.flTask-dialog-form-upload {
	width: 22%;
	display: flex;
	justify-content: start;
}
.form-header {
	font-size: 16px;
	font-weight: 600;
	margin-bottom: 20px;
}
.flTask-start-info {
	width: 100%;
	background: pink;
	height: 50px;
	line-height: 50px;
	padding-left: 30px;
	margin-bottom: 30px;
}
.success-dialog {
	width: 100%;
	height: 300px;
	display: flex;
	flex-direction: column;
	justify-content: center;
}
.dialog-line {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	margin-bottom: 30px;
}
</style>
