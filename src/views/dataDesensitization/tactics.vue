<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar">
			<div class="page-title">脱敏策略</div>
			<el-button size="large" type="primary" @click="openTactics('add')">
				<el-icon>
					<ele-Plus />
				</el-icon>
				新建策略
			</el-button>
		</div>

		<el-card shadow="never" class="mt20 mb20 title-search">
			<template #header>
				<el-input
					clearable
					v-model="params.taskName"
					style="width: 240px"
					size="large"
					placeholder="请输入策略名称"
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
					<el-table-column prop="id" label="策略ID" show-overflow-tooltip></el-table-column>

					<el-table-column prop="strategyName" label="策略名称" show-overflow-tooltip>
						<template #default="scope">
							<!-- <el-button size="small" text type="info" @click="taskDetail(scope.row.id)">{{ scope.row.strategyName }}</el-button> -->
							<el-text type="info">{{ scope.row.strategyName }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="desensitizeAlgorithm" label="脱敏算法" show-overflow-tooltip>
						<template #default="scope">
							<span v-if="scope.row.desensitizeAlgorithm === 'mask'">掩码</span>
							<span v-else-if="scope.row.desensitizeAlgorithm === 'trunc'">截断</span>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态" show-overflow-tooltip>
						<template #default="scope">
							{{ scope.row.status == '1' ? '启用' : '停用' }}
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
					<el-table-column label="操作" align="center" width="150">
						<template #default="scope">
							<!-- 除去任务历史其他按钮发起者显示反之不显示 -->
							<el-button size="small" text type="info" @click="handleFiring(scope.row)">
								{{ scope.row.status == '1' ? '停用' : '启用' }}
							</el-button>
							<el-button size="small" text type="info" @click="editTask('edit', scope.row.id)">编辑</el-button>
							<el-button size="small" text type="info" @click="deleteTask(scope.row.id)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<Pagination :total="list.total" v-model:page="list.pageNum" v-model:limit="list.pageSize" @pagination="getTableData" />
			</div>
		</el-card>
		<AddTactics ref="addTacticsRef" @refresh="getTableData" />
	</div>
</template>

<script setup lang="ts" name="privacyIntersect">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { dataTacticsList, dataTacticsStart, dataTacticsDelete, dataTacticsEdit } from '@/api/dataDesensitization';

const AddTactics = defineAsyncComponent(() => import('@/views/dataDesensitization/addTactics.vue'));

const addTacticsRef = ref();
const tacticsDetailRef = ref();

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

const searchList = () => {
	getTableData();
};

// 获取列表
const getTableData = () => {
	list.loading = true;
	dataTacticsList({
		pageNum: list.pageNum,
		pageSize: list.pageSize,
		name: params.taskName,
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

//新增任务
const openTactics = (type: string) => {
	addTacticsRef.value?.openDialog(type);
};

// 编辑任务
const editTask = (type: string, id: string) => {
	addTacticsRef.value?.openDialog(type, id);
};

//启动任务
const handleFiring = (row: any) => {
	ElMessageBox.confirm(`确定要${row.status === '1' ? '停用' : '启用'}该策略吗?`, '提示', {
		confirmButtonText: '确 定',
		cancelButtonText: '取 消',
		type: 'warning',
		buttonSize: 'large',
	}).then(() => {
		var status = '0';
		if (row.status === '1') {
			status = '0';
		} else {
			status = '1';
		}
		dataTacticsEdit({
			id: row.id,
			status: status,
		}).then((res) => {
			if (res.resultCode === 0) {
				ElMessage.success(`${row.status === '1' ? '停用' : '启用'}成功`);
				getTableData();
			} else {
				ElMessage.error(res.resultDesc);
			}
		});
	});
};

// 删除任务
const deleteTask = (id: string) => {
	ElMessageBox.confirm('确定要删除该策略吗? 删除后不可恢复', '提示', {
		confirmButtonText: '确 定',
		cancelButtonText: '取 消',
		type: 'warning',
		buttonSize: 'large',
	}).then(() => {
		dataTacticsDelete({
			id,
		}).then((res) => {
			if (res.resultCode === 0) {
				ElMessage.success('删除成功');
				getTableData();
			} else {
				ElMessage.error(res.resultDesc);
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
</style>
