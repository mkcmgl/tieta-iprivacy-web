<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="700px" :close-on-click-modal="false">
			<el-form
				ref="roleDialogFormRef"
				v-loading="state.loading"
				:model="state.nodeForm"
				:rules="rules"
				size="large"
				label-position="left"
				label-width="120px"
			>
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
						<el-form-item label="注册人:" class="leftFormTip">
							<span>{{ nodesDetails.data.userName }}</span>
						</el-form-item>
						<el-form-item label="所属公司:" class="leftFormTip">
							<span>{{ nodesDetails.data.enterpriseName }}</span>
						</el-form-item>
						<el-form-item label="节点名称:" class="leftFormTip">
							<span>{{ nodesDetails.data.nodeName }}</span>
						</el-form-item>
						<el-form-item label="节点规格:" class="leftFormTip">
							<el-table class="isDisabled" border :data="tableDataList" style="width: 100%" ref="multipleTable">
								<el-table-column label="节点规格" show-overflow-tooltip>
									<template #default="scope">{{ tabelList[scope.row.specs].spes }}</template>
								</el-table-column>
								<el-table-column property="cpu" label="CPU" >
									<template #default="scope">{{ tabelList[scope.row.specs].cpu }}</template>
								</el-table-column>
								<el-table-column label="内存">
									<template #default="scope">{{ tabelList[scope.row.specs].memory }}</template>
								</el-table-column>
							</el-table>
						</el-form-item>
						<el-form-item label="注册时间:" class="leftFormTip">
							<span>{{ nodesDetails.data.registerTime }}</span>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
						<el-form-item label="审核意见" prop="auditStatus" class="leftFormTip danRadio">
							<el-radio-group v-model="state.nodeForm.auditStatus" class="ml-4" @change="handleChange">
								<el-radio value="1" size="large">同意</el-radio>
								<el-radio value="2" size="large">驳回</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22" v-if="state.nodeForm.auditStatus == '2'">
						<el-form-item label="驳回原因" prop="auditReason" class="leftFormTip danRadio">
							<el-input type="textarea" show-word-limit maxlength="200" v-model="state.nodeForm.auditReason" placeholder="请输入驳回原因"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22" v-if="state.nodeForm.auditStatus == '1'">
						<el-form-item label="选择节点" prop="nodeInfoId" class="leftFormTip danRadio">
							<el-select v-model="state.nodeForm.nodeInfoId" clearable placeholder="请选择节点" style="width: 100%">
								<el-option v-for="item in nodeList" :key="item.id" :label="item.nodeIp" :value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="large" type="info" plain>取 消</el-button>
					<el-button type="primary" @click="onSubmit" :loading="state.nodeForm.loading" size="large">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="addNodeServer">
import { reactive, ref, nextTick, getCurrentInstance, onMounted, onUpdated } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { ElTree, ElTable } from 'element-plus';
import { audit, snodeDetail } from '@/api/nodeManageServer';
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
// import { RowRoleType, TreeType } from '@/types/views';

const radio1 = ref('1');
const value1 = ref(true);
// 定义变量内容
const roleDialogFormRef = ref<FormInstance>();
const menu = ref<InstanceType<typeof ElTree>>();
const selectList = ref([]);
const tabelList = ref([{}, { spes: '标准配置', cpu: '8核', memory: '16GB' }, { spes: '高端配置', cpu: '16核', memory: '64GB' }]);
const multipleTable = ref<InstanceType<typeof ElTable>>();
const state = reactive({
	nodeForm: {
		nodeId: '',
		nodeInfoId: '',
		publicKey: '',
		auditStatus: '1',
		specs: '',
		activationStatus: true,
		nodeName: '',
		nodeDesc: '',
		nodeIp: '',
		nodePort: '',
		name: '', //
		roleKey: '', //
		keys: [] as string[],
		sort: 0, // 排序
		status: 0, //
		remark: '' as string | null, //
		fileId: '',
		onlineStatus: -1,
		loading: false,
		partyId: '',
		auditReason: '',
	},
	menuData: [] as TreeType[],
	menuProps: {
		children: 'children',
		label: 'name',
	},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
	},
	loading: false,
});

const equalToEmpty = (rule: any, value: any, callback: any) => {
	if (/^\s+$/gi.test(value)) {
		callback(new Error('不能全输入空格'));
	} else {
		callback();
	}
};

const dataName = (rule: any, value: any, callback: any) => {
	if (!/^(?=.*[a-zA-Z])(?=.*[\d_-])[a-zA-Z\d_-]{6,32}$/.test(value)) {
		callback(new Error('6-32个字符，只能由英文字母、数字及‘_’‘-’组成'));
	} else {
		callback();
	}
};
const mustNumber = (rule: any, value: any, callback: any) => {
	if (!/^(?:[1-9]\d{0,4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-3]\d|6553[0-5])$/.test(value)) {
		callback(new Error('请输入正确的端口号'));
	} else {
		callback();
	}
};
const isIp = (rule: any, value: any, callback: any) => {
	if (!/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value)) {
		callback(new Error('请输入正确的通讯地址'));
	} else {
		callback();
	}
};

const rules = reactive<FormRules>({
	auditStatus: [{ required: true, message: '请选择审核意见', trigger: 'change' }],
	auditReason: [
		{ required: true, message: '请输入驳回原因', trigger: 'blur' },
		{ required: true, validator: equalToEmpty, trigger: 'blur' },
	],
	nodeInfoId: [{ required: true, message: '请选择节点' }],
});
const formReset = () => {
	state.nodeForm = {
		nodeId: '',
		nodeInfoId: '',
		auditStatus: '1',
		specs: '',
		nodeName: '',
		publicKey: '',
		nodeDesc: '',
		nodeIp: '',
		nodePort: '',
		name: '', //
		roleKey: '',
		keys: [] as string[],
		sort: 1, // 排序
		status: 0, //
		remark: '', //
		fileId: '', //
		onlineStatus: -1,
		activationStatus: true,
		loading: false,
		partyId: '',
		auditReason: '',
	};

	roleDialogFormRef.value?.resetFields();
};

const tableDataList = ref([]);
const nodeList = ref([]);
const selectDataId = ref('1');
const nodesDetails = reactive({
	data: {
		userName: '',
		enterpriseName: '',
		nodeName: '',
		registerTime: '',
		nodeId: '',
		id: '',
	},
});
const getNodeDetail = (id: any) => {
	state.loading = true;
	snodeDetail({ id: id })
		.then((res) => {
			if (res.resultCode === 0) {
				nodesDetails.data = res.data;
				nodeList.value = [];
				tableDataList.value = [];
				nodeList.value = res.data.nodeInfoList;
				tableDataList.value.push(res.data);
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err: any) => {
			ElMessage.error(err);
		})
		.finally(() => (state.loading = false));
};

// 打开弹窗
const isEdit = ref(false);
const openDialog = (row: NodeState) => {
	roleDialogFormRef.value?.clearValidate();
	getNodeDetail(row.id);
	state.dialog.title = '节点申请审核';
	state.nodeForm.auditStatus = '1';
	state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
	nodesDetails.data = {
		userName: '',
		enterpriseName: '',
		nodeName: '',
		registerTime: '',
		nodeId: '',
		id: '',
	};
	formReset();
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};

const handleChange = (val: any) => {
	formReset();
	state.nodeForm.auditStatus = val;
};
// 提交
const onSubmit = () => {
	roleDialogFormRef.value?.validate((valid: any) => {
		if (valid) {
			state.nodeForm.loading = true;
			audit({
				nodeId: state.nodeForm.nodeId,
				auditStatus: state.nodeForm.auditStatus,
				id: nodesDetails.data.id,
				auditReason: state.nodeForm.auditReason,
				nodeInfoId: state.nodeForm.nodeInfoId,
			})
				.then((res: any) => {
					if (res.resultCode === 0) {
						closeDialog();
						ElMessage.success('处理成功');
						emit('refresh');
					} else {
						ElMessage.error(res.resultDesc);
					}
				})
				.catch((err: any) => {
					ElMessage.error(err);
				})
				.finally(() => (state.nodeForm.loading = false));
		}
	});
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
.leftFormTip {
	::v-deep(.el-form-item__label) {
		font-weight: bold;
	}
}
.isDisabled {
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
