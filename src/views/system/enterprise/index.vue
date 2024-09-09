<template>
	<div class="system-enterprise-container layout-padding">
		<div class="title-bar">
			<div class="page-title">企业管理</div>
		</div>

		<el-card shadow="never" class="mt20 mb20 title-search">
			<template #header>
				<el-input v-model="state.organizeName" style="width: 240px" size="large" placeholder="请输入企业/机构名称" @keyup.enter="searchList">
					<template #suffix>
						<el-icon class="el-input__icon" style="cursor: pointer" @click="searchList">
							<el-icon>
								<ele-Search />
							</el-icon>
						</el-icon>
					</template>
				</el-input>
			</template>

			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column prop="organizeName" label="企业/机构名称" show-overflow-tooltip>
					<template #default="scope">
						<el-button text @click="onRowView(scope.row.organizeId)" type="info">{{ scope.row.organizeName }} </el-button>
					</template>
				</el-table-column>
				<el-table-column prop="organizeType" label="认证类型" show-overflow-tooltip>
					<template #default="scope">
						<div>{{ organizeTypeList[scope.row.organizeType] }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="提交时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="auditState" label="审核状态" show-overflow-tooltip>
					<template #default="scope">
						<span
							class="mr2"
							:class="{
								'round-blue': scope.row.auditState == 0,
								'round-green': scope.row.auditState == 1,
								'round-red': scope.row.auditState == 2,
							}"
						></span>
						<span>{{ auditStateList[scope.row.auditState] }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="auditTime" label="审核时间" show-overflow-tooltip></el-table-column>
			</el-table>
			<Pagination :total="state.tableData.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" @pagination="getTableData" />
		</el-card>
	</div>
</template>

<script setup lang="ts" name="systemEnterprise">
import { defineAsyncComponent, reactive, onMounted, ref, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getOrganizeList } from '@/api/system/enterprise';

const router = useRouter();
// 定义变量内容
const state = reactive({
	isOnceMore: false,
	pageNum: 1,
	pageSize: 10,
	organizeName: null,
	auditState: null,
	state: '',
	tableData: {
		data: [],
		total: 0,
		loading: false,
	},
});
const organizeTypeList = ['铁塔用户认证', '企业实名认证'];

const auditStateList = ['待审核', '审核通过', '驳回'];

// 初始化表格数据
const getTableData = () => {
	state.tableData.loading = true;
	state.tableData.data = [];
	getOrganizeList({
		pageSize: state.pageSize,
		pageNum: state.pageNum,
		organizeName: state.organizeName,
	})
		.then((res) => {
			if (res.resultCode == 0) {
				state.tableData.total = res.data.total;
				state.tableData.data = res.data.data;
				state.tableData.loading = false;
			} else {
				ElMessage.error(res.resultDesc);
				state.tableData.loading = false;
			}
			state.isOnceMore = true;
		})
		.catch((err) => {
			state.tableData.loading = false;
			console.log(err);
		});
};

const searchList = () => {
	state.pageNum = 1;
	getTableData();
};

const onRowView = (organizeId: string) => {
	router.push({
		path: '/system/enterprise/detail',
		query: {
			organizeId: organizeId,
		},
	});
};

// 页面加载时
onMounted(() => {
	getTableData();
});
onActivated(() => {
	if (state.isOnceMore) {
		getTableData();
	}
});
</script>

<style scoped lang="scss">
:deep(.search-box .el-card__body) {
	padding: 30px 30px 0px 30px;
}
</style>
