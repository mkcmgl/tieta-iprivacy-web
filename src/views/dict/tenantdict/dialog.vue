<template>
	<div class="tenant-dict-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="dictForm" :model="state.ruleForm" :rules="rules" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="字典名称" prop="dictName">
							<el-input v-model="state.ruleForm.dictName" placeholder="请输入名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="字典编码" prop="dictCode">
							<el-input v-model="state.ruleForm.dictCode" placeholder="请输入参数编码" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="备注" prop="dictDesc">
							<el-input v-model="state.ruleForm.dictDesc" type="textarea" placeholder="请输入备注" maxlength="64"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button v-if="state.dialog.type == 'view'" type="primary" @click="onCancel" size="default">确 认</el-button>
					<el-button v-else type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="tenantDicDialog">
import { reactive, ref, nextTick } from 'vue';
import type { FormRules } from 'element-plus';
import { deepClone } from '@/utils/other';
import { newMainDict } from '@/api/dict/index';
import { ElMessage, FormInstance } from 'element-plus';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const dictForm = ref<FormInstance>();
// 定义变量内容
const state = reactive({
	ruleForm: {
		id: '',
		dictName: '',
		dictCode: '',
		dictDesc: '',
	},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

const rules = reactive<FormRules>({
	dictName: [
		{ required: true, message: '请输入名称', trigger: 'blur' },
		{ min: 1, max: 32, message: '长度在1到32', trigger: 'blur' },
	],
	dictCode: [
		{ required: true, message: '请输入参数编码', trigger: 'blur' },
		{ min: 1, max: 32, message: '长度在1到32', trigger: 'blur' },
	],
	dictDesc: [
		{ required: false },
	]
});

// 打开弹窗
const openDialog = (type: string, row: any) => {
	if (type === 'view') {
		state.ruleForm = deepClone(row);
		state.dialog.title = '查看字典';
		state.dialog.submitTxt = '确 认';
	} else if (type === 'edit') {
		state.ruleForm = deepClone(row);
		state.dialog.title = '修改字典';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增字典';
		state.dialog.submitTxt = '新 增';
	}
	state.dialog.type = type;
	state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
	state.ruleForm.id='';
	state.dialog.isShowDialog = false;
	// 清空表单，此项需加表单验证才能使用
	nextTick(() => {
		dictForm.value?.resetFields();
	});
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
function onSubmit() {
	console.log(dictForm);
	dictForm.value?.validate((valid) => {
		console.log(valid);
		if (valid) {
			newMainDict(state.ruleForm)
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
