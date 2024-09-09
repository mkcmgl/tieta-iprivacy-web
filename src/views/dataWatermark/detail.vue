<template>
	<div class="system-user-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="state.title" v-model="isShowDialog" width="950px">
			<el-form ref="watemarkForm" :model="state.form" size="large" label-position="left" label-width="110px">
				<el-row class="box-detail" :gutter="20">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="任务名称：">
							{{ state.form.name }}
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="任务id：">
							{{ state.form.id }}
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="添加水印数据：">
							{{ state.form.data }}
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="数据来源：">
							{{ state.form.source }}
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="数据主键：">
							{{ state.form.key }}
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="添加水印字段：">
							{{ state.form.fields }}
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="水印信息：">
							{{ state.form.info }}
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="水印密钥表名：">
							{{ state.form.tableName }}
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="结果保存位置：">
							{{ state.form.position }}
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="创建时间：">
							{{ state.form.created }}
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="嵌入水印描述：" prop="createdBy">
							<el-input
								placeholder="请输入描述"
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
import { ElMessage } from 'element-plus';
import { getDataWatemarkDetail } from '@/api/dataWatermark';

const emit = defineEmits(['refresh']);

const watemarkForm = ref();
const isShowDialog = ref(false);
const fullscreenLoading = ref(false);

const dataValueType = ref('');

const state = reactive({
	title: '详情',
	form: {
		id: 'edbx3czjnakevtpzm76r51v6hs2zw8e98qzhwwpcnr',
		name: '测试任务',
		data: '大萨达',
		source: '撒大大',
		key: '撒旦撒',
		desc: '大萨达',
		fields: '手机号',
		info: '大萨达',
		tableName: '大萨达',
		position: '撒大大',
		created: '2024-04-12 08:26:38',
	},
});

const openDialog = (row: any) => {
	state.title = 'CSV水印详情';
	isShowDialog.value = true;
	fullscreenLoading.value = true;
	getDataWatemarkDetail({})
		.then((res) => {
			fullscreenLoading.value = false;
			if (res.rescultCode === 0) {
				console.log('详情', res);
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch(() => {
			fullscreenLoading.value = false;
		});
};

const onSubmit = () => {};

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
</style>