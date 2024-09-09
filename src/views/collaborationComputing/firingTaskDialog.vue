<template>
	<div class="task-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="850px" :close-on-click-modal="false">
			<template #default>
				<el-alert title="请确认信息无误后，启动该任务" class="mb30" type="warning" show-icon :closable="false" />
				<div class="box-title mb30">基本信息</div>
				<el-form class="form-item" ref="inforFormRef" :model="state.infoForm" :rules="rules" size="large" label-position="left" label-width="110px">
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="任务名称" prop="name">
								<el-input disabled v-model="state.infoForm.name" placeholder="请输入任务名称" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="创建着" prop="organizeName">
								<el-input disabled v-model="state.infoForm.organizeName" placeholder="请输入创建着" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="所属项目" prop="projectName">
								<el-input disabled v-model="state.infoForm.projectName" placeholder="请输入所属项目" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="任务实例名称" prop="taskName">
								<el-input v-model="state.infoForm.taskName" placeholder="请输入任务实例名称" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="任务发起节点" prop="leadNode">
								<el-input disabled v-model="state.infoForm.leadNode" placeholder="请输入任务发起节点" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="函数类型" prop="algorithmType">
								<el-input
									disabled
									placeholder="请输入函数类型"
									:value="
										state.infoForm.algorithmType === '+'
											? 'MPCAdd'
											: state.infoForm.algorithmType === '*'
											? 'MPCMul'
											: state.infoForm.algorithmType === '-'
											? 'MPCSub'
											: state.infoForm.algorithmType === '/'
											? 'MPCDiv'
											: ''
									"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="超时时间" prop="timeout">
								<el-input placeholder="请输入超时时间" v-model.number="state.infoForm.timeout" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="描述" prop="describe">
								<template #label><span class="desc-before">描述</span> </template>
								<el-input
									placeholder="请输入描述"
									v-model="state.infoForm.description"
									:autosize="{ minRows: 2, maxRows: 4 }"
									maxlength="200"
									type="textarea"
									show-word-limit
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<div class="box-title mb30">参与节点配置</div>
				<el-table :data="state.infoForm.fieldEntityList" style="width: 100%">
					<el-table-column type="index" width="70" label="序号" />
					<el-table-column prop="nodeName" label="节点名称" show-overflow-tooltip></el-table-column>
					<el-table-column prop="dataName" label="数据" show-overflow-tooltip></el-table-column>
					<el-table-column prop="colName" label="统计字段" show-overflow-tooltip></el-table-column>
					<el-table-column prop="rowIndex" label="所在行" show-overflow-tooltip></el-table-column>
				</el-table>
				<el-dialog
					class="dialog-success"
					:close-on-click-modal="false"
					:show-close="false"
					v-model="innerVisible"
					title="任务启动"
					width="30%"
					append-to-body
				>
					<template #header>
						<div class="my-header">
							<span>启动任务</span>
							<el-icon @click="close" class="close-icon">
								<ele-Close />
							</el-icon>
						</div>
					</template>
					<div class="success-box">
						<el-icon class="el-icon-success">
							<ele-CircleCheckFilled />
						</el-icon>
						<div class="success-title">启动成功</div>
						<div style="font-weight: 600">
							还剩 <span class="success-time">{{ timer }}</span> 秒，页面自动跳转至<span class="success-jump" @click="close">任务历史</span>
						</div>
					</div>
					<template #footer></template>
				</el-dialog>
			</template>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" type="info" plain size="large">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="large" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="firingTaskDialog">
import { reactive, ref, getCurrentInstance } from 'vue';
import { descriptionProps, ElMessage, FormInstance, FormRules } from 'element-plus';
import { firingTask, getTaskDetail } from '@/api/collaborationComputing';

//标签实例
const inforFormRef = ref<FormInstance>();

// 定义子组件向父组件传值/事件
const emit = defineEmits(['firingSuccess']);

// 表单校验规则
const rules = reactive<FormRules>({
	name: [{ required: true, trigger: 'blur', message: '请输入任务名称' }],
	organizeName: [{ required: true, trigger: 'blur', message: '请输入创建者' }],
	projectName: [{ required: true, trigger: 'blur', message: '请选择所属项目' }],
	taskName: [{ required: true, trigger: 'blur', message: '请输入实例名称' }],
	algorithmType: [{ required: true, trigger: 'blur', message: '请选择函数类型' }],
	leadNode: [{ required: true, trigger: 'blur', message: '请选择节点' }],
	timeout: [
		{ required: true, trigger: 'blur', message: '请输入超时时间' },
		{ type: 'number', message: '超时时间是一个数字' },
	],
});

const timer = ref(5);
const in_clock = ref();
const innerVisible = ref(false);
const taskId = ref('');
// 定义变量内容
const state = reactive({
	infoForm: {
		name: '',
		timeout: null as number | null,
		organizeName: '',
		projectName: '',
		leadNode: '',
		algorithmType: '',
		description: '',
		taskName: '',
		fieldEntityList: [] as any,
	}, //基本信息
	dialog: {
		isShowDialog: false,
		// type: '',
		title: '启动',
	},
});

// 打开弹窗
const openDialog = (id: string) => {
	inforFormRef.value?.clearValidate();
	taskId.value = id;
	timer.value = 5;
	formReset();
	fullscreenLoading.value = true;
	getTaskDetail({ taskId: id })
		.then((res) => {
			fullscreenLoading.value = false;
			if (res.resultCode === 0) {
				state.infoForm = res.data;
			} else {
				ElMessage.error(res.message);
			}
			// state.tableData = res.data.nodes;
		})
		.catch(() => {
			fullscreenLoading.value = false;
		});
	state.dialog.isShowDialog = true;
};

const fullscreenLoading = ref(false);

const formReset = () => {};

//关闭子级弹窗
const close = () => {
	innerVisible.value = false;
	window.clearInterval(in_clock.value);
	closeDialog();
	emit('firingSuccess');
};

//提交
const onSubmit = () => {
	inforFormRef.value?.validate((valid: boolean) => {
		if (valid) {
			// 提交表单
			fullscreenLoading.value = true;
			firingTask({
				name: state.infoForm.taskName,
				taskId: taskId.value,
				taskName: state.infoForm.name,
				algorithmType: state.infoForm.algorithmType,
				timeout: state.infoForm.timeout,
				description: state.infoForm.description,
				createdBy: state.infoForm.organizeName,
			})
				.then((res) => {
					fullscreenLoading.value = false;
					if (res.resultCode === 0) {
						innerVisible.value = true;
						in_clock.value = setInterval(() => {
							timer.value--;
							if (timer.value <= 0) {
								window.clearInterval(in_clock.value);
								innerVisible.value = false;
								closeDialog();
								emit('firingSuccess');
								timer.value = 5;
							}
						}, 1000);
					} else {
						ElMessage.error(res.resultDesc);
					}
				})
				.catch(() => {
					fullscreenLoading.value = false;
				});
		}
	});
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.my-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-right: 16px !important;
	.close-icon {
		font-size: 16px;
		cursor: pointer;
		color: #5079d9;
	}
}
.success-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
	.el-icon-success {
		// margin-top: 5px;
		vertical-align: middle;
		margin-right: 5px;
		font-size: 40px;
		color: #67c23a;
	}
	.success-title {
		font-size: 18px;
		font-weight: 700;
		// color: #67c23a;
	}
	.success-time {
		color: #5079d9;
	}
	.success-jump {
		color: #e6a23c;
		cursor: pointer;
	}
}

.desc-before::before {
	content: '*';
	color: #fff;
	margin-right: 4px;
	background-color: #fff;
}
.m10 {
	margin: 10px 0;
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
