<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="700px" :close-on-click-modal="false">
			<el-form ref="roleDialogFormRef" :model="state.nodeForm" :rules="rules" size="large" label-position="left" label-width="120px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
						<el-form-item label="用户类型" prop="userType" class="leftFormTip danRadio">
							<el-radio-group v-model="state.nodeForm.userType" class="ml-4" :disabled="isEdit && auditStatus != '2'" @change="handleChange">
								<el-radio value="1" size="large">铁塔内部用户</el-radio>
								<el-radio value="0" size="large">非铁塔用户</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>

					<div v-if="state.nodeForm.userType == '1'" style="width: 100%">
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
							<el-form-item label="节点名称" prop="nodeName" class="leftFormTip">
								<el-input
									:disabled="isEdit && auditStatus != '2'"
									v-model="state.nodeForm.nodeName"
									placeholder="请输入节点名称"
									clearable
								></el-input>
								<!-- <span style="margin-top: 5px; line-height: 1.6; font-size: 14px; color: #b8b8b8"> 6-32个字符，只能由英文字母、数字及!"'”组成 </span> -->
							</el-form-item>
							<el-form-item label="节点规格" prop="specs" class="leftFormTip">
								<el-table
									:class="{
										'eidtTable isDisabled': isEdit && auditStatus != '2',
									}"
									:data="tableDataList"
									v-loading="state.loading"
									style="width: 100%"
									ref="multipleTable"
									@selection-change="handleSelectionChange"
								>
									<el-table-column type="selection" width="55" :selectable="selectable">
										<!-- <template >
											<el-checkbox :disabled="isEdit"></el-checkbox>
										</template> -->
									</el-table-column>
									<el-table-column label="节点规格" width="160" show-overflow-tooltip>
										<template #default="scope">{{ scope.row.peizhi }}</template>
									</el-table-column>
									<el-table-column property="cpu" label="CPU" width="120" />
									<el-table-column label="内存">
										<template #default="scope">{{ scope.row.neicun }}</template>
									</el-table-column>
								</el-table>
								<span style="margin-top: 5px; line-height: 1.6; font-size: 14px; color: #b8b8b8"
									>注：对于数据量大/计算效率要求较高的可选择高端配置</span
								>
							</el-form-item>
						</el-col>
					</div>
					<div v-else style="width: 100%">
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
							<el-form-item label="节点名称" prop="nodeName" class="leftFormTip">
								<el-input
									:disabled="isEdit && auditStatus != '2'"
									v-model="state.nodeForm.nodeName"
									placeholder="请输入节点名称"
									clearable
								></el-input>
								<!-- <span style="margin-top: 5px; line-height: 1.6; font-size: 14px; color: #b8b8b8"> 6-32个字符，只能由英文字母、数字及!"'”组成 </span> -->
							</el-form-item>
							<el-form-item label="节点端口号" prop="nodePort" class="leftFormTip">
								<el-input v-model="state.nodeForm.nodePort" placeholder="请输入节点端口" clearable></el-input>
							</el-form-item>
							<el-form-item label="节点IP/域名" prop="nodeIp" class="leftFormTip">
								<el-input v-model="state.nodeForm.nodeIp" placeholder="请输入节点IP/域名" clearable></el-input>
							</el-form-item>

							<el-form-item label="节点ID" prop="partyId" class="leftFormTip">
								<el-input
									:disabled="isEdit && auditStatus != '2'"
									v-model="state.nodeForm.partyId"
									placeholder="请输入节点即party-id"
									clearable
								></el-input>
							</el-form-item>
						</el-col>
					</div>
					<!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
						<el-form-item label="节点状态" prop="activationStatus" class="leftFormTip">
							<el-switch style="--el-switch-on-color: #5079d9" active-value="1" inactive-value="0" v-model="state.nodeForm.activationStatus" />
						</el-form-item>
					</el-col> -->
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
						<el-form-item label="节点描述" class="leftFormTip">
							<el-input
								v-model="state.nodeForm.nodeDesc"
								type="textarea"
								placeholder="请输入节点描述"
								maxlength="200"
								show-word-limit
								clearable
							></el-input>
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

<script setup lang="ts" name="addNode">
import { reactive, ref, nextTick, getCurrentInstance, onMounted, onUpdated } from 'vue';
import { ElMessage, FormInstance, FormRules, ElMessageBox } from 'element-plus';
import { ElTree, ElTable } from 'element-plus';
import { addNode, nodeDetail, editNode, extList } from '@/api/nodeManage';
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
// import { RowRoleType, TreeType } from '@/types/views';

const radio1 = ref('1');
const value1 = ref(true);
// 定义变量内容
const roleDialogFormRef = ref<FormInstance>();
const menu = ref<InstanceType<typeof ElTree>>();
const selectList = ref([]);
const multipleTable = ref<InstanceType<typeof ElTable>>();
const auditStatus = ref('');
const eiditId=ref('')
const state = reactive({
	nodeForm: {
		nodeId: '',
		id: '',
		userType: '1',
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
	if (
		!/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value) &&
		!/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+(?:com|net|org|info|edu|gov|mil|biz|name|co|uk|jp|fr|de|au|us|ru|ch|it|nl|se|no|es|ca|br|cn|mx|hk|sg|hu|fi|pl|be|gr|ir|tr|nz|dk|pt|cz|at|sk|si|ie|za|kr|ro|ua|id|in|cl|il|tw|vn|ph|my|th|pk|co\.uk|co\.jp|com\.au|net\.au|org\.au)$/.test(
			value
		)
	) {
		callback(new Error('请输入正确的节点IP/域名'));
	} else {
		callback();
	}
};

const rules = reactive<FormRules>({
	nodeName: [
		{ required: true, message: '请输入节点名称', trigger: 'blur' },
		{ required: true, validator: equalToEmpty, trigger: 'blur' },
		{ min: 6, max: 32, message: '6-32字符', trigger: 'blur' },
		// { required: true, validator: dataName, trigger: 'blur' },
	],
	nodeIp: [
		{ required: true, message: '请输入节点IP/域名', trigger: 'blur' },
		{ required: true, validator: equalToEmpty, trigger: 'blur' },
		{ min: 1, max: 255, message: '长度在1-255之间', trigger: 'blur' },
		{ required: true, validator: isIp, trigger: 'blur' },
	],

	nodePort: [
		{ required: true, message: '请输入节点端口号', trigger: 'blur' },
		{ required: true, validator: equalToEmpty, trigger: 'blur' },
		{ required: true, validator: mustNumber, trigger: 'blur' },
		{ min: 1, max: 20, message: '长度在1-20之间', trigger: 'blur' },
	],
	partyId: [
		{ required: true, message: '请输入节点即party-id', trigger: 'blur' },
		{ required: true, validator: equalToEmpty, trigger: 'blur' },
		{ min: 1, max: 20, message: '长度在1-20之间', trigger: 'blur' },
	],
	activationStatus: [{ required: true, message: '请选择节点状态', trigger: 'change' }],
	onlineStatus: [{ required: true, message: '请选择节点状态', trigger: 'change' }],
	userType: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
	specs: [{ required: true, message: '请选择节点规格', trigger: 'blur' }],
});
const formReset = () => {
	state.nodeForm = {
		nodeId: '',
		id: '',
		userType: '1',
		specs: '',
		nodeName: '',
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
	};
	roleDialogFormRef.value?.resetFields();
};
const selectable = () => {
	return !isEdit.value || auditStatus.value == '2';
};
const tableDataList = ref([]);
const selectDataId = ref('1');
const getExtList = () => {
	state.loading = true;
	tableDataList.value = [];
	extList({ mainId: 1, pageNum: 1, pageSize: 1000 })
		.then((res) => {
			if (res.resultCode === 0) {
				res.data.data.forEach((item: any) => {
					tableDataList.value.push({ ...JSON.parse(item.dictValue), id: item.id });
				});
				if (state.dialog.type === 'edit') {
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
			state.loading = false;
		});
};

const getNodeDetail = (nodeId: any, id: any) => {
	state.loading = true;
	nodeDetail({ nodeId: id, id: id })
		.then((res) => {
			if (res.resultCode === 0) {
				state.nodeForm = res.data;
				eiditId.value=res.data.id;
				state.nodeForm.partyId = res.data.nodeId;
				selectDataId.value = res.data.specs;
				getExtList();
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err: any) => {
			ElMessage.error(...err);
		});
};
const selectListData = () => {
	const selectData = tableDataList.value?.find((item: any) => item.id == selectDataId.value);
	multipleTable.value?.toggleRowSelection(selectData, true);
};
// 打开弹窗
const isEdit = ref(false);
const openDialog = (type: string, row: NodeState) => {
	roleDialogFormRef.value?.clearValidate();
	state.dialog.type = type;
	if (type === 'edit') {
		isEdit.value = true;
		auditStatus.value = row.auditStatus;

		getNodeDetail(row.nodeId, row.id);
		state.dialog.title = '编辑节点';
	} else {
		getExtList();
		isEdit.value = false;
		state.dialog.title = '添加节点';
		// 清空表单，此项需加表单验证才能使用
		nextTick(() => {
			formReset();
		});
	}
	state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};

const handleSelectionChange = (val: any) => {
	if (val.length > 1) {
		multipleTable.value?.clearSelection();
		multipleTable.value?.toggleRowSelection(val[val.length - 1], true);
		selectList.value = [val[val.length - 1]];
	} else {
		selectList.value = val;
	}
	nextTick().then(() => {
		state.nodeForm.specs = selectList.value[0]?.id;
	});
};

const handleChange = (val: any) => {
	formReset();
	state.nodeForm.userType = val;
};
// 提交
const onSubmit = () => {
	roleDialogFormRef.value?.validate((valid: any) => {
		if (valid) {
			state.nodeForm.loading = true;
			if (state.dialog.type === 'add') {
				addNode({
					nodeName: state.nodeForm.nodeName,
					nodeIp: state.nodeForm.nodeIp || 0,
					nodePort: state.nodeForm.nodePort || 0,
					nodeDesc: state.nodeForm.nodeDesc,
					userType: state.nodeForm.userType,
					specs: state.nodeForm.specs + '',
					activationStatus: '1',
					nodeId: state.nodeForm.partyId,
				})
					.then((res: any) => {
						if (res.resultCode === 0) {
							closeDialog();
							if (state.nodeForm.userType == '1') {
								ElMessageBox.confirm('节点审核通过后方可使用，审核时间1-3日', '节点注册完成，请耐心等待审核', {
									confirmButtonText: '确认',
									cancelButtonText: '取消',
									type: 'success',
									buttonSize: 'large',
								})
									.then(() => {
										emit('refresh');
									})
									.catch(() => {
										emit('refresh');
									});
							} else {
								ElMessage.success('新增成功');
								emit('refresh');
							}
						} else {
							ElMessage.error(res.resultDesc);
						}
					})
					.catch((err: any) => {
						ElMessage.error(err);
						// closeDialog();
					})
					.finally(() => (state.nodeForm.loading = false));
			} else {
				editNode({
					nodeId: state.nodeForm.partyId,
					nodeName: state.nodeForm.nodeName,
					nodeIp: state.nodeForm.nodeIp,
					nodePort: state.nodeForm.nodePort,
					nodeDesc: state.nodeForm.nodeDesc,
					userType: state.nodeForm.userType,
					specs: state.nodeForm.specs + '',
					activationStatus: '1',
					id: eiditId.value,
				})
					.then((res: any) => {
						if (res.resultCode === 0) {
							closeDialog();
							ElMessage.success('编辑成功');
							emit('refresh');
						} else {
							ElMessage.error(res.resultDesc);
						}
					})
					.catch((err: any) => {
						ElMessage.error(err);
						closeDialog();
					})
					.finally(() => (state.nodeForm.loading = false));
			}
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
.eidtTable {
	::v-deep(.el-table-column--selection > .cell) {
		cursor: not-allowed;
		pointer-events: none;
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
