<template>
	<div class="system-role-container layout-padding">
		<div class="title-bar">
			<div class="page-title">节点管理</div>
			<el-button size="large" type="primary" @click="onOpenAddNode('add')">
				<el-icon>
					<ele-Plus />
				</el-icon>
				节点注册
			</el-button>
		</div>

		<el-card shadow="never" class="mt20 mb20 title-search">
			<template #header>
				<el-input v-model="state.nodeName" style="width: 240px" size="large" placeholder="请输入节点名称" @keyup.enter="handleSearch">
					<template #suffix>
						<el-icon class="el-input__icon" :class="searchLoading ? 'cursorNo' : 'cursorPointer'" @click="handleSearch">
							<el-icon>
								<ele-Search />
							</el-icon>
						</el-icon>
					</template>
				</el-input>
			</template>

			<el-table
				@row-dblclick="toDetail"
				:data="state.tableData"
				v-loading="state.loading"
				@selection-change="handleSelectionChange"
				style="width: 100%"
			>
				<el-table-column label="节点ID" prop="nodeId" show-overflow-tooltip>
					<template #default="scope">
						<el-button size="small" text type="info" @click="toDetail(scope.row)" v-auth="'api:role:update'">{{ scope.row.nodeId }}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="nodeName" label="节点名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nodeIp" label="节点IP/域名" show-overflow-tooltip> </el-table-column>
				<el-table-column label="端口" prop="nodePort" show-overflow-tooltip />

				<el-table-column label="激活状态">
					<template #default="scope">
						<el-switch
							v-if="!(scope.row.userType == '1' && (scope.row.auditStatus == '0' || scope.row.auditStatus == '2'))"
							size="default"
							active-value="1"
							inactive-value="0"
							:disabled="scope.row.onlineStatus == 0"
							v-model="scope.row.activationStatus"
							:before-change="() => changeStatus(scope.row)"
						/>
					</template>
				</el-table-column>

				<el-table-column prop="onlineStatus" label="状态">
					<template #default="scope">
						<div class="align-center">
							<div
								class="mr2"
								:class="{
									'round-green': scope.row.onlineStatus == 1,
									'round-red': scope.row.onlineStatus == 0,
								}"
								v-if="!(scope.row.userType == '1' && (scope.row.auditStatus == '0' || scope.row.auditStatus == '2'))"
							/>
							<div v-if="!(scope.row.userType == '1' && (scope.row.auditStatus == '0' || scope.row.auditStatus == '2'))">
								{{ scope.row.onlineStatus == 0 ? '离线' : '在线' }}
							</div>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button
							size="small"
							:disabled="scope.row.userType == '1'"
							text
							type="info"
							@click="onOpenEditNode('edit', scope.row)"
							:class="scope.row.userType == '1' ? 'disabledColor' : ''"
							v-auth="'api:role:update'"
							>编辑</el-button
						>
						<el-button
							size="small"
							:disabled="scope.row.userType == '1' && scope.row.auditStatus == '0'"
							text
							type="info"
							@click="onNodeDel(scope.row)"
							:class="scope.row.userType == '1' && scope.row.auditStatus == '0' ? 'disabledColor' : ''"
							v-auth="'api:role:delete'"
							>删除</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" @pagination="getTableData" />
		</el-card>

		<add-node-dialog ref="roleDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="nodeManage">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs, nextTick } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getNodeList, deleteNode, deleteBatch, updateActivation, updateStatusByIds, nodeOnlineState } from '@/api/nodeManage';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
// 引入组件
const AddNodeDialog = defineAsyncComponent(() => import('@/views/nodeManage/addNode.vue'));
// 定义变量内容
const roleDialogRef = ref();
const inputSerch = ref('');
const router = useRouter();
const state = reactive<SysNodeState>({
	nodeName: '',
	onlineStatus: '',
	pageSize: 10,
	pageNum: 1,
	total: 0,
	loading: false,
	tableData: [],
});
const searchLoading = ref(false);
const statusList = [
	{
		value: '0',
		label: '正常',
	},
	{
		value: '1',
		label: '停用',
	},
];

onMounted(() => {
	clearData();
	getTableData();
	// getNodeOnlineState();
});
const nodeModel = ref(<NodeModelList>[]);
// const getNodeOnlineState = () => {
// 	nodeOnlineState({ code: 'onlineStatus' }).then((res) => {
// 		nodeModel.value = res.data;
// 	});
// };
// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	searchLoading.value = true;
	getNodeList({
		pageSize: state.pageSize,
		pageNum: state.pageNum,
		nodeName: state.nodeName,
		onlineStatus: state.onlineStatus,
	})
		.then((res: any) => {
			if (res.resultCode === 0) {
				state.tableData = [];
				state.tableData = res.data.data;
				state.total = res.data.total;
				nextTick().then(() => {
					getUpdateStatusByIds();
				});
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err: any) => {
			ElMessage.error(...err);
		})
		.finally(() => {
			state.loading = false;
			searchLoading.value = false;
		});
};
const getUpdateStatusByIds = () => {
	const idList = state.tableData.map((obj: any) => obj.id);
	updateStatusByIds([...idList])
		.then((res: any) => {
			if (res.resultCode === 0) {
				if (res.data?.length > 0) {
					state.tableData = res.data;
				}
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err: any) => {
			ElMessage.error(...err);
		});
};
const searchList = () => {
	state.pageNum = 1;
	getTableData();
};

// 重置
const clearForm = () => {
	state.nodeName = '';
	state.onlineStatus = '';
	state.pageSize = 10;
	state.pageNum = 1;
	getTableData();
};

const clearData = () => {
	state.nodeName = '';
	state.onlineStatus = '';
	state.pageSize = 10;
	state.pageNum = 1;
};
// 切换用户状态
const changeStatus = (row: NodeState) => {
	state.loading = true;
	return new Promise((resolve, reject) => {
		updateActivation({ nodeId: row.nodeId, activationStatus: row.activationStatus == '0' ? '1' : '0', id: row.id })
			.then((res) => {
				if (res.resultCode === 0) {
					ElMessage.success('操作成功');
					getTableData();
				} else {
					ElMessage.error(res.resultDesc);
				}
			})
			.catch((err) => {
				state.loading = false;
				ElMessage.error(err);
			})
			.finally(() => (state.loading = false));
	});
};
// 打开新增节点弹窗
const onOpenAddNode = (type: string) => {
	roleDialogRef.value.openDialog(type);
};
// 打开修改节点弹窗
const onOpenEditNode = (type: string, row: Object) => {
	roleDialogRef.value.openDialog(type, row);
};

// 删除节点
const onNodeDel = (row: any) => {
	ElMessageBox.confirm('删除后将无法恢复，请谨慎操作？', '确定要删除选中的节点数据集吗？', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
		buttonSize: 'default',
	}).then(() => {
		state.loading = true;
		searchLoading.value = true;
		deleteNode({ nodeId: row.nodeId, id: row.id })
			.then((res) => {
				if (res.resultCode === 0) {
					ElMessage.success('删除成功');
					getTableData();
				} else {
					ElMessage.error(res.resultDesc);
				}
			})
			.catch((err) => {
				ElMessage.error(...err);
			})
			.finally(() => {
				state.loading = false;
				searchLoading.value = false;
			});
	});
};
const selectData = ref(<any>[]);
const handleSelectionChange = (val: Array<any>) => {
	selectData.value = val;
};
const nodeInfoList = ref<NodeIdObject[]>([]);

type NodeIdObject = { nodeId: string };
const onOpenDelete = () => {
	nodeInfoList.value = [];
	if (selectData.value?.length > 0) {
		ElMessageBox.confirm('删除后将无法恢复，请谨慎操作？', '确定要删除选中的节点数据集吗？', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
			buttonSize: 'default',
		}).then(() => {
			selectData.value.forEach((item: NodeState) => {
				nodeInfoList.value.push({ nodeId: item.nodeId });
			});
			deleteBatch({ nodeInfoList: nodeInfoList.value })
				.then((res) => {
					if (res.resultCode === 0) {
						ElMessage.success('删除成功');
						getTableData();
					} else {
						ElMessage.error(res.resultDesc);
					}
				})
				.catch((err) => {
					ElMessage.error(...err);
				});
		});
	}
};
const handleSearch = () => {
	searchList();
};
const handlerRowClick = (row: any) => {};

const toDetail = (row: any) => {
	router.push({ path: '/nodeManage/detail', query: { nodeId: row.nodeId, id: row.id } });
};
</script>

<style scoped lang="scss">
.cursorPointer {
  cursor: pointer;
}
.cursorNo {
  pointer-events: none;
}
.system-role-container {
  .system-role-padding {
    padding: 15px;
  }
}
.round-red {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
}
.round-green {
  width: 10px;
  height: 10px;
  background-color: green;
  border-radius: 50%;
}
.round-red {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
}
.round-green {
  width: 10px;
  height: 10px;
  background-color: green;
  border-radius: 50%;
}
.align-center {
  display: flex;
  align-items: center;
}
.disabledColor {
  color: #c8c9cc !important;
}
</style>
