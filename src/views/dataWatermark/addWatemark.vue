<template>
	<div class="system-user-dialog-container">
		<el-dialog :close-on-click-modal="false" title="添加水印" v-model="isShowDialog" width="750px">
			<el-form ref="watemarkForm" :model="state.form" :rules="rules" size="large" label-position="left" label-width="120px">
				<el-row class="box-detail">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="任务名称" prop="name">
							<el-input maxlength="32" v-model="state.form.name" placeholder="请输入6-32个字符" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="添加水印数据" prop="data">
							<div class="flex-row-item">
								<el-select placeholder="请选择水印数据" v-model="state.form.data" @change="changeData">
									<el-option v-for="item in state.dataList" :key="item.id" :label="item.name" :value="item.id"></el-option>
								</el-select>
								<el-button type="primary" size="large" @click="addData">添加数据</el-button>
							</div>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="数据来源" prop="source">
							<el-input v-model="state.form.source" disabled placeholder="请输入数据来源" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30" v-if="dataValueType === '2'">
						<el-form-item label="数据主键" prop="key">
							<el-input v-model="state.form.key" placeholder="请输入数据主键" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30" v-if="dataValueType === '2'">
						<el-form-item label="添加水印字段" prop="fields">
							<el-table :data="tableDataList" style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
								<el-table-column type="selection" width="55">
									<!-- <template>
										<el-checkbox></el-checkbox>
									</template> -->
								</el-table-column>
								<el-table-column label="字段名称" show-overflow-tooltip>
									<template #default="scope">{{ scope.row.peizhi }}</template>
								</el-table-column>
								<el-table-column label="数据类型">
									<template #default="scope">{{ scope.row.neicun }}</template>
								</el-table-column>
							</el-table>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="水印信息" prop="info">
							<el-input v-model="state.form.info" placeholder="请输入水印信息" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30" v-if="dataValueType === '2'">
						<el-form-item label="水印密钥表名" prop="tableName">
							<template #label>
								<div class="tips-desc">
									<span>水印密钥表名</span>
									<el-tooltip class="box-item" effect="dark" content="水印密钥表名" placement="top">
										<el-icon class="mg-l-10">
											<QuestionFilled />
										</el-icon>
									</el-tooltip>
								</div>
							</template>
							<el-input v-model="state.form.tableName" placeholder="请输入水印密钥表名" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="结果保存位置" prop="position">
							<el-select placeholder="请选择结果保存位置" v-model="state.form.position">
								<el-option v-for="item in state.saveList" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24" class="mb30">
						<el-form-item label="嵌入水印描述">
							<template #label>
								<span class="desc-before">嵌入水印描述</span>
							</template>
							<el-input
								placeholder="请输入嵌入水印描述"
								v-model="state.form.desc"
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
import { reactive, ref, nextTick } from 'vue';
import { ElMessage, ElTable } from 'element-plus';
import { addDataWatemark, getDataWatemarkData, saveDataWatemark, getDataWatemarkField } from '@/api/dataWatermark';
import { useRouter } from 'vue-router';

const emit = defineEmits(['refresh']);

const router = useRouter();

const watemarkForm = ref();
const isShowDialog = ref(false);
const fullscreenLoading = ref(false);
const multipleTable = ref<InstanceType<typeof ElTable>>();

const tableDataList = ref([
	{
		id: 1,
		mainId: 1,
		dictValue: '{"peizhi":"标准配置","cpu":"8核","neicun":"16g"}',
		dictDesc: '',
		peizhi: '标准配置',
		cpu: '8核',
		neicun: '16g',
		sort: 1,
		state: 1,
		createTime: '2024-06-26 14:57:05',
		updateTime: '2024-06-26 14:57:05',
	},
	{
		id: 2,
		mainId: 1,
		dictValue: '{"peizhi":"高端配置","cpu":"16核","neicun":"32g"}',
		dictDesc: '',
		peizhi: '高端配置',
		cpu: '16核',
		neicun: '32g',
		sort: 2,
		state: 1,
		createTime: '2024-06-26 14:57:06',
		updateTime: '2024-06-26 14:57:06',
	},
] as any);
const selectList = ref([] as any);

const dataValueType = ref('');

const state = reactive({
	title: '',
	form: {
		name: '',
		data: '',
		source: '',
		key: '',
		desc: '',
		fields: '',
		info: '',
		tableName: '',
		position: '',
	},
	dataList: [
		{
			createTime: '2024-08-03 16:28:31',
			id: '352b945cf9a64749ad81e71cb8e6fd14',
			enterpriseId: 'a5d3fd989b494364b52c06a90504d3a9',
			nodeName: '152_test_10000',
			typeId: '1',
			typeName: '{"peizhi":"标准配置","cpu":"8核","neicun":"16g"}',
			name: 'breast_152_guest',
			description: '',
			tableName: '1722673709413723',
			namespace: '202408',
			label: 'y',
			keyName: 'id',
			authStatus: '1',
			useScene: '2',
		},
		{
			createTime: '2024-08-03 16:24:53',
			id: '3a6a45a2987d483ab3c402e6516ad8db',
			enterpriseId: 'a5d3fd989b494364b52c06a90504d3a9',
			nodeName: '152_test_10000',
			typeId: '2',
			typeName: '{"peizhi":"标准配置","cpu":"8核","neicun":"16g"}',
			name: 'breast_152',
			description: '',
			tableName: '1722673492069781',
			namespace: '202408',
			label: 'test',
			keyName: 'id',
			authStatus: '1',
			useScene: '2',
		},
	] as any,
	saveList: [] as any,
});
const rules = {
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
	data: [{ required: true, trigger: 'blur', message: '请选择数据' }],
	source: [{ required: true, trigger: 'blur', message: '请输入数据来源' }],
	key: [{ required: true, trigger: 'blur', message: '请输入数据主键' }],
	fields: [{ required: true, trigger: 'blur', message: '请选择水印字段' }],
	info: [{ required: true, trigger: 'blur', message: '请输入水印信息' }],
	tableName: [{ required: true, trigger: 'blur', message: '请输入水印密钥表名' }],
	position: [{ required: true, trigger: 'blur', message: '请选择结果保存位置' }],
};

const openDialog = (title: string, row: any) => {
	watemarkForm.value?.clearValidate();
	formReset();
	getDataWatemarkDataFun();
	saveDataWatemarkFun();
	getDataWatemarkFieldFun();
	isShowDialog.value = true;
};

//数据
const getDataWatemarkDataFun = () => {
	getDataWatemarkData({}).then((res) => {
		if (res.resultCode === 0) {
			state.dataList = res.data;
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};

//结果保存位置
const saveDataWatemarkFun = () => {
	saveDataWatemark({}).then((res) => {
		if (res.resultCode === 0) {
			state.saveList = res.data;
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};

// 字段列表
const getDataWatemarkFieldFun = () => {
	getDataWatemarkField({}).then((res) => {
		if (res.resultCode === 0) {
			tableDataList.value = res.data;
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};

const onSubmit = () => {
	watemarkForm.value.validate((valid: any) => {
		if (valid) {
			fullscreenLoading.value = true;
			addDataWatemark({})
				.then((res) => {
					fullscreenLoading.value = false;
					if (res.resultCode === 0) {
						ElMessage.success('提交成功');
						emit('refresh');
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

const changeData = (val: string) => {
	dataValueType.value = state.dataList.filter((item: any) => {
		return item.id === val;
	})[0].typeId;
	if (dataValueType.value === '1') {
		state.form.source = 'csv格式';
	} else {
		state.form.source = '数据库导入';
	}
};

const handleSelectionChange = (val: any) => {
	if (val.length > 1) {
		multipleTable.value?.clearSelection();
		multipleTable.value?.toggleRowSelection(val[val.length - 1], true);
		selectList.value = [val[val.length - 1]] as any;
	} else {
		selectList.value = val;
	}
	nextTick().then(() => {
		state.form.fields = selectList.value[0]?.id;
	});
};

const addData = () => {
	router.push('/dataManage');
};

const formReset = () => {
	state.form = {
		name: '',
		data: '',
		source: '',
		key: '',
		desc: '',
		fields: '',
		info: '',
		tableName: '',
		position: '',
	};
};

const onCancel = () => {
	closeDialog();
};

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
.tips-desc {
	display: flex;
	align-items: center;
}
</style>