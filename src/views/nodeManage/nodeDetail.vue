<template>
	<div class="enterprise-detail-container layout-padding" v-loading="fieldListLoading">
		<div class="title-bar">
			<div class="page-title">
				<img src="@/assets/public/back.png" class="mr5" @click="backList" />
				节点详情
			</div>
		</div>
		<el-card shadow="never" class="w100 box-detail mt20 mb20">
			<div class="box-detail-title mb30">节点注册详情</div>
			<el-form :model="nodeDetailMsg" label-width="120px" label-position="left">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户类型：">
							<span>{{ nodeDetailMsg.userType == '1' ? '铁塔' : '非铁塔' }}用户</span>
						</el-form-item>
						<el-form-item label="注册人：">
							<span>{{ nodeDetailMsg.userName }}</span>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="节点名称：">
							<span>{{ nodeDetailMsg.nodeName }}</span>
						</el-form-item>
						<el-form-item label="注册时间：">
							<span>{{ nodeDetailMsg.createTime }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="35" v-if="nodeDetailMsg.userType == '1'">
					<el-col :xs="24" :sm="14" :md="14" :lg="14" :xl="14" class="mb20">
						<el-form-item label="节点规格：">
							<el-table
								class="isDisabled"
								:data="tableDataList"
								v-loading="loading"
								style="width: 100%"
								ref="multipleTable"
								@selection-change="handleSelectionChange"
							>
								<el-table-column type="selection" :selectable="selectable">
									<!-- <template >
										<el-checkbox :disabled="isEdit"></el-checkbox>
									</template> -->
								</el-table-column>
								<el-table-column label="节点规格" show-overflow-tooltip>
									<template #default="scope">{{ scope.row.peizhi }}</template>
								</el-table-column>
								<el-table-column property="cpu" label="CPU" />
								<el-table-column label="内存">
									<template #default="scope">{{ scope.row.neicun }}</template>
								</el-table-column>
							</el-table>
						</el-form-item>
						<el-form-item label="节点描述：">
							<span>{{ nodeDetailMsg.nodeDesc }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="35" v-else>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="节点端口号:">
							<span>{{ nodeDetailMsg.nodePort }}</span>
						</el-form-item>
						<el-form-item label="节点ID:">
							<span>{{ nodeDetailMsg.nodeId }}</span>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="节点IP/域名：">
							<span>{{ nodeDetailMsg.nodeIp }}</span>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="14" :md="14" :lg="14" :xl="14" class="mb20">
						<el-form-item label="节点描述：">
							<span>{{ nodeDetailMsg.nodeDesc }}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<el-card shadow="never" class="w100 box-detail mt20 mb20" v-if="nodeDetailMsg.userType == '1'">
			<div class="box-detail-title mb30">审核信息</div>
			<el-form :model="nodeDetailMsg" label-width="120px" label-position="left">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="审核状态：">
							<span>{{ nodeDetailMsg.auditStatus == '0' ? '待审核' : nodeDetailMsg.auditStatus == '1' ? '审核通过' : '审核驳回' }}</span>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="审核时间：">
							<span>{{ nodeDetailMsg.auditTime }}</span>
						</el-form-item>
					</el-col>
				</el-row>

				<div style="width: 100%" v-if="nodeDetailMsg.auditStatus == '1'">
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="节点ID：">
								<span>{{ nodeDetailMsg.nodeId }}</span>
							</el-form-item>

							<el-form-item label="端口：">
								<span>{{ nodeDetailMsg.nodePort }}</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="节点IP/域名：">
								<span>{{ nodeDetailMsg.nodeIp }}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-form>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="nodeManageDetail">
import { onActivated, nextTick, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserInfo } from '@/stores/userInfo';
import { nodeDetail, extList } from '@/api/nodeManage';
// import { NodeDetailType } from '@/types/views';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { ElTree, ElTable } from 'element-plus';
const router = useRouter();
const route = useRoute();
const userInfos = useUserInfo();
declare interface NodeDetailFromType {
	nodeId: string;
	userId: string;
	enterpriseId: string;
	nodeName: string;
	nodePort: string;
	nodeIp: string;
	createTime: string;
	updateTime: string;
	activationStatus: string;
	onlineStatus: string;
	userType: string;
	userName: string;
	nodeDesc: string;
	auditStatus: string;
	auditTime: string;
}
const nodeDetailMsg = ref(<NodeDetailFromType>{});
const loading = ref(false);
const fieldListLoading = ref(false);
const tableDataList = ref([]);
const selectDataId = ref('1');
const multipleTable = ref<InstanceType<typeof ElTable>>();
const selectList = ref([]);
onActivated(() => {
	getNodeDetail();
});
const selectable = () => {
	return false;
};
const getExtList = () => {
	loading.value = true;
	tableDataList.value = [];
	extList({ mainId: 1, pageNum: 1, pageSize: 1000 })
		.then((res) => {
			if (res.resultCode === 0) {
				res.data.data.forEach((item: any) => {
					tableDataList.value.push({ ...JSON.parse(item.dictValue), id: item.id });
				});
				if (selectDataId.value) {
					nextTick(() => {
						selectListData();
					});
				}
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err: any) => {
			ElMessage.error(...err);
		})
		.finally(() => {
			loading.value = false;
		});
};
const selectListData = () => {
	const selectData = tableDataList.value?.find((item: any) => item.id == selectDataId.value);
	multipleTable.value?.toggleRowSelection(selectData, true);
};
const getNodeDetail = () => {
	nodeDetailMsg.value = <NodeDetailFromType>{};
	selectDataId.value = '';
	fieldListLoading.value = true;
	nodeDetail({ nodeId: route.query.nodeId ? route.query.nodeId : '', id: route.query.id })
		.then((res) => {
			if (res.resultCode == 0) {
				nodeDetailMsg.value = res.data;
				selectDataId.value = res.data.specs;
				getExtList();
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err: any) => {
			ElMessage.error(...err);
		})
		.finally(() => {
			fieldListLoading.value = false;
		});
};

const handleSelectionChange = (val: any) => {
	if (val.length > 1) {
		multipleTable.value?.clearSelection();
		multipleTable.value?.toggleRowSelection(val[val.length - 1], true);
		selectList.value = [val[val.length - 1]];
	} else {
		selectList.value = val;
	}
};

const backList = () => {
	router.back();
};
</script>

<style scoped lang="scss">
.w50 {
	width: 50%;
}
.w-100 {
	width: 100px;
}

.align-center {
	display: flex;
	align-items: center;
}
.leftName {
	font-weight: bold;
}
.isDisabled {
	::v-deep(.el-table-column--selection > .cell) {
		cursor: not-allowed;
		pointer-events: none;
	}

	::v-deep(.el-checkbox__input) {
		cursor: not-allowed;
		pointer-events: none;
	}
	::v-deep(.el-checkbox__original) {
		cursor: not-allowed;
		pointer-events: none;
	}
	::v-deep(.el-checkbox.el-checkbox--large.is-checked) {
		cursor: not-allowed;
		pointer-events: none;
	}
	::v-deep(th.el-table_2_column_8.el-table-column--selection.is-leaf.el-table__cell > .cell > .el-checkbox.el-checkbox--large) {
		cursor: not-allowed;
		pointer-events: none;
	}
}
</style>
