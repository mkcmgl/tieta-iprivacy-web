<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar mb20">
			<div class="page-title task-title" @click="closeDialog">
				<img src="@/assets/public/back.png" class="mr5" />
				{{ state.dialog.title }}
			</div>
		</div>
		<el-form class="form-item" ref="provacyFormRef" :model="state.taskForm" :rules="rules" size="large" label-position="left" label-width="110px">
			<el-card class="mb20 box-detail" shadow="never">
				<div class="content">
					<div class="box-detail-title mb30">基本信息</div>
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
									@change="projectChange"
									v-model="state.taskForm.projectId"
									:disabled="state.dialog.type === 'edit'"
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
									:autosize="{ minRows: 2, maxRows: 4 }"
									maxlength="200"
									type="textarea"
									show-word-limit
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card class="mb20 box-detail" shadow="never">
				<div class="content">
					<div class="box-detail-title mb30">调度信息</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="超时时间" prop="overTime">
								<el-input v-model.number="state.taskForm.overTime" placeholder="请输入超时时间" clearable></el-input>
								<span style="margin-left: 8px">秒</span>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card class="mb20 box-detail" shadow="never">
				<div class="content">
					<div class="box-detail-title mb30">算法配置</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="算法类型" prop="AlgorithmType">
								<el-select :disabled="state.dialog.type === 'edit'" v-model="state.taskForm.AlgorithmType" placeholder="请选择算法类型">
									<el-option v-for="(k, index) in typeList" :key="index" :label="k.label" :value="k.value" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card class="mb20 box-detail" shadow="never">
				<div class="box-detail-title mb30">参与节点配置</div>
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
								<!-- 	<el-select :disabled="state.dialog.type === 'edit'" placeholder="请选择节点" v-model="item.nodeName">
									<el-option :disabled="k.disabled" v-for="(k, index) in nodeConfigList" :key="index" :label="k.node" :value="k.node" />
								</el-select>-->
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
									<el-option :disabled="k.disabled" v-for="(k, index) in dataList" :key="index" :label="k.dataName" :value="k.dataId" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item
								label="求交关联键"
								:prop="'fieldEntityList.' + index + '.fieldList'"
								:rules="[
									{
										required: true,
										message: '请选择求交关联键',
										trigger: 'blur',
									},
								]"
							>
								<!-- <el-select :disabled="state.dialog.type === 'edit'" v-model="item.psikey" placeholder="请选择求交关键键">
									<el-option v-for="(k, index) in state.taskForm.fieldList" :key="index" :label="k.node" :value="k.node" />
								</el-select>-->
								<el-input disabled v-model="item.psikey" placeholder="请输入求交关联键"></el-input>
							</el-form-item>
						</el-col>
						<!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item
								label="是否分片"
								:prop="'fieldEntityList.' + index + '.sharding'"
								:rules="[
									{
										required: true,
										message: '请输入所在行',
										trigger: 'blur',
									},
								]"
							>
								<el-radio-group v-model="item.sharding">
									<el-radio value="1">是</el-radio>
									<el-radio value="0">否</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col> -->
					</el-row>
				</div>
				<el-row v-else :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="节点" prop="nodeName">
							<div style="width: 100%">
								<!-- <el-select placeholder="请选择节点" v-model="state.taskForm.nodeName">
									<el-option :disabled="k.disabled" v-for="(k, index) in nodeConfigList" :key="index" :label="k.node" :value="k.node" />
								</el-select>
								<div class="tips">请先选择项目，再选择节点</div> -->
								<el-input disabled v-model="state.taskForm.nodeName" placeholder="请输入节点"></el-input>
							</div>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="数据" prop="dataId">
							<el-select placeholder="请选择数据" v-model="state.taskForm.dataId">
								<el-option :disabled="k.disabled" v-for="(k, index) in dataList" :key="index" :label="k.name" :value="k.dataId" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="求交关联键" prop="psikey">
							<!-- <el-select v-model="state.taskForm.psikey" placeholder="请选择统计字段">
								<el-option :disabled="k.disabled" v-for="(k, index) in state.taskForm.fieldList" :key="index" :label="k.node" :value="k.node" />
							</el-select> -->
							<el-input disabled v-model="state.taskForm.psikey" placeholder="请输入求交关联键"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item class="mb20" v-if="state.dialog.type === 'add'">
					<el-button :disabled="projectPartnerList.length === 0" @click="addCooperate" size="large" plain type="primary">
						<el-icon>
							<ele-Plus />
						</el-icon>
						确认并配置协作方
					</el-button>
				</el-form-item>
				<el-form-item class="mb20" v-if="state.taskForm.fieldEntityList.length > 0 && state.dialog.type === 'add'">
					<el-table :data="state.taskForm.fieldEntityList">
						<el-table-column type="index" width="90" label="序号" />
						<el-table-column prop="nodeId" width="200" label="节点ID" show-overflow-tooltip></el-table-column>
						<el-table-column prop="nodeName" label="节点名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="dataName" label="数据" show-overflow-tooltip></el-table-column>
						<el-table-column prop="dataId" width="200" label="数据ID" show-overflow-tooltip></el-table-column>
						<el-table-column prop="psikey" label="求交关联键" show-overflow-tooltip></el-table-column>
						<el-table-column width="80px" label="操作">
							<template #default="scope">
								<el-button size="small" text type="info" @click="delTask(scope.row.nodeId, scope.$index)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
			</el-card>
		</el-form>
		<div class="fotter mb20">
			<el-button @click="onCancel" type="info" plain size="large">取 消</el-button>
			<el-button type="primary" @click="onSubmit" size="large" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
		</div>
	</div>
</template>

<script setup lang="ts" name="addEditorPrivacy">
import { reactive, ref, getCurrentInstance, onMounted, watch } from 'vue';
import { descriptionItemProps, ElMessage, FormInstance, FormRules } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { editPrivacy, addPrivacy, getPrivacyProjectList, getPrivacyProjectDetail, getPrivacyDetail } from '@/api/privacyIntersect';

const route = useRoute();
const router = useRouter();
const provacyFormRef = ref();

//校验规则
const rules = reactive<FormRules>({
	name: [
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
	projectId: [{ required: true, trigger: 'blur', message: '请选择所属项目' }],
	AlgorithmType: [{ required: true, trigger: 'blur', message: '请选择算法类型' }],
	overTime: [
		{ required: true, message: '请输入超时时间' },
		{ type: 'number', message: '超时时间是一个数字' },
	],
	type: [{ required: true, trigger: 'blur', message: '请选择函数类型' }],
	psikey: [{ required: true, trigger: 'blur', message: '请选择字段' }],
	nodeName: [{ required: true, trigger: 'blur', message: '请选择节点' }],
	dataId: [{ required: true, trigger: 'blur', message: '请选择数据' }],
});

const state = reactive({
	taskForm: {
		name: '',
		projectId: '',
		overTime: null as number | null,
		description: '',
		AlgorithmType: '',
		nodeName: '',
		dataId: '',
		psikey: 'id',
		fieldEntityList: [] as any, //配置编辑赋值 新增也需要赋值
	},
	dialog: {
		title: '',
		type: '',
	},
});
const nodeList = ref([] as any);
const projectId = ref('');
const nodeId = ref('');
const projectPartnerList = ref([] as any);
const projectList = ref([] as any);
const dataList = ref([] as any);
const typeList = ref([
	// { value: '1', label: 'RSA' },
	{ value: '2', label: 'ECDH' },
]);

const validate = ref([] as any);
const fullscreenLoading = ref(false);
const loading = ref(false);

//打开页面
const openDialog = () => {
	provacyFormRef.value?.clearValidate();
	state.dialog.type = route.query.type as string;
	getPrivacyProjectListFun();
	if (route.query.type === 'add') {
		state.dialog.title = '新增任务';
	} else if (route.query.type === 'edit') {
		state.dialog.title = '编辑任务';
		fullscreenLoading.value = true;
		getPrivacyDetail({
			taskId: route.query.taskId,
		})
			.then((res) => {
				fullscreenLoading.value = false;
				if (res.resultCode === 0) {
					state.taskForm = res.data;
					state.taskForm.AlgorithmType = res.data.algorithmType;
					state.taskForm.fieldEntityList.forEach((item: any) => {
						item.psikey = 'id';
					});
				} else {
					ElMessage.error(res.resultDesc);
				}
			})
			.catch(() => {
				fullscreenLoading.value = false;
			});
	}
};

//生成随机数
const getRandomElement = () => {
	// 生成 0 到 nodeList.length - 1 的随机整数
	const randomIndex = Math.floor(Math.random() * nodeList.value.length);
	return randomIndex;
};

//项目id改变获取节点
// 参与节点配置 定义两个数组 projectPartnerList 接收所有数据 nodeList 接收除第一条数据外的其他数据
// 添加 采用随机数 形式 在 nodeList 取值进行赋值 新增完 nodeList 删除对应数据
// 删除 projectPartnerList 查找删除的数据 添加到 nodeList 中 并进行随机数赋值
const projectChange = () => {
	getPrivacyProjectDetail({ projectId: state.taskForm.projectId }).then((res) => {
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

//删除协作方
const delTask = (nodeId: string, index: any) => {
	var data = projectPartnerList.value.filter((obj: any, k: number) => {
		return obj.nodeId === nodeId;
	});
	nodeList.value.push(data[0]);
	var k = getRandomElement();
	state.taskForm.psikey = 'id';
	state.taskForm.nodeName = nodeList.value[k]?.nodeName;
	dataList.value = nodeList.value[k]?.dataList;
	state.taskForm.fieldEntityList.splice(index, 1);
};
// 添加协作方
// 定义一个函数来执行异步验证，并返回 Promise
async function validateAndPush(psikey: string) {
	return new Promise<void>((resolve) => {
		provacyFormRef.value.validateField(psikey, (errorMsg: any) => {
			validate.value.push(errorMsg);
			resolve(); // 标记异步操作完成
		});
	});
}

//新增协作方
const addCooperate = async () => {
	if (state.taskForm.fieldEntityList.length === projectPartnerList.value.length) {
		return ElMessage.warning('协作方配置完成！');
	}
	validate.value = [];
	let fieldsToValidate = ['dataId', 'psikey', 'nodeName'];
	// 使用 async/await 等待所有验证完成
	for (let psikey of fieldsToValidate) {
		await validateAndPush(psikey);
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
			psikey: state.taskForm.psikey,
			role: projectId.value === project[0]?.enterpriseId ? 'guest' : 'host',
			sharding: state.taskForm.AlgorithmType === '1' ? '1' : '0',
			nodeId: project[0]?.nodeId,
			nodeUnionId: project[0]?.nodeUnionId,
			dataNamespace: data[0].namespace,
			dataName: data[0].name,
			enterpriseId: project[0]?.enterpriseId,
			enterpriseName: project[0]?.enterpriseName,
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
		state.taskForm.psikey = 'id';
		var index = getRandomElement();
		state.taskForm.nodeName = nodeList.value[index]?.nodeName;
		dataList.value = nodeList.value[index]?.dataList;
	}
};

//提交
const onSubmit = async () => {
	validate.value = [];
	let fieldsToValidate: string[] = [];
	if (state.taskForm.fieldEntityList.length !== 0) {
		fieldsToValidate = ['name', 'projectId', 'overTime', 'AlgorithmType'];
	} else {
		fieldsToValidate = ['dataId', 'psikey', 'nodeName', 'name', 'projectId', 'overTime', 'AlgorithmType'];
	}
	// 使用 async/await 等待所有验证完成
	for (let psikey of fieldsToValidate) {
		await validateAndPush(psikey);
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
			addPrivacy({
				name: state.taskForm.name,
				projectId: state.taskForm.projectId,
				nodeId: nodeId.value,
				overTime: state.taskForm.overTime,
				AlgorithmType: state.taskForm.AlgorithmType,
				description: state.taskForm.description,
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
			var list = [] as any;
			state.taskForm.fieldEntityList.forEach((item: any) => {
				list.push({
					id: item.id,
					sharding: item.sharding,
				});
			});
			editPrivacy({
				taskId: route.query.taskId,
				description: state.taskForm.description,
				overTime: state.taskForm.overTime,
				fieldEntityList: list,
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

//获取项目列表
const getPrivacyProjectListFun = () => {
	getPrivacyProjectList({
		type: '0',
		useScene: '2',
	})
		.then((res) => {
			if (res.resultCode === 0) {
				projectList.value = res.data;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch(() => {});
};

// 关闭弹窗
const closeDialog = () => {
	router.push('/privacyIntersect');
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
// ::v-deep .el-button:hover {
// 	--el-button-hover-bg-color: #c53f3f;
// 	--el-button-hover-border-color: #c53f3f;
// }
// .form-item {
// 	.el-form-item {
// 		// padding-left: 20px !important;
// 	}
// }
// .danRadio {
// 	::v-deep(.el-radio__input.is-checked .el-radio__inner) {
// 		border-color: #5079d9;
// 		background-color: #5079d9;
// 	}
// 	::v-deep(.el-radio__input.is-checked .el-radio__inner::after) {
// 		background-color: #fff;
// 	}

// 	::v-deep(.el-radio__label) {
// 		color: #333333;
// 	}

// 	::v-deep(.el-radio:hover .el-radio__input) {
// 		border-color: #5079d9;
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
