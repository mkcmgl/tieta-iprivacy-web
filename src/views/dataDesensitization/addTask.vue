<template>
	<div class="system-user-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="state.title" v-model="isShowDialog" width="750px">
			<el-form ref="taskForm" :model="state.form" :rules="rules" size="large" label-resultPath="left" label-width="110px">
				<el-row class="box-detail">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="任务名称" prop="taskName">
							<el-input maxlength="32" v-model="state.form.taskName" placeholder="请输入6-32个字符" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="脱敏数据" prop="dataId">
							<div class="flex-row-item">
								<el-select placeholder="请选择脱敏数据" v-model="state.form.dataId">
									<el-option v-for="item in state.dataList" :key="item.id" :label="item.name" :value="item.id"></el-option>
								</el-select>
								<el-button type="primary" size="large" @click="jumpData">添加数据</el-button>
							</div>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="脱敏字段列表" prop="itemList">
							<el-table :data="state.form.itemList">
								<el-table-column label="脱敏字段">
									<template #default="scope">
										<el-input v-model="scope.row.field" placeholder="请输入" size="default"></el-input>
									</template>
								</el-table-column>
								<el-table-column label="脱敏策略">
									<template #default="scope">
										<el-select v-model="scope.row.strategyId" size="default" @change="changeTactics(scope.row, scope.$index)">
											<el-option v-for="item in state.tacticsList" :key="item.id" :label="item.strategyName" :value="item.id"></el-option>
										</el-select>
									</template>
								</el-table-column>
								<el-table-column label="脱敏算法">
									<template #default="scope">
										<span v-if="scope.row.desensitizeAlgorithm === 'mask'">掩码</span>
										<span v-else-if="scope.row.desensitizeAlgorithm === 'trunc'">截断</span>
									</template>
								</el-table-column>
								<el-table-column label="算法类型">
									<template #default="scope">
										{{ scope.row.desensitizeTypeName }}
										<!-- <span v-if="scope.row.desensitizeType === '1'">保留前n后m</span>
										<span v-else-if="scope.row.desensitizeType === '2'">掩码前n后m</span>
										<span v-else-if="scope.row.desensitizeType === '3'">掩码自n至m</span>
										<span v-else-if="scope.row.desensitizeType === '4'">保留自n至m</span> -->
									</template>
								</el-table-column>
								<el-table-column label="操作" width="80">
									<template #default="scope">
										<el-button type="primary" link :icon="Delete" @click="deleteField(scope.$index)" />
									</template>
								</el-table-column>
							</el-table>
							<el-button size="large" @click="addField" :icon="Plus" style="width: 100%; margin-top: 15px"> 添加脱敏字段 </el-button>
						</el-form-item>
					</el-col>
					<!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="结果保存位置" prop="resultPath">
							<el-input v-model="state.form.resultPath" placeholder="请输入"></el-input>
						</el-form-item>
					</el-col> -->
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
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

<script setup lang="ts" name="systemUserDialog">
import { reactive, ref } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { Delete, Plus } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { dataTaskAdd, dataTaskEdit, dataTacticsDetail, getDataList, getDataTacticsList, dataTaskDetail } from '@/api/dataDesensitization';

const emit = defineEmits(['refresh']);

const router = useRouter();
const taskForm = ref();
const itemList = (rule: any, value: any, callback: any) => {
	const filed = value.every((item: any) => {
		return item.field !== '' && item.strategyId !== '';
	});
	if (filed) {
		callback();
	} else {
		callback(new Error('存在未填写的脱敏字段或策略'));
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
	// resultPath: [{ required: true, trigger: 'blur', message: '请输入保存路径' }],
	itemList: [{ required: true, validator: itemList, trigger: 'blur' }],
});

const isShowDialog = ref(false);
const fullscreenLoading = ref(false);

const state = reactive({
	title: '',
	type: '',
	form: {
		taskName: '',
		dataId: '',
		// resultPath: '',
		description: '',
		itemList: [
			{
				field: '',
				strategyId: '',
				desensitizeAlgorithm: '',
				desensitizeType: '',
				strategyName: '',
				desensitizeTypeName: '',
			},
		],
	},
	dataList: [] as any,
	tacticsList: [] as any,
});

// const typeList = ref(['', '保留前n后m', '掩码前n后m', '掩码自n至m', '保留自n至m']);

//策略改变
const changeTactics = (row: any, index: number) => {
	dataTacticsDetail({ id: state.form.itemList[index].strategyId }).then((res) => {
		if (res.resultCode === 0) {
			state.form.itemList[index].desensitizeType = res.data.desensitizeType;
			state.form.itemList[index].desensitizeAlgorithm = res.data.desensitizeAlgorithm;
			state.form.itemList[index].strategyName = res.data.strategyName;
			if (res.data.desensitizeAlgorithm === 'mask') {
				if (res.data.desensitizeType === '1') {
					state.form.itemList[index].desensitizeTypeName = '掩码前n后m';
				} else if (res.data.desensitizeType === '2') {
					state.form.itemList[index].desensitizeTypeName = '保留前n后m';
				} else if (res.data.desensitizeType === '3') {
					state.form.itemList[index].desensitizeTypeName = '掩码自n至m';
				} else if (res.data.desensitizeType === '4') {
					state.form.itemList[index].desensitizeTypeName = '保留自n至m';
				}
			} else {
				if (res.data.desensitizeType === '1') {
					state.form.itemList[index].desensitizeTypeName = '截断前n后m';
				} else if (res.data.desensitizeType === '2') {
					state.form.itemList[index].desensitizeTypeName = '保留前n后m';
				} else if (res.data.desensitizeType === '3') {
					state.form.itemList[index].desensitizeTypeName = '截断自n至m';
				} else if (res.data.desensitizeType === '4') {
					state.form.itemList[index].desensitizeTypeName = '保留自n至m';
				}
			}
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};
//添加脱敏字段
const addField = () => {
	state.form.itemList.push({
		field: '',
		strategyId: '',
		desensitizeAlgorithm: '',
		desensitizeType: '',
		strategyName: '',
		desensitizeTypeName: '',
	});
};

// 删除脱敏字段
const deleteField = (index: number) => {
	if (state.form.itemList.length <= 1) {
		ElMessage.warning('至少保留一个脱敏字段');
		return;
	}
	state.form.itemList.splice(index, 1);
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

// 打开弹窗
const openDialog = (type: string, id: string) => {
	taskForm.value?.clearValidate();
	formReset();
	getData();
	getDataTacticsListFun();
	state.type = type;
	if (type === 'add') {
		state.title = '新增任务';
	} else {
		state.title = '编辑任务';
		fullscreenLoading.value = true;
		dataTaskDetail({
			id: id,
		})
			.then((res) => {
				fullscreenLoading.value = false;
				if (res.resultCode === 0) {
					state.form = res.data;
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
//重置字段
const formReset = () => {
	state.form = {
		taskName: '',
		dataId: '',
		// resultPath: '',
		description: '',
		itemList: [
			{
				field: '',
				strategyId: '',
				desensitizeAlgorithm: '',
				desensitizeType: '',
				strategyName: '',
				desensitizeTypeName: '',
			},
		],
	};
};
const jumpData = () => {
	router.push('/dataManage');
};

// 关闭弹窗
const closeDialog = () => {
	isShowDialog.value = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};

// 提交
const onSubmit = () => {
	taskForm.value.validate((valid: boolean) => {
		if (valid) {
			fullscreenLoading.value = true;

			if (state.type === 'add') {
				dataTaskAdd({
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
				dataTaskEdit({
					...state.form,
				})
					.then((res) => {
						fullscreenLoading.value = false;
						if (res.resultCode === 0) {
							closeDialog();
							ElMessage.success('编辑成功');
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

// 暴露变量
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
