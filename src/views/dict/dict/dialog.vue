<template>
	<div class="dict-dict-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="extDictForm" :model="state.ruleForm" :rules="rules" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="字典值" prop="dictValue">
							<el-input v-model="state.ruleForm.dictValue" placeholder="请输入字典值" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="字典状态" prop="state">
							<el-radio-group v-model="state.ruleForm.state">
								<el-radio :label="1" size="default">启用</el-radio>
								<el-radio :label="0" size="default">禁用</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="排序" prop="sort">
							<el-input v-model="state.ruleForm.sort" placeholder="请输入排序" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" type="info" plain size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="dictDicDialog">
import { reactive, ref, nextTick } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { deepClone } from '@/utils/other';
import { newExtDict, newMainDict } from '@/api/dict/index';
import { ElMessage } from 'element-plus';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const dicDialogFormRef = ref();
const state = reactive({
	ruleForm: {
		id: NaN,
		mainId: '',
		dictValue: '',
		state: 1,
		sort: 0,
	},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});
const extDictForm = ref<FormInstance>();
const rules = reactive<FormRules>({
	dictValue: [
		{ required: true, message: '请输入字典值', trigger: 'blur' },
		{ min: 1, max: 30, message: '长度在1到30', trigger: 'blur' },
	],
	state: [{ required: true, message: '请输入字典状态', trigger: 'blur' }],
	sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (type: string, row: RowMaintainDicT, mainId: string) => {
	state.ruleForm.mainId = mainId;
	if (type === 'view' || type === 'edit') {
		state.ruleForm = deepClone(row);
		state.dialog.title = '修改';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增';
		state.ruleForm = { id: NaN, mainId: mainId, dictValue: '', state: 1, sort: 0 };
		state.dialog.submitTxt = '新 增';
	}
	state.dialog.type = type;
	state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
	state.ruleForm = { id: NaN, mainId: '', dictValue: '', state: 1, sort: 0 };
	// 清空表单，此项需加表单验证才能使用
	nextTick(() => {
		extDictForm.value?.resetFields();
	});
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
function onSubmit() {
	extDictForm.value?.validate((valid) => {
		console.log(valid);
		if (valid) {
			newExtDict(state.ruleForm)
				.then((res) => {
					if (res.resultCode === 0) {
						ElMessage.success(state.dialog.submitTxt.replaceAll(' ', '') + '成功!');
						closeDialog();
						emit('refresh');
					} else {
						ElMessage.warning(state.dialog.submitTxt.replaceAll(' ', '') + '失败!' + res.resultDesc);
					}
				})
				.catch((e) => {
					ElMessage.warning(e);
				});
		}
	});
}

// 暴露变量
defineExpose({
	openDialog,
});
</script>
