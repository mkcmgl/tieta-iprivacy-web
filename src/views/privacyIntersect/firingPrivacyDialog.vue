<template>
	<div class="task-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="850px">
			<template #default>
				<el-alert class="mb30" title="请确认信息无误后，启动该任务" type="warning" show-icon :closable="false" />
				<div class="box-title mb30">基本信息</div>
				<el-form class="form-item" ref="inforFormRef" :model="state.infoForm" :rules="rules" size="large" label-position="left" label-width="110px">
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="任务名称" prop="name">
								<el-input disabled v-model="state.infoForm.name" placeholder="请输入任务名称" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="创建着" prop="createdBy">
								<el-input disabled v-model="state.infoForm.createdBy" placeholder="请输入创建着" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="所属项目" prop="projectName">
								<el-input disabled v-model="state.infoForm.projectName" placeholder="请输入所属项目" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="任务实例名称" prop="taskName">
								<el-input v-model="state.infoForm.taskName" placeholder="请输入任务实例名称" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="任务发起节点" prop="node">
								<el-input disabled v-model="state.infoForm.node" placeholder="请输入任务发起节点" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="算法类型" prop="algorithmType">
								<el-input disabled placeholder="请输入算法类型" :value="state.infoForm.algorithmType === '1' ? 'RSA' : 'ECDH'" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="超时时间" prop="overTime">
								<el-input placeholder="请输入超时时间" v-model="state.infoForm.overTime" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="任务描述" prop="describe">
								<template #label>
									<span class="desc-before">任务描述</span>
								</template>
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
					<div class="box-title mb30">参与节点配置</div>
					<el-row :gutter="35" v-for="(item, index) in state.infoForm.fieldEntityList" :key="index">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="节点" required>
								<el-input disabled v-model="item.nodeName" placeholder="请输入任务名称" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="数据" required>
								<el-input disabled v-model="item.dataName" placeholder="请输入数据" clearable></el-input>
							</el-form-item>
						</el-col>
						<!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否分片" required>
								<el-radio-group v-model="item.sharding">
									<el-radio value="1">是</el-radio>
									<el-radio value="0">否</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col> -->
					</el-row>
				</el-form>
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

<script setup lang="ts" name="firingPrivacyDialog">
import { reactive, ref, getCurrentInstance } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { startPrivacy, getPrivacyDetail } from '@/api/privacyIntersect';

//标签实例
const inforFormRef = ref<FormInstance>();

// 定义子组件向父组件传值/事件
const emit = defineEmits(['firingSuccess']);
// 表单校验规则
const rules = reactive<FormRules>({
	name: [{ required: true, trigger: 'blur', message: '请输入任务名称' }],
	createdBy: [{ required: true, trigger: 'blur', message: '请输入创建者' }],
	projectName: [{ required: true, trigger: 'blur', message: '请选择所属项目' }],
	taskName: [
		{ required: true, trigger: 'blur', message: '请输入实例名称' },
		{
			validator: (rule: any, value: any, callback: any) => {
				if (!/^.{6,32}$/.test(value)) {
					callback(new Error('任务实例名称由长度为6-32个的字符组成'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
	algorithmType: [{ required: true, trigger: 'blur', message: '请选择函数类型' }],
	node: [{ required: true, trigger: 'blur', message: '请选择节点' }],
	overTime: [{ required: true, trigger: 'blur', message: '请输入超时时间' }],
});

const timer = ref(5);
const in_clock = ref();
const innerVisible = ref(false);

const fullscreenLoading = ref(false);

// 定义变量内容
const taskId = ref('');
const state = reactive({
	infoForm: {
		name: '',
		createdBy: '',
		projectName: '',
		description: '',
		overTime: null as number | null,
		algorithmType: '',
		taskName: '',
		node: '',
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
	timer.value = 5;
	formReset();
	state.dialog.isShowDialog = true;
	fullscreenLoading.value = true;
	taskId.value = id;
	getPrivacyDetail({
		taskId: id,
	})
		.then((res) => {
			fullscreenLoading.value = false;
			if (res.resultCode === 0) {
				state.infoForm = res.data;
				res.data.fieldEntityList.forEach((item: any) => {
					if (item.role === 'guest') {
						state.infoForm.node = item.nodeName;
					}
				});
			} else {
				fullscreenLoading.value = false;
				ElMessage.error(res.resultDesc);
			}
		})
		.catch(() => {});
};

const formReset = () => {
	state.infoForm = {
		name: '',
		createdBy: '',
		projectName: '',
		description: '',
		overTime: null,
		algorithmType: '',
		taskName: '',
		node: '',
		fieldEntityList: [],
	};
};

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
			fullscreenLoading.value = true;
			startPrivacy({
				taskId: taskId.value,
				description: state.infoForm.description,
				overTime: state.infoForm.overTime,
				name: state.infoForm.taskName,
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

.form-item {
	.el-form-item {
		padding-left: 20px !important;
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
