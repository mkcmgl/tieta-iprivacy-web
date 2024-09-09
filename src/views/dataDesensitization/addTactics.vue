<template>
	<div class="system-user-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="state.title" v-model="isShowDialog" width="750px">
			<el-form ref="tacticsForm" :model="state.form" :rules="rules" size="large" label-position="left" label-width="110px">
				<el-row class="box-detail">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="脱敏策略名称" prop="strategyName">
							<el-input maxlength="32" v-model="state.form.strategyName" placeholder="请输入6-32个字符" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="脱敏算法" prop="desensitizeAlgorithm">
							<el-radio-group v-model="state.form.desensitizeAlgorithm" class="ml-4" @change="changeRadio">
								<el-radio value="mask" size="large">掩码</el-radio>
								<el-radio value="trunc" size="large">截断</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="算法类型" prop="desensitizeType">
							<el-select v-model="state.form.desensitizeType" placeholder="请选择算法类型">
								<el-option v-for="(item, index) in algorithmTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="测试数据">
							<template #label>
								<span class="desc-before">测试数据</span>
							</template>
							<div class="flex-row-item">
								<el-input v-model="state.form.testData" placeholder="测试数据"></el-input>
								<el-button type="primary" size="large" @click="onTest">测试</el-button>
							</div>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="测试结果">
							<template #label>
								<span class="desc-before">测试结果</span>
							</template>
							<el-input v-model="state.form.result" placeholder="测试结果"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="参数n" prop="paramN">
							<el-input-number v-model="state.form.paramN" :step="1" :min="0" :max="99" controls-position="right" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="参数m" prop="paramM">
							<el-input-number v-model="state.form.paramM" :step="1" :min="0" :max="99" controls-position="right" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="描述">
							<template #label>
								<span class="desc-before">描述</span>
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
import { dataTacticsAdd, dataTacticsEdit, dataTacticsTest, dataTacticsDetail } from '@/api/dataDesensitization';
const emit = defineEmits(['refresh']);

const tacticsForm = ref();

const rules = reactive<FormRules>({
	strategyName: [
		{ required: true, trigger: 'blur', message: '请输入策略名称' },
		{
			validator: (rule: any, value: any, callback: any) => {
				if (!/^.{6,32}$/.test(value)) {
					callback(new Error('策略名称由长度为6-32个的字符组成'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
	desensitizeAlgorithm: [{ required: true, trigger: 'change', message: '请选择脱敏算法' }],
	desensitizeType: [{ required: true, trigger: 'blur', message: '请选择算法类型' }],
	paramN: [{ required: true, trigger: 'blur', message: '请选择参数N' }],
	paramM: [{ required: true, trigger: 'blur', message: '请选择参数M' }],
});

const isShowDialog = ref(false);
const fullscreenLoading = ref(false);

const state = reactive({
	title: '',
	type: '',
	form: {
		strategyName: '',
		desensitizeAlgorithm: '0',
		desensitizeType: '',
		paramN: 0,
		paramM: 0,
		status: '1',
		description: '',
		testData: '',
		result: '',
	},
});

// 算法类型
const algorithmTypeList = ref([
	{
		label: '掩码前n后m',
		value: '1',
	},
	{
		label: '保留前n后m',
		value: '2',
	},
	{
		label: '掩码自n至m',
		value: '3',
	},
	{
		label: '保留自n至m',
		value: '4',
	},
]);

const changeRadio = () => {
	if (state.form.desensitizeAlgorithm === 'mask') {
		algorithmTypeList.value = [
			{
				label: '掩码前n后m',
				value: '1',
			},
			{
				label: '保留前n后m',
				value: '2',
			},
			{
				label: '掩码自n至m',
				value: '3',
			},
			{
				label: '保留自n至m',
				value: '4',
			},
		];
	} else if (state.form.desensitizeAlgorithm === 'trunc') {
		algorithmTypeList.value = [
			{
				label: '截断前n后m',
				value: '1',
			},
			{
				label: '保留前n后m',
				value: '2',
			},
			{
				label: '截断自n至m',
				value: '3',
			},
			{
				label: '保留自n至m',
				value: '4',
			},
		];
	}
};

// 打开弹窗
const openDialog = (type: string, id: string) => {
	state.type = type;
	tacticsForm.value?.clearValidate();
	formReset();
	if (type === 'add') {
		state.title = '新增策略';
	} else {
		state.title = '编辑策略';
		fullscreenLoading.value = true;

		dataTacticsDetail({
			id: id,
		})
			.then((res) => {
				fullscreenLoading.value = false;
				if (res.resultCode === 0) {
					state.form = res.data;
					changeRadio();
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
		strategyName: '',
		desensitizeAlgorithm: '0',
		desensitizeType: '',
		paramN: 0,
		paramM: 0,
		status: '1',
		description: '',
		testData: '',
		result: '',
	};
};

// 关闭弹窗
const closeDialog = () => {
	isShowDialog.value = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};

// 检测
const onTest = () => {
	fullscreenLoading.value = true;
	dataTacticsTest({
		methodName: state.form.desensitizeAlgorithm,
		m: state.form.paramM,
		n: state.form.paramN,
		data: state.form.testData,
		methodType: state.form.desensitizeType,
	})
		.then((res) => {
			fullscreenLoading.value = false;
			if (res.resultCode === 0) {
				ElMessage.success('测试成功');
				state.form.result = res.data.result;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch(() => {
			fullscreenLoading.value = false;
		});
};

// 提交
const onSubmit = () => {
	tacticsForm.value.validate((valid: boolean) => {
		if (valid) {
			fullscreenLoading.value = true;
			if (state.type === 'add') {
				dataTacticsAdd({
					strategyName: state.form.strategyName,
					desensitizeAlgorithm: state.form.desensitizeAlgorithm,
					desensitizeType: state.form.desensitizeType,
					paramN: state.form.paramN,
					paramM: state.form.paramM,
					status: '1',
					description: state.form.description,
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
				dataTacticsEdit({
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

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.el-select,
.el-input-number {
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
