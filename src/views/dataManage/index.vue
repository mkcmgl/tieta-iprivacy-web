<template>
	<div class="system-role-container layout-padding">
		<!-- <el-card shadow="never" class="search-box">
			<div class="content">
				<div class="search-box clearfix">
					<div class="fl mb30">
						<div class="search-name">数据名称:</div>
						<el-input placeholder="请输入数据名称" v-model="state.roleName" size="large"></el-input>
					</div>
					<div class="fl mb30">
						<div class="search-name">节点名称:</div>
						<el-input placeholder="请输入节点名称" v-model="state.roleKey" size="large"></el-input>
					</div>
					<div class="fr mb30">
						<el-button type="primary" size="large" @click="searchList" >
							<el-icon>
								<ele-Search />
							</el-icon>
							<span>查询</span>
						</el-button>
						<el-button type="info" size="large" @click="clearForm" >
							<el-icon>
								<ele-RefreshLeft />
							</el-icon>
							<span>重置</span>
						</el-button>
					</div>
				</div>
			</div>
		</el-card> -->
		<div class="title-bar">
			<div class="page-title">数据管理</div>
			<el-button size="large" type="primary" @click="onOpenAddData('add')">
				<el-icon>
					<ele-Plus />
				</el-icon>
				添加数据
			</el-button>
			<!-- <el-button size="default" type="primary" @click="onOpenAddData('add')">
				<el-icon>
					<ele-Plus />
				</el-icon>
				添加数据
			</el-button> -->
		</div>

		<el-card shadow="never" class="mt20 mb20 title-search">
			<template #header>
				<el-input v-model="state.name" style="width: 240px" size="large" placeholder="请输入数据名称" @keyup.enter="handleSearch">
					<template #suffix>
						<el-icon class="el-input__icon" :class="searchLoading ? 'cursorNo' : 'cursorPointer'" @click="handleSearch">
							<el-icon>
								<ele-Search />
							</el-icon>
						</el-icon>
					</template>
				</el-input>
			</template>

			<el-table :data="state.tableData" v-loading="state.loading" @selection-change="handleSelectionChange" style="width: 100%">
				<el-table-column label="数据ID" show-overflow-tooltip prop="id"> </el-table-column>
				<el-table-column label="数据名称" show-overflow-tooltip>
					<template #default="scope">
						<el-button size="small" text type="info" @click="toDetail(scope.row.id)">{{ scope.row.name }}</el-button>
					</template>
				</el-table-column>
				<el-table-column label="数据来源" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.typeId == '1' ? '文件上传' : '数据库导入' }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="使用详情" width="100">
					<template #default="scope">
						<el-button size="small" text type="info" @click="onOpenAuthorizationDetail('use', scope.row)">
							<img :src="queryDetail" class="size-img" />
						</el-button>
					</template>
				</el-table-column>
				<el-table-column label="授权详情" width="100">
					<template #default="scope">
						<el-button size="small" text type="info" @click="onOpenAuthorizationDetail('auth', scope.row)">
							<img :src="queryDetail" class="size-img" />
						</el-button>
					</template>
				</el-table-column>
				<el-table-column label="数据登记证书" width="120">
					<template #default="scope">
						<el-button size="small" text type="info" @click="handlerShowZhengShu(scope.row)" :disabled="scope.row.isRegister == '0'">
							<img :src="queryDetail" class="size-img" />
						</el-button>
					</template>
				</el-table-column>
				<el-table-column label="namespace" width="120" prop="namespace"> </el-table-column>
				<!-- <el-table-column prop="status" label="状态" show-overflow-tooltip>
					<template #default="scope">
						<div class="align-center">
							<div class="round-green mg-r-2" />
							<div>{{ scope.row.status==0?"成功":"失败" }}</div>
						</div>
					</template>
				</el-table-column> -->

				<el-table-column label="操作" width="150">
					<template #default="scope">
						<el-button size="small" text type="info" @click="onOpenEditData('edit', scope.row)">编辑</el-button>
						<el-button size="small" text type="info" @click="onDataDel(scope.row)" v-auth="'api:dataManage:delete'">删除</el-button>
						<el-button
							size="small"
							text
							type="info"
							:disabled="scope.row.isRegister == '1'"
							@click="openAuditDialog(scope.row)"
							v-auth="'api:dataManage:delete'"
							:class="scope.row.isRegister == '1' ? 'disabledColor' : ''"
							>数据登记</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" @pagination="getTableData" />
		</el-card>

		<RoleDialog ref="roleDialogRef" @refresh="getTableData()" />
		<AuthorizationDetail ref="AuthorizationDetailRef" />
		<el-dialog title="数据登记" ref="auditDialogRef" width="600px" v-model="dialogShow" @close="closeAuditDialog">
			<!-- <div class="flex mb10" style="align-items: center;">
				<svg data-v-274386bc="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" style="color:#5079D9;  height:30px; width: 50px">
					<path
						fill="currentColor"
						d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 192a58.432 58.432 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.432 58.432 0 0 0 512 256m0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4"
					></path>
				</svg>
				<div style=" font-size: 16px;font-weight: 600;">确定对当前数据进行资源登记吗？</div>
			</div> -->
			<el-form ref="indexDialogFormRef" :model="dialogForm" :rules="rules" size="large" label-position="left" label-width="120px">
				<el-row :gutter="35">
					<el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20" class="mb22">
						<el-form-item label="登记有效期" prop="lifeSpan" class="leftFormTip">
							<el-input v-model="dialogForm.lifeSpan" type="number" min="1" max="99" placeholder="请输入登记证书有效期" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" class="mb22" style="display: flex; align-items: center">年</el-col>
				</el-row>
				<div style="margin-top: 10px; line-height: 1.6; font-size: 14px; color: #b8b8b8">请进一步核实数据内容的真实性和唯一性</div>
			</el-form>
			<div class="dialog-footer pt20 pb20" style="display: flex; justify-content: center">
				<el-button type="primary" size="large" v-loading="auditLoading" @click="submitAudit">确定</el-button>

				<el-button size="large" @click="closeAuditDialog">取消</el-button>
			</div>
		</el-dialog>
		<el-dialog
			style="min-width: 650px"
			title="数据登记证书"
			width="650px"
			ref="auditDialogRef"
			v-model="dialogShowZhengShu"
			@close="closeZhengShuDialog"
		>
			<div
				v-loading="showZhengShuLoading"
				class="bgzs w100"
				style="align-items: center; min-height: 800px; height: 800px; padding-top: 270px; padding-left: 100px"
			>
				<div>
					<div class="align-center mb20">
						<span class="leftText">数据名称</span>
						<span class="rightText">{{ dialogZhengShuForm.data.dataName }}</span>
					</div>
					<div class="align-center mb20">
						<span class="leftText">所属单位</span>
						<span class="rightText">{{ dialogZhengShuForm.data.enterpriseName }}</span>
					</div>
					<div class="align-center mb20">
						<span class="leftText">数据所有者</span>
						<span class="rightText">{{ dialogZhengShuForm.data.userName }}</span>
					</div>
					<div class="align-center mb20">
						<span class="leftText">证书编号</span>
						<span class="rightText">{{ dialogZhengShuForm.data.id }}</span>
					</div>
					<div class="align-center mb20">
						<span class="leftText">存证交易哈希</span>
						<span class="rightText">{{ dialogZhengShuForm.data.blockHash }}</span>
					</div>
					<div class="align-center mb20">
						<span class="leftText">区块高度</span>
						<span class="rightText">{{ dialogZhengShuForm.data.blockHeight }}</span>
					</div>
					<div class="align-center mb20">
						<span class="leftText">数据Hash</span>
						<span class="rightText">{{ dialogZhengShuForm.data.dataHash }}</span>
					</div>
					<div class="align-center mb20">
						<span class="leftText">存证时间</span>
						<span class="rightText">{{ dialogZhengShuForm.data.createTime }}</span>
					</div>
					<div class="align-center mb20">
						<span class="leftText">有效期限</span>
						<span class="rightText">{{ dialogZhengShuForm.data.endTime }}</span>
					</div>
				</div>
				<div class="bottomTip">本证书内容来自“铁塔链-BCOS”的节点共识信息，有关原文内容可通过Hash进行校验。 特此证明。</div>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="dataManage">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs, markRaw, computed, onActivated } from 'vue';
import { ElMessageBox, ElMessage, FormRules } from 'element-plus';
import { Search, Warning } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '@/stores/userInfo';
import { getDataList, deleteData, deleteBatch, dataRegister, dataRegisterDetail } from '@/api/dataManage';
// import { DataListObjectType, SysRoleState } from '@/types/views';
import queryDetail from '@/assets/queryDetail.png';
// 引入组件
const RoleDialog = defineAsyncComponent(() => import('@/views/dataManage/dialog.vue'));
const AuthorizationDetail = defineAsyncComponent(() => import('@/views/dataManage/AuthorizationDetail-dialog.vue'));
// 定义变量内容
const roleDialogRef = ref();
const AuthorizationDetailRef = ref();
const router = useRouter();
const userInfos = useUserInfo();
// const { userInfos } = storeToRefs(stores);
const state = reactive<SysDataState>({
	name: '',
	pageSize: 10,
	pageNum: 1,
	total: 0,
	loading: false,
	tableData: [],
});
const indexDialogFormRef = ref();
const dialogForm = reactive({
	lifeSpan: '',
	dataId: '',
});
const dialogZhengShuForm = reactive({
	data: {
		id: '',
		enterpriseId: '',
		enterpriseName: '',
		dataId: '',
		dataName: '',
		userId: '',
		userName: '',
		expire: '',
		blockHeight: '',
		blockHash: '',
		endTime: '',
		createTime: '',
		dataHash: '',
	},
});
const dialogShow = ref(false);
const dialogShowZhengShu = ref(false);
const auditLoading = ref(false);
const showZhengShuLoading = ref(false);
const searchLoading = ref(false);
const inputSerch = ref('');
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
const range = (rule: any, value: any, callback: any) => {
	if (!/^[1-9]\d?$/.test(value)) {
		callback(new Error('只能是1-99'));
	} else {
		callback();
	}
};
const rules = reactive<FormRules>({
	lifeSpan: [
		{ required: true, message: '请输入登记证书有效期', trigger: 'blur' },
		{ required: true, validator: equalToEmpty, trigger: 'blur' },
		{ required: true, validator: dataName, trigger: 'blur' },
		{ required: true, validator: range, trigger: 'blur' },
		
	],
});

onActivated(() => {
	clearData();
	getTableData();
});
const isSystemAdmin = computed(() => {
	return userInfos.userInfos.roles.includes('systemAdmin');
});
const closeAuditDialog = () => {
	dialogShow.value = false;
	dialogForm.lifeSpan = '';
	dialogForm.dataId = '';
	indexDialogFormRef.value?.resetFields();
};

// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	searchLoading.value = true;
	getDataList({
		pageSize: state.pageSize,
		pageNum: state.pageNum,

		name: state.name,
	})
		.then((res: any) => {
			if (res.resultCode === 0) {
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
			searchLoading.value = false;
			state.loading = false;
		});
};

const searchList = () => {
	state.pageNum = 1;
	getTableData();
};
const submitAudit = () => {
	indexDialogFormRef.value?.validate((valid: any) => {
		if (valid) {
			auditLoading.value = true;
			dataRegister({ dataId: dialogForm.dataId, expire: dialogForm.lifeSpan })
				.then((res: any) => {
					if (res.resultCode === 0) {
						ElMessage.success('登记成功');
						getTableData();
					} else {
						ElMessage.error(res.resultDesc);
					}
				})
				.catch((err: any) => {
					ElMessage.error(...err);
				})
				.finally(() => {
					auditLoading.value = false;
					closeAuditDialog();
				});
		}
	});
};
// 重置
const clearForm = () => {
	state.name = '';
	state.pageSize = 10;
	state.pageNum = 1;
	getTableData();
};

const clearData = () => {
	state.name = '';
	state.pageSize = 10;
	state.pageNum = 1;
};

// 打开新增角色弹窗
const onOpenAddData = (type: string) => {
	roleDialogRef.value.openDialog(type);
};
// 打开修改数据弹窗
const onOpenEditData = (type: string, row: Object) => {
	roleDialogRef.value.openDialog(type, row);
};
const onOpenAuthorizationDetail = (type: string, row: Object) => {
	AuthorizationDetailRef.value.openDialog(type, row);
};
// 删除数据
const onDataDel = (row: any) => {
	ElMessageBox.confirm('删除后将无法恢复，请谨慎操作？', `您确定要删除节点'${row.nodeName}'的数据'${row.name}'吗？`, {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(() => {
		deleteData({ dataId: row.id })
			.then((res) => {
				if (res.resultCode === 0) {
					ElMessage.success('删除成功');
					getTableData();
				} else {
					ElMessage.error(res.resultDesc);
				}
			})
			.catch((err: any) => {
				ElMessage.error(...err);
			});
	});
};

const openAuditDialog = (row: any) => {
	dialogShow.value = true;
	dialogForm.dataId = row.id;
};

const selectData = ref(<any>[]);
const handleSelectionChange = (val: Array<any>) => {
	selectData.value = val;
};
const dataIdList = ref<DataIdObject[]>([]);
type DataIdObject = { dataId: string };
const onOpenDelete = () => {
	dataIdList.value = [];
	if (selectData.value.length > 0) {
		ElMessageBox.confirm('删除后将无法恢复，请谨慎操作？', '确定要删除选中的节点数据集吗？', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'error',
			buttonSize: 'default',
		}).then(() => {
			selectData.value.forEach((item: DataListObjectType) => {
				dataIdList.value.push({ dataId: item.id } as DataIdObject);
			});
			deleteBatch({ dataIdList: dataIdList.value }).then((res) => {
				if (res.resultCode === 0) {
					ElMessage.success('删除成功');
					getTableData();
				} else {
					ElMessage.error(res.resultDesc);
				}
			});
		});
	} else {
		ElMessage.warning('请选择要删除的数据');
	}
};

const handlerShowZhengShu = (row: any) => {
	dialogShowZhengShu.value = true;
	showZhengShuLoading.value = true;
	dataRegisterDetail({ dataId: row.id })
		.then((res: any) => {
			if (res.resultCode === 0) {
				dialogZhengShuForm.data = res.data;
			} else {
				ElMessage.error(res.resultDesc);
				closeZhengShuDialog();
			}
		})
		.catch((err: any) => {
			ElMessage.error(...err);
			closeZhengShuDialog();
		})
		.finally(() => {
			showZhengShuLoading.value = false;
		});
};
const closeZhengShuDialog = () => {
	dialogShowZhengShu.value = false;
	dialogZhengShuForm.data = {
		id: '',
		enterpriseId: '',
		enterpriseName: '',
		dataId: '',
		dataName: '',
		userId: '',
		userName: '',
		expire: '',
		blockHeight: '',
		blockHash: '',
		endTime: '',
		createTime: '',
		dataHash: '',
	};
};

const handleSearch = () => {
	searchList();
};
const toDetail = (id: string) => {
	router.push({
		path: '/dataManage/detail',
		query: {
			id: id,
		},
	});
};
</script>

<style scoped lang="scss">
.bgzs {
  background: url("@/assets/dataManage/zhengShu.png") no-repeat;
  background-size: 100% 100%;
}
.leftText {
  width: 100px;
  font-size: 14px;
  font-weight: 600;
}
.rightText {
  width: 350px;
  font-size: 14px;
  word-break: break-all;
}
.bottomTip {
  position: absolute;
  bottom: 75px;
  width: 450px;
  margin-top: 5px;
  color: rgb(184, 184, 184);
  font-size: 12px;
  line-height: 1.6;
  word-break: break-all;
}
.system-role-container {
  .system-role-padding {
    padding: 15px;
  }
  .size-img {
    width: 20px;
    height: 20px;
  }
}
.cursorPointer {
  cursor: pointer;
}
.cursorNo {
  pointer-events: none;
}
.align-center {
  display: flex;
  align-items: center;
}
.disabledColor {
  color: #c8c9cc !important;
}
</style>
