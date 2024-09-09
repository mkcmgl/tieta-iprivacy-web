<template>
	<div class="system-task-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="850px" v-loading="state.loading">
			<el-form ref="taskDialogFormRef" :model="state.ruleForm" :rules="rules" size="default" label-width="100px" :label-position="labelPosition">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="任务名称" prop="name">
							<el-input
								v-model="state.ruleForm.name"
								placeholder="请输入任务名称"
								clearable
								:disabled="state.dialog.type != 'add'"
								size="large"
							></el-input>
							<p class="flTask-dialog-form-text">6-32个字符，只能由英文字母、数字及‘_’‘-’组成</p>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="所属项目" prop="projectId">
							<el-select
								placeholder="请选择所属项目"
								clearable
								class="w100"
								v-model="state.ruleForm.projectId"
								@change="handleChange"
								:disabled="state.dialog.type != 'add'"
								size="large"
							>
								<el-option v-for="(item, index) in projectList" :key="index" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30" v-if="state.dialog.type == 'add'">
						<div class="form-header">参与节点配置</div>
						<el-form
							ref="fieldEntityFormRef"
							:model="state.fieldEntityForm"
							style="display: flex; flex-wrap: wrap"
							label-position="left"
							label-width="85px"
							:rules="fieldRules"
						>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" label-width="100px" size="default" :label-position="labelPosition">
								<el-form-item
									label="节点名称"
									prop="nodeName"
									:rules="[
										{
											required: true,
											message: '请输入节点名称',
											trigger: 'blur',
										},
									]"
								>
									<el-input v-model="state.fieldEntityForm.nodeName" disabled placeholder="请输入节点名称" size="large"></el-input> </el-form-item
							></el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item
									label="节点ID"
									prop="nodeId"
									:rules="[
										{
											required: true,
											message: '请输入节点ID',
											trigger: 'blur',
										},
									]"
								>
									<el-input v-model="state.fieldEntityForm.nodeId" disabled placeholder="请输入节点ID" size="large"></el-input> </el-form-item
							></el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="数据" prop="dataId">
									<el-select v-model="state.fieldEntityForm.dataId" size="large" @change="handleDataChange">
										<el-option v-for="(item, index) in dataList" :key="index" :value="item.id" :label="item.name"></el-option>
									</el-select> </el-form-item
							></el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="namespace" prop="dataNamespace">
									<el-input v-model="state.fieldEntityForm.dataNamespace" placeholder="请输入namespace" size="large" disabled></el-input>
								</el-form-item>
							</el-col>
						</el-form>
						<!-- </div> -->
						<el-button @click="addNodeConfig" :disabled="addNodeConfigDisabled" size="default" plain type="primary"
							><el-icon><Plus /></el-icon>请配置协作方</el-button
						>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<div class="form-header">节点信息列表</div>
						<el-table :data="state.ruleForm.fieldEntityList">
							<el-table-column prop="nodeId" label="节点ID"></el-table-column>
							<el-table-column prop="nodeName" label="节点名称"></el-table-column>
							<el-table-column prop="dataName" label="数据" width="170"></el-table-column>
							<el-table-column prop="tableName" label="tableName" width="170"></el-table-column>
							<el-table-column prop="dataNamespace" label="namespace"></el-table-column>
							<el-table-column label="操作">
								<template #default="scope">
									<el-button type="text" @click="deleteNodeConfig(scope.row)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-col>

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="DAG配置" prop="dagContent">
							<template #label>
								<span
									>DAG配置
									<el-tooltip content="流程配量，定义参与联邦建模任务的组件列表以及组件输入和输出顺序" placement="top" effect="dark">
										<el-icon><Warning /></el-icon>
									</el-tooltip>
								</span>
							</template>
							<el-upload
								ref="flTaskUploadRef"
								class="flTask-dialog-form-upload"
								action=""
								:auto-upload="false"
								:limit="1"
								:on-change="handleFileChange"
								v-model:file-list="dslFileList"
								v-if="state.dialog.type == 'add'"
							>
								<template #trigger>
									<el-button style="width: 150px">
										<el-icon><UploadFilled /></el-icon>上传文件
									</el-button>
								</template>
							</el-upload>
							<el-button type="primary" @click="verifyDSL" size="medium" v-if="state.dialog.type == 'add'">验证</el-button>
						</el-form-item>
					</el-col>
					<el-col
						:xs="24"
						:sm="24"
						:md="24"
						:lg="24"
						:xl="24"
						class="mb30"
						style="display: flex; flex-direction: row"
						v-show="state.showGraphContainer"
					>
						<div class="dag-view-section">
							<div
								v-for="(item, index) in sortedGraphList"
								:key="index"
								:class="state.selectedNode == item.taskName ? 'selected' : 'dag-content'"
								@click="focusInput(item,index)"
							>
								<el-input type="textarea" style="height: 100%" :rows="7" v-model="item.dagContent">{{ item.dagContent }}</el-input>
							</div>
						</div>
						<div class="dag-view-section">
							<div id="container-graph" style="min-height: 500px; width: 100%; min-width: 400px"></div>
						</div>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="任务描述" prop="description">
							<el-input
								v-model="state.ruleForm.description"
								type="textarea"
								placeholder="简述项目情况，200字以内"
								maxlength="200"
								size="large"
							></el-input>
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
	</div>
</template>

<script setup lang="ts" name="systemTaskDialog">
import { reactive, ref, getCurrentInstance } from 'vue';
import { getFlTaskDetail, addFlTask, editFlTask, checkFlTask } from '@/api/flTask';
import { Graph, Path, Edge, StringExt, Node, Cell, Model, DataUri, Dom } from '@antv/x6';
import { getProjectList, projectDetail } from '@/api/projectManage';
import { getList } from '@/api/system/role';
import { ElMessage, FormInstance, FormRules, FormProps } from 'element-plus';
import type { UploadInstance, UploadProps, UploadUserFile } from 'element-plus';

const flTaskUploadRef = ref<UploadInstance>();

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const taskDialogFormRef = ref<FormInstance>();
const fieldEntityFormRef = ref<FormInstance>();
const projectPartnerList = ref([] as any);
const projectPartnerListWait = ref([] as any);
const parternerIndex = ref(0);
const addNodeConfigDisabled = ref(false);
const dslFileList = ref<UploadUserFile[]>();
const sortedGraphList = ref([] as any[]);
declare type FieldEntityForm = {
	nodeName: string;
	nodeId: string;
	dataId: string;
	dataName: string;
	dataNamespace: string;
	tableName: string;
};
const state = reactive({
	loading: false,
	showGraphContainer: false,
	graphData: [] as any[],
	selectedNode: '',
	id: '',
	ruleForm: {
		name: '',
		dagContent: '',
		description: '',
		fieldEntityList: [] as FieldEntityForm[],
		projectId: '',
		projectName: '',
	},
	fieldEntityForm: {
		nodeName: '',
		nodeId: '',
		dataId: '',
		dataName: '',
		dataNamespace: '',
		tableName: '',
	},
	deptData: [] as OrgTreeType[], // 部门数据
	roleList: [] as any,
	dialog: {
		isShowDialog: false,
		type: '',
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
const projectList = ref<ProjectStateType[]>([]);
const dataList = ref<DataType[]>([]);
const labelPosition = ref<FormProps['labelPosition']>('left');
const graphNodes = ref({
	nodes: new Array(),
	edges: new Array(),
});
const rules = reactive<FormRules>({
	name: [
		{ required: true, message: '请输入任务名称', trigger: 'blur' },
		{ min: 6, max: 32, message: '6-32个字符' },
		{ pattern: /^[0-9a-zA-Z-_]{1,}$/, message: '只能由英文字母、数字及‘_’‘-’组成' },
	],
	projectId: [{ required: true, message: '请选择项目', trigger: 'blur' }],
	dagContent: [
		{
			required: true,
			message: '请上传并验证DAG配置文件',
		},
	],
	description: [
		{
			max: 200,
			message: '最多输入200个字符',
		},
	],
});
const fieldRules = reactive<FormRules>({
	nodeId: [{ required: true, message: '请选择节点', trigger: 'blur' }],
	dataId: [{ required: true, message: '请选择数据', trigger: 'blur' }],
	dataNamespace: [{ required: true, message: '请输入namespace', trigger: 'blur' }],
});
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
const deleteNodeConfig = (row: any) => {
	parternerIndex.value = parternerIndex.value - 1;

	var data = projectPartnerList.value.filter((obj: any, k: number) => {
		return obj.nodeId === row.nodeId;
	});
	state.ruleForm.fieldEntityList.splice(state.ruleForm.fieldEntityList.indexOf(row), 1);

	projectPartnerListWait.value.push(data[0]);
	if (state.fieldEntityForm.nodeId == '') {
		state.fieldEntityForm = {
			nodeName: data[0].nodeName,
			nodeId: data[0].nodeId,
			dataId: '',
			dataName: '',
			dataNamespace: '',
			tableName: data[0].tableName,
		};
		dataList.value = data[0].dataList;
	}
	addNodeConfigDisabled.value = false;
};
const addNodeConfig = () => {
	fieldEntityFormRef.value?.validate((valid) => {
		if (valid) {
			state.ruleForm.fieldEntityList.push(state.fieldEntityForm);
			var data = projectPartnerList.value.filter((obj: any, k: number) => {
				return obj.nodeId === state.fieldEntityForm.nodeId;
			});
			if (projectPartnerListWait.value.indexOf(data[0]) != -1) {
				projectPartnerListWait.value.splice(projectPartnerListWait.value.indexOf(data[0]), 1);
			}
			fieldEntityFormRef.value?.clearValidate();
			parternerIndex.value = parternerIndex.value + 1;
		} else {
			ElMessage.info('请补全协作方数据');
		}
		if (projectPartnerListWait.value.length == 0) {
			state.fieldEntityForm = {
				nodeName: '',
				nodeId: '',
				dataId: '',
				dataName: '',
				dataNamespace: '',
				tableName: '',
			};
			dataList.value = [];
			addNodeConfigDisabled.value = true;
		} else {
			state.fieldEntityForm = {
				nodeName: projectPartnerListWait.value[parternerIndex.value - 1].nodeName,
				nodeId: projectPartnerListWait.value[parternerIndex.value - 1].nodeId,
				dataId: '',
				dataName: '',
				dataNamespace: '',
				tableName: projectPartnerListWait.value[parternerIndex.value - 1].tableName,
			};

			dataList.value = projectPartnerListWait.value[parternerIndex.value - 1].dataList;
		}
	});
};
const formReset = () => {
	state.ruleForm = {
		name: '',
		dagContent: '',
		description: '',
		projectId: '',
		projectName: '',
		fieldEntityList: [] as FieldEntityForm[],
	};
	state.fieldEntityForm = {
		nodeName: '',
		nodeId: '',
		dataId: '',
		dataName: '',
		dataNamespace: '',
		tableName: '',
	};
	dslFileList.value = [];
};
const handleFileChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
	let file = uploadFile.raw;
	console.log(file);

	if (!file) {
		return;
	}
	const fileReader = new FileReader();
	fileReader.readAsText(file!);
	fileReader.onload = (ev) => {
		const data = ev.target?.result;
		// dagJson = data as string
		state.ruleForm.dagContent = data as string;
	};
};
const handleChange = (val: string) => {
	state.fieldEntityForm = {
		nodeName: '',
		nodeId: '',
		dataId: '',
		dataName: '',
		dataNamespace: '',
		tableName: '',
	};
	projectPartnerList.value = [];
	projectPartnerListWait.value = [];
	projectList.value.filter((item) => {
		if (item.id == val) {
			state.ruleForm.projectName = item.name;
		}
	});
	projectDetail({ projectId: val }).then((res: any) => {
		projectPartnerList.value = res.data.projectPartnerList;
		res.data.projectPartnerList.filter((item: any) => {
			if (item.enterpriseId == res.data.enterpriseId) {
				state.fieldEntityForm.nodeId = item.nodeId;
				state.fieldEntityForm.nodeName = item.nodeName;
				state.fieldEntityForm.tableName = item.name;
				// state.fieldEntityForm.dataNamespace = item.namespace;
				dataList.value = item.dataList;
				projectPartnerList.value.splice(res.data.projectPartnerList.indexOf(item), 1);
				projectPartnerList.value.unshift(item);
			} else {
				//候选队列
				projectPartnerListWait.value.push(item);
			}
		});
	});
};
const handleDataChange = (val: string) => {
	dataList.value.filter((item) => {
		if (item.id == val) {
			state.fieldEntityForm.dataName = item.name;
			state.fieldEntityForm.tableName = item.tableName;
			state.fieldEntityForm.dataNamespace = item.namespace;
		}
	});
};
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
const openDialog = (type: string, id: string) => {
	taskDialogFormRef.value?.clearValidate();
	formReset();
	state.dialog.type = type;
	getRoleList();
	if (type === 'edit') {
		state.id = id;
		state.dialog.title = '编辑任务';
		getFlTaskDetail({
			taskId: id,
		})
			.then((res) => {
				state.ruleForm = res.data;
				state.showGraphContainer = true;
				state.graphData = res.data.dagTaskList;
				makeGraphContainer(state.graphData);
				
			})
			.catch((err) => {
				console.log(err);
			});
	} else if (type === 'add') {
		state.dialog.title = '新增任务';
		// 清空表单，此项需加表单验证才能使用
		state.ruleForm = {
			name: '',
			dagContent: '',
			description: '',
			projectId: '',
			projectName: '',
			fieldEntityList: [] as FieldEntityForm[],
		};
	}
	getProjectListData();

	state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
	formReset();
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	formReset();
	closeDialog();
};
//验证上传文件
const verifyDSL = () => {
	state.loading = true;
	checkFlTask({
		dagContent: state.ruleForm.dagContent,
		fieldEntityList: state.ruleForm.fieldEntityList,
	}).then((res) => {
		if (res.resultCode === 0) {
			// console.log(JSON.stringify(res.data));
			ElMessage.success('校验成功');
			state.loading = false;
			state.showGraphContainer = true;
			state.graphData = res.data;
			makeGraphContainer(res.data);
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};
const focusInput = (item:any,index:number) => {
	state.selectedNode = item.taskName;
	// let node = document.getElementsByClassName('x6-node')[index] as HTMLElement;
	// console.log(node);
	// node.click();
}

//创作画布
const makeGraphContainer = (data: any[]) => {
	sortedGraphList.value = [];
	const graph = new Graph({
		container: document.getElementById('container-graph'),
		background: 'null',
	});
	function findNextNode(node: string, nodes: any[], res: any[]) {
		let arr = new Array();
		nodes.filter((n) => {
			if (node == '' && n.dependentTasks.length == 0) {
				arr.push(n.taskName);
			} else if (n.dependentTasks.indexOf(node) != -1) {
				arr.push(n.taskName);
			}
		});
		if (arr.length != 0) {
			res.push(arr);
			arr.filter((a) => {
				return findNextNode(a, nodes, res);
			});
		} else {
			return res;
		}
	}
	let result = [] as string[][];

	findNextNode('', data, result);
	let n = 0;
	result.filter((item) => {
		item.filter((i) => {
			
			graphNodes.value.nodes.push({
				id: i,
				shape: 'rect',
				x: 100 + 50 * item.indexOf(i),
				y: 20 + 100 * n,
				width: 100,
				height: 40,
				label: i,
				attrs: {
					body: {
						stroke: '#8f8f8f',
						strokeWidth: 1,
						fill: '#fff',
						rx: 6,
						ry: 6,
					},
				},
			});
			let value = state.graphData.filter((value) => {
				return value.taskName == i;
			});
			sortedGraphList.value.push(value[0]);
		});
		n = n + 1;
	});

	data.filter((item) => {
		if (item.toTasks.length != 0) {
			item.toTasks.filter((task: string) => {
				graphNodes.value.edges.push({
					shape: 'edge',
					source: item.taskName,
					target: task,
					label: '',
					attrs: {
						line: {
							stroke: '#8f8f8f',
							strokeWidth: 1,
						},
					},
				});
			});
		}
	});

	graph.fromJSON(graphNodes.value);

	graph.on('node:click', ({ e, x, y, cell, view }) => {
		e.stopPropagation();
		const allNodes = graph.getNodes();
		allNodes.filter((node) => {
			// console.log(node);
			if (node.id != cell.id) {
				node.attr('body/stroke', '#8f8f8f');
			}
		});
		cell.attr('body/stroke', 'red');
		state.selectedNode = cell.id;
		console.log(state.selectedNode);
	});
};
// 提交
const onSubmit = () => {
	taskDialogFormRef.value?.validate((valid) => {
		if (valid) {
			state.loading = true;

			if (state.dialog.type === 'add') {
				addFlTask({
					name: state.ruleForm.name,
					dagContent: state.ruleForm.dagContent,
					description: state.ruleForm.description,
					projectId: state.ruleForm.projectId,
					projectName: state.ruleForm.projectName,
					fieldEntityList: state.ruleForm.fieldEntityList,
					dagTaskList: sortedGraphList.value,
				})
					.then((res) => {
						if (res.resultCode === 0) {
							closeDialog();
							ElMessage.success('新增成功');
							state.loading = false;
							emit('refresh');
						} else {
							ElMessage.warning(res.resultDesc);
						}
					})
					.catch((err) => {
						console.log(err);
					});
			} else if (state.dialog.type === 'edit') {
				editFlTask({
					taskId: state.id,
					name: state.ruleForm.name,
					dagContent: state.ruleForm.dagContent,
					description: state.ruleForm.description,
					projectId: state.ruleForm.projectId,
					projectName: state.ruleForm.projectName,
					fieldEntityList: state.ruleForm.fieldEntityList,
					dagTaskList: sortedGraphList.value,
				})
					.then((res) => {
						if (res.resultCode === 0) {
							closeDialog();
							ElMessage.success('编辑成功');
							state.loading = false;
							emit('refresh');
						} else {
							ElMessage.warning(res.resultDesc);
						}
					})
					.catch((err) => {
						console.log(err);
					});
			}
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
.dag-view-section {
	width: 50%;
}

.dag-content {
	border: 1px solid black;
	width: 100%;
	min-height: 100px;
	margin-bottom: 10px;
}
.selected {
	border: 2px solid red;
	width: 100%;
	min-height: 100px;
	margin-bottom: 10px;
}
</style>
