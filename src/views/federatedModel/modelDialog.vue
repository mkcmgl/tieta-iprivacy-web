<template>
	<div class="system-model-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="850px">
			<el-form ref="modelDialogFormRef" :model="state.ruleForm" :rules="rules" size="default" label-width="100px" :label-position="labelPosition">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16" class="mb30">
						<el-form-item label="模型名称" prop="name">
							<el-input v-model="state.ruleForm.name" placeholder="请输入模型名称" clearable></el-input>
							<p class="flTask-dialog-form-text">6-32个字符，只能由英文字母、数字及‘_’‘-’组成</p>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="模型描述" prop="description">
							<el-input v-model="state.ruleForm.description" type="textarea" placeholder="简述模型描述，200字以内" maxlength="200"></el-input>
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

<script setup lang="ts" name="systemModelDialog">
import { reactive, ref, getCurrentInstance } from 'vue';
import { modelAdd } from '@/api/flTask';

import { ElMessage, FormInstance, FormRules, FormProps } from 'element-plus';

// 定义子组件向父组件传值/事件
// const emit = defineEmits(['refresh']);

// 定义变量内容
const modelDialogFormRef = ref<FormInstance>();
const state = reactive({
	modelId: '',
	ruleForm: {
		name: '',
		description: '',
	},

	dialog: {
		isShowDialog: false,
		title: '',
	},
});
const labelPosition = ref<FormProps['labelPosition']>('left');

const rules = reactive<FormRules>({
	name: [
		{ required: true, message: '请输入任务名称', trigger: 'blur' },
		{ min: 6, max: 32, message: '6-32个字符' },
		{ pattern: /^[0-9a-zA-Z-_]{1,}$/, message: '只能由英文字母、数字及‘_’‘-’组成' },
	],
});

const formReset = () => {
	state.ruleForm = {
		name: '',
		description: '',
	};
};

// 打开弹窗
const openDialog = (id: string) => {
	modelDialogFormRef.value?.clearValidate();
	formReset();
	state.modelId = id;
	state.dialog.title = '模型提交';
	// 清空表单，此项需加表单验证才能使用
	state.ruleForm = {
		name: '',
		description: '',
	};

	state.dialog.isShowDialog = true;
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
	modelDialogFormRef.value?.validate((valid) => {
		if (valid) {
			modelAdd({
				recordId: state.modelId,
				name: state.ruleForm.name,
				description: state.ruleForm.description,
			})
				.then((res) => {
					if (res.resultCode === 0) {
						closeDialog();
						ElMessage.success('提交成功');
						// emit('refresh');
					} else {
						ElMessage.warning(res.resultDesc);
					}
				})
				.catch((err) => {
					console.log(err);
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
.flTask-dialog-form-text {
	color: gray;
	font-size: 12px;
}
.flTask-dialog-form-upload {
	width: 22%;
	display: flex;
	justify-content: start;
}
</style>
