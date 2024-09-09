<template>
	<div class="system-user-dialog-container">
		<el-dialog :close-on-click-modal="false" title="加密策略详情" v-model="isShowDialog" width="900px">
			<el-form v-loading="loading" class="form-item" ref="inforFormRef" :model="state.form" size="large" label-position="left" label-width="110px">
				<el-row :gutter="20" class="box-detail">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="任务名称：" prop="name">{{ state.form.taskName }} </el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="任务ID：" prop="createdBy"> {{ state.form.id }} </el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="加密数据：" prop="createdBy"> {{ state.form.dataId }} </el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="数据ID：" prop="createdBy"> {{ state.form.dataId }} </el-form-item>
					</el-col>

					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="加密策略名称：" prop="createdBy"> {{ state.form.itemList[0].strategyName }}</el-form-item>
					</el-col>
					<!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="加密策略状态：" prop="createdBy"> {{  }}</el-form-item>
					</el-col> -->
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="加密类型：" prop="createdBy">
							<span v-if="state.form.itemList[0].encryptionType === '0'">对称加密</span>
							<span v-else-if="state.form.itemList[0].encryptionType === '1'">非对称加密</span>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="加密算法：" prop="createdBy"> {{ state.form.itemList[0].encryptionAlgorithm }}</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="创建时间：" prop="createdBy"> {{ state.form.createTime }} </el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="描述：" prop="createdBy">
							{{ state.form.description }}
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="large" type="info" plain>取 消</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { encryptionTaskDetail } from '@/api/dataEncryption';
import { ElMessageBox, ElMessage } from 'element-plus';

const isShowDialog = ref(false);
const loading = ref(false);

const state = reactive({
	form: {
		id: '',
		taskName: '',
		dataId: '',
		resultPath: '',
		description: '',
		createTime: '',
		itemList: [
			{
				taskId: '',
				field: '',
				strategyId: '',
				strategyName: '',
				encryptionAlgorithm: '',
				encryptionType: '',
			},
		],
	},
});

const openDialog = (id: string) => {
	isShowDialog.value = true;
	getDetail(id);
};

const getDetail = (id: string) => {
	loading.value = true;
	encryptionTaskDetail({
		id: id,
	})
		.then((res) => {
			loading.value = false;
			if (res.resultCode === 0) {
				state.form = res.data;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch(() => {
			loading.value = false;
		});
};

const onCancel = () => {
	isShowDialog.value = false;
};

const onSubmit = () => {};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style>
</style>