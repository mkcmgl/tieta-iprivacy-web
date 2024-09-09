getDataType
<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="1000px" :close-on-click-modal="false" :before-close="onCancel">
			<hr style="margin-top: -10px" />
			<div class="content" style="margin-top: 20px">
				<div class="search-box clearfix flex flex-1">
					<div class="search-flex flex-1"></div>

					<div class="search-button">
						<el-input v-model="state.queryParams.name" style="width: 240px" size="large" placeholder="请输入数据名称" @keyup.enter="searchList">
							<template #suffix>
								<el-icon class="el-input__icon" :class="searchLoading ? 'cursorNo' : 'cursorPointer'" @click="searchList">
									<el-icon>
										<ele-Search />
									</el-icon>
								</el-icon>
							</template>
						</el-input>
					</div>
				</div>
			</div>
			<el-table
				ref="multipleTable"
				:data="selectTableList"
				v-loading="state.loading"
				@selection-change="handleSelectionChange"
				style="width: 100%; margin-top: 20px"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column prop="name" label="数据名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nodeName" label="所属节点" show-overflow-tooltip></el-table-column>
				<el-table-column label="数据格式" show-overflow-tooltip>
					<template #default="scope"
						><div>
							{{ scope.row.typeId == '1' ? 'csv' : 'mysql' }}
						</div></template
					>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
			</el-table>

			<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" @pagination="getTableData" />
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" type="info" plain size="large">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="large" v-loading="loading">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="addDataManageDialog">
import { reactive, ref, nextTick, getCurrentInstance, onMounted, onUpdated, defineAsyncComponent, computed } from 'vue';
import { ElMessage, FormInstance, FormRules, ElMessageBox } from 'element-plus';
import { ElTree } from 'element-plus';
import { projectAddData } from '@/api/projectManage';

import { dataDetail } from '@/api/dataManage';
import { useRouter } from 'vue-router';
import { useUserInfo } from '@/stores/userInfo';
// import {ProjectDetailType} from '@/types/views';
import { getDataList } from '@/api/dataManage';

// 定义变量内容
const roleDialogFormRef = ref<FormInstance>();
const menu = ref<InstanceType<typeof ElTree>>();
const idList = ref(<any>[]);
const router = useRouter();
const userInfos = useUserInfo();
const { proxy } = getCurrentInstance() as any;
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const loading = ref(false);
const searchLoading = ref(false);
const useSceneContent = ref('');
const state = reactive({
	projectId: '',
	partnerId: '',
	queryParams: {
		name: '',
		nodeName: '',
	},
	pageSize: 10,
	pageNum: 1,
	total: 0,
	loading: false,
	tableData: [],
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
	},
	idList: [],
});
const dataListData = ref(<any>[]);
const selectTableList = ref(<any>[]);
const multipleTable = ref();
const enterpriseId = computed(() => {
	return userInfos.userInfos.enterpriseId;
});
// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	searchLoading.value = true;
	getDataList({
		pageSize: state.pageSize,
		pageNum: state.pageNum,
		name: state.queryParams.name,
		nodeName: state.queryParams.nodeName,
	})
		.then((res) => {
			if (res.resultCode === 0) {
				state.tableData = [];
				state.tableData = res.data.data;

				state.total = res.data.total;
				selectTableList.value = state.tableData.filter((obj: any) => !dataListData.value.includes(obj.id));
				if (state.tableData.length > 0 && selectTableList.value.length == 0) {
					ElMessage.warning('展无未添加的数据');
				}
				// nextTick(() => {
				// 	selectListData();
				// });
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err) => {
			ElMessage.error(...err);
		})
		.finally(() => {
			searchLoading.value = false;
			state.loading = false;
		});
};
// const selectListData = () => {
//   selectTableList.value.forEach((item:any) =>{
// 	multipleTable.value?.toggleRowSelection(item, true);

//   } )
// };
const selectData = ref(<any>[]);
const handleSelectionChange = (val: Array<any>) => {
	selectData.value = val;
	idList.value = val.map((item) => item.id);
	// console.log(`output->idList.value`, idList.value);
};
const searchList = () => {
	state.pageNum = 1;
	getTableData();
};

// 重置
const clearForm = () => {
	state.projectId = '';
	state.partnerId = '';
	state.queryParams = {
		name: '',
		nodeName: '',
	};
	state.pageSize = 10;
	state.pageNum = 1;
	getTableData();
};
// 打开弹窗
const openDialog = (type: string, row: ProjectDetailType, dataList: any, useSceneData: any) => {
	roleDialogFormRef.value?.clearValidate();
	loading.value = false;
	useSceneContent.value = useSceneData;
	dataListData.value = dataList.map((obj: any) => obj.dataId);
	state.dialog.type = type;
	state.dialog.title = '添加数据';
	state.dialog.isShowDialog = true;
	// console.log(`output->ProjectDetail`, row);
	state.projectId = row.id;
	const partner = row.projectPartnerList.find((item) => item.enterpriseId === enterpriseId.value);
	if (partner && partner.partnerId && partner.partnerId.length > 0) {
		state.partnerId = partner.partnerId;
	} else {
		state.partnerId = '';
	}

	getTableData();
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
	state.queryParams = {
		name: '',
		nodeName: '',
	};
};
const dataDetailMsg = ref(<DataDetailType>{});
const dataIdList = ref(<any>[]);
// 提交
const onSubmit = async () => {
	if (idList.value.length > 0) {
		dataIdList.value = [];
		loading.value = true;

		const promises = idList.value.map((item: any) => {
			return dataDetail({ dataId: item }).then((res) => {
				if (res.resultCode === 0) {
				dataIdList.value.push(res.data);
				} else {
					ElMessage.error(res.resultDesc);
				}
			})
			.catch((err) => {
				ElMessage.error(err);
			})
		});
		await Promise.all(promises);
		projectAddData({
			id: state.projectId,
			partnerId: state.partnerId,
			dataIdList: dataIdList.value,
			useSceneData: useSceneContent.value,
		})
			.then((res) => {
				if (res.resultCode === 0) {
					closeDialog();
					ElMessage.success('新增成功');
					emit('refresh');
				} else {
					ElMessage.error(res.resultDesc);
				}
			})
			.catch((err) => {
				ElMessage.error(err);
				closeDialog();
			})
			.finally(() => {
				state.queryParams = {
					name: '',
					nodeName: '',
				};
				loading.value = false;
			});
	}
};

// 暴露变量

defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.system-role-dialog-container {
	.menu-data-tree {
		width: 100%;
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
.search-flex {
	display: flex;
	align-items: center;

	.el-input {
		width: 150px !important;
	}
	.el-select {
		width: 150px !important;
	}
}
.align-center {
	display: flex;
	align-items: center;
}
.flex-1 {
	flex: 1;
}
.search-button {
	display: flex;
	justify-content: flex-end;
	margin-left: 10px;
	.el-button {
		width: 60px;
		.el-icon {
			margin-right: 0;
		}
		span {
			margin-left: 0;
		}
	}
}
.dataKey {
	display: flex;
	width: 100%;
	justify-content: end;

	.span-blue {
		color: #2d8cf0;
		margin-right: 10px;
	}
}

.upload-text {
	::v-deep(.el-upload-list) {
		display: none;
	}
}

.upload-demo {
	width: 100%;
	margin-top: 20px;
}
.cursorPointer {
	cursor: pointer;
}
.cursorNo {
	pointer-events: none;
}
</style>
