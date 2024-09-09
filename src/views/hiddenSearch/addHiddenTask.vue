<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar mb20">
			<div class="page-title task-title" @click="closeDialog">
				<img src="@/assets/public/back.png" class="mr5" />
				{{ state.dialog.title }}
			</div>
		</div>
		<el-form class="form-item" ref="hiddenForm" :model="state.hiddenForm" :rules="rules" size="large" label-position="left" label-width="110px">
			<div class="content">
				<el-card shadow="never" class="w100 box-detail mb20">
					<div class="box-title mb30">基本信息</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="任务名称" prop="taskName">
								<div style="width: 100%">
									<el-input
										:disabled="state.dialog.type === 'edit'"
										v-model="state.hiddenForm.taskName"
										placeholder="请输入任务名称"
										clearable
										maxlength="32"
									></el-input>
									<div class="tips">任务名称由长度为6-32个的字符组成</div>
								</div>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="所属项目" prop="project">
								<el-select
									placeholder="请选择所属项目"
									v-model="state.hiddenForm.project"
									:disabled="state.dialog.type === 'edit'"
									@change="projectChange"
								>
									<el-option v-for="(item, index) in projectList" :key="index" :label="item.name" :value="item.id" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="任务描述">
								<template #label>
									<span class="desc-before">任务描述</span>
								</template>
								<el-input
									placeholder="请输入描述"
									v-model="state.hiddenForm.desc"
									maxlength="200"
									show-word-limit
									:autosize="{ minRows: 2, maxRows: 4 }"
									type="textarea"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-card>
				<el-card shadow="never" class="w100 box-detail mb20">
					<div class="box-title mb30">调度信息</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="查询超时时间" prop="outTime">
								<el-input v-model.number="state.hiddenForm.outTime" placeholder="请输入查询超时时间" clearable></el-input>
								<span style="margin-left: 8px">秒</span>
							</el-form-item>
						</el-col>
					</el-row>
				</el-card>
				<el-card shadow="never" class="w100 box-detail mb20">
					<div class="box-title mb30">参与节点配置</div>
					<el-divider content-position="left"> <span style="color: #5079d9">客户端</span> </el-divider>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="节点" prop="nodeNameClient">
								<div style="width: 100%">
									<el-input disabled v-model="state.hiddenForm.nodeNameClient" placeholder="请输入节点"></el-input>
								</div>
							</el-form-item>
						</el-col>
					</el-row>
					<el-divider content-position="left"> <span style="color: #5079d9">服务端</span> </el-divider>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="节点" prop="nodeNameServer">
								<div style="width: 100%">
									<el-input disabled v-model="state.hiddenForm.nodeNameServer" placeholder="请输入节点"></el-input>
								</div>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="数据" prop="data">
								<el-select :disabled="state.dialog.type === 'edit'" placeholder="请选择数据" v-model="state.hiddenForm.data">
									<el-option v-for="(k, index) in dataList" :key="index" :label="k.name" :value="k.id" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-divider content-position="left"> <span style="color: #5079d9">字段配置</span> </el-divider>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="查询字段名称" prop="fieldList">
								<el-select multiple placeholder="请选择查询字段名称" v-model="state.hiddenForm.fieldList">
									<el-option v-for="(k, index) in fieldList" :key="index" :label="k.name" :value="k.value" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</el-card>
				<el-card shadow="never" class="w100 box-detail mb20">
					<div class="box-title mb30">算法配置</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="数据安全等级" prop="dataSecurityLevel">
								<el-input-number
									:disabled="state.dialog.type === 'edit'"
									v-model="state.hiddenForm.dataSecurityLevel"
									:step="0.1"
									:min="0"
									:max="1"
									controls-position="right"
								/>
							</el-form-item>
						</el-col>
					</el-row>
				</el-card>
			</div>
		</el-form>
		<div class="fotter mb20">
			<el-button @click="onCancel" type="info" plain size="large">取 消</el-button>
			<el-button type="primary" @click="onSubmit" size="large" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
		</div>
	</div>
</template>

<script setup lang='ts' name="addHiddenTask">
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { addHiddenTask, updateHiddenTask, getProjectList, getNodeList, getDataList, getFieldList } from '@/api/hiddenSearch';

const route = useRoute();
const router = useRouter();

const hiddenForm = ref();

//校验规则
const rules = reactive<FormRules>({
	taskName: [
		{ required: true, trigger: 'blur', message: '请输入任务名称' },
		{
			validator: (rule: any, value: any, callback: any) => {
				if (!/^.{6,32}$/.test(value)) {
					callback(new Error('任务名称由长度为6-32个的字符组成'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
	project: [{ required: true, trigger: 'change', message: '请选择所属项目' }],
	outTime: [
		{ required: true, message: '请输入超时时间' },
		{ type: 'number', message: '超时时间是一个数字' },
	],
	nodeNameClient: [{ required: true, trigger: 'blur', message: '请选择客户端节点' }],
	nodeNameServer: [{ required: true, trigger: 'blur', message: '请选择客服务端节点' }],
	data: [{ required: true, trigger: 'blur', message: '请选择数据' }],
	fieldList: [{ required: true, type: 'array', trigger: 'blur', message: '请选择数据' }],
	dataSecurityLevel: [{ required: true, trigger: 'blur', message: '请选择数据安全等级' }],
});
const fullscreenLoading = ref(false);

const state = reactive({
	hiddenForm: {
		taskName: '',
		project: '',
		desc: '',
		outTime: null as number | null,
		nodeNameClient: '',
		nodeNameServer: '',
		data: '',
		fieldList: [] as any,
		dataSecurityLevel: null as number | null,
	},
	dialog: {
		title: '',
		type: '',
	},
});
const fieldList = ref([
	{
		name: 'name',
		value: 'name',
	},
	{
		name: 'task-id',
		value: 'task-id',
	},
]);
const dataList = ref([
	{
		name: '测试数据1',
		id: '1',
	},
	{
		name: '测试数据2',
		id: '2',
	},
]);
const projectList = ref([
	{
		name: '项目1',
		id: '1',
	},
	{
		name: '项目2',
		id: '2',
	},
	{
		name: '项目3',
		id: '3',
	},
]);
//项目改变触发
const projectChange = () => {
	getNodeListFun();
};

//项目列表
const getProjectListFun = () => {
	getProjectList({})
		.then((res) => {
			// projectList.value = []
		})
		.catch();
};

//节点列表
const getNodeListFun = () => {
	getNodeList({}).then((res) => {
		// nodeConfigList.value = []
	});
};

//数据列表
const getDataListFun = () => {
	getDataList({}).then((res) => {
		dataList.value = [];
	});
};

//字段列表
const getFieldListFun = () => {
	getFieldList({}).then((res) => {
		fieldList.value = [];
	});
};

// 打开页面
const openPage = () => {
	hiddenForm.value?.clearValidate();
	state.dialog.type = route.query.type as string;
	getProjectListFun();
	getDataListFun();
	getFieldListFun();
	if (route.query.type === 'add') {
		state.dialog.title = '新增任务';
	} else {
		getNodeListFun();
		state.dialog.title = '编辑任务';
		state.hiddenForm.taskName = '任务名称';
		state.hiddenForm.project = '1';
		state.hiddenForm.desc = '描述';
		state.hiddenForm.outTime = 600;
		state.hiddenForm.nodeNameClient = '节点3';
		state.hiddenForm.nodeNameServer = '节点1';
		state.hiddenForm.data = '1';
		state.hiddenForm.fieldList = ['name', 'task-id'];
		state.hiddenForm.dataSecurityLevel = 0.5;
	}
};

//提交
const onSubmit = () => {
	hiddenForm.value?.validate((valid: boolean) => {
		if (valid) {
			fullscreenLoading.value = true;
			if (state.dialog.type === 'add') {
				addHiddenTask({})
					.then((res) => {
						fullscreenLoading.value = false;
						ElMessage.success('新增成功');
						closeDialog();
					})
					.catch(() => {
						fullscreenLoading.value = false;
					});
			} else {
				updateHiddenTask({})
					.then((res) => {
						fullscreenLoading.value = false;
						ElMessage.success('编辑成功');
						closeDialog();
					})
					.catch(() => {
						fullscreenLoading.value = false;
					});
			}
		}
	});
};
// 关闭弹窗
const closeDialog = () => {
	router.push('/hiddenSearch');
};
// 取消
const onCancel = () => {
	closeDialog();
};
onMounted(() => {
	openPage();
});
</script>

<style scoped lang="scss">
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
.el-input,
.el-select,
.el-textarea,
.el-input-number {
	width: 70%;
}
.task-title {
	cursor: pointer;
}
.fotter {
	margin: 0 auto;
}
.m10 {
	margin: 0 0 10px 0;
}
.tips {
	font-size: 12px;
	color: #b5b5b5;
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
.goback {
	vertical-align: middle;
}
</style>