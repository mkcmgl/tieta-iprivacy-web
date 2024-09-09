<template>
	<div class="system-role-container layout-padding">
		<div class="title-bar">
			<div class="page-title">证书管理</div>
			<el-button size="large" type="primary" @click="onOpenAddNode('add')">
				<el-icon>
					<ele-Plus />
				</el-icon>
				新增证书
			</el-button>
		</div>

		<el-card shadow="never" class="mt20 mb20 title-search">
			<template #header>
				<el-input v-model="state.nodeName" style="width: 240px" size="large" placeholder="请输入证书名称" @keyup.enter="handleSearch">
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
				<el-table-column label="证书ID" show-overflow-tooltip>
					<template #default="scope">
						<el-button size="small" text type="info" @click="toDetail(scope.row.id)" v-auth="'api:role:update'">{{ scope.row.id }}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="证书名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nodeIp" label="IP/域名" show-overflow-tooltip></el-table-column>
				<el-table-column label="端口" prop="nodePort" show-overflow-tooltip />
				<el-table-column prop="createTime" label="颁发时间" show-overflow-tooltip></el-table-column>

				<el-table-column prop="status" label="证书状态">
					<template #default="scope">
						<div class="align-center">
							<div
								class="mr5"
								:class="{
									'round-green': scope.row.status == 1,
									'round-red': scope.row.status == 2,
									'round-orange': scope.row.status == 3,
									'round-grey': scope.row.status == 4,
								}"
							/>
							<div>
								{{ scope.row.status == 1 ? '正常' : scope.row.status == 2 ? '失效 ' : scope.row.status == 3 ? '临期' : '吊销' }}
							</div>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="操作" width="160">
					<template #default="scope">
						<el-button size="small" text type="info" @click="certListDownload(scope.row)">下载</el-button>
						<el-button
							size="small"
							text
							type="info"
							:class="{
								'text-grey': scope.row.status == 4,
							}"
							:disabled="scope.row.status == 4"
							@click="certificatesRevoke(scope.row.id)"
							>吊销</el-button
						>
						<el-button size="small" text type="info" @click="onOpenRenewalDialog(scope.row.id)">续期</el-button>
						<el-button size="small" text type="info" @click="onNodeDel(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" @pagination="getTableData" />
		</el-card>

		<add-dialog ref="roleDialogRef" @refresh="getTableData()" />
		<el-dialog title="证书续期" ref="auditDialogRef" width="600px" v-model="dialogShow" @close="closeAuditDialog">
			<el-form ref="indexDialogFormRef" :model="dialogForm" :rules="rules" size="large" label-position="left" label-width="120px">
				<el-row :gutter="35">
					<el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20" class="mb22">
						<el-form-item label="证书续期时长" prop="expire" class="leftFormTip">
							<el-input-number style="width: 100%" v-model="dialogForm.expire" placeholder="请输入证书有效期" :min="1" :max="99" />
						</el-form-item>
					</el-col>
					<el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" class="mb22" style="display: flex; align-items: center">年</el-col>
				</el-row>
				<div style="margin-top: 10px; line-height: 1.6; font-size: 14px; color: #b8b8b8">注：续期证书有效明为证书续期时长加上原证书剩余有效期</div>
			</el-form>
			<div class="dialog-footer pt20 pb20" style="display: flex; justify-content: center">
				<el-button type="primary" size="large" @click="submitAudit">确定</el-button>

				<el-button size="large" @click="closeAuditDialog">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="certificates">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs, nextTick } from 'vue';
import { ElMessageBox, ElMessage, FormRules } from 'element-plus';
import { getCertList, certRevoke, certRenewal, deleteCert } from '@/api/certificatesManage';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
// 引入组件
const AddDialog = defineAsyncComponent(() => import('@/views/certificatesManage/addDialog.vue'));
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
const dialogForm = reactive({
	id: '',
	expire: '',
});
const indexDialogFormRef = ref();
const dialogShow = ref(false);
const searchLoading = ref(false);
const loading = ref(false);
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
const closeAuditDialog = () => {
	dialogShow.value = false;
	dialogForm.expire = '';
	dialogForm.id = '';
	indexDialogFormRef.value?.resetFields();
};
const equalToEmpty = (rule: any, value: any, callback: any) => {
	if (/^\s+$/gi.test(value)) {
		callback(new Error('不能全输入空格'));
	} else {
		callback();
	}
};
const dataName = (rule: any, value: any, callback: any) => {
	if (!/^(?!0\d)\d+$/.test(value)) {
		callback(new Error('只能是数字'));
	} else {
		callback();
	}
};
const rules = reactive<FormRules>({
	expire: [{ required: true, message: '请输入登记证书有效期', trigger: 'blur' }],
});
// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	searchLoading.value = true;
	getCertList({
		pageSize: state.pageSize,
		pageNum: state.pageNum,
		keyword: state.nodeName,
	})
		.then((res: any) => {
			state.tableData = [];
			state.tableData = res.data.data;
			state.total = res.data.total;
		})
		.catch((err: any) => {
			ElMessage.error(...err);
		})
		.finally(() => {
			state.loading = false;
			searchLoading.value = false;
		});
};
const certListDownload = (row: any) => {
	const link = document.createElement('a');
	let locationObj = window.location;
	let urlStr = locationObj.protocol + '//' + locationObj.host + import.meta.env.VITE_API_URL;
	link.href = urlStr + `api/privacy/cert/download?id=${row.id}`;
	link.download = row.name + '.zip';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
const certificatesRevoke = (id: any) => {
	state.loading = true;
	certRevoke({ id })
		.then((res: any) => {
			if (res.resultCode == 0) {
				ElMessage.success('吊销成功');
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err: any) => {
			ElMessage.error(err);
		})
		.finally(() => (state.loading = false));
};

const onOpenRenewalDialog = (id: any) => {
	dialogShow.value = true;
	dialogForm.id = id;
};
const submitAudit = () => {
	indexDialogFormRef.value?.validate((valid: any) => {
		if (valid) {
			loading.value = true;
			certRenewal(dialogForm)
				.then((res: any) => {
					if (res.resultCode == 0) {
						closeAuditDialog();
						getTableData();
						ElMessage.success('续期成功');
					} else {
						ElMessage.error(res.resultDesc);
					}
				})
				.catch((err: any) => {
					ElMessage.error(err);
				})
				.finally(() => (loading.value = false));
		}
	});
};

const searchList = () => {
	state.pageNum = 1;
	getTableData();
};

const clearData = () => {
	state.nodeName = '';
	state.onlineStatus = '';
	state.pageSize = 10;
	state.pageNum = 1;
};

// 打开新增证书弹窗
const onOpenAddNode = (type: string) => {
	roleDialogRef.value.openDialog(type);
};

// 删除证书
const onNodeDel = (id: string) => {
	ElMessageBox.confirm('删除后将无法恢复，请谨慎操作？', '确定要删除选中的证书数据集吗？', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
		buttonSize: 'default',
	}).then(() => {
		deleteCert({ id }).then((res) => {
			if (res.resultCode === 0) {
				ElMessage.success('删除成功');
				getTableData();
			} else {
				ElMessage.warning(res.resultDesc);
			}
		});
	});
};
const selectData = ref(<any>[]);

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
.round-orange {
  width: 10px;
  height: 10px;
  background-color: orange;
  border-radius: 50%;
}
.round-grey {
  width: 10px;
  height: 10px;
  background-color: grey;
  border-radius: 50%;
}
.text-grey {
  color: grey !important;
}
.align-center {
  display: flex;
  align-items: center;
}
</style>
