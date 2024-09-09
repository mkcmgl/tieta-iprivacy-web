<template>
	<div class="system-menu-container layout-padding">
		<div class="title-bar">
			<div class="page-title">菜单管理</div>
			<el-button size="large" type="primary" @click="onOpenAddMenu('add')">
				<el-icon>
					<ele-Plus />
				</el-icon>
				新建菜单
			</el-button>
		</div>

		<el-card shadow="never" class="mt20 mb20 title-search">
			<el-table
				:data="state.tableData.data"
				v-loading="state.tableData.loading"
				style="width: 100%"
				row-key="id"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			>
				<el-table-column label="菜单名称" show-overflow-tooltip>
					<template #default="scope">
						<SvgIcon :name="scope.row.icon" />
						<span class="ml10">{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="path" label="路由路径" show-overflow-tooltip></el-table-column>
				<el-table-column label="组件路径" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.component }}</span>
					</template>
				</el-table-column>
				<el-table-column label="权限标识" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.perms }}</span>
					</template>
				</el-table-column>
				<el-table-column label="排序" show-overflow-tooltip width="100">
					<template #default="scope">
						{{ scope.row.orderNum }}
					</template>
				</el-table-column>
				<el-table-column label="类型" show-overflow-tooltip width="100">
					<template #default="scope">
						<span v-if="scope.row.menuType == 'M'">目录</span>
						<span v-if="scope.row.menuType == 'C'">菜单</span>
						<span v-if="scope.row.menuType == 'B'">按钮</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" show-overflow-tooltip width="140">
					<template #default="scope">
						<el-button size="small" text type="info" @click="onOpenAddMenu('add', scope.row)">新增</el-button>
						<el-button size="small" text type="info" @click="onOpenEditMenu('edit', scope.row)">修改</el-button>
						<el-button size="small" text type="info" @click="onTabelRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<MenuDialog ref="menuDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemMenu">
import { defineAsyncComponent, ref, onMounted, reactive } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
import { useRoutesList } from '@/stores/routesList';
import { menuTreeList, menuDelete } from '@/api/system/menu';

// 引入组件
const MenuDialog = defineAsyncComponent(() => import('@/views/system/menu/dialog.vue'));

// 定义变量内容
let total = ref(0);
const stores = useRoutesList();
const { routesList } = storeToRefs(stores);
const menuDialogRef = ref();
const state = reactive({
	queryParams: {
		menuName: '',
	},
	tableData: {
		data: [] as RouteRecordRaw[],
		loading: true,
	},
});

// 获取路由数据，真实请从接口获取
const getTableData = () => {
	state.tableData.loading = true;
	menuTreeList(state.queryParams)
		.then((res) => {
			state.tableData.loading = false;
			if (res.resultCode === 0) {
				state.tableData.data = res.data;
				total.value = res.data.total;
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			console.error(err);
			state.tableData.loading = false;
		});
};

const searchList = () => {
	getTableData();
};

// 重置
const clearForm = () => {
	state.queryParams.menuName = '';
	getTableData();
};

// 打开新增菜单弹窗
const onOpenAddMenu = (type: string, row?: any) => {
	menuDialogRef.value.openDialog(type, row);
};
// 打开编辑菜单弹窗
const onOpenEditMenu = (type: string, row?: any) => {
	menuDialogRef.value.openDialog(type, row);
};
// 删除当前行
const onTabelRowDel = (row?: any) => {
	ElMessageBox.confirm(`此操作将永久删除路由：${row.path}, 是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		buttonSize: 'large',
		type: 'warning',
	})
		.then(() => {
			menuDelete({
				id: row.id,
			})
				.then((res) => {
					if (res.resultCode == 0) {
						ElMessage.success('删除成功');
						getTableData();
					} else {
						ElMessage.warning(res.resultDesc);
					}
				})
				.catch((err) => {
					ElMessage.success('删除失败');
				});
		})
		.catch(() => {});
};
// 页面加载时
onMounted(() => {
	getTableData();
});
</script>
<style scoped lang="scss">
.system-menu-container {
	:deep(.search-box .el-card__body) {
		padding-bottom: 0px !important;
	}
}
</style>
