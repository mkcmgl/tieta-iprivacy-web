<template>
	<div class="system-user-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="state.title" v-model="isShowDialog" width="750px">
			<el-form ref="tacticsForm" :model="state.form" :rules="rules" size="large" label-position="left" label-width="110px">
				<el-row class="box-detail">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="加密策略名称" prop="strategyName">
							<el-input maxlength="32" v-model="state.form.strategyName" placeholder="请输入6-32个字符" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="加密策略状态" prop="status">
							<el-switch size="default" active-value="1" inactive-value="0" v-model="state.form.status" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="加密类型" prop="encryptionType">
							<el-radio-group v-model="state.form.encryptionType" class="ml-4" @change="changeRadio">
								<el-radio value="0" size="large">对称加密</el-radio>
								<el-radio value="1" size="large">非对称加密</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="加密算法" prop="encryptionAlgorithm">
							<el-radio-group v-model="state.form.encryptionAlgorithm" class="ml-4" @change="changeAlgorithm">
								<el-radio v-for="(item, index) in algorithmOptions" :key="index" :value="item.value" size="large">{{ item.label }}</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="加密密钥" prop="encryptionKey">
							<div class="flex-row-item">
								<el-input disabled v-model="state.form.encryptionKey" placeholder="请生成密钥"></el-input>
								<el-button type="primary" size="large" @click="dataTacticsGenerateKeyFun">生成密钥</el-button>
							</div>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30" v-if="state.form.encryptionType === '1'">
						<el-form-item label="解密密钥" prop="encryptionPrivateKey">
							<el-input disabled v-model="state.form.encryptionPrivateKey" placeholder="请输入解密密钥"></el-input>
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
							<el-input v-model="state.form.testRes" placeholder="测试结果"></el-input>
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
import { reactive, ref, computed } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { dataTacticsAdd, dataTacticsEdit, dataTacticsGenerateKey, dataTacticsTestData, dataTacticsDetail } from '@/api/dataEncryption';

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
	encryptionAlgorithm: [{ required: true, trigger: 'blur', message: '请选择加密算法' }],
	status: [{ required: true, trigger: 'change', message: '请选择策略状态' }],
	encryptionType: [{ required: true, trigger: 'blur', message: '请选择加密类型' }],
	encryptionKey: [{ required: true, trigger: 'blur', message: '请生成加密密钥' }],
	encryptionPrivateKey: [{ required: true, trigger: 'blur', message: '请生成解密密钥' }],
});

const isShowDialog = ref(false);
const fullscreenLoading = ref(false);

const state = reactive({
	title: '',
	type: '',
	form: {
		strategyName: '',
		description: '',
		encryptionType: '0',
		encryptionAlgorithm: '',
		encryptionKey: '',
		encryptionPrivateKey: '',
		decryptKey: '',
		status: '0',
		testData: '',
		testRes: '',
	},
});

// 加密算法
const algorithmOptions = ref([
	{ value: 'SM4', label: 'SM4' },
	{ value: 'AES', label: 'AES' },
	{ value: 'DES', label: 'DES' },
	{ value: 'DESede', label: 'DESede' },
] as any);

const changeRadio = () => {
	state.form.encryptionAlgorithm = '';
	state.form.encryptionPrivateKey = '';
	state.form.encryptionKey = '';
	if (state.form.encryptionType === '0') {
		algorithmOptions.value = [
			{ value: 'SM4', label: 'SM4' },
			{ value: 'AES', label: 'AES' },
			{ value: 'DES', label: 'DES' },
			{ value: 'DESede', label: 'DESede' },
		];
	} else {
		algorithmOptions.value = [
			{ value: 'RSA', label: 'RSA' },
			{ value: 'SM2', label: 'SM2' },
		];
	}
};
const changeAlgorithm = () => {
	state.form.encryptionPrivateKey = '';
	state.form.encryptionKey = '';
};

// 生成密钥
const dataTacticsGenerateKeyFun = () => {
	if (state.form.encryptionAlgorithm === '') return ElMessage.warning('请选择加密算法');
	dataTacticsGenerateKey({
		methodName: state.form.encryptionAlgorithm,
	}).then((res) => {
		if (res.resultCode === 0) {
			state.form.encryptionKey = res.data.publicKey;
			if (state.form.encryptionType === '1') {
				state.form.encryptionPrivateKey = res.data.privateKey;
			}
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};

// 检测
const onTest = () => {
	fullscreenLoading.value = true;
	dataTacticsTestData({
		data: state.form.testData,
		publicKey: state.form.encryptionKey,
		privateKey: state.form.encryptionPrivateKey,
		methodName: state.form.encryptionAlgorithm,
	})
		.then((res) => {
			fullscreenLoading.value = false;
			if (res.resultCode === 0) {
				ElMessage.success('测试成功');
				state.form.testRes = res.data;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch(() => {
			fullscreenLoading.value = false;
		});
};

// 打开弹窗
const openDialog = (type: string, id: string) => {
	state.type = type;
	formReset();
	tacticsForm.value?.clearValidate();
	if (type === 'add') {
		state.title = '新增策略';
	} else {
		state.title = '编辑策略';
		fullscreenLoading.value = true;
		dataTacticsDetail({ id: id })
			.then((res) => {
				fullscreenLoading.value = false;
				if (res.resultCode === 0) {
					state.form = res.data;
					if (state.form.encryptionType === '0') {
						algorithmOptions.value = [
							{ value: 'SM4', label: 'SM4' },
							{ value: 'AES', label: 'AES' },
							{ value: 'DES', label: 'DES' },
							{ value: 'DESede', label: 'DESede' },
						];
					} else {
						algorithmOptions.value = [
							{ value: 'RSA', label: 'RSA' },
							{ value: 'SM2', label: 'SM2' },
						];
					}
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
		description: '',
		encryptionType: '0',
		encryptionAlgorithm: '',
		encryptionKey: '',
		encryptionPrivateKey: '',
		decryptKey: '',
		status: '0',
		testData: '',
		testRes: '',
	};
	algorithmOptions.value = [
		{ value: 'SM4', label: 'SM4' },
		{ value: 'AES', label: 'AES' },
		{ value: 'DES', label: 'DES' },
		{ value: 'DESede', label: 'DESede' },
	];
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
	tacticsForm.value.validate((valid: boolean) => {
		if (valid) {
			fullscreenLoading.value = true;
			if (state.type === 'add') {
				dataTacticsAdd({
					strategyName: state.form.strategyName,
					encryptionAlgorithm: state.form.encryptionAlgorithm,
					encryptionType: state.form.encryptionType,
					encryptionKey: state.form.encryptionKey,
					encryptionPrivateKey: state.form.encryptionPrivateKey,
					status: state.form.status,
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
