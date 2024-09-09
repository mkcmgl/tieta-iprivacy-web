<template>
	<div class="system-task-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="80%">
			<div>输出{{ state.total }}条实例（当前表格近展示其中100条）</div>
			<!-- <el-row>
				<el-col v-for="(item, index) in outputData" :key="index">
					<div v-for="(item1, index1) in item" :key="index1" style="display: inline">{{ item1 }}</div>
				</el-col>
			</el-row> -->
			<el-table :data="outputData" v-loading="state.loading">
				<el-table-column type="index" label="index" width="80"></el-table-column>
				<el-table-column prop="1" label="id"></el-table-column>
				<el-table-column v-for="(item1,index1) in firstData.slice(2,firstData.length)" :key="index1" :prop="index1+2" :label="'x'+(index1+2).toString()"></el-table-column>

			</el-table>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">关 闭</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemTaskDialog">
import { reactive, ref, getCurrentInstance } from 'vue';
import { fateBoardData } from '@/api/fateboard';
import { getList } from '@/api/system/role';
import { ElMessage, FormInstance, FormRules, FormProps } from 'element-plus';

const activeName = ref('data');

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const outputData = ref([]);
const firstData = ref([])
// 定义变量内容
const state = reactive({
	loading:false,
	total: 0,
	pageNum: 1,
	pageSize: 10,
	summary: {},
	data: [],
	log: {},
	dialog: {
		title: '',
		isShowDialog: false,
	},
});

const formReset = () => {
	state.summary = {};
	state.data = [];
	state.log = {};
	state.dialog.title = '';
};

//获取日志信息
const getRecordData = (party_id: string, job_id: string, role: string, component_name: string,nodeId: string) => {
	state.loading=true
	fateBoardData({
		party_id: party_id,
		job_id: job_id,
		role: role,
		component_name: component_name,
		
	},nodeId).then((res) => {
		if (res.resultCode === 0) {
			state.total = res.data.output_data[0].total;
            state.loading= false;
			outputData.value = res.data.output_data[0].data.slice(0,100)
			firstData.value = outputData.value[0]
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};
// 打开弹窗
const openDialog = (party_id: string, job_id: string, role: string, component_name: string,nodeId: string) => {
	formReset();
	state.dialog.title = component_name;
	getRecordData(party_id, job_id, role, component_name,nodeId);
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
