<template>
	<div class="system-role-container layout-padding">
		<div class="title-bar">
			<div class="page-title">隐私计算节点管理</div>
			<!-- <el-button size="large" type="primary" @click="onOpenAddNode('add')">
				<el-icon>
					<ele-Plus />
				</el-icon>
				节点注册
			</el-button> -->
		</div>

		<el-card shadow="never" class="mt20 mb20 title-search">
			<template #header>
				<el-input v-model="state.nodeName" style="width: 250px" size="large" placeholder="请输入节点CPU/内存/所属公司" @keyup.enter="handleSearch">
					<template #suffix>
						<el-icon class="el-input__icon" :class="searchLoading ? 'cursorNo' : 'cursorPointer'" @click="handleSearch">
							<el-icon>
								<ele-Search />
							</el-icon>
						</el-icon>
					</template>
				</el-input>
			</template>

			<el-table :data="state.tableData" v-loading="state.loading" style="width: 100%">
				<el-table-column label="节点ID" prop="nodeId" show-overflow-tooltip>
					<template #default="scope">
						<el-button size="small" text type="info" @click="toDetail(scope.row.nodeId)">{{ scope.row.nodeId }}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="nodeName" label="节点名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="cpu" label="节点CPU" show-overflow-tooltip></el-table-column>
				<el-table-column prop="memory" label="节点内存" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nodeIp" label="节点IP/域名" show-overflow-tooltip></el-table-column>
				<el-table-column label="端口" prop="nodePort" show-overflow-tooltip />
				<el-table-column prop="userName" label="注册人" show-overflow-tooltip></el-table-column>
				<el-table-column prop="enterpriseName" label="所属公司" show-overflow-tooltip></el-table-column>
				<el-table-column prop="auditTime" label="审核时间" show-overflow-tooltip></el-table-column>

				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button  v-if="scope.row.auditStatus=='0'" size="small" text type="info" @click="onOpenEditNode( scope.row)">审核</el-button>
						
						<el-button  v-else disabled size="small" text >审核</el-button>
						<!-- <el-button size="small" text type="info" @click="handleUpdateStatus(scope.row)">{{ scope.row.status == 1 ? '禁用' : '启用' }}</el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" @pagination="getTableData" />
		</el-card>

		<node-dialog ref="roleDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="nodeManageServer">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs, nextTick } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getNodeList, updateStatus } from '@/api/nodeManageServer';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
// 引入组件
const NodeDialog = defineAsyncComponent(() => import('@/views/nodeManageServer/dialog.vue'));
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
});

// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	searchLoading.value = true;
	getNodeList({
		pageSize: state.pageSize,
		pageNum: state.pageNum,
		keyword: state.nodeName,
	})
		.then((res: any) => {
			if (res.resultCode === 0) {
				state.tableData = [];
				state.tableData = res.data.data;
				state.total = res.data.total;
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

// 打开新增节点弹窗
const onOpenAddNode = (type: string) => {
	roleDialogRef.value.openDialog(type);
};
// 打开修改节点弹窗
const onOpenEditNode = ( row: Object) => {
	roleDialogRef.value.openDialog(row);
};
interface NodeListData {
	nodeName: string;
	status: string;
	nodeId: string;
}
const handleUpdateStatus = (row: NodeListData) => {
	state.loading = true;
	updateStatus({ nodeId: row.nodeId, status: row.status == '1' ? '0' : '1' })
		.then((res: any) => {
			if (res.resultCode === 0) {
				if (row.status == '1') {
					ElMessage.success('禁用成功');
				} else {
					ElMessage.success('启用成功');
				}
				getTableData();
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err: any) => {
			ElMessage.error(...err);
		})
		.finally(() => {
			state.loading = false;
		});
};

const handleSearch = () => {
	searchList();
};
const toDetail = (nodeId: string) => {
	//产品说详情先不做
	// 	router.push({ path: '/nodeManage/detail', query: { nodeId } });
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
</style>
