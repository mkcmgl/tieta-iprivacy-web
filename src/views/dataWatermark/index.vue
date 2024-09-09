<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar">
			<div class="page-title">数据水印</div>
			<el-button size="large" type="primary" @click="openTask('add')">
				<el-icon>
					<ele-Plus />
				</el-icon>
				新建水印
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

					<el-table-column prop="name" label="任务名称" show-overflow-tooltip>
						<template #default="scope">
							<el-button size="small" text type="info" @click="jumpDetail(scope.row)">{{ scope.row.name }}</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="dataName" label="数据名称" show-overflow-tooltip>
						<template #default="scope">
							<el-button size="small" text type="info" @click="dataDetail(scope.row)">{{ scope.row.dataName }}</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="projectName" label="数据类型" show-overflow-tooltip></el-table-column>
					<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
					<el-table-column label="操作" align="center" width="100">
						<template #default="scope">
							<el-button size="small" text type="info" @click="extract(scope.row)">提取水印</el-button>
						</template>
					</el-table-column>
				</el-table>
				<Pagination :total="list.total" v-model:page="list.pageNum" v-model:limit="list.pageSize" @pagination="getTableData" />
			</div>
		</el-card>
		<AddWatemark ref="addWatemarkRef" />
		<Detail ref="detailRef" />

		<!-- 提取水印 -->
		<el-dialog :close-on-click-modal="false" title="提取水印" v-model="showDialog" width="500px">
			<div class="search-box clearfix" v-loading="dialogLoading">
				<div class="fl mb30">
					<div class="search-name">水印信息：</div>
					<el-input placeholder="请输入任务名称" v-model="params.taskName" size="large"></el-input>
				</div>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="large" type="info" plain>取 消</el-button>
					<el-button @click="onSubmit" size="large" type="primary">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="privacyIntersect">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { getDataWatemarkList, extractDataWatemark } from '@/api/dataWatermark';

const router = useRouter();

const AddWatemark = defineAsyncComponent(() => import('@/views/dataWatermark/addWatemark.vue'));
const Detail = defineAsyncComponent(() => import('@/views/dataWatermark/detail.vue'));

const addWatemarkRef = ref();
const detailRef = ref();

const showDialog = ref(false);
const dialogLoading = ref(false);

const params = reactive({
	taskName: '',
});
// 列表数据
const list = reactive({
	loading: false,
	pageNum: 1,
	pageSize: 10,
	total: 0,
	tableData: [
		{
			createdBy: 'Test152',
			createTime: '2024-08-06 16:22:00',
			updateTime: '2024-08-06 16:22:00',
			id: '892c97b3cd8a408887346b722020695e',
			role: 'guest',
			name: 'psi-0806-152-2',
			dataName: 'psi-测试数据',
			projectId: 'f7f969879ccf4bc893e3479004c89ecf',
			projectName: 'csv',
			organizeName: 'Test152',
			algorithmType: '2',
			status: '0',
		},
	],
});

const onCancel = (row: any) => {
	showDialog.value = false;
};

const onSubmit = (row: any) => {
	showDialog.value = false;
};

//提取水印
const extract = (row: any) => {
	showDialog.value = true;
	dialogLoading.value = true;
	extractDataWatemark({})
		.then((res) => {
			dialogLoading.value = false;
			if (res.resultCode === 0) {
				console.log('提取水印', res);
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch(() => {
			dialogLoading.value = false;
		});
};

const dataDetail = (id: string) => {
	router.push({
		path: '/dataManage/detail',
		query: {
			id: id,
		},
	});
};

const jumpDetail = (row: any) => {
	detailRef.value?.openDialog(row);
};

const searchList = () => {
	getTableData();
};

// 获取列表
const getTableData = () => {
	list.loading = true;
	getDataWatemarkList({})
		.then((res) => {
			list.loading = false;
			if (res.resultCode === 0) {
				console.log('列表', res);
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch(() => {
			list.loading = false;
		});
};

//新增任务
const openTask = (type: string) => {
	addWatemarkRef.value?.openDialog();
};

// 页面加载时
onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss">
</style>
