<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar">
			<div class="page-title">脱敏任务</div>
			<el-button size="large" type="primary" @click="openTask('add')">
				<el-icon>
					<ele-Plus />
				</el-icon>
				新建任务
			</el-button>
		</div>

		<el-card shadow="never" class="mt20 mb20 title-search">
			<template #header>
				<el-input
					clearable
					v-model="params.taskName"
					style="width: 240px"
					size="large"
					placeholder="请输入任务名称"
					@keyup.enter="searchList"
					@clear="getTableData"
				>
					<template #suffix>
						<el-icon class="el-input__icon" style="cursor: pointer" @click="searchList">
							<el-icon>
								<ele-Search />
							</el-icon>
						</el-icon>
					</template>
				</el-input>
			</template>

			<div>
				<el-table :data="list.tableData" v-loading="list.loading" style="width: 100%">
					<el-table-column prop="id" label="任务ID" show-overflow-tooltip></el-table-column>

					<el-table-column prop="taskName" label="任务名称" show-overflow-tooltip>
						<template #default="scope">
							<el-button size="small" text type="info" @click="taskDetail(scope.row.id)">{{ scope.row.taskName }}</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="dataName" label="数据名称" show-overflow-tooltip>
						<template #default="scope">
							<el-button size="small" text type="info" @click="dataDetail(scope.row.dataId)">{{ scope.row.dataName }}</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="typeId" label="数据类型" show-overflow-tooltip>
						<template #default="scope">
							<span v-if="scope.row.typeId === '1'">scv</span>
							<span v-else-if="scope.row.typeId === '2'">mysql导入</span>
						</template>
					</el-table-column>
					<el-table-column prop="strategyNames" label="脱敏策略" show-overflow-tooltip>
						<template #default="scope">
							{{ scope.row.strategyNames.join('，') }}
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态" show-overflow-tooltip>
						<template #default="scope">
							<span
								class="mr2"
								:class="{
									'round-blue': scope.row.status == '0',
									'round-green': scope.row.status == '1',
									'round-red': scope.row.status == '2',
								}"
							></span>
							<span>{{ status[scope.row.status] }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
					<el-table-column label="操作" align="center" width="160">
						<template #default="scope">
							<!-- 除去任务历史其他按钮发起者显示反之不显示 -->
							<el-button size="small" text type="info" @click="handleFiring(scope.row.id)">启动</el-button>
							<el-button v-if="scope.row.status === '1'" size="small" text type="info" @click="download(scope.row)"> 下载 </el-button>

							<el-button size="small" text type="info" @click="editTask('edit', scope.row.id)">编辑</el-button>
							<el-button size="small" text type="info" @click="deleteTask(scope.row.id)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<Pagination :total="list.total" v-model:page="list.pageNum" v-model:limit="list.pageSize" @pagination="getTableData" />
			</div>
		</el-card>
		<AddTask ref="addTaskRef" @refresh="getTableData" />
		<TaskDetail ref="taskDetailRef" />
	</div>
</template>

<script setup lang="ts" name="privacyIntersect">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { dataTaskList, dataTaskDelete, dataTaskStart, dataTacticsDownload } from '@/api/dataDesensitization';

const router = useRouter();

const AddTask = defineAsyncComponent(() => import('@/views/dataDesensitization/addTask.vue'));
const TaskDetail = defineAsyncComponent(() => import('@/views/dataDesensitization/taskDetail.vue'));

const addTaskRef = ref();
const taskDetailRef = ref();
const params = reactive({
	taskName: '',
});
// 列表数据
const list = reactive({
	loading: false,
	pageNum: 1,
	pageSize: 10,
	total: 0,
	tableData: [],
});

const status = ref(['未执行', '成功', '失败']);

const searchList = () => {
	getTableData();
};

// 获取列表
const getTableData = () => {
	list.loading = true;
	dataTaskList({
		pageNum: list.pageNum,
		pageSize: list.pageSize,
		taskName: params.taskName,
	})
		.then((res) => {
			list.loading = false;
			if (res.resultCode === 0) {
				list.tableData = res.data.data;
				list.total = res.data.total;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch(() => {
			list.loading = false;
		});
};

const taskDetail = (id: string) => {
	taskDetailRef.value?.openDialog(id);
};

const dataDetail = (id: string) => {
	router.push({
		path: '/dataManage/detail',
		query: {
			id: id,
		},
	});
};

const download = (row: any) => {
	list.loading = true;
	dataTacticsDownload({ id: row.id })
		.then((res: any) => {
			list.loading = false;
			const blob = new Blob([res]);
			const downloadElement = document.createElement('a');
			const href = window.URL.createObjectURL(blob);
			downloadElement.href = href;
			downloadElement.download = row.taskName + '.csv';
			document.body.appendChild(downloadElement);
			downloadElement.click();
			document.body.removeChild(downloadElement);
			window.URL.revokeObjectURL(href);
		})
		.catch(() => {
			list.loading = false;
		});
};

//新增任务
const openTask = (type: string) => {
	addTaskRef.value?.openDialog(type);
};

// 编辑任务
const editTask = (type: string, id: string) => {
	addTaskRef.value?.openDialog(type, id);
};

//启动任务
const handleFiring = (row: string) => {
	ElMessageBox.confirm('确定要启动该任务吗?', '提示', {
		confirmButtonText: '确 定',
		cancelButtonText: '取 消',
		type: 'warning',
		buttonSize: 'large',
	}).then(() => {
		dataTaskStart({
			id: row,
		})
			.then((res) => {
				if (res.resultCode === 0) {
					ElMessage.success('启动成功');
					getTableData();
				} else {
					ElMessage.error(res.resultDesc);
				}
			})
			.catch(() => {});
	});
};

// 删除任务
const deleteTask = (id: string) => {
	ElMessageBox.confirm('确定要删除该任务吗? 删除后不可恢复', '提示', {
		confirmButtonText: '确 定',
		cancelButtonText: '取 消',
		type: 'warning',
		buttonSize: 'large',
	}).then(() => {
		dataTaskDelete({
			id: id,
		})
			.then((res) => {
				if (res.resultCode === 0) {
					ElMessage.success('删除成功');
					getTableData();
				} else {
					ElMessage.error(res.resultDesc);
				}
			})
			.catch(() => {});
	});
};

// 页面加载时
onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss">
</style>
