<template>
	<div class="system-role-container layout-padding">
		<div class="title-bar">
			<div class="page-title">角色管理</div>
			<el-button size="large" type="primary" @click="onOpenAddRole('add')">
				<el-icon>
					<ele-Plus />
				</el-icon>
				新建角色
			</el-button>
		</div>

		<el-card shadow="never" class="mt20 mb20 title-search">
			<template #header>
				<el-input v-model="state.roleName" style="width: 240px" size="large" placeholder="请输入角色名称" @keyup.enter="searchList">
					<template #suffix>
						<el-icon class="el-input__icon" style="cursor: pointer" @click="searchList">
							<el-icon>
								<ele-Search />
							</el-icon>
						</el-icon>
					</template>
				</el-input>
			</template>

			<el-table :data="state.tableData" v-loading="state.loading" style="width: 100%">
				<el-table-column prop="name" label="角色名称" show-overflow-tooltip>
					<template #default="scope">
						<el-text type="info">{{ scope.row.name }}</el-text>
					</template>
				</el-table-column>
				<el-table-column prop="sort" label="排序" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="角色状态" show-overflow-tooltip>
					<template #default="scope">
						<el-switch
							size="default"
							inline-prompt
							active-value="0"
							inactive-value="1"
							v-model="scope.row.status"
							:before-change="() => changeStatus(scope.row.id)"
						/>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="210">
					<template #default="scope">
						<el-button size="small" text type="info" @click="onOpenEditRole('edit', scope.row)">编辑</el-button>
						<el-button size="small" text type="info" @click="onRowDel(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" @pagination="getTableData" />
		</el-card>

		<RoleDialog ref="roleDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { defineAsyncComponent, reactive, ref, onActivated } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getRoleList, changeRoleStatus, deleteRole } from '@/api/system/role';

// 引入组件
const RoleDialog = defineAsyncComponent(() => import('@/views/system/role/dialog.vue'));

// 定义变量内容
const roleDialogRef = ref();
const state = reactive<SysRoleState>({
	roleName: '',
	roleKey: '',
	status: '',
	pageSize: 10,
	pageNum: 1,
	total: 0,
	loading: false,
	tableData: [],
});
const statusList = ['正常', '停用'];
// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	getRoleList({
		roleName: state.roleName,
		roleKey: state.roleKey,
		status: state.status,
		pageSize: state.pageSize,
		pageNum: state.pageNum,
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

const searchList = () => {
	state.pageNum = 1;
	getTableData();
};

// 切换用户状态
const changeStatus = (id: string) => {
	state.loading = true;
	return new Promise((resolve, reject) => {
		changeRoleStatus({ id })
			.then((res) => {
				if (res.resultCode === 0) {
					ElMessage.success('操作成功');
					getTableData();
				} else {
					state.loading = false;
					ElMessage.warning(res.resultDesc);
				}
			})
			.catch((err) => {
				state.loading = false;
				console.log(err);
			});
	});
};
// 打开新增角色弹窗
const onOpenAddRole = (type: string) => {
	roleDialogRef.value.openDialog(type);
};
// 打开修改角色弹窗
const onOpenEditRole = (type: string, row: Object) => {
	roleDialogRef.value.openDialog(type, row);
};
// 删除角色
const onRowDel = (id: string) => {
	ElMessageBox.confirm('删除后将无法恢复，是否确认删除？', '确定要删除这个角色吗？', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
		buttonSize: 'default',
	}).then(() => {
		deleteRole({ id }).then((res) => {
			if (res.resultCode === 0) {
				ElMessage.success('删除成功');
				getTableData();
			} else {
				ElMessage.warning(res.resultDesc);
			}
		});
	});
};

onActivated(() => {
	getTableData();
});
</script>

<style scoped lang="scss">
.system-role-container {
	.system-role-padding {
		padding: 15px;
	}
}
</style>
