<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar">
			<div class="page-title">匿踪查询</div>
			<el-button size="large" type="primary" @click="addTask('add')">
				<el-icon>
					<ele-Plus />
				</el-icon>
				新建任务
			</el-button>
		</div>

		<el-card shadow="never" class="mt20 mb20 title-search">
			<template #header>
				<div class="tabs-header">
					<div class="tabs-btn">
						<div class="tabs-list" :class="{ active: params.tabsName == '任务列表' }" @click="changeTabs('任务列表')">任务列表</div>
						<div class="tabs-history" :class="{ active: params.tabsName == '任务历史' }" @click="changeTabs('任务历史')">任务历史</div>
					</div>
					<div>
						<el-input
							@keyup.enter="searchList"
							@clear="getTableData"
							placeholder="请输入任务名称"
							maxlength="64"
							v-model="params.taskName"
							size="large"
							clearable
							><template #suffix>
								<el-icon class="el-input__icon" style="cursor: pointer" @click="searchList">
									<el-icon>
										<ele-Search />
									</el-icon>
								</el-icon> </template
						></el-input>
					</div>
				</div>
			</template>
			<div v-if="params.tabsName == '任务列表'">
				<el-table :data="list.tableData" v-loading="list.loading" style="width: 100%">
					<el-table-column type="index" width="70" label="序号" />
					<el-table-column prop="name" label="任务名称" show-overflow-tooltip>
						<template #default="scope">
							<el-button size="small" text type="info" @click="taskDetail(scope.row.id)">{{ scope.row.name }}</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="project" label="所属项目" show-overflow-tooltip></el-table-column>
					<el-table-column prop="server" label="服务端" show-overflow-tooltip></el-table-column>
					<el-table-column prop="user" label="创建者" show-overflow-tooltip></el-table-column>
					<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
					<el-table-column label="操作" align="center" width="180">
						<template #default="scope">
							<!-- 除去任务历史其他按钮发起者显示反之不显示 -->
							<el-button size="small" text type="info" @click="editTask('edit')">编辑</el-button>
							<el-button size="small" text type="info" @click="handleFiring(scope.row.id)">启动</el-button>
							<el-button size="small" text type="info" @click="taskHistory(scope.row.id)">任务历史</el-button>
							<el-button size="small" text type="info" @click="deleteTask(scope.row.id)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<Pagination :total="list.total" v-model:page="list.pageNum" v-model:limit="list.pageSize" @pagination="getTableData" />
			</div>
			<div v-else>
				<el-table :data="history.tableData" v-loading="history.loading" style="width: 100%">
					<el-table-column type="index" width="70" label="序号" />
					<el-table-column prop="name" label="任务实例名称" show-overflow-tooltip>
						<template #default="scope">
							<el-button size="small" text type="info" @click="historyDetail(scope.row.id)">{{ scope.row.name }}</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="project" label="所属任务" show-overflow-tooltip></el-table-column>
					<el-table-column prop="createTime" label="开始时间" show-overflow-tooltip></el-table-column>
					<el-table-column prop="endTime" label="结束时间" show-overflow-tooltip></el-table-column>
					<el-table-column prop="status" label="状态" show-overflow-tooltip>
						<template #default="scope">
							<div class="align-center">
								<div
									v-if="scope.row.status !== '执行中'"
									class="mr4"
									:class="{
										'round-green': scope.row.status == '执行成功',
										'round-red': scope.row.status == '执行失败',
									}"
								/>
								<el-icon class="mr3 is-loading" :size="14" v-else>
									<ele-Loading />
								</el-icon>
								<div>
									<span v-if="scope.row.status === '执行成功'">执行成功</span>
									<span v-else-if="scope.row.status === '执行失败'">执行失败</span>
									<span v-else>执行中</span>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="100">
						<template #default="scope">
							<el-button :disabled="scope.row.status !== '执行中'" size="small" text type="info" @click="cease(scope.row.id)">停止</el-button>
						</template>
					</el-table-column>
				</el-table>
				<Pagination :total="history.total" v-model:page="history.pageNum" v-model:limit="history.pageSize" @pagination="getTableData" />
			</div>
		</el-card>
		<!-- 启动任务弹窗 -->
		<firingHidden ref="firingHiddenExample" @firingSuccess="getTableData" />
	</div>
</template>

<script setup lang="ts" name="hiddenSearch">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { getHiddenList, getHiddenHistoryList, deleteHiddenTask, stopHiddenTask } from '@/api/hiddenSearch';

const router = useRouter();

const firingHidden = defineAsyncComponent(() => import('@/views/hiddenSearch/firingHidden.vue'));

const firingHiddenExample = ref();

const params = reactive({
	tabsName: '任务列表',
	taskName: '',
});
//任务列表数据
const history = reactive({
	loading: false,
	pageNum: 1,
	pageSize: 10,
	total: 10,
	id: '',
	tableData: [
		{
			name: '111',
		},
	],
});
// 列表数据
const list = reactive({
	loading: false,
	pageNum: 1,
	pageSize: 10,
	total: 10,
	tableData: [
		{
			name: '111',
		},
	],
});
const searchList = () => {
	if (params.tabsName === '任务列表') {
		list.pageNum = 1;
	} else {
		history.pageNum = 1;
	}
	getTableData();
};

// 切换tabs
const changeTabs = (tab: string) => {
	params.taskName = '';
	if (tab === '任务列表') {
		params.tabsName = '任务列表';
		list.pageNum = 1;
	} else {
		params.tabsName = '任务历史';
		history.pageNum = 1;
	}
	getTableData();
};

// 停止任务
const cease = (id: string) => {
	ElMessageBox.confirm('当前任务正在执行中，是否停止？', '提示', {
		confirmButtonText: '确 定',
		cancelButtonText: '取 消',
		type: 'warning',
		buttonSize: 'large',
	}).then(() => {
		stopHiddenTask({}).then((res) => {
			if (res.resultCode === 0) {
				ElMessage({
					type: 'success',
					message: '停止任务成功!',
				});
				getTableData();
			} else {
				ElMessage.warning(res.resultDesc);
			}
		});
	});
};

// 获取列表
const getTableData = () => {
	if (params.tabsName === '任务列表') {
		list.loading = true;
		getHiddenList({})
			.then((res) => {
				list.loading = false;
				if (res.resultCode === 0) {
					console.log('res', res);
				} else {
					ElMessage.warning(res.resultDesc);
				}
			})
			.catch(() => {
				list.loading = false;
			});
	} else {
		console.log('任务历史2');
		history.loading = true;
		getHiddenHistoryList({})
			.then((res) => {
				history.loading = false;
				if (res.resultCode === 0) {
					console.log('res', res);
				} else {
					ElMessage.warning(res.resultDesc);
				}
			})
			.catch(() => {
				history.loading = false;
			});
	}
};
//新增任务
const addTask = (type: string) => {
	router.push({
		path: '/hiddenSearch/addHiddenTask',
		query: {
			type: type,
		},
	});
};

// 编辑任务
const editTask = (row: string) => {
	router.push({
		path: '/hiddenSearch/addHiddenTask',
		query: {
			type: 'edit',
			// id: row,
		},
	});
};

//任务详情
const taskDetail = (id: string) => {
	router.push({
		path: '/hiddenSearch/hiddenTaskDetail',
		query: {
			id: id,
		},
	});
};

// 历史任务详情
const historyDetail = (id: string) => {
	router.push({
		path: '/hiddenSearch/hiddenHistoryDetail',
		query: {
			id: id,
		},
	});
};

//任务历史
const taskHistory = (row: string) => {
	history.id = row;
	params.tabsName = '任务历史';
	getTableData();
};

//启动任务
const handleFiring = (row: string) => {
	console.log('firingHiddenExample.value', firingHiddenExample.value);
	firingHiddenExample.value?.openDialog(row);
};

// 删除任务
const deleteTask = (row: string) => {
	ElMessageBox.confirm('确定要删除该任务吗? 删除后不可恢复', '提示', {
		confirmButtonText: '确 定',
		cancelButtonText: '取 消',
		type: 'warning',
		buttonSize: 'large',
	}).then(() => {
		deleteHiddenTask({}).then((res) => {
			if (res.resultCode === 0) {
				ElMessage({
					type: 'success',
					message: '删除任务成功!',
				});
				getTableData();
			} else {
				ElMessage.warning(res.resultDesc);
			}
		});
	});
};

// 页面加载时
onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss">
.align-center {
	display: flex;
	align-items: center;
}
.round-red {
	width: 10px;
	height: 10px;
	background-color: #ed4014;
	border-radius: 50%;
}
.round-green {
	width: 10px;
	height: 10px;
	background-color: #00b42a;
	border-radius: 50%;
}
.tabs-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	// margin-bottom: 1px;
	.tabs-btn {
		display: flex;
		gap: 20px;
		width: 150px;
		cursor: pointer;
		.tabs-history,
		.tabs-list {
			font-size: 14px;
			font-weight: 600;
			&:hover {
				color: #c53f3f;
			}
		}
	}
	.active {
		color: #eb4b4b;
	}
}
</style>
