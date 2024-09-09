<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="700px" :close-on-click-modal="false">
			<el-form ref="roleDialogFormRef" :model="state.nodeForm" :rules="rules" size="large" label-position="left" label-width="120px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
						<el-form-item label="证书名称" prop="name" class="leftFormTip">
							<el-input :disabled="isEdit" v-model="state.nodeForm.name" placeholder="请输入证书名称" clearable></el-input>
							<!-- <span style="margin-top: 5px; line-height: 1.6; font-size: 14px; color: #b8b8b8"> 6-32个字符，只能由英文字母、数字及!"'”组成 </span> -->
						</el-form-item>
						<el-form-item label="组织名称" prop="enterpriseName" class="leftFormTip">
							<el-input v-model="state.nodeForm.enterpriseName" placeholder="请输入组织名称" clearable></el-input>
						</el-form-item>
						<!-- <el-form-item label="密钥算法" prop="nodeIp" class="leftFormTip">
							<el-select v-model="state.nodeForm.nodeIp" clearable placeholder="请选择密钥算法">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item> -->
						<el-form-item label="证书有效期" prop="expire" class="leftFormTip">
							<el-input-number
								style="width: 50%"
								v-model="state.nodeForm.expire"
								placeholder="请输入证书有效期"
								:min="1"
								:max="99"
								@change="handleChangeNum"
							/>
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

<script setup lang="ts" name="addCertificates">
import { reactive, ref, nextTick, getCurrentInstance, onMounted, onUpdated } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { ElTree, ElTable } from 'element-plus';
// import { addNode, nodeDetail, editNode, extList } from '@/api/nodeManage';
import { addCertList } from '@/api/certificatesManage';

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
const state = reactive({
	nodeForm: {
		name: '',
		enterpriseName: '',
		expire: 0,
		loading: false,
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
const value = ref('');
const options = [
	{
		value: 'Option1',
		label: 'Option1',
	},
	{
		value: 'Option2',
		label: 'Option2',
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
	if (!/^(?=.*[a-zA-Z])(?=.*[\d_-])[a-zA-Z\d_-]{6,32}$/.test(value)) {
		callback(new Error('6-32个字符，只能由英文字母、数字及‘_’‘-’组成'));
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
const zhNumABC = (rule: any, value: any, callback: any) => {
	if (!/^[\u4e00-\u9fa5A-Za-z0-9]{1,20}$/.test(value)) {
		callback(new Error('限中文、数字或大小写字母，不超过20个字符'));
	} else {
		callback();
	}
};

const rules = reactive<FormRules>({
	name: [
		{ required: true, message: '请输入证书名称', trigger: 'blur' },
		{ required: true, validator: equalToEmpty, trigger: 'blur' },
		{ min: 6, max: 32, message: '6-32字符', trigger: 'blur' },
		// { required: true, validator: dataName, trigger: 'blur' },
	],
	nodeIp: [
		{ required: true, message: '请选择密钥算法', trigger: 'change' },
		{ required: true, validator: equalToEmpty, trigger: 'change' },
	],

	enterpriseName: [
		{ required: true, message: '请输入组织名称', trigger: 'blur' },
		{ required: true, validator: equalToEmpty, trigger: 'blur' },
		{ required: true, validator: zhNumABC, trigger: 'blur' },
	],
	expire: [
		{ required: true, message: '请输入证书有效期', trigger: 'blur' },
	],
	
});
const formReset = () => {
	state.nodeForm = {
		name: '',
		enterpriseName: '',
		expire: 0,
		loading: false,
	};
	roleDialogFormRef.value?.resetFields();
};
const selectable = () => {
	return !isEdit.value;
};
const tableDataList = ref([]);
const selectDataId = ref('1');

const selectListData = () => {
	const selectData = tableDataList.value?.find((item: any) => item.id == selectDataId.value);
	multipleTable.value?.toggleRowSelection(selectData, true);
};
const handleChangeNum = (value: number) => {
	console.log(value);
};
// 打开弹窗
const isEdit = ref(false);
const openDialog = (type: string, row: NodeState) => {
	roleDialogFormRef.value?.clearValidate();
	state.dialog.type = type;
	isEdit.value = false;
	state.dialog.title = '新增证书';
	// 清空表单，此项需加表单验证才能使用
	nextTick(() => {
		formReset();
	});
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


// 提交
const onSubmit = () => {
	roleDialogFormRef.value?.validate((valid: any) => {
		if (valid) {
			console.log(`output->test`);
			state.nodeForm.loading = true;
			addCertList({
				name: state.nodeForm.name,
				enterpriseName: state.nodeForm.enterpriseName,
				expire: state.nodeForm.expire,
			})
				.then((res: any) => {
					if (res.resultCode == 0) {
						closeDialog();
						ElMessage.success('新增成功');
						emit('refresh');
					} else {
						ElMessage.error(res.resultDesc);
					}
				})
				.catch((err: any) => {
					ElMessage.error(err);
					// closeDialog();
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
