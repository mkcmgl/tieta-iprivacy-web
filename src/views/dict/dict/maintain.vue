<template>
	<div class="dict-maintain-container layout-padding">
		<el-card shadow="hover" class="box-card">
			<template #header>
				<div class="card-header card-header-flex">
					<span style="font-size: defaultr">{{ parentName }}</span>
					<div class="tc">
						<el-button size="default" type="primary" @click="onOpenAddDic('add')">
							<el-icon>
								<ele-FolderAdd />
							</el-icon>
							新增
						</el-button>
					</div>
				</div>
			</template>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column prop="id" label="ID" width="100" align="center" />
				<el-table-column prop="dictValue" label="字典值" show-overflow-tooltip></el-table-column>
				<el-table-column prop="state" label="状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.state">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="sort" label="排序" show-overflow-tooltip></el-table-column>
				<el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="150">
					<template #default="scope">
						<!-- <el-button size="small" text type="primary" @click="onOpenViewDic('view', scope.row)">查看</el-button> -->
						<el-button size="small" text type="primary" @click="onOpenEditDic('edit', scope.row)">修改</el-button>
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

<script setup lang="ts" name="maintainDict">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { extList, changeExtState, deleteExt, deleteMain } from '@/api/dict/index';
import { useRouter } from 'vue-router';

// 引入组件
const DicDialog = defineAsyncComponent(() => import('@/views/dict/dict/dialog.vue'));
const router = useRouter();
let mainId = router.currentRoute.value.query.id;
let parentName = router.currentRoute.value.query.name;

// 定义变量内容
const dicDialogRef = ref();
const state = reactive<MaintainDicState>({
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
	extList({
		pageNum: state.tableData.param.pageNum,
		pageSize: state.tableData.param.pageSize,
		mainId: mainId,
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
	dicDialogRef.value.openDialog(type, undefined, mainId);
};
// 打开修改字典弹窗
const onOpenEditDic = (type: string, row: RowMaintainDicT) => {
	dicDialogRef.value.openDialog(type, row, mainId);
};
// 打开查看字典弹窗
// const onOpenViewDic = (type: string, row: RowMaintainDicT) => {
// 	dicDialogRef.value.openDialog(type, row, mainId);
// };
// 删除字典
const onRowDel = (row: RowMaintainDicT) => {
	ElMessageBox.confirm(`此操作将永久删除字典值：“${row.dictValue}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		buttonSize: 'default',
		type: 'warning',
	})
		.then(() => {
			deleteExt({ id: row.id })
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
	console.log(mainId);
	getTableData();
});
</script>
<style scoped lang="scss">
.card-header-flex {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>
