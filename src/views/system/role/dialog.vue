<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="roleDialogFormRef" :model="state.ruleForm" :rules="rules" size="large" label-width="90px" label-position="left">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="角色名称" prop="name">
							<el-input v-model="state.ruleForm.name" placeholder="请输入角色名称" maxlength="30" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="权限标识" prop="roleKey">
							<el-input v-model="state.ruleForm.roleKey" placeholder="请输入角色标识" maxlength="30" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="角色权限" prop="keys">
							<el-tree
								ref="menu"
								:data="state.menuData"
								:props="state.menuProps"
								show-checkbox
								node-key="id"
								check-strictly
								class="menu-data-tree"
								@check="nodeClick"
							/>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="角色状态" prop="status">
							<el-switch v-model="state.ruleForm.status" active-value="0" inactive-value="1" inline-prompt></el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="排序" prop="sort">
							<el-input-number
								v-model.number="state.ruleForm.sort"
								:min="1"
								:max="9999"
								step-strictly
								controls-position="right"
								placeholder="请输入排序"
								class="w100"
							/>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="角色描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入角色描述" maxlength="100"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="large" type="info" plain>取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="large">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemRoleDialog">
import { reactive, ref, nextTick, getCurrentInstance } from 'vue';
import { getMenuTree } from '@/api/menu';
import { setRole, updateRole } from '@/api/system/role';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { ElTree } from 'element-plus';
import { isArray } from 'lodash';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const roleDialogFormRef = ref<FormInstance>();
const menu = ref<InstanceType<typeof ElTree>>();
const state = reactive({
	ruleForm: {
		id: '',
		name: '', // 角色名称
		roleKey: '',
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

const checkKeys = (rule: any, value: any, callback: any) => {
	let keys = getMenuAllCheckedKeys();
	if (keys?.length == 0) {
		callback(new Error('请选择角色权限'));
	} else {
		callback();
	}
};

const rules = reactive<FormRules>({
	name: [
		{ required: true, message: '请输入角色名称', trigger: 'blur' },
		{ min: 1, max: 30, message: '长度在1-30之间', trigger: 'blur' },
	],
	roleKey: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],
	keys: [{ required: true, validator: checkKeys, trigger: 'change' }],
	status: [{ required: true, message: '请选择角色状态', trigger: 'change' }],
	sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
});
const formReset = () => {
	state.ruleForm = {
		id: '',
		name: '', // 角色名称
		roleKey: '', // 角色标识
		keys: [] as string[],
		sort: 1, // 排序
		status: 0, // 角色状态 0正常 1停用
		remark: '', // 角色描述
	};
	roleDialogFormRef.value?.resetFields();
};
// 打开弹窗
const openDialog = (type: string, row: RowRoleType) => {
	roleDialogFormRef.value?.clearValidate();
	state.dialog.type = type;
	if (type === 'edit') {
		state.ruleForm = JSON.parse(JSON.stringify(row));
		state.dialog.title = '编辑角色';
	} else {
		state.dialog.title = '新增角色';
		// 清空表单，此项需加表单验证才能使用
		nextTick(() => {
			formReset();
		});
	}
	state.dialog.isShowDialog = true;
	getMenuData();
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
	roleDialogFormRef.value?.validate((valid) => {
		if (valid) {
			if (state.dialog.type === 'add') {
				setRole({
					name: state.ruleForm.name,
					sort: state.ruleForm.sort,
					remark: state.ruleForm.remark,
					keys: getMenuAllCheckedKeys(),
					roleKey: state.ruleForm.roleKey,
					status: state.ruleForm.status,
				})
					.then((res) => {
						if (res.resultCode === 0) {
							closeDialog();
							ElMessage.success('新增成功');
							emit('refresh');
						} else {
							ElMessage.warning(res.resultDesc);
						}
					})
					.catch((err) => {
						console.log(err);
						closeDialog();
					});
			} else {
				updateRole({
					name: state.ruleForm.name,
					sort: state.ruleForm.sort,
					remark: state.ruleForm.remark,
					keys: getMenuAllCheckedKeys(),
					roleKey: state.ruleForm.roleKey,
					status: state.ruleForm.status,
					id: state.ruleForm.id,
				})
					.then((res) => {
						if (res.resultCode === 0) {
							closeDialog();
							ElMessage.success('编辑成功');
							emit('refresh');
						} else {
							ElMessage.warning(res.resultDesc);
						}
					})
					.catch((err) => {
						console.log(err);
						closeDialog();
					});
			}
		}
	});
};
// 获取菜单结构数据
const getMenuData = () => {
	state.menuData = [];
	getMenuTree({})
		.then((res) => {
			state.menuData = res.data;
			nextTick(() => {
				menu.value?.setCheckedKeys(state.ruleForm.keys);
			});
		})
		.catch((err) => {
			console.log(err);
		});
};
// 所有菜单节点数据
const getMenuAllCheckedKeys = () => {
	// 目前被选中的菜单节点
	let checkedKeys = menu.value?.getCheckedKeys();
	// 半选中的菜单节点
	let halfCheckedKeys = menu.value?.getHalfCheckedKeys();
	if (isArray(halfCheckedKeys)) {
		checkedKeys?.unshift.apply(checkedKeys, halfCheckedKeys);
	}
	return checkedKeys;
};

const nodeClick = (currentObj: any, treeStatus: any) => {
	// 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
	let selected = treeStatus.checkedKeys.indexOf(currentObj.id); // -1未选中,>=0为选中
	// 选中
	if (selected !== -1) {
		// 子节点只要被选中父节点就被选中(需要选中父节点时候调用此方法)
		selectedParent(currentObj);
		// 统一处理子节点为相同的勾选状态
		uniteChildSame(currentObj, true);
	} else {
		// 未选中 处理子节点全部未选中
		if (currentObj.children.length !== 0) {
			uniteChildSame(currentObj, false);
		}
	}
};

// 统一处理子节点为相同的勾选状态
const uniteChildSame = (treeList: any, isSelected: any) => {
	menu.value?.setChecked(treeList.id, isSelected, false);
	for (let i = 0; i < treeList.children.length; i++) {
		uniteChildSame(treeList.children[i], isSelected);
	}
};

// 统一处理父节点为选中
const selectedParent = (currentObj: any) => {
	let currentNode: any | undefined = menu.value?.getNode(currentObj);
	if (currentNode.parent.key !== undefined) {
		menu.value?.setChecked(currentNode.parent, true, false);
		selectedParent(currentNode.parent);
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
		padding: 5px;
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
	}
}
</style>
