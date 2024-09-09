<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar">
			<div class="page-title">用户管理</div>
			<el-button size="large" type="primary" @click="onOpenAddUser('add')">
				<el-icon>
					<ele-Plus />
				</el-icon>
				新建用户
			</el-button>
		</div>

		<el-card shadow="never" class="mt20 mb20 title-search">
			<template #header>
				<el-input v-model="state.loginName" style="width: 240px" size="large" placeholder="请输入账号/手机号" @keyup.enter="searchList">
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
				<el-table-column prop="loginName" label="账号" show-overflow-tooltip>
					<template #default="scope">
						<!-- @click="onOpenDetail(scope.row.id)" -->
						<el-text type="info">{{ scope.row.loginName }}</el-text>
					</template>
				</el-table-column>
				<el-table-column prop="roleNames" label="角色" show-overflow-tooltip></el-table-column>
				<el-table-column prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="blockchainId" label="区块链ID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="certificate" label="CA证书" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="用户状态" show-overflow-tooltip>
					<template #default="scope">
						<el-switch
							size="default"
							inline-prompt
							active-value="0"
							inactive-value="1"
							v-model="scope.row.status"
							:before-change="() => changeStatus(scope.row.id, scope.row.status)"
						/>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button size="small" text type="info" @click="onOpenEditUser('edit', scope.row.id)">编辑</el-button>
						<el-button size="small" text type="info" @click="onRowDel(scope.row.id)">删除</el-button>
						<!-- <el-button size="small" text type="info" @click="onOpenDetail(scope.row.id)">详情</el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" @pagination="getTableData" />
		</el-card>
		<UserDialog ref="userDialogRef" @refresh="getTableData()" />
		<UserDetailDialog ref="userDetailDialogRef" />
		<ChangePwdDialog ref="changePwdDialogRef" />
	</div>
</template>

<script setup lang="ts" name="systemUser">
import { defineAsyncComponent, reactive, ref, onActivated } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getUserList, changeUserStatus, deleteUser } from '@/api/system/user';

// 引入组件
const UserDialog = defineAsyncComponent(() => import('@/views/system/user/dialog.vue'));
const UserDetailDialog = defineAsyncComponent(() => import('@/views/system/user/detailDialog.vue'));
const ChangePwdDialog = defineAsyncComponent(() => import('@/components/changePwd/index.vue'));

// 定义变量内容
const userDialogRef = ref();
const changePwdDialogRef = ref();
const userDetailDialogRef = ref();
const state = reactive<SysUserState>({
	loading: false,
	pageNum: 1,
	pageSize: 10,
	total: 0,
	loginName: '',
	tableData: [],
	roleList: [],
});

// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	state.tableData = [];
	getUserList({
		pageSize: state.pageSize,
		pageNum: state.pageNum,
		loginName: state.loginName,
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

// 打开新增用户弹窗
const onOpenAddUser = (type: string) => {
	userDialogRef.value.openDialog(type);
};
// 打开修改用户弹窗
const onOpenEditUser = (type: string, id: string) => {
	userDialogRef.value.openDialog(type, id);
};
// 打开用户详情弹窗
const onOpenDetail = (id: string) => {
	userDetailDialogRef.value.openDialog(id);
};
// 删除用户
const onRowDel = (id: string) => {
	ElMessageBox.confirm('删除后将无法恢复，是否确认删除', '确认要删除这个用户吗？', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		buttonSize: 'large',
		type: 'warning',
	})
		.then(() => {
			deleteUser({
				userId: id,
			})
				.then((res) => {
					if (res.resultCode === 0) {
						getTableData();
						ElMessage.success('删除成功');
					} else {
						ElMessage.warning(res.resultDesc);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch(() => {});
};
const changeStatus = (id: string, status: string) => {
	state.loading = true;
	return new Promise((resolve, reject) => {
		changeUserStatus({
			id,
			status: status === '1' ? '0' : '1',
		})
			.then((res) => {
				if (res.resultCode === 0) {
					ElMessage.success('操作成功');
					getTableData();
				} else {
					ElMessage.success(res.resultDesc);
					state.loading = false;
				}
			})
			.catch((err) => {
				state.loading = false;
				console.log(err);
			});
	});
};

// 打开修改密码弹窗
const onOpenChangePwd = (id: number) => {
	changePwdDialogRef.value.openDialog(id);
};

// 页面加载时
onActivated(() => {
	getTableData();
});
</script>

<style scoped lang="scss"></style>
