<template>
	<div class="system-user-dialog-container">
		<el-dialog title="查看结果" v-model="isShowDialog" width="850px">
			<p class="ml30" v-html="log" style="white-space: pre-line"></p>
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

const isShowDialog = ref(false);
const log = ref('送达地点的点点滴滴滴滴答答哒哒哒哒哒哒哒哒哒哒哒哒');

// 打开弹窗
const openDialog = (type: string, id: string) => {
	isShowDialog.value = true;
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
