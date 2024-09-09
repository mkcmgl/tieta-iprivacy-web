<template>
	<div class="inference-service-dialog-container">
		<el-dialog title="推理服务" v-model="state.dialog.isShowDialog" width="850px">
			<el-form
				ref="inferenceServiceFormRef"
				:model="state.ruleForm"
				:rules="rules"
				size="large"
				label-width="90px"
				label-position="left"
				v-loading="state.loading"
			>
				<el-row class="box-detail">
					<el-col class="mb30">
						<el-form-item label="所属项目" prop="projectName">
							<el-input v-model="state.ruleForm.projectName" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col class="mb30">
						<el-form-item label="服务描述">
							<el-input type="textarea" v-model="state.ruleForm.description" placeholder="请输入服务描述，200字以内" maxlength="200"></el-input>
						</el-form-item>
					</el-col>

					<el-col>
						<div class="box-detail-title">发起方节点配置</div>
						<el-row :gutter="20" class="mb30" v-for="(item, index) in state.ruleForm.guestNodeList" :key="index">
							<el-col :span="12">
								<el-form-item label="节点" :prop="`guestNodeList[${index}][nodeName]`" :rules="rules.nodeName">
									<el-input v-model="item.nodeName" disabled></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="数据" :prop="`guestNodeList[${index}][dataId]`" :rules="rules.dataId">
									<el-select placeholder="请选择数据" v-model="item.dataId" class="w100" @change="changeGuest($event, index)" clearable>
										<el-option v-for="dataItem in item.nodeDataList" :key="dataItem.dataId" :label="dataItem.dataName" :value="dataItem.dataId" />
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
					</el-col>
					<el-col>
						<div class="box-detail-title">协作方节点配置</div>
						<el-row :gutter="20" class="mb30" v-for="(item, index) in state.ruleForm.hostNodeList" :key="index">
							<el-col :span="12">
								<el-form-item label="节点" :prop="`hostNodeList[${index}][nodeName]`" :rules="rules.nodeName">
									<el-input v-model="item.nodeName" disabled></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="数据" :prop="`hostNodeList[${index}][dataId]`" :rules="rules.dataId">
									<el-select placeholder="请选择数据" v-model="item.dataId" class="w100" @change="changeHost($event, index)" clearable>
										<el-option v-for="dataItem in item.nodeDataList" :key="dataItem.dataId" :label="dataItem.dataName" :value="dataItem.dataId" />
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="large" type="info" plain>取 消</el-button>
					<el-button type="primary" :loding="state.loading" @click="onSubmit" size="large">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="inferenceServiceDialog">
import { reactive, ref } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { getModelDetail, getProjectDetail, offlineServiceStart } from '@/api/inferenceService';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const inferenceServiceFormRef = ref<FormInstance>();
const state = reactive({
	ruleForm: {
		modelId: '',
		projectName: '',
		description: '',
		nodeName: '',
		nodeId: '',
		hostNodeList: [] as any,
		guestNodeList: [] as any,
	},
	dialog: {
		isShowDialog: false,
	},
	loading: false,
});

const rules = reactive<FormRules>({
	projectName: [{ required: true, message: '请填写所属项目' }],
	nodeName: [{ required: true, message: '请填写节点', trigger: 'blur' }],
	dataId: [{ required: true, message: '请选择数据', trigger: 'change' }],
});

const formReset = () => {
	state.ruleForm = {
		modelId: '',
		projectName: '',
		description: '',
		nodeName: '',
		nodeId: '',
		hostNodeList: [],
		guestNodeList: [],
	};
};

// 打开弹窗
const openDialog = (modelId: string) => {
	inferenceServiceFormRef.value?.clearValidate();
	state.loading = true;
	formReset();
	getModelDetail({ modelId })
		.then((res) => {
			if (res.resultCode === 0) {
				state.ruleForm.modelId = res.data.modelId;
				state.ruleForm.projectName = res.data.projectName;
				for (let i = 0; i < res.data?.modelFieldList.length; i++) {
					if (res.data?.modelFieldList[i].role === 'host') {
						state.ruleForm.hostNodeList.push({
							nodeId: res.data?.modelFieldList[i].nodeId,
							nodeName: res.data?.modelFieldList[i].nodeName,
							dataId: '',
							nodeDataList: [],
							role: 'host',
						});
					} else {
						state.ruleForm.guestNodeList.push({
							nodeId: res.data?.modelFieldList[i].nodeId,
							nodeName: res.data?.modelFieldList[i].nodeName,
							dataId: '',
							nodeDataList: [],
							role: 'guest',
						});
					}
				}
				getDataList(res.data.projectId);
			} else {
				state.loading = false;
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			state.loading = false;
			console.error(err);
		});
	state.dialog.isShowDialog = true;
};

const getDataList = (projectId: string) => {
	getProjectDetail({ projectId })
		.then((res) => {
			state.loading = false;
			if (res.resultCode === 0) {
				res.data?.projectPartnerList.forEach((item: any) => {
					if (item.enterpriseId === res.data?.enterpriseId) {
						state.ruleForm.guestNodeList.forEach((subItem: any) => {
							item?.dataList.forEach((dataItem: any) => {
								if (dataItem.nodeId === subItem.nodeId) {
									subItem.nodeDataList.push({
										dataName: dataItem.name,
										namespace: dataItem.namespace,
										tableName: dataItem.tableName,
										dataId: dataItem.dataId,
									});
								}
							});
						});
					} else {
						state.ruleForm.hostNodeList.forEach((subItem: any) => {
							item?.dataList.forEach((dataItem: any) => {
								if (dataItem.nodeId === subItem.nodeId) {
									subItem.nodeDataList.push({
										dataName: dataItem.name,
										namespace: dataItem.namespace,
										tableName: dataItem.tableName,
										dataId: dataItem.dataId,
									});
								}
							});
						});
					}
				});
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			state.loading = false;
			console.error(err);
		});
};

const changeGuest = (val: string, index: number) => {
	if (val) {
		let dataIndex = state.ruleForm.guestNodeList[index].nodeDataList.findIndex((item: any) => item.dataId === val);
		Object.assign(state.ruleForm.guestNodeList[index], state.ruleForm.guestNodeList[index].nodeDataList[dataIndex]);
	}
};

const changeHost = (val: string, index: number) => {
	if (val) {
		let dataIndex = state.ruleForm.hostNodeList[index].nodeDataList.findIndex((item: any) => item.dataId === val);
		Object.assign(state.ruleForm.hostNodeList[index], state.ruleForm.hostNodeList[index].nodeDataList[dataIndex]);
	}
};

// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
const onSubmit = () => {
	inferenceServiceFormRef.value?.validate((valid) => {
		if (valid) {
			state.loading = true;
			let fieldList = [...state.ruleForm.hostNodeList, ...state.ruleForm.guestNodeList];
			offlineServiceStart({
				modelId: state.ruleForm.modelId,
				description: state.ruleForm.description,
				fieldList: fieldList,
			})
				.then((res) => {
					state.loading = false;
					if (res.resultCode === 0) {
						closeDialog();
						ElMessage.success('推理服务开始');
						emit('refresh');
					} else {
						ElMessage.warning(res.resultDesc);
					}
				})
				.catch((err) => {
					state.loading = false;
					console.error(err);
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
</style>
