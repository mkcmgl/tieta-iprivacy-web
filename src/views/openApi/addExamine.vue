<template>
	<div class="system-user-dialog-container">
		<el-dialog :close-on-click-modal="false" title="申请审批" v-model="isShowDialog" width="900px">
			<el-form ref="examineForm" :model="state.form" :rules="rules" size="large" label-position="left" label-width="110px">
				<el-row class="box-detail">
					<!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="组织名称" prop="name" class="leftFormTip">
							<template #label>
								<span class="desc-before">组织名称</span>
							</template>
							<span>{{ state.form.nonEnterpriseName }}</span>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="组织编码" prop="name" class="leftFormTip">
							<template #label>
								<span class="desc-before">组织编码</span>
							</template>
							<span>{{ state.form.nonEnterpriseCode }}</span>
						</el-form-item>
					</el-col> -->
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="自定义名称" prop="name" class="leftFormTip">
							<template #label>
								<span class="desc-before">自定义名称</span>
							</template>
							<span>{{ state.form.customName }}</span>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="使用场景" prop="name" class="leftFormTip">
							<template #label>
								<span class="desc-before">使用场景</span>
							</template>
							<span>{{ state.form.useScene }}</span>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="申请时间" prop="name" class="leftFormTip">
							<template #label>
								<span class="desc-before">申请时间</span>
							</template>
							<span>{{ state.form.createTime }}</span>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="审核意见" prop="auditState" class="leftFormTip">
							<el-radio-group v-model="state.form.auditState" @change="radioChange">
								<el-radio label="1">通过</el-radio>
								<el-radio label="2">驳回</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30" v-if="state.form.auditState === '2'">
						<el-form-item label="驳回原因" prop="auditOpinion" class="leftFormTip">
							<el-input v-model="state.form.auditOpinion" :rows="3" maxlength="100" placeholder="请输入驳回原因" type="textarea" />
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
import { getExamineDetail, examineApply } from '@/api/openApi';

const emit = defineEmits(['refresh']);

const examineForm = ref();

const isShowDialog = ref(false);
const fullscreenLoading = ref(false);

const rules = reactive<FormRules>({
	auditState: [{ required: true, trigger: 'blur', message: '请选择审核意见' }],
	auditOpinion: [{ required: true, trigger: 'blur', message: '请输入驳回原因' }],
});

const state = reactive({
	form: {
		nonEnterpriseName: '',
		nonEnterpriseCode: '',
		customName: '',
		useScene: '',
		auditState: '',
		auditOpinion: '',
	} as any,
});

const radioChange = () => {
	if (state.form.auditState === '1') {
		state.form.auditOpinion = '';
	}
};

// 打开弹窗
const openDialog = (row: any) => {
	examineForm.value?.clearValidate();
	formReset();
	fullscreenLoading.value = true;
	getExamineDetail({
		id: row.id,
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
	isShowDialog.value = true;
};

//重置字段
const formReset = () => {
	state.form = {
		nonEnterpriseName: '',
		nonEnterpriseCode: '',
		customName: '',
		useScene: '',
		auditState: '',
		auditOpinion: '',
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

// 提交
const onSubmit = () => {
	examineForm.value.validate((valid: boolean) => {
		if (valid) {
			fullscreenLoading.value = true;
			examineApply({
				...state.form,
			})
				.then((res) => {
					fullscreenLoading.value = false;
					if (res.resultCode === 0) {
						ElMessage.success('审核成功');
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
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.leftFormTip {
	::v-deep(.el-form-item__label) {
		font-weight: bold;
	}
}
.tips-title {
	display: flex;
	align-items: center;
	gap: 15px;
}
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
