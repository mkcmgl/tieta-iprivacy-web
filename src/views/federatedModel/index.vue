<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar">
			<div class="page-title">联邦建模</div>
			<el-button size="large" type="primary" @click="onOpenAddTask('add')" style="margin-right: 30px">
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
							v-model="state.name"
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
				<el-table :data="state.tableData" v-loading="state.loading" style="width: 100%">
					<el-table-column type="index" label="序号" width="60"></el-table-column>
					<el-table-column prop="name" label="任务名称" show-overflow-tooltip width="200">
						<template #default="scope1">
							<el-button type="text" @click="onOpenDetail(scope1.row.id)">{{ scope1.row.name }}</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="projectName" label="所属项目" show-overflow-tooltip></el-table-column>
					<el-table-column prop="createdBy" label="发起机构" show-overflow-tooltip></el-table-column>
					<el-table-column prop="fedType" label="算法类型" show-overflow-tooltip></el-table-column>
					<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
					<el-table-column label="操作" align="center" width="180">
						<template #default="scope">
							<el-button size="small" text type="info" @click="onOpenEditFlTask('edit', scope.row.id)">编辑</el-button>
							<el-button size="small" text type="info" @click="onOpenStart(scope.row.id)">启动</el-button>
							<el-button size="small" text type="info" @click="onOpenHistory(scope.row.id)">任务历史</el-button>
							<el-button size="small" text type="info" @click="onRowDel(scope.row.id)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" @pagination="getFlRecordData" />
			</div>
			<div v-else>
				<el-table :data="state.recordData" v-loading="state.loading" style="width: 100%">
					<el-table-column type="index" label="序号" width="60"></el-table-column>
					<el-table-column prop="name" label="任务实例名称" show-overflow-tooltip width="120">
						<template #default="scope2">
							<el-button type="text" @click="onOpenPanel(scope2.row.modelId, scope2.row.nodeId)">{{ scope2.row.name }}</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="taskName" label="所属任务" show-overflow-tooltip>
						<template #default="scope3">
							<el-button type="text" @click="onOpenDetail(scope3.row.taskId)">{{ scope3.row.taskName }}</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="fedType" label="算法类型" show-overflow-tooltip></el-table-column>
					<el-table-column prop="status" label="任务状态" show-overflow-tooltip>
						<template #default="scope">
							<el-text size="default" :class="scope.row.status">{{
								scope.row.status == 'success'
									? '执行成功'
									: scope.row.status == 'failed'
									? '执行失败'
									: scope.row.status == 'running'
									? '执行中'
									: '执行中止'
							}}</el-text>
						</template>
					</el-table-column>

					<el-table-column prop="startTime" label="开始时间" show-overflow-tooltip></el-table-column>
					<el-table-column prop="endTime" label="结束时间" show-overflow-tooltip></el-table-column>
					<el-table-column label="操作" align="center" width="210">
						<template #default="scope">
							<el-button size="small" text type="info" @click="onStopFlTask(scope.row.id)" :disabled="scope.row.status != 'running'">停止</el-button>
							<el-button size="small" text type="info" @click="onOpenPanel(scope.row.modelId, scope.row.nodeId)">面板</el-button>
							<el-button size="small" text type="info" @click="onSubmitModel(scope.row.id)" :disabled="scope.row.status != 'success'"
								>模型提交</el-button
							>
							<el-button
								size="small"
								text
								type="info"
								@click="onDownloadRecord(scope.row.id, scope.row.name)"
								:disabled="scope.row.status != 'success'"
								>模型下载</el-button
							>
						</template>
					</el-table-column>
				</el-table>
				<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" @pagination="getFlRecordData" />
			</div>
		</el-card>

		<TaskDialog ref="taskDialogRef" @refresh="getTableData()" />
		<ModelDialog ref="modelDialogRef" />
		<StartDialog ref="taskStartDialogRef" @goTaskHistory="handleTaskHistory" />
	</div>
</template>

<script setup lang="ts" name="federatenModel">
import { defineAsyncComponent, reactive, onMounted, ref, watch, onUnmounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getFlTaskList, getFlRecordList, deleteFlTask, stopFlTask, flRecordDownload } from '@/api/flTask';
// import { FlTaskState } from '@/types/views';
import { fateBoardJobQuery } from '@/api/fateboard';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
import JSZip from 'jszip';
import { AxiosResponse } from 'axios';
import { param } from 'jquery';
import { interval } from 'd3';

// 引入组件
const TaskDialog = defineAsyncComponent(() => import('@/views/federatedModel/dialog.vue'));
const ModelDialog = defineAsyncComponent(() => import('@/views/federatedModel/modelDialog.vue'));
const StartDialog = defineAsyncComponent(() => import('@/views/federatedModel/runDialog.vue'));
const router = useRouter();

// 定义变量内容
const params = reactive({
	tabsName: '任务列表',
	taskName: '',
});
const taskDialogRef = ref();
const modelDialogRef = ref();
const taskStartDialogRef = ref();
const intervalId = ref();
const state = reactive({
	loading: false,
	taskId: '',
	pageNum: 1,
	pageSize: 10,
	total: 0,
	name: '',
	tableData: [],
	recordData: [],
});

// 切换tabs
const changeTabs = (tab: string) => {
	params.taskName = '';
	state.name = '';
	if (tab === '任务列表') {
		params.tabsName = '任务列表';
		state.pageNum = 1;
		state.taskId = '';
		getTableData();
		if (intervalId.value) {
			clearInterval(intervalId.value);
		}
	} else {
		params.tabsName = '任务历史';
		state.taskId = '';
		state.pageNum = 1;
		getFlRecordData();
		intervalId.value = setInterval(getFlRecordData, 10000);
	}
};
// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	state.tableData = [];
	getFlTaskList({
		pageSize: state.pageSize,
		pageNum: state.pageNum,
		name: state.name,
	})
		.then((res) => {
			if (res.resultCode === 0) {
				state.loading = false;
				state.tableData = res.data.data;
				state.total = res.data.total;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err) => {
			state.loading = false;
			console.log(err);
		});
};
//获取任务历史列表
const getFlRecordData = () => {
	state.loading = true;
	state.recordData = [];
	getFlRecordList({
		pageSize: state.pageSize,
		pageNum: state.pageNum,
		name: state.name,
		taskId: state.taskId,
	})
		.then((res) => {
			if (res.resultCode === 0) {
				state.loading = false;
				state.recordData = res.data.data;
				state.total = res.data.total;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err) => {
			state.loading = false;
			console.log(err);
		});
};
const searchList = () => {
	state.pageNum = 1;
	if (params.tabsName == '任务历史') {
		getFlRecordData();
	} else {
		getTableData();
	}
};

// 打开新建任务弹窗
const onOpenAddTask = (type: string) => {
	taskDialogRef.value.openDialog(type);
};
// 打开修改用户弹窗
const onOpenEditFlTask = (type: string, id: string) => {
	taskDialogRef.value.openDialog(type, id);
};
// 打开详情页面
const onOpenDetail = (id: string) => {
	// userDetailDialogRef.value.openDialog(id);
	router.push({
		path: '/federatedModel/detail',
		query: { id },
	});
};
const handleTaskHistory = (id: string) => {
	state.taskId = id;
	params.tabsName = '任务历史';
	intervalId.value = setInterval(getFlRecordData, 10000);
	getFlRecordData();
};
//模型下载
const onDownloadRecord = async (id: string, name: string) => {
	// try {
	// 	if ('showSaveFilePicker' in window) {
	// 		const handle = await window.showSaveFilePicker({
	// 			suggestedName: name + '.tar',
	// 		});
	// 		const file = await handle.getFile();
	// 		state.loading = true;
	// 		let locationObj = window.location;
	// 		let urlStr = locationObj.protocol + '//' + locationObj.host + import.meta.env.VITE_API_URL;
	// 		flRecordDownload({ recordId: id })
	// 			.then(async (res: AxiosResponse) => {
	// 				const writableStream = await handle.createWritable();
	// 				writableStream.write(new Blob([res.data]));

	// 				await writableStream.close();
	// 				ElMessage.success('下载成功');
	// 				state.loading = false;
	// 			})
	// 			.catch((err: any) => {
	// 				state.loading = false;
	// 				console.log(err);
	// 			});
	// 	} else {
	// 		throw new Error('浏览器不支持 File System Access API');
	// 	}
	// } catch (error) {
	// 	console.error('写入文件失败:', error);
	// }
	state.loading = true;
	flRecordDownload({ recordId: id })
		.then((res: any) => {
			state.loading = false;
			// if (res.code === 0) {
				const blob = new Blob([res]);
				const downloadElement = document.createElement('a');
				const href = window.URL.createObjectURL(blob);
				downloadElement.href = href;
				downloadElement.download = name + '.tar.gz';
				document.body.appendChild(downloadElement);
				downloadElement.click();
				document.body.removeChild(downloadElement);
				window.URL.revokeObjectURL(href);
				ElMessage.success('下载成功');
			// } else {
			// 	ElMessage.error(res.resultDesc);
			// }
		})
		.catch((err) => {
			state.loading = false;
			console.error(err);
		});
};
// 删除
const onRowDel = (id: string) => {
	ElMessageBox.confirm('删除后将无法恢复，是否确认删除', '确认要删除吗？', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		buttonSize: 'default',
		type: 'warning',
	})
		.then(() => {
			deleteFlTask({
				taskId: id,
			}).then((res) => {
				if (res.resultCode == 0) {
					ElMessage.success('删除成功');
					getTableData();
				} else {
					ElMessage.error(res.resultDesc);
				}
			});
		})
		.catch(() => {});
};
//打开模型提交弹窗
const onSubmitModel = (id: string) => {
	modelDialogRef.value.openDialog(id);
};
// 打开面板弹窗
const onOpenPanel = (modelId: string, nodeId: string) => {
	fateBoardJobQuery(modelId, nodeId).then((res) => {
		if (res.resultCode === 0) {
			router.push({
				name: 'federatedModelPanel',
				state: Object.assign(res.data.data[0], { nodeId: nodeId }),
			});
		} else {
			ElMessage.error(res.msg);
		}
	});
};
//启动任务
const onOpenStart = (id: string) => {
	taskStartDialogRef.value.openDialog(id);
};

//停止任务
const onStopFlTask = (id: string) => {
	state.loading = true;
	stopFlTask({
		recordId: id,
	})
		.then((res) => {
			state.loading = false;
			if (res.resultCode == 0) {
				ElMessage.success('停止成功');
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err) => {
			state.loading = false;
			console.log(err);
		});
};

const onOpenHistory = (id: string) => {
	state.loading = true;
	state.taskId = id;
	state.recordData = [];
	getFlRecordList({
		pageSize: state.pageSize,
		pageNum: state.pageNum,
		taskId: state.taskId,
		name: state.name,
	})
		.then((res) => {
			if (res.resultCode === 0) {
				state.loading = false;
				state.recordData = res.data.data;
				state.total = res.data.total;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err) => {
			state.loading = false;
			console.log(err);
		});
	params.tabsName = '任务历史';
	intervalId.value = setInterval(getFlRecordData, 10000);
};

// 页面加载时
onMounted(() => {
	if (params.tabsName == '任务历史') {
		getFlRecordData();
		intervalId.value = setInterval(getFlRecordData, 10000);
	} else {
		getTableData();
	}
});
onUnmounted(() => {
	if (intervalId.value) {
		clearInterval(intervalId.value);
	}
});
</script>

<style scoped lang="scss">
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
.clearfix {
	margin-right: 30px;
	position: relative;
	z-index: 999;
}
.success::before {
	content: '•';
	display: inline;
	color: #00b42a;
	margin-right: 10px;
	font-weight: 800;
}
.running::before {
	content: '•';
	display: inline;
	color: #409eff;
	margin-right: 10px;
	font-weight: 800;
}
.canceled::before {
	content: '•';
	display: inline;
	color: #e6a23c;
	margin-right: 10px;
	font-weight: 800;
}
.failed::before {
	content: '•';
	display: inline;
	color: #ed4014;
	margin-right: 10px;
	font-weight: 800;
}
:deep(.el-tabs__active-bar) {
	height: 0px !important;
}
:deep(.el-tabs__nav-scroll) {
	z-index: 998;
}
:deep(.el-tabs__nav) {
	z-index: 999;
}
:deep(.el-upload-list) {
	margin-left: 100px;
}
:deep(.el-upload-list__item) {
	width: 120px;
}
</style>
