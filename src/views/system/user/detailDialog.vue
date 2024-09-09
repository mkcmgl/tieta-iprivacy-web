<template>
	<div class="system-user-dialog-detail-container">
		<el-dialog title="用户详情" v-model="state.dialog.isShowDialog" width="850px">
			<el-form ref="userDialogFormRef" :model="state.ruleForm" size="large" label-width="90px" label-position="left" v-loading="state.loading">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="账号">
							<div>{{ state.ruleForm.loginName }}</div>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="手机号">
							<div>{{ state.ruleForm.phone }}</div>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="创建时间">
							<div>{{ state.ruleForm.createTime }}</div>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="状态">
							<div>{{ statusList[state.ruleForm.status] }}</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="onCancel" size="large">关 闭</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemUserDialog">
import { reactive, ref } from 'vue';
import { getUserDetail } from '@/api/system/user';
import { ElMessage, FormInstance } from 'element-plus';

// 定义变量内容
const userDialogFormRef = ref<FormInstance>();
const state = reactive({
	ruleForm: {
		loginName: '',
		phone: '',
		createTime: '',
		status: '' as any,
	},
	loading: false,
	dialog: {
		isShowDialog: false,
	},
});

const statusList = ['启用', '停用'];

// 打开弹窗
const openDialog = (id: string) => {
	state.loading = true;
	getUserDetail({
		userId: id,
	})
		.then((res) => {
			state.loading = false;
			if (res.resultCode === 0) {
				state.ruleForm = res.data;
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			console.log(err);
		});
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
