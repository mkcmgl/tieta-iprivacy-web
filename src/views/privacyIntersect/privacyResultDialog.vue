<template>
	<div class="system-user-dialog-container">
		<el-dialog title="查看结果" v-model="isShowDialog" width="850px">
			<!-- <p class="ml30" v-html="log" style="white-space: pre-line"></p> -->
			<json-viewer :value="log" sort v-loading="loading"> </json-viewer>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="large" type="info" plain>取 消</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemUserDialog">
import { reactive, ref } from 'vue';
import { getPrivacyResult } from '@/api/privacyIntersect';
import { ElMessage } from 'element-plus';

const isShowDialog = ref(false);
const log = ref({});
const loading = ref(false);
// 打开弹窗
const openDialog = (id: string) => {
	isShowDialog.value = true;
	loading.value = true;
	getPrivacyResult({
		recordId: id,
		componentName: 'reader_0',
	})
		.then((res) => {
			loading.value = false;
			if (res.resultCode === 0) {
				log.value = JSON.parse(JSON.stringify(res.data.output_data));
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err) => {
			loading.value = false;
		});
};

// 关闭弹窗
const closeDialog = () => {
	isShowDialog.value = false;
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
</style>
