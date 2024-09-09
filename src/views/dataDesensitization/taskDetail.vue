<template>
	<div class="system-user-dialog-container">
		<el-dialog :close-on-click-modal="false" title="脱敏任务详情" v-model="isShowDialog" width="900px">
			<el-form v-loading="loading" class="form-item" ref="inforFormRef" :model="state.form" size="large" label-position="left" label-width="110px">
				<el-row :gutter="20" class="box-detail">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="任务名称：" prop="name"> {{ state.form.taskName }} </el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="任务ID：" prop="createdBy"> {{ state.form.id }} </el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="脱敏数据：" prop="createdBy"> {{ state.form.dataId }} </el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="数据ID：" prop="createdBy"> {{ state.form.dataId }} </el-form-item>
					</el-col>
					<el-col :span="24" class="mb30">
						<el-form-item label="脱敏字段列表：" prop="createdBy">
							<el-table :data="state.form.itemList">
								<el-table-column prop="field" label="脱敏字段"> </el-table-column>
								<el-table-column prop="strategyName" label="脱敏策略"> </el-table-column>
								<el-table-column label="脱敏算法">
									<template #default="scope">
										<span v-if="scope.row.desensitizeAlgorithm === 'mask'">掩码</span>
										<span v-else-if="scope.row.desensitizeAlgorithm === 'trunc'">截断</span>
									</template>
								</el-table-column>
								<el-table-column label="算法类型">
									<template #default="scope">
										<span v-if="scope.row.desensitizeAlgorithm === 'mask'">
											<span v-if="scope.row.desensitizeType === '2'">保留前n后m</span>
											<span v-else-if="scope.row.desensitizeType === '1'">掩码前n后m</span>
											<span v-else-if="scope.row.desensitizeType === '3'">掩码自n至m</span>
											<span v-else-if="scope.row.desensitizeType === '4'">保留自n至m</span>
										</span>
										<span v-else>
											<span v-if="scope.row.desensitizeType === '2'">保留前n后m</span>
											<span v-else-if="scope.row.desensitizeType === '1'">截断前n后m</span>
											<span v-else-if="scope.row.desensitizeType === '3'">截断自n至m</span>
											<span v-else-if="scope.row.desensitizeType === '4'">保留自n至m</span>
										</span>
									</template>
								</el-table-column>
							</el-table>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="创建时间：" prop="createdBy"> {{ state.form.createTime }} </el-form-item>
					</el-col>
					<el-col :span="12" class="mb30">
						<el-form-item label="任务描述：" prop="createdBy">
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
import { ElMessage } from 'element-plus';
import { dataTaskDetail } from '@/api/dataDesensitization';

const isShowDialog = ref(false);

const loading = ref(false);

const state = reactive({
	form: {
		id: '111',
		taskName: '大萨达',
		dataId: '1',
		resultPath: '1',
		description: '1',
		createTime: '13',
		itemList: [
			{
				field: '1',
				strategyName: '2',
				strategyId: '1',
				desensitizeAlgorithm: '3',
				desensitizeType: '4',
				desensitizeTypeName: '1',
			},
		],
	},
});

const openDialog = (id: string) => {
	isShowDialog.value = true;
	loading.value = true;
	dataTaskDetail({
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
// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style>
</style>