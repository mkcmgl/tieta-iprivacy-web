<template>
	<div class="task-dialog-container">
		<el-dialog :title="state.dialog.title" :close-on-click-modal="false" v-model="state.dialog.isShowDialog" width="850px">
			<template #default>
				<el-alert class="mb30" title="请确认信息无误后，启动该任务" type="warning" show-icon :closable="false" />
				<el-form class="form-item" ref="inforFormRef" :model="state.infoForm" :rules="rules" size="large" label-position="left" label-width="110px">
					<div class="box-title mb30">基本信息</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="任务名称" prop="taskName">
								<el-input disabled v-model="state.infoForm.taskName" placeholder="请输入任务名称" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="创建着" prop="creator">
								<el-input disabled v-model="state.infoForm.creator" placeholder="请输入创建着" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="所属项目" prop="project">
								<el-input disabled v-model="state.infoForm.project" placeholder="请输入所属项目" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="任务实例名称" prop="name">
								<el-input v-model="state.infoForm.name" placeholder="请输入任务实例名称" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="客户端" prop="client">
								<el-input disabled v-model="state.infoForm.client" placeholder="请选择客户端" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="服务端" prop="server">
								<el-input disabled placeholder="请选择服务端" v-model="state.infoForm.server" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="超时时间" prop="outTime">
								<el-input placeholder="请输入超时时间" v-model.number="state.infoForm.outTime" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="描述" prop="describe">
								<template #label> <span class="desc-before">描述</span> </template>
								<el-input
									placeholder="请输入描述"
									v-model="state.infoForm.describe"
									:autosize="{ minRows: 2, maxRows: 4 }"
									maxlength="200"
									type="textarea"
									show-word-limit
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<div class="box-title mb30">参与节点配置</div>
					<el-divider content-position="left"> <span style="color: #5079d9">客户端</span> </el-divider>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
							<el-form-item label="节点" prop="clientNode">
								<el-select disabled v-model="state.infoForm.clientNode" placeholder="请选择节点">
									<el-option v-for="(k, index) in clientNode" :key="index" :label="k.value" :value="k.id" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-divider content-position="left"> <span style="color: #5079d9">服务端</span> </el-divider>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
							<el-form-item label="节点" prop="serverNode">
								<el-select disabled v-model="state.infoForm.serverNode" placeholder="请选择节点">
									<el-option v-for="(k, index) in serverNode" :key="index" :label="k.value" :value="k.id" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
							<el-form-item label="数据" prop="data">
								<el-select disabled v-model="state.infoForm.data" placeholder="请选择数据">
									<el-option v-for="(k, index) in dataList" :key="index" :label="k.value" :value="k.id" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-divider content-position="left"> <span style="color: #5079d9">字段配置</span> </el-divider>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
							<el-form-item label="查询字段名称" prop="fieldList">
								<el-select disabled multiple v-model="state.infoForm.fieldList" placeholder="请选择查询字段名称">
									<el-option v-for="(k, index) in fieldList" :key="index" :label="k.value" :value="k.id" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<div class="box-title mb30">算法配置</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="数据安全等级" prop="dataSecurityLevel">
								<el-input-number disabled v-model="state.infoForm.dataSecurityLevel" :step="0.1" :min="0" :max="1" controls-position="right" />
							</el-form-item>
						</el-col>
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

<script setup lang="ts" name="firingHidden">
import { reactive, ref, getCurrentInstance } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { firingTask } from '@/api/collaborationComputing';

//标签实例
const inforFormRef = ref<FormInstance>();

// 定义子组件向父组件传值/事件
const emit = defineEmits(['firingSuccess']);

// 表单校验规则
const rules = reactive<FormRules>({
	taskName: [{ required: true, trigger: 'blur', message: '请输入任务名称' }],
	creator: [{ required: true, trigger: 'blur', message: '请输入创建者' }],
	project: [{ required: true, trigger: 'blur', message: '请选择所属项目' }],
	name: [{ required: true, trigger: 'blur', message: '请输入实例名称' }],
	server: [{ required: true, trigger: 'blur', message: '请选择服务端' }],
	client: [{ required: true, trigger: 'blur', message: '请选择客户端' }],
	clientNode: [{ required: true, trigger: 'blur', message: '请选择客户端节点' }],
	serverNode: [{ required: true, trigger: 'blur', message: '请选择服务端节点' }],
	data: [{ required: true, trigger: 'blur', message: '请选择数据' }],
	fieldList: [{ required: true, type: 'array', trigger: 'blur', message: '请选择查询字段' }],
	outTime: [
		{ required: true, trigger: 'blur', message: '请输入超时时间' },
		{ type: 'number', message: '超时时间是一个数字' },
	],
});

const timer = ref(5);
const in_clock = ref();
const innerVisible = ref(false);

// 定义变量内容
const state = reactive({
	infoForm: {
		taskName: '',
		outTime: null as number | null,
		dataSecurityLevel: null as number | null,
		creator: '',
		project: '',
		name: '',
		describe: '',
		server: '',
		client: '',
		clientNode: '',
		serverNode: '',
		data: '',
		fieldList: [] as any, //字段配置
	}, //基本信息
	dialog: {
		isShowDialog: false,
		// type: '',
		title: '启动',
	},
});
const clientNode = ref<any>([]);
const serverNode = ref<any>([]);
const dataList = ref<any>([]);
const fieldList = ref<any>([]);
// 打开弹窗
const openDialog = (id: string) => {
	inforFormRef.value?.clearValidate();
	formReset();
	state.dialog.isShowDialog = true;
};

const fullscreenLoading = ref(false);

const formReset = () => {
	state.infoForm = {
		taskName: '电商企业名单共享',
		outTime: 300,
		dataSecurityLevel: 0.5,
		creator: '中国铁塔',
		project: '电商共享项目',
		name: '测试任务2',
		describe: '这是一个描述',
		server: 'node02',
		client: 'node01',
		clientNode: '1',
		serverNode: '2',
		data: '2',
		fieldList: ['1', '2'],
	};
};
//关闭子级弹窗
const close = () => {
	console.log('timer.value', timer.value);
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
			firingTask({})
				.then((res) => {
					fullscreenLoading.value = false;
					if (res.rescultCode === 0) {
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
						ElMessage.warning(res.resultDesc);
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
.el-input-number {
	width: 100%;
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
