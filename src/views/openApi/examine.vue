<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar">
			<div class="page-title">openApi认证审核</div>
		</div>

		<el-card shadow="never" class="mt20 mb20 title-search">
			<template #header>
				<el-input
					clearable
					v-model="params.name"
					style="width: 240px"
					size="large"
					placeholder="请输入组织名称"
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
					<el-table-column prop="id" label="申请ID" show-overflow-tooltip>
						<template #default="scope">
							<el-text size="small" type="info">{{ scope.row.id }}</el-text>
						</template>
					</el-table-column>

					<!-- <el-table-column prop="nonEnterpriseName" label="组织名称" show-overflow-tooltip> </el-table-column>
					<el-table-column prop="nonEnterpriseCode" label="组织编码" show-overflow-tooltip> </el-table-column> -->
					<el-table-column prop="customName" label="自定义名称" show-overflow-tooltip></el-table-column>
					<el-table-column prop="createTime" label="申请时间" show-overflow-tooltip> </el-table-column>
					<el-table-column prop="auditTime" label="审核时间" show-overflow-tooltip></el-table-column>
					<el-table-column prop="auditState" label="审核状态" show-overflow-tooltip>
						<template #default="scope">
							<span
								class="mr2"
								:class="{
									'round-blue': scope.row.auditState == '0',
									'round-green': scope.row.auditState == '1',
									'round-red': scope.row.auditState == '2',
								}"
							></span>
							<span>{{ auditStateList[scope.row.auditState] }}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="100">
						<template #default="scope">
							<el-button
								:disabled="scope.row.auditState === '1' || scope.row.auditState === '2'"
								size="small"
								text
								type="info"
								@click="openDialog(scope.row)"
								>审核</el-button
							>
						</template>
					</el-table-column>
				</el-table>
				<Pagination :total="list.total" v-model:page="list.pageNum" v-model:limit="list.pageSize" @pagination="getTableData" />
			</div>
		</el-card>
		<AddExamine ref="addExamineRef" @refresh="getTableData" />
	</div>
</template>

<script setup lang="ts" name="privacyIntersect">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { getExamineList } from '@/api/openApi';
const router = useRouter();

const AddExamine = defineAsyncComponent(() => import('@/views/openApi/addExamine.vue'));

const addExamineRef = ref();

const params = reactive({
	name: '',
});
// 列表数据
const list = reactive({
	loading: false,
	pageNum: 1,
	pageSize: 10,
	total: 0,
	tableData: [],
});

const auditStateList = ['待审核', '审核通过', '审核驳回'];

const searchList = () => {
	getTableData();
};

// 获取列表
const getTableData = () => {
	list.loading = true;
	getExamineList({
		nonEnterpriseName: params.name,
		pageNum: list.pageNum,
		pageSize: list.pageSize,
		roles: '1',
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

//新增
const openDialog = (row: any) => {
	addExamineRef.value?.openDialog(row);
};

// 页面加载时
onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss">
</style>
