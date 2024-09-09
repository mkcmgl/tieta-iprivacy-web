<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar mb20">
			<div class="page-title task-title" @click="closeDialog">
				<img src="@/assets/public/back.png" class="mr5" />
				{{ state.dialog.title }}
			</div>
		</div>
		<el-form class="form-item" ref="taskFormRef" :model="state.taskForm" :rules="rules" size="large" label-position="left" label-width="110px">
			<el-card class="mb20 box-detail" shadow="never">
				<div class="content">
					<div class="box-title mb30">基本信息</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="任务名称" prop="name">
								<div style="width: 100%">
									<el-input
										:disabled="state.dialog.type === 'edit'"
										v-model="state.taskForm.name"
										placeholder="请输入任务名称"
										clearable
										maxlength="32"
									></el-input>
									<div class="tips">任务名称由长度为6-32个的字符组成</div>
								</div>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="所属项目" prop="projectId">
								<el-select
									placeholder="请选择所属项目"
									v-model="state.taskForm.projectId"
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
									v-model="state.taskForm.description"
									maxlength="200"
									show-word-limit
									:autosize="{ minRows: 2, maxRows: 4 }"
									type="textarea"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card class="mb20 box-detail" shadow="never">
				<div class="content">
					<div class="box-title mb30">调度信息</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="超时时间" prop="timeout">
								<el-input v-model.number="state.taskForm.timeout" placeholder="请输入超时时间" clearable></el-input>
								<span style="margin-left: 8px">秒</span>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card class="mb20 box-detail" shadow="never">
				<div class="box-title mb30">参与节点配置</div>
				<div v-if="state.dialog.type === 'edit'">
					<el-row :gutter="35" v-for="(item, index) in state.taskForm.fieldEntityList" :key="index">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item
								label="节点"
								prop="nodeName"
								:rules="[
									{
										required: true,
										message: '请选择节点',
										trigger: 'blur',
									},
								]"
							>
								<!-- <el-select :disabled="state.dialog.type === 'edit'" placeholder="请选择节点" v-model="item.nodeName">
									<el-option :disabled="k.disabled" v-for="(k, index) in nodeConfigList" :key="index" :label="k.node" :value="k.node" />
								</el-select> -->
								<el-input disabled v-model="item.nodeName" placeholder="请输入节点"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item
								label="数据"
								:prop="'fieldEntityList.' + index + '.dataId'"
								:rules="[
									{
										required: true,
										message: '请选择数据',
										trigger: 'blur',
									},
								]"
							>
								<el-select :disabled="state.dialog.type === 'edit'" placeholder="请选择数据" v-model="item.dataName">
									<el-option v-for="(k, index) in item.dataList" :key="index" :label="k.name" :value="k.dataId" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item
								label="统计字段"
								:prop="'fieldEntityList.' + index + '.fieldList'"
								:rules="[
									{
										required: true,
										message: '请选择统计字段',
										trigger: 'blur',
									},
								]"
							>
								<el-select v-model="item.colName" placeholder="请选择统计字段">
									<el-option v-for="(k, index) in item.fieldList" :key="index" :label="k" :value="k" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item
								label="所在行"
								:prop="'fieldEntityList.' + index + '.rowIndex'"
								:rules="[
									{
										required: true,
										message: '请输入所在行',
										trigger: 'blur',
									},
								]"
							>
								<el-input v-model="item.rowIndex" placeholder="请输入所在行" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
				<el-row v-else :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="节点" prop="nodeName">
							<el-input v-model="state.taskForm.nodeName" placeholder="请输入节点"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="数据" prop="dataId">
							<el-select placeholder="请选择数据" v-model="state.taskForm.dataId" @change="dataChange">
								<el-option :disabled="k.disabled" v-for="(k, index) in dataList" :key="index" :label="k.name" :value="k.dataId" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="统计字段" prop="colName">
							<el-select v-model="state.taskForm.colName" placeholder="请选择统计字段">
								<el-option :disabled="k.disabled" v-for="(k, index) in fieldList" :key="index" :label="k" :value="k" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="所在行" prop="rowIndex">
							<el-input v-model="state.taskForm.rowIndex" placeholder="请输入所在行" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item class="mb20" v-if="state.dialog.type === 'add'">
					<!-- <el-button @click="addCooperate" size="default" type="info" :disabled="state.taskForm.fieldEntityList.length === nodeConfigList.length">
						<el-icon>
							<ele-Plus />
						</el-icon>
						确认并配置协作方
					</el-button> -->
					<el-button :disabled="projectPartnerList.length === 0" @click="addCooperate" size="large" plain type="primary">
						<el-icon>
							<ele-Plus />
						</el-icon>
						确认并配置协作方
					</el-button>
				</el-form-item>
				<el-form-item class="mb20" v-if="state.taskForm.fieldEntityList.length > 0 && state.dialog.type === 'add'">
					<el-table :data="state.taskForm.fieldEntityList">
						<el-table-column type="index" width="70" label="序号" />
						<el-table-column prop="nodeName" label="节点名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="dataName" label="数据" show-overflow-tooltip></el-table-column>
						<el-table-column prop="colName" label="统计字段" show-overflow-tooltip></el-table-column>
						<el-table-column prop="rowIndex" label="所在行" show-overflow-tooltip></el-table-column>
						<el-table-column width="80px" label="操作">
							<template #default="scope">
								<el-button size="small" text type="info" @click="delTask(scope.row.nodeId, scope.$index)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
			</el-card>
			<el-card class="mb20 box-detail" shadow="never">
				<div class="content">
					<div class="box-title mb30">统计函数配置</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="函数类型" prop="algorithmType">
								<el-select placeholder="请选择函数类型" v-model="state.taskForm.algorithmType">
									<el-option v-for="(k, index) in typeList" :key="index" :label="k.node" :value="k.value" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
		</el-form>
		<div class="fotter mb20">
			<el-button @click="onCancel" size="large" type="info" plain>取 消</el-button>
			<el-button type="primary" @click="onSubmit" size="large" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
		</div>
	</div>
</template>

<script setup lang="ts" name="task">
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { addTask, editTask, getProjectList, getProjectDetail, getField, getTaskDetail } from '@/api/collaborationComputing';

const route = useRoute();
const router = useRouter();
const taskFormRef = ref();

const name = (rule: any, value: any, callback: any) => {
	if (!/^.{6,32}$/.test(value)) {
		callback(new Error('任务名称由长度为6-32个的字符组成'));
	} else {
		callback();
	}
};
//校验规则
const rules = reactive<FormRules>({
	name: [
		{ required: true, trigger: 'blur', message: '请输入任务名称' },
		{
			validator: name,
			trigger: 'blur',
		},
	],
	projectId: [{ required: true, trigger: 'change', message: '请选择所属项目' }],
	timeout: [
		{ required: true, message: '请输入超时时间' },
		{ type: 'number', message: '超时时间是一个数字' },
	],
	algorithmType: [{ required: true, trigger: 'blur', message: '请选择函数类型' }],
	colName: [{ required: true, trigger: 'blur', message: '请选择字段' }],
	nodeName: [{ required: true, trigger: 'blur', message: '请选择节点' }],
	dataId: [{ required: true, trigger: 'blur', message: '请选择数据' }],
	rowIndex: [{ required: true, trigger: 'blur', message: '请输入所在行' }],
});

const state = reactive({
	taskForm: {
		name: '',
		projectId: '',
		timeout: null as number | null,
		description: '',
		algorithmType: '',
		nodeName: '',
		dataId: '',
		colName: '',
		rowIndex: '',
		fieldEntityList: [] as any, //配置编辑赋值 新增也需要赋值
	},
	dialog: {
		title: '',
		type: '',
	},
});
const fieldList = ref([] as any);
// 节点数据列表
const nodeList = ref([] as any);
const projectId = ref('');
const nodeId = ref('');
const projectPartnerList = ref([] as any);
const projectList = ref([] as any); //项目
const dataList = ref([] as any); //数据
// 函数类型列表
const typeList = ref([
	{ node: 'MPCAdd', value: '+' },
	{ node: 'MPCMul', value: '*' },
	{ node: 'MPCSub', value: '-' },
	{ node: 'MPCDiv', value: '/' },
	// { node: 'MPCCmp', value: '+' },
]);

const validate = ref([] as any);

const fullscreenLoading = ref(false);

const openDialog = () => {
	taskFormRef.value?.clearValidate();
	state.dialog.type = route.query.type as string;
	getProject();
	if (route.query.type === 'add') {
		state.dialog.title = '新增任务';
	} else if (route.query.type === 'edit') {
		state.dialog.title = '编辑任务';
		fullscreenLoading.value = true;
		getTaskDetail({
			taskId: route.query.taskId,
		})
			.then((res) => {
				fullscreenLoading.value = false;
				if (res.resultCode === 0) {
					state.taskForm = res.data;
					editField();
				} else {
					ElMessage.error(res.resultDesc);
				}
			})
			.catch(() => {
				fullscreenLoading.value = false;
			});
	}
};

//修改获取统计字段
const editField = () => {
	getProjectDetail({ projectId: state.taskForm.projectId })
		.then((result) => {
			if (result.resultCode === 0) {
				state.taskForm.fieldEntityList.forEach((item: any) => {
					result.data.projectPartnerList.forEach((k: any) => {
						if (item.nodeId === k.nodeId) {
							k.dataList.forEach((data: any) => {
								if (item.dataId === data.dataId) {
									getField({
										id: data.id,
									})
										.then((code) => {
											if (code.resultCode === 0) {
												if (code.data.fieldList && code.data.fieldList.length > 0) {
													item.fieldList = Object.keys(code.data.fieldList[0]);
												}
											} else {
												ElMessage.error(code.resultDesc);
											}
										})
										.catch(() => {
											fullscreenLoading.value = false;
										});
								}
							});
						}
					});
				});
			} else {
				ElMessage.error(result.resultDesc);
			}
		})
		.catch(() => {
			fullscreenLoading.value = false;
		});
};

// 获取字段
const dataChange = (row: any) => {
	var list = dataList.value.filter((item: any) => {
		return item.dataId === row;
	});
	getField({
		id: list[0].id,
	}).then((res) => {
		if (res.resultCode === 0) {
			if (res.data.fieldList && res.data.fieldList.length > 0) {
				fieldList.value = Object.keys(res.data.fieldList[0]);
			}
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};

// // 获取项目列表
const getProject = () => {
	getProjectList({ type: '0', useScene: '1' }).then((res) => {
		if (res.resultCode === 0) {
			projectList.value = res.data;
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};

//删除协作方
const delTask = (nodeId: string, index: any) => {
	var data = projectPartnerList.value.filter((obj: any, k: number) => {
		return obj.nodeId === nodeId;
	});
	nodeList.value.push(data[0]);
	var k = getRandomElement();
	// state.taskForm.psikey = 'id';
	state.taskForm.nodeName = nodeList.value[k]?.nodeName;
	dataList.value = nodeList.value[k]?.dataList;
	state.taskForm.fieldEntityList.splice(index, 1);
};
// 添加协作方
// 定义一个函数来执行异步验证，并返回 Promise
async function validateAndPush(field: string) {
	return new Promise<void>((resolve) => {
		taskFormRef.value.validateField(field, (errorMsg: any) => {
			validate.value.push(errorMsg);
			resolve(); // 标记异步操作完成
		});
	});
}
const addCooperate = async () => {
	if (state.taskForm.fieldEntityList.length === projectPartnerList.value.length) {
		return ElMessage.warning('协作方配置完成！');
	}
	validate.value = [];
	let fieldsToValidate = ['rowIndex', 'dataId', 'colName', 'nodeName'];
	// 使用 async/await 等待所有验证完成
	for (let field of fieldsToValidate) {
		await validateAndPush(field);
	}
	var validShow = validate.value.every((item: any) => {
		return item;
	});
	if (validShow) {
		var data = dataList.value.filter((obj: any) => {
			return obj.dataId === state.taskForm.dataId;
		});
		var project = projectPartnerList.value.filter((obj: any) => {
			return obj.nodeName === state.taskForm.nodeName;
		});
		var obj = {
			nodeName: state.taskForm.nodeName,
			dataId: state.taskForm.dataId,
			role: projectId.value === project[0]?.enterpriseId ? 'guest' : 'host',
			nodeId: project[0]?.nodeId,
			dataNamespace: data[0].namespace,
			dataName: data[0].name,
			enterpriseId: project[0]?.enterpriseId,
			enterpriseName: project[0]?.enterpriseName,
			colName: state.taskForm.colName, //统计字段
			rowIndex: state.taskForm.rowIndex, //所在行
		};
		state.taskForm.fieldEntityList.push(obj);
		nodeList.value.forEach((item: any, k: number) => {
			if (item.nodeId === obj.nodeId) {
				nodeList.value.splice(k, 1);
			}
		});
		state.taskForm.dataId = '';
		state.taskForm.nodeName = '';
		dataList.value = [];
		state.taskForm.colName = '';
		state.taskForm.rowIndex = '';
		var index = getRandomElement();
		state.taskForm.nodeName = nodeList.value[index]?.nodeName;
		dataList.value = nodeList.value[index]?.dataList;
		fieldList.value = [];
	}
};
//生成随机数
const getRandomElement = () => {
	// 生成 0 到 nodeList.length - 1 的随机整数
	const randomIndex = Math.floor(Math.random() * nodeList.value.length);
	return randomIndex;
};
const projectChange = () => {
	getProjectDetail({ projectId: state.taskForm.projectId }).then((res) => {
		if (res.resultCode === 0) {
			nodeList.value = [];
			state.taskForm.fieldEntityList = [];
			projectPartnerList.value = res.data.projectPartnerList;
			projectId.value = res.data.enterpriseId;
			nodeId.value = res.data.nodeId;
			state.taskForm.nodeName = projectPartnerList.value[0].nodeName;
			dataList.value = projectPartnerList.value[0].dataList;
			projectPartnerList.value.forEach((item: any) => {
				if (item.nodeId !== projectPartnerList.value[0].nodeId) {
					nodeList.value.push(item);
				}
			});
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};

//提交
const onSubmit = async () => {
	validate.value = [];
	let fieldsToValidate: string[] = [];
	if (state.taskForm.fieldEntityList.length !== 0) {
		fieldsToValidate = ['name', 'projectId', 'timeout', 'algorithmType'];
	} else {
		fieldsToValidate = ['rowIndex', 'dataId', 'colName', 'nodeName', 'name', 'projectId', 'timeout', 'algorithmType'];
	}
	// 使用 async/await 等待所有验证完成
	for (let field of fieldsToValidate) {
		await validateAndPush(field);
	}
	const validShow = validate.value.every((item: any) => {
		return item;
	});
	if (validShow) {
		if (state.taskForm.fieldEntityList.length !== projectPartnerList.value.length && state.dialog.type !== 'edit') {
			ElMessage.warning('存在未配置节点的协作方！请检查');
			return;
		}
		fullscreenLoading.value = true;
		if (state.dialog.type === 'add') {
			// 新增
			addTask({
				name: state.taskForm.name,
				projectId: state.taskForm.projectId,
				description: state.taskForm.description,
				algorithmType: state.taskForm.algorithmType,
				timeout: state.taskForm.timeout,
				leadNode: projectPartnerList.value.filter((obj: any) => {
					return nodeId.value === obj.nodeId;
				})[0].nodeName,
				fieldEntityList: state.taskForm.fieldEntityList,
				projectName: projectList.value.filter((obj: any) => {
					return obj.id === state.taskForm.projectId;
				})[0].name,
			})
				.then((res) => {
					fullscreenLoading.value = false;
					if (res.resultCode === 0) {
						ElMessage.success('新增成功!');
						closeDialog();
					} else {
						ElMessage.error(res.resultDesc);
					}
				})
				.catch(() => {
					fullscreenLoading.value = false;
				});
		} else {
			// 编辑
			editTask({
				...state.taskForm,
				taskId: route.query.taskId,
			})
				.then((res) => {
					fullscreenLoading.value = false;
					if (res.resultCode === 0) {
						ElMessage.success('编辑成功!');
						closeDialog();
					} else {
						ElMessage.error(res.resultDesc);
					}
				})
				.catch(() => {
					fullscreenLoading.value = false;
				});
		}
	}
};

// 关闭弹窗
const closeDialog = () => {
	router.push('/collaborationComputing');
};
// 取消
const onCancel = () => {
	closeDialog();
};

onMounted(() => {
	openDialog();
});
</script>

<style scoped lang="scss">
// .form-item {
// 	.el-form-item {
// 		// padding-left: 20px !important;
// 	}
// }

.desc-before::before {
	content: '*';
	color: #fff;
	margin-right: 4px;
	background-color: #fff;
}
.el-input,
.el-select,
.el-textarea {
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
