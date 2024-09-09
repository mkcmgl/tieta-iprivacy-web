<template>
	<div class="inference-service layout-padding">
		<div class="title-bar">
			<div class="page-title">任务溯源</div>
		</div>

		<el-card shadow="never" class="mt20 mb20 title-search">
			<div class="tabs-header mb20">
				<div style="float: right">
					<el-input @keyup.enter="searchList" placeholder="请输入任务名称" v-model="state.projectName" size="large">
						<template #suffix>
							<el-icon class="el-input__icon" style="cursor: pointer" @click="searchList">
								<el-icon>
									<ele-Search />
								</el-icon>
							</el-icon> </template
					></el-input>
					
				</div>
				<div style="float: right;margin-left:10px">
					<el-input @keyup.enter="searchList" placeholder="请输入实例名称" v-model="state.recordName" size="large">
						<template #suffix>
							<el-icon class="el-input__icon" style="cursor: pointer" @click="searchList">
								<el-icon>
									<ele-Search />
								</el-icon>
							</el-icon> </template
					></el-input>
				</div>
			</div>

			<el-table :data="state.tableData" v-loading="state.loading" style="width: 100%">
				<el-table-column prop="recordId" label="实例ID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="recordName" label="实例名称" show-overflow-tooltip> </el-table-column>
				<el-table-column prop="projectName" label="所属任务" show-overflow-tooltip> </el-table-column>
				<el-table-column prop="taskType" label="任务类型" show-overflow-tooltip>
					<template #default="scope">
						{{
							scope.row.taskType == '0'
								? '联邦建模'
								: scope.row.taskType == '1'
								? 'PSI'
								: scope.row.taskType == '2'
								? '协同计算'
								: scope.row.taskType == '3'
								? 'PIR'
								: '推理服务'
						}}
					</template>
				</el-table-column>
				<el-table-column prop="blockHeight" label="区块高度" show-overflow-tooltip></el-table-column>
				<el-table-column prop="blockHash" label="哈希值" show-overflow-tooltip></el-table-column>
				<el-table-column prop="recordStartTime" label="存证时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button size="small" text type="info" @click="reTrace(scope.row)">追溯</el-button>
					</template>
				</el-table-column>
			</el-table>

			<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" @pagination="getTableData" />
		</el-card>
	</div>
</template>
<script setup lang="ts" name="taskTraceability">
import { reactive, onMounted, defineAsyncComponent, ref } from 'vue';
import { getCalculatePage, getCalculateDetail } from '@/api/taskTraceability';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';

// 引入组件

const state = reactive({
	recordName: '',
	projectName:'',
	modelId: '' as any,
	loading: false,
	pageNum: 1,
	pageSize: 10,
	total: 0,
	tableData: [],
	serviceTableData: [],
	timer: '' as any,
});
const router = useRouter();

const searchList = () => {
	state.pageNum = 1;
	getTableData();
};
// 初始化表格数据
const getTableData = () => {
	clearTimeout(state.timer);
	state.loading = true;
	getCalculatePage({
		pageSize: state.pageSize,
		pageNum: state.pageNum,
		recordName: state.recordName,
		name:state.projectName
	})
		.then((res) => {
			state.tableData = [];
			state.loading = false;
			if (res.resultCode === 0) {
				state.tableData = res.data.data;
				state.total = res.data.total;
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			state.loading = false;
			console.error(err);
		});
};

const reTrace = (row: any) => {
	// console.log('追溯详情', row);

	router.push({
		name: 'taskTraceabilityDetail',
		query: { id: row.recordId,type: row.taskType },
	});
};

onMounted(() => {
	getTableData();
});
</script>
<style scope lang="scss">
.inference-service {
	.tabs-header {
		display: flex;
		justify-content: end;
		align-items: center;
		height: 40px;

		.tabs-btn {
			display: flex;
			gap: 20px;
			width: 150px;
			cursor: pointer;
			.tabs-title {
				font-size: 14px;
				font-weight: 600;
				&:hover {
					color: #eb4b4b;
				}
			}
		}

		.active {
			color: #eb4b4b;
		}
	}
}
</style>
