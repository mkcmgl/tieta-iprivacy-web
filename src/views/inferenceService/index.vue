<template>
	<div class="inference-service layout-padding">
		<div class="title-bar">
			<div class="page-title">推理服务</div>
		</div>

		<el-card shadow="never" class="mt20 mb20 title-search">
			<template #header>
				<div class="tabs-header">
					<div class="tabs-btn">
						<div
							class="tabs-title"
							v-for="(item, index) in state.menuList"
							:key="index"
							:class="{ active: state.activeMenuIndex === index }"
							@click="changeMenu(index)"
						>
							{{ item }}
						</div>
					</div>
					<div>
						<el-input @keyup.enter="searchList" placeholder="请输入模型名称" v-model="state.modelName" size="large">
							<template #suffix>
								<el-icon class="el-input__icon" style="cursor: pointer" @click="searchList">
									<el-icon>
										<ele-Search />
									</el-icon>
								</el-icon> </template
						></el-input>
					</div>
				</div>
			</template>

			<el-table :data="state.tableData" v-loading="state.loading" style="width: 100%" v-if="state.activeMenuIndex === 0">
				<el-table-column prop="id" label="模型ID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="模型名称" show-overflow-tooltip>
					<template #default="scope">
						<el-text type="info">{{ scope.row.name }}</el-text>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="所属项目" show-overflow-tooltip>
					<template #default="scope">
						<el-text type="info">{{ scope.row.projectName }}</el-text>
					</template>
				</el-table-column>
				<el-table-column prop="fedType" label="模型类型" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="提交时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="scope">
						<el-button size="small" text type="info" @click="onOpenInference(scope.row.id)">推理服务</el-button>
						<el-button size="small" text type="info" @click="onRowDel(scope.row.id)">删除</el-button>
						<el-button size="small" text type="info" @click="onOpenService(scope.row.id)">服务记录</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-table :data="state.serviceTableData" v-loading="state.loading" style="width: 100%" v-if="state.activeMenuIndex === 1">
				<el-table-column prop="id" label="服务实例ID" show-overflow-tooltip>
					<template #default="scope">
						<el-button type="text" @click="onOpenDetail(scope.row.id)">{{ scope.row.id }}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="modelName" label="模型来源" show-overflow-tooltip></el-table-column>
				<el-table-column prop="startTime" label="开始时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="endTime" label="结束时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="推理服务状态" show-overflow-tooltip>
					<template #default="scope">
						<span
							class="mr2"
							:class="{
								'round-blue': scope.row.status == 'running',
								'round-green': scope.row.status == 'success',
								'round-red': scope.row.status == 'canceled' || scope.row.status == 'failed',
							}"
						></span>
						<span>{{ statusMap[scope.row.status] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="scope">
						<el-button size="small" text type="info" @click="onStopInference(scope.row.id)" v-if="scope.row.status == 'running'">停止</el-button>
						<el-button
							size="small"
							text
							type="info"
							@click="onDownloadInference(scope.row)"
							v-if="scope.row.status == 'success'"
							:loading="scope.row.loading"
							>结果下载</el-button
						>
					</template>
				</el-table-column>
			</el-table>

			<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" @pagination="getTableData" />
		</el-card>

		<InferenceServiceDialog ref="inferenceServiceDialogRef" @refresh="getTableData()" />
	</div>
</template>
<script setup lang="ts" name="inferenceService">
import { reactive, onMounted, defineAsyncComponent, ref } from 'vue';
import { getModelPage, modelDel, getOfflineServicePage, serviceStop, offlineServiceDownload } from '@/api/inferenceService';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';

// 引入组件
const InferenceServiceDialog = defineAsyncComponent(() => import('@/views/inferenceService/dialog.vue'));

const inferenceServiceDialogRef = ref();

const state = reactive({
	modelName: '',
	modelId: '' as any,
	activeMenuIndex: 0,
	menuList: ['推理列表', '服务记录'],
	loading: false,
	pageNum: 1,
	pageSize: 10,
	total: 0,
	tableData: [],
	serviceTableData: [],
	timer: '' as any,
});

const statusMap = {
	running: '推理中',
	canceled: '推理失败',
	failed: '推理失败',
	success: '推理成功',
} as any;

const router = useRouter();

const changeMenu = (index: number, modelId?: string) => {
	state.activeMenuIndex = index;
	state.pageNum = 1;
	state.pageSize = 10;
	state.total = 0;
	state.modelName = '';
	state.modelId = modelId;
	getTableData();
};

const searchList = () => {
	state.pageNum = 1;
	getTableData();
};
// 初始化表格数据
const getTableData = () => {
	clearTimeout(state.timer);
	if (state.activeMenuIndex === 0) {
		state.loading = true;
		getModelPage({
			pageSize: state.pageSize,
			pageNum: state.pageNum,
			name: state.modelName,
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
	} else {
		fetchService();
	}
};

const fetchService = () => {
	if (state.activeMenuIndex === 0) return;
	clearTimeout(state.timer);
	state.loading = true;
	getOfflineServicePage({
		pageSize: state.pageSize,
		pageNum: state.pageNum,
		modelName: state.modelName,
		modelId: state.modelId,
	})
		.then((res) => {
			state.serviceTableData = [];
			state.loading = false;
			if (res.resultCode === 0) {
				state.serviceTableData = res.data.data;
				state.serviceTableData.forEach((item: any) => {
					if (!item.loading) item.loading = false;
				});
				state.total = res.data.total;
				state.timer = setTimeout(() => {
					fetchService(modelId);
				}, 30000);
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			state.loading = false;
			console.error(err);
		});
};

const onOpenInference = (id: string) => {
	inferenceServiceDialogRef.value.openDialog(id);
};

const onRowDel = (modelId: string) => {
	ElMessageBox.confirm('删除后将无法恢复，是否确认删除', '确认要删除这个模型吗？', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		buttonSize: 'large',
		type: 'warning',
	})
		.then(() => {
			modelDel({ modelId })
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

const onOpenService = (modelId: string) => {
	changeMenu(1, modelId);
};

const onStopInference = (serviceId: string) => {
	ElMessageBox.confirm('确认要停止这个服务吗？', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		buttonSize: 'large',
		type: 'warning',
	})
		.then(() => {
			serviceStop({ serviceId })
				.then((res) => {
					if (res.resultCode === 0) {
						getTableData();
						ElMessage.success('服务已停止');
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

const onDownloadInference = async (row: any) => {
	row.loading = true;

	offlineServiceDownload({ serviceId: row.id })
		.then((res: any) => {
			row.loading = false;
			const blob = new Blob([res]);
			const downloadElement = document.createElement('a');
			const href = window.URL.createObjectURL(blob);
			downloadElement.href = href;
			downloadElement.download = row.id + '.tar.gz';
			document.body.appendChild(downloadElement);
			downloadElement.click();
			document.body.removeChild(downloadElement);
			window.URL.revokeObjectURL(href);
			ElMessage.success('下载成功');
		})
		.catch((err) => {
			row.loading = false;
			console.error(err);
		});
};

const onOpenDetail = (id: string) => {
	router.push({
		path: '/inferenceService/detail',
		query: { id },
	});
};

onMounted(() => {
	getTableData();
});
</script>
<style scope lang="scss">
.inference-service {
	.tabs-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 40px;

		.tabs-btn {
			display: flex;
			gap: 20px;
			width: 150px;
			cursor: pointer;
			.tabs-title {
				font-size: 14px;
				font-weight: 600;
				&:hover {
					color: #eb4b4b;
				}
			}
		}

		.active {
			color: #eb4b4b;
		}
	}
}
</style>
