<template>
	<div class="system-user-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="state.title" v-model="isShowDialog" width="750px">
			<el-form ref="taskForm" :model="state.form" :rules="rules" label-width="110px" label-position="left" size="large">
				<el-row class="box-detail">
					<el-col :span="24" class="mb30">
						<el-form-item label="任务名称" prop="taskName">
							<el-input v-model="state.form.taskName" placeholder="请输入6-32字符" maxlength="32" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24" class="mb30">
						<el-form-item label="加密数据" prop="dataId">
							<div class="flex-row-item">
								<el-select placeholder="请选择加密数据" v-model="state.form.dataId">
									<el-option v-for="item in state.dataList" :key="item.id" :label="item.name" :value="item.id"></el-option>
								</el-select>
								<el-button type="primary" size="large" @click="jumpData">添加数据</el-button>
							</div>
						</el-form-item>
					</el-col>
					<el-col :span="24" class="mb30">
						<el-form-item label="加密字段" prop="fieldList">
							<div v-for="(item, index) in state.fieldList" :key="index" style="width: 100%">
								<el-input class="mb10" style="width: 91%" v-model="item.field" placeholder="请输入加密字段" clearable></el-input
								><el-button type="primary" style="margin-left: 15px; margin-bottom: 10px" link :icon="Delete" @click="removeField(index)" />
							</div>
							<el-button size="large" @click="addField" :icon="Plus" style="width: 100%; margin-top: 15px"> 添加加密字段 </el-button>
						</el-form-item>
					</el-col>
					<el-col :span="24" class="mb30">
						<el-form-item label="加密策略" prop="strategyId">
							<el-select placeholder="请选择加密策略" v-model="state.form.strategyId" @change="changeStrate">
								<el-option v-for="item in state.tacticsList" :key="item.id" :label="item.strategyName" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="24" class="mb30">
						<el-form-item label="结果保存位置" prop="resultPath">
							<el-input v-model="state.form.resultPath" placeholder="请输入结果保存位置" clearable></el-input>
						</el-form-item>
					</el-col> -->
					<el-col :span="24" class="mb30">
						<el-form-item label="任务描述">
							<template #label>
								<span class="desc-before">任务描述</span>
							</template>
							<el-input
								placeholder="请输入描述"
								v-model="state.form.description"
								:autosize="{ minRows: 2, maxRows: 4 }"
								maxlength="200"
								type="textarea"
								show-word-limit
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="large" type="info" plain>取 消</el-button>
					<el-button type="primary" size="large" @click="onSubmit" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup  lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { Delete, Plus } from '@element-plus/icons-vue';

import { useRouter } from 'vue-router';
import {
	encryptionTaskAdd,
	encryptionTaskEdit,
	encryptionTaskDetail,
	getDataTacticsList,
	getDataList,
	dataTacticsDetail,
} from '@/api/dataEncryption';

const emit = defineEmits(['refresh']);

const router = useRouter();

const taskForm = ref();

const isShowDialog = ref(false);
const fullscreenLoading = ref(false);
const itemList = (rule: any, value: any, callback: any) => {
	const filed = state.fieldList.every((item: any) => {
		return item.field !== '';
	});
	if (filed) {
		callback();
	} else {
		callback(new Error('存在未填写的加密字段'));
	}
};
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
	dataId: [{ required: true, trigger: 'blur', message: '请选择脱敏字段' }],
	// resultPath: [{ required: true, trigger: 'blur', message: '请输入结果保存位置' }],
	strategyId: [{ required: true, trigger: 'blur', message: '请选择加密策略' }],
	fieldList: [
		{
			required: true,
			validator: itemList,
			trigger: 'blur',
		},
	],
});

const state = reactive({
	title: '',
	type: '',
	form: {
		taskName: '',
		dataId: '',
		description: '',
		// resultPath: '',
		strategyId: '',
		itemList: [
			{
				encryptionType: '',
				encryptionAlgorithm: '',
				strategyName: '',
				encryptionTypeName: '',
				strategyId: '',
				field: '',
			},
		],
	},
	dataList: [] as any,
	tacticsList: [] as any,
	fieldList: [
		{
			field: '',
		},
	] as any,
});

const formReset = () => {
	state.dataList = [];
	state.tacticsList = [];
	state.fieldList = [
		{
			field: '',
		},
	];
	state.form = {
		taskName: '',
		dataId: '',
		description: '',
		// resultPath: '',
		strategyId: '',
		itemList: [
			{
				encryptionType: '',
				encryptionAlgorithm: '',
				strategyName: '',
				encryptionTypeName: '',
				strategyId: '',
				field: '',
			},
		] as any,
	};
};

const addField = () => {
	if (state.fieldList.length === state.dataList.length) {
		ElMessage.warning('达到上限字段');
		return;
	}
	state.fieldList.push({
		field: '',
	} as any);
};

const removeField = (index: number) => {
	if (state.fieldList.length === 1) {
		ElMessage.warning('至少保留一个加密字段');
		return;
	}
	state.fieldList.splice(index, 1);
};

const typeList = ref(['对称加密', '非对称加密']);

const openDialog = (type: string, id: string) => {
	taskForm.value?.clearValidate();
	state.type = type;
	formReset();
	getDataTacticsListFun();
	getData();
	if (type === 'add') {
		state.title = '新增任务';
	} else {
		state.title = '修改任务';
		fullscreenLoading.value = true;
		encryptionTaskDetail({ id: id })
			.then((res) => {
				fullscreenLoading.value = false;
				if (res.resultCode === 0) {
					state.form = res.data;
					state.form.strategyId = res.data.itemList[0].strategyId;
					state.fieldList = res.data.itemList[0].field.split(',').map((item: any) => {
						return {
							field: item,
						};
					});
				} else {
					ElMessage.error(res.resultDesc);
				}
			})
			.catch(() => {
				fullscreenLoading.value = false;
			});
	}
	isShowDialog.value = true;
};

//脱敏策略
const getDataTacticsListFun = () => {
	getDataTacticsList({}).then((res) => {
		if (res.resultCode === 0) {
			state.tacticsList = res.data;
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};

const changeStrate = (row: any) => {
	dataTacticsDetail({
		id: row,
	}).then((res) => {
		if (res.resultCode === 0) {
			state.form.itemList[0].encryptionType = res.data.encryptionType;
			state.form.itemList[0].strategyId = state.form.strategyId;
			state.form.itemList[0].encryptionAlgorithm = res.data.encryptionAlgorithm;
			state.form.itemList[0].strategyName = res.data.strategyName;
			state.form.itemList[0].encryptionTypeName = typeList.value[res.data.encryptionType];
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};

// 获取脱敏数据列表
const getData = () => {
	getDataList({}).then((res) => {
		if (res.resultCode === 0) {
			state.dataList = res.data;
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};

// 提交
const onSubmit = () => {
	taskForm.value.validate((valid: boolean) => {
		if (valid) {
			fullscreenLoading.value = true;
			state.form.itemList[0].field = state.fieldList.map((obj: any) => obj.field).join(',');
			if (state.type === 'add') {
				encryptionTaskAdd({
					...state.form,
				})
					.then((res) => {
						fullscreenLoading.value = false;
						if (res.resultCode === 0) {
							ElMessage.success('新增成功');
							closeDialog();
							emit('refresh');
						} else {
							ElMessage.error(res.resultDesc);
						}
					})
					.catch(() => {
						fullscreenLoading.value = false;
					});
			} else {
				encryptionTaskEdit({
					...state.form,
				})
					.then((res) => {
						fullscreenLoading.value = false;
						if (res.resultCode === 0) {
							ElMessage.success('编辑成功');
							closeDialog();
							emit('refresh');
						} else {
							ElMessage.error(res.resultDesc);
						}
					})
					.catch(() => {
						fullscreenLoading.value = false;
					});
			}
		}
	});
};

const jumpData = () => {
	router.push('/dataManage');
};

const onCancel = () => {
	closeDialog();
};
// 关闭弹窗
const closeDialog = () => {
	isShowDialog.value = false;
};

defineExpose({
	openDialog,
});
</script>

<style lang="scss" scoped>
.el-select {
	width: 100%;
}
.flex-row-item {
	width: 100%;
	display: flex;
	gap: 10px;
}
.desc-before::before {
	content: '*';
	color: #fff;
	margin-right: 4px;
	background-color: #fff;
}
</style>