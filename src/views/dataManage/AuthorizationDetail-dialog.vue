<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" style="height: 600px">
			<el-table v-loading="loading" :data="state.tableData" border style="width: 100%; height: 500px; overflow: auto">
				<el-table-column prop="index" label="序号" align="center" fixed width="80">
					<template #default="scope">
						<span>{{ scope.$index + 1 }}</span>
					</template>
				</el-table-column>
				<el-table-column
					:prop="state.dialog.type === 'auth' ? 'projectName' : 'recordName'"
					:label="state.dialog.type === 'auth' ? '项目名称' : '任务名称'"
					width="180"
					show-overflow-tooltip
				/>
				<el-table-column
					:prop="state.dialog.type === 'auth' ? 'organizeName' : 'taskName'"
					:label="state.dialog.type === 'auth' ? '发起机构' : '任务实例名称'"
					show-overflow-tooltip
				/>
				<el-table-column prop="createTime" :label="state.dialog.type === 'auth' ? '授权时间' : '使用时间'" width="180" show-overflow-tooltip />
			</el-table>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="dataManageAuthDialog">
import { reactive, ref, nextTick, getCurrentInstance } from 'vue';
import { getMenuTree } from '@/api/menu';
import { setRole, updateRole } from '@/api/system/role';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { ElTree } from 'element-plus';
import type Node from 'element-plus/es/components/tree/src/model/node';
import { isArray } from 'lodash';
import { deepClone } from '@/utils/other';

const { proxy } = getCurrentInstance() as any;
// import {RowRoleType, TreeType, UseData, ManData} from '@/types/views';
import { getManData, getUseData } from '@/api/dataManage';
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const roleDialogFormRef = ref<FormInstance>();
const menu = ref<InstanceType<typeof ElTree>>();
const state = reactive({
	id: '',
	tableData: [],
	ruleForm: {
		id: '',
		name: '', // 角色名称
		roleKey: '', // 角色标识
		keys: [] as string[],
		sort: 0, // 排序
		status: 0, // 角色状态 0正常 1停用
		remark: '' as string | null, // 角色描述
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
});
const loading = ref(false);
const tableData = ref([]);
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
	{
		value: 'Option3',
		label: 'Option3',
	},
	{
		value: 'Option4',
		label: 'Option4',
	},
	{
		value: 'Option5',
		label: 'Option5',
	},
];
const rules = reactive<FormRules>({
	name: [
		{ required: true, message: '请输入角色名称', trigger: 'blur' },
		{ min: 1, max: 30, message: '长度在1-30之间', trigger: 'blur' },
	],
	roleKey: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],
	status: [{ required: true, message: '请选择角色状态', trigger: 'change' }],
	sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
});
const formReset = () => {
	state.ruleForm = {
		id: '',
		name: '', //
		roleKey: '', //
		keys: [] as string[],
		sort: 1, // 排序
		status: 0, //
		remark: '', //
	};
	roleDialogFormRef.value?.resetFields();
};
// 打开弹窗
const openDialog = (type: string, row: RowRoleType) => {
	state.id = row.id;
	roleDialogFormRef.value?.clearValidate();
	state.dialog.type = type;
	if (type === 'auth') {
		state.ruleForm = JSON.parse(JSON.stringify(row));
		state.dialog.title = '授权详情';
		getManDatas();
	} else if (type === 'use') {
		state.dialog.title = '使用详情';
		state.ruleForm = JSON.parse(JSON.stringify(row));
		// 清空表单，此项需加表单验证才能使用
		getUseDatas();
	}
	state.dialog.isShowDialog = true;
};
const getManDatas = () => {
	loading.value = true;
	getManData({
		dataId: state.id,
	})
		.then((res: any) => {
			if (res.resultCode === 0) {
				state.tableData = [];
				state.tableData = res.data;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err: any) => {
			ElMessage.error(err);
		})
		.finally(() => {
			loading.value = false;
		});
};
const getUseDatas = () => {
	loading.value = true;
	getUseData({ dataId: state.id })
		.then((res: any) => {
			if (res.resultCode === 0) {
				state.tableData = [];
				state.tableData = res.data;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err: any) => {
			ElMessage.error(err);
		})
		.finally(() => {
			loading.value = false;
		});
};
// 关闭弹窗
const closeDialog = () => {
	state.tableData = [];
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
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
    padding: 5px;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  }
}

.dataKey {
  display: flex;
  justify-content: end;
  width: 100%;

  a {
    color: #2d8cf0;
  }
}
</style>
