<template>
	<div class="system-role-container layout-padding">
		<div class="title-bar">
			<div class="page-title">项目管理</div>

			<el-button size="large" type="primary" @click="onOpenAddRole('add')">
				<el-icon>
					<ele-Plus />
				</el-icon>
				创建项目
			</el-button>
		</div>

		<el-card shadow="never" class="mt20 mb20 title-search">
			<template #header>
				<div class="tabs-header">
					<div class="tabs-btn">
						<div class="tabs-list" :class="{ active: state.type == '0' }" @click="handleChange('0')">全部项目</div>
						<div class="tabs-history" :class="{ active: state.type == '1' }" @click="handleChange('1')">我发起的</div>
						<div class="tabs-history" :class="{ active: state.type == '2' }" @click="handleChange('2')">我协作的</div>
					</div>
					<div>
						<el-input v-model="state.name" style="width: 240px" size="large" placeholder="请输入项目名称/发起机构" @keyup.enter="handleSearch">
							<template #suffix>
								<el-icon class="el-input__icon" :class="searchLoading ? 'cursorNo' : 'cursorPointer'" @click="handleSearch">
									<el-icon>
										<ele-Search />
									</el-icon>
								</el-icon>
							</template>
						</el-input>
					</div>
				</div>
			</template>

			<div v-if="state.type == '0'">
				<el-table :data="state.tableData" v-loading="state.loading" @selection-change="handleSelectionChange" style="width: 100%">
					<el-table-column label="项目ID" prop="id" show-overflow-tooltip></el-table-column>
					<el-table-column label="项目名称" show-overflow-tooltip>
						<template #default="scope">
							<el-button size="small" text type="info" @click="toDetail(scope.row)" v-auth="'api:role:update'">{{ scope.row.name }} </el-button>
						</template>
					</el-table-column>
					<el-table-column prop="enterpriseName" label="发起机构" show-overflow-tooltip></el-table-column>
					<el-table-column prop="partnerNum" label="协作机构数" show-overflow-tooltip></el-table-column>
					<el-table-column prop="jobNum" label="任务数" show-overflow-tooltip></el-table-column>
					<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip />

					<el-table-column label="操作" width="100">
						<template #default="scope">
							<el-button
								:disabled="scope.row.type == '2'"
								size="small"
								text
								type="info"
								@click="onOpenEditRole('edit', scope.row)"
								v-auth="'api:role:update'"
								:class="scope.row.type == '2' ? 'disabledColor' : ''"
								>编辑
							</el-button>
							<el-button
								:disabled="scope.row.type == '2'"
								:class="scope.row.type == '2' ? 'disabledColor' : ''"
								size="small"
								text
								type="info"
								@click="onProjectDelete(scope.row)"
								>{{ scope.row.status == 1 ? '启用' : '禁用' }}
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" @pagination="getTableData" />
			</div>

			<div v-if="state.type == '1'">
				<el-table :data="state.tableData" v-loading="state.loading" @selection-change="handleSelectionChange" style="width: 100%">
					<el-table-column label="项目ID" prop="id" show-overflow-tooltip></el-table-column>
					<el-table-column label="项目名称" show-overflow-tooltip>
						<template #default="scope">
							<el-button size="small" text type="info" @click="toDetail(scope.row)" v-auth="'api:role:update'">{{ scope.row.name }} </el-button>
						</template>
					</el-table-column>
					<el-table-column prop="enterpriseName" label="发起机构" show-overflow-tooltip></el-table-column>
					<el-table-column prop="partnerNum" label="协作机构数" show-overflow-tooltip></el-table-column>
					<el-table-column prop="jobNum" label="任务数" show-overflow-tooltip></el-table-column>
					<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip />
					<el-table-column label="操作" width="100">
						<template #default="scope">
							<el-button size="small" text type="info" @click="onOpenEditRole('edit', scope.row)" v-auth="'api:role:update'">编辑 </el-button>
							<el-button size="small" text type="info" @click="onProjectDelete(scope.row)">{{ scope.row.status == 1 ? '启用' : '禁用' }} </el-button>
						</template>
					</el-table-column>
				</el-table>
				<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" @pagination="getTableData" />
			</div>

			<div v-if="state.type == '2'">
				<el-table :data="state.tableData" v-loading="state.loading" @selection-change="handleSelectionChange" style="width: 100%">
					<el-table-column label="项目ID" prop="id" show-overflow-tooltip></el-table-column>
					<el-table-column label="项目名称" show-overflow-tooltip>
						<template #default="scope">
							<el-button size="small" text type="info" @click="toDetail(scope.row)" v-auth="'api:role:update'">{{ scope.row.name }} </el-button>
						</template>
					</el-table-column>
					<el-table-column prop="enterpriseName" label="发起机构" show-overflow-tooltip></el-table-column>
					<el-table-column prop="partnerNum" label="协作机构数" show-overflow-tooltip></el-table-column>
					<el-table-column prop="jobNum" label="任务数" show-overflow-tooltip></el-table-column>
					<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip />
					<el-table-column label="操作" width="100">
						<template #default="scope">
							<el-button
								disabled
								size="small"
								class="disabledColor"
								text
								type="info"
								@click="onOpenEditRole('edit', scope.row)"
								v-auth="'api:role:update'"
								>编辑
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" @pagination="getTableData" />
			</div>
		</el-card>

		<add-project-dialog ref="roleDialogRef" @refresh="getTableData()" />
		<AuthorizationDetail ref="AuthorizationDetailRef" />
	</div>
</template>

<script setup lang="ts" name="projectManage">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
// import {ProjectModelList, ProjectStateType} from '@/types/views';
import type { TabsPaneContext, TabPaneName } from 'element-plus';
import { getProjectList, projectAuditList, projectUpdateState } from '@/api/projectManage';
import { formatDate } from '@/utils/formatTime';
import { Search } from '@element-plus/icons-vue';

// 引入组件
const AddProjectDialog = defineAsyncComponent(() => import('@/views/projectManage/addDialog.vue'));
const AuthorizationDetail = defineAsyncComponent(() => import('@/views/dataManage/AuthorizationDetail-dialog.vue'));
// 定义变量内容
const roleDialogRef = ref();
const AuthorizationDetailRef = ref();
const inputSerch = ref('');
const router = useRouter();
const state = reactive({
	name: '',
	type: '0',
	pageSize: 10,
	pageNum: 1,
	total: 0,
	createTime: [],
	enterpriseId: '',
	loading: false,
	tableData: [],
	createStartTime: '',
	description: '',
	partnerIds: [],
});

const searchLoading = ref(false);
onMounted(() => {
	getTableData();
	getProjectAuditList();
});
const projectModel = ref<ProjectModelList>([]);
const getProjectAuditList = () => {
	projectAuditList({})
		.then((res: any) => {
			if (res.resultCode === 0) {
				projectModel.value = res.data;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err: any) => {
			ElMessage.error(...err);
		});
};
const handleClick = (tab: TabsPaneContext, event: Event) => {
	// console.log(tab, event);
};

const handleChange = (name: TabPaneName) => {
	if (name == '1') {
		state.type = name;
	} else if (name == '2') {
		state.type = name;
	} else if (name == '0') {
		state.type = name;
	}
	getTableData();
};
const activeName = ref('0');
// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	searchLoading.value = true;
	getProjectList({
		pageSize: state.pageSize,
		pageNum: state.pageNum,
		type: state.type,
		name: state.name,
		enterpriseId: state.enterpriseId,
		createStartTime: state.createTime && state.createTime[0] ? formatDate(state.createTime[0], 'YYYY-mm-dd') : '',
		createEndTime: state.createTime && state.createTime[1] ? formatDate(state.createTime[1], 'YYYY-mm-dd') : '',
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

const handleSearch = () => {
	state.pageNum = 1;
	getTableData();
};

// 重置
const clearForm = () => {
	state.name = '';
	state.type = '0';
	state.pageSize = 10;
	state.pageNum = 1;
	state.createTime = [];
	state.enterpriseId = '';
	getTableData();
};
// 打开新增角色弹窗
const onOpenAddRole = (type: string) => {
	roleDialogRef.value.openDialog(type);
};
// 打开修改角色弹窗
const onOpenEditRole = (type: string, row: Object) => {
	// console.log(`output->`,row)
	roleDialogRef.value.openDialog(type, row);
};
// 删除角色
const onProjectDelete = (row: ProjectStateType) => {
	state.loading = true;
	projectUpdateState({ id: row.id, status: row.status == 1 ? '0' : '1' })
		.then((res) => {
			if (res.resultCode === 0) {
				if (row.status == 1) {
					ElMessage.success('启用成功');
				} else {
					ElMessage.success('禁用成功');
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
const selectData = ref(<any>[]);
const handleSelectionChange = (val: Array<any>) => {
	selectData.value = val;
};

const toDetail = (row: ProjectStateType) => {
	router.push({ path: '/projectManage/detail', query: { projectId: row.id } });
};
</script>

<style scoped lang="scss">
.system-role-container {
  .system-role-padding {
    padding: 15px;
  }
}

.cursorPointer {
  cursor: pointer;
}
.cursorNo {
  pointer-events: none;
}
.tabs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin-bottom: 1px;
  .tabs-btn {
    display: flex;
    cursor: pointer;

    gap: 20px;
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
.disabledColor {
  color: #c8c9cc !important;
}
</style>
