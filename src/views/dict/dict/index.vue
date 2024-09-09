<template>
	<div class="dict-manage-container layout-padding">
		<el-card shadow="hover">
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column prop="id" label="ID" width="100" align="center" />
				<el-table-column prop="dictName" label="字典名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="dictCode" label="字典编码" show-overflow-tooltip></el-table-column>
				<el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onRowMaintain(scope.row)">维护字典项</el-button>
					</template>
				</el-table-column>
			</el-table>
			<Pagination
				:total="state.tableData.total"
				v-model:page="state.tableData.param.pageNum"
				v-model:limit="state.tableData.param.pageSize"
				:background="false"
				@pagination="getTableData"
			/>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="dictDict">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getMainPage } from '@/api/dict';

const router = useRouter();
// 定义变量内容
const state = reactive<DicState>({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNum: 1,
			pageSize: 5,
		},
	},
});

// 初始化表格数据
const getTableData = () => {
	state.tableData.loading = true;
	getMainPage({
		pageNum: state.tableData.param.pageNum,
		pageSize: state.tableData.param.pageSize,
	})
		.then((res) => {
			if (res.resultCode === 0) {
				state.tableData.total = res.data.total;
				state.tableData.data = res.data.data;
			} else {
				ElMessage.warning(res.resultDesc);
			}
			state.tableData.loading = false;
		})
		.catch((err) => {
			state.tableData.loading = false;
			ElMessage.warning(err);
		});
};

const onRowMaintain = (row: RowTenantdict) => {
	router.push({
		path: '/dict/management/maintain',
		query: { id: row.id, name: row.dictName },
	});
};
// 页面加载时
onMounted(() => {
	getTableData();
});
</script>
