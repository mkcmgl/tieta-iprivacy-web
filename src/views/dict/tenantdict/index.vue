<template>
	<div class="tenant-dict-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="tc mb15">
				<el-button size="default" type="primary" class="ml10" @click="onOpenAddDic('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增字典
				</el-button>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column prop="id" label="ID" width="100" align="center" />
				<el-table-column prop="dictName" label="字典名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="dictCode" label="字典编码" show-overflow-tooltip></el-table-column>
				<el-table-column prop="dictDesc" label="备注" show-overflow-tooltip></el-table-column>
				<el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="150">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenViewDic('view', scope.row)">查看</el-button>
						<el-button size="small" text type="primary" @click="onOpenEditDic('edit', scope.row)">编辑</el-button>
						<el-button size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
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
		<DicDialog ref="dicDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="tenantDict">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getMainPage, deleteMain } from '@/api/dict/index';

// 引入组件
const DicDialog = defineAsyncComponent(() => import('@/views/dict/tenantdict/dialog.vue'));

// 定义变量内容
const dicDialogRef = ref();
const state = reactive<TenantDicState>({
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
// 打开新增字典弹窗
const onOpenAddDic = (type: string) => {
	dicDialogRef.value.openDialog(type);
};
// 打开修改字典弹窗
const onOpenEditDic = (type: string, row: RowTenantdict) => {
	dicDialogRef.value.openDialog(type, row);
};
// 打开查看字典弹窗
const onOpenViewDic = (type: string, row: RowTenantdict) => {
	dicDialogRef.value.openDialog(type, row);
};
// 删除字典
const onRowDel = (row: RowTenantdict) => {
	ElMessageBox.confirm(`此操作将永久删除字典名称：“${row.dictName}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		buttonSize: 'default',
		type: 'warning',
	})
		.then(() => {
			deleteMain({ id: row.id })
				.then((res) => {
					if (res.resultCode === 0) {
						getTableData();
						ElMessage.success('删除成功');
					} else {
						ElMessage.warning(res.resultDesc);
					}
				})
				.catch((e) => {
					ElMessage.error(e);
				});
		})
		.catch(() => {});
};

// 页面加载时
onMounted(() => {
	getTableData();
});
</script>
