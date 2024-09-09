<template>
	<div class="system-task-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="850px">
			<el-tabs v-model="activeName" v-loading="state.loading">
				<el-tab-pane name="partyError" label="error">
					<el-row>
						<el-col v-for="(item, index) in state.outputLogData.errorData" :key="index">{{ item }}</el-col></el-row
					>
				</el-tab-pane>
				<el-tab-pane name="partyWarning" label="warning">
					<el-row>
						<el-col v-for="(item, index) in state.outputLogData.warningData" :key="index">{{ item }}</el-col></el-row
					>
				</el-tab-pane>
				<el-tab-pane name="partyInfo" label="info">
					<el-row>
						<el-col v-for="(item, index) in state.outputLogData.infoData" :key="index">{{ item }}</el-col></el-row
					>
				</el-tab-pane>
			</el-tabs>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">关 闭</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemTaskDialog">
import { reactive, ref, watch } from 'vue';
import { fateBoardLog, fateBoardLogNumber } from '@/api/fateboard';
import { ElMessage, FormInstance, FormRules, FormProps } from 'element-plus';

const activeName = ref('partyInfo');

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// const outputLogData = ref([]);
// 定义变量内容
const state = reactive({
	total: 0,
	loading: false,
	pageNum: 1,
	pageSize: 10,
	partyId: '',
	jobId: '',
	nodeId:'',
	role: '',
	componentId: '',
	dialog: {
		title: '',
		isShowDialog: false,
	},
	outputLogData: {
		errorData: [],
		warningData: [],
		infoData: [],
	},
});

const formReset = () => {
	state.dialog.title = '';
};
//监听tab页变化
watch(
	activeName,
	() => {
		getLogData(state.partyId, state.jobId, state.role, state.componentId,state.nodeId);
	},
	{ deep: true }
);

//获取日志信息
const getLogData = (party_id: string, job_id: string, role: string, component_id: string,nodeId: string) => {
	state.loading = true;
	fateBoardLogNumber(party_id, job_id, role, component_id, {
		type: 'logSize',
	},nodeId).then((resp) => {
		if(resp.resultCode === 0) {
		state.total = resp.data.page.componentInfo;
		fateBoardLog(job_id, role, party_id, component_id, {
			type: activeName.value,
			begin: '0',
			end: state.total.toString(),
		},nodeId).then((res) => {
			if (res.resultCode === 0) {
				state.loading= false;
				if (activeName.value == 'partyInfo') {
					state.outputLogData.infoData = res.data.content.data;
				} else if (activeName.value == 'partyError') {
					state.outputLogData.errorData = res.data.content.data;
				} else {
					state.outputLogData.warningData = res.data.content.data;
				}
			} else {
				ElMessage.error(res.resultDesc);
			}
		});
	}else{
			ElMessage.error(resp.resultDesc)
		}
	});
};
// 打开弹窗
const openDialog = (party_id: string, job_id: string, role: string, component_name: string,nodeId: string) => {
	formReset();
	state.dialog.title = component_name;
	state.partyId = party_id;
	state.role = role;
	state.componentId = component_name;
	state.jobId = job_id;
	state.nodeId = nodeId;
	console.log('nodeid',nodeId);
	
	getLogData(party_id, job_id, role, component_name,nodeId);
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
