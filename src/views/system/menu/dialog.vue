<template>
	<div class="system-menu-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="menuDialogFormRef" :model="state.ruleForm" :rules="rules" size="large" label-width="80px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="上级菜单" prop="parentId">
							<el-cascader
								:options="state.menuData"
								:props="{ emitPath: false, checkStrictly: true, value: 'id', label: 'name' }"
								placeholder="请选择上级菜单"
								clearable
								class="w100"
								v-model="state.ruleForm.parentId"
							>
								<template #default="{ node, data }">
									<span>{{ data.name }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="菜单类型" prop="menuType">
							<el-radio-group v-model="state.ruleForm.menuType">
								<el-radio label="M">目录</el-radio>
								<el-radio label="C">菜单</el-radio>
								<el-radio label="B">按钮</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="菜单名称" prop="name">
							<el-input v-model="state.ruleForm.name" placeholder="菜单名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<template v-if="state.ruleForm.menuType === 'C'">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="路由路径" prop="path">
								<el-input v-model="state.ruleForm.path" placeholder="路由中的 path 值" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="组件路径" prop="component">
								<el-input v-model="state.ruleForm.component" placeholder="组件路径" clearable></el-input>
							</el-form-item>
						</el-col>
					</template>
					<template v-if="state.ruleForm.menuType === 'M' || state.ruleForm.menuType === 'C'">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="菜单图标">
								<IconSelector placeholder="请输入菜单图标" v-model="state.ruleForm.icon" />
							</el-form-item>
						</el-col>
					</template>
					<template v-if="state.ruleForm.menuType === 'B'">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="权限标识" prop="perms">
								<el-input v-model="state.ruleForm.perms" placeholder="请输入权限标识" clearable></el-input>
							</el-form-item>
						</el-col>
					</template>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
						<el-form-item label="菜单排序" prop="orderNum">
							<el-input-number v-model="state.ruleForm.orderNum" controls-position="right" placeholder="请输入排序" class="w100" />
						</el-form-item>
					</el-col>
					<template v-if="state.ruleForm.menuType === 'M'">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="路径" prop="path">
								<el-input v-model="state.ruleForm.path" placeholder="请输入目录路径" clearable></el-input>
							</el-form-item>
						</el-col>
					</template>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" type="info" plain size="large">取 消</el-button>
					<el-button type="primary" @click="onSubmit(menuDialogFormRef)" size="large">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemMenuDialog">
import { defineAsyncComponent, reactive, onMounted, ref, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoutesList } from '@/stores/routesList';
import type { FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { menuTreeList, menuSave, menuUpdate } from '@/api/system/menu';
import { deepClone } from '@/utils/other';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 引入组件
const IconSelector = defineAsyncComponent(() => import('@/components/iconSelector/index.vue'));

// 定义变量内容
const menuDialogFormRef = ref();
const stores = useRoutesList();
const { routesList } = storeToRefs(stores);
const state = reactive({
	parentId: '',
	ruleForm: {
		id: '',
		menuType: 'M', // 菜单类型
		parentId: '', // 父级资源id
		name: '', // 路由名称
		component: '', // 组件路径
		orderNum: 0, // 菜单排序
		path: '', // 路由路径
		icon: '', // 菜单图标
		perms: '', // 权限标识
	},
	menuData: [] as RouteItems, // 上级菜单数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

const rules = reactive<FormRules>({
	// parentId: [{ required: true, message: '请选择上级菜单', trigger: 'change' }],
	menuType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
	name: [
		{ required: true, message: '请输入菜单名称', trigger: 'blur' },
		{ min: 1, max: 50, message: '长度在1到50', trigger: 'blur' },
	],
	path: [
		{ required: true, message: '请输入路由路径', trigger: 'blur' },
		{ min: 1, max: 200, message: '长度在1到200', trigger: 'blur' },
	],
	component: [
		{ required: true, message: '请输入组件路径', trigger: 'blur' },
		{ min: 1, max: 255, message: '长度在1到255', trigger: 'blur' },
	],
	perms: [
		{ required: true, message: '请输入权限标识', trigger: 'blur' },
		{ min: 1, max: 100, message: '长度在1到100', trigger: 'blur' },
	],
	orderNum: [{ required: true, message: '请输入菜单排序', trigger: 'blur' }],
});

const getMenuData = (data?: any) => {
	const arr: any = [];
	data.map((val?: any) => {
		arr.push({ ...val });
		if (val.children) getMenuData(val.children);
	});
	return arr;
};
const getDisabledMenuData = (data?: any) => {
	const arr: any = [];
	data.map((val?: any) => {
		if (val.id == state.parentId || val.parentId == state.parentId) {
			val.disabled = true;
		} else {
			val.disabled = false;
		}
		arr.push({ ...val });
		if (val.children) getDisabledMenuData(val.children);
	});
	return arr;
};
const getMenuList = () => {
	menuTreeList({})
		.then((res) => {
			if (res.resultCode == 0) {
				state.menuData = getMenuData(res.data);
			}
		})
		.catch((err) => {});
};

const formReset = () => {
	state.ruleForm.menuType = 'M'; // 菜单类型
	state.ruleForm.parentId = ''; // 父级资源id
	state.ruleForm.name = ''; // 路由名称
	state.ruleForm.component = ''; // 组件路径
	state.ruleForm.orderNum = 0; // 菜单排序
	state.ruleForm.path = ''; // 路由路径
	state.ruleForm.icon = ''; // 菜单图标
	state.ruleForm.perms = ''; // 权限标识
	menuDialogFormRef.value?.clearValidate();
};
// 打开弹窗
const openDialog = (type: string, row?: any) => {
	formReset();
	if (type === 'edit') {
		state.ruleForm = deepClone(row);
		state.parentId = state.ruleForm.id;
		state.dialog.title = '修改';
		getDisabledMenuData(state.menuData);
	} else {
		if (row) {
			state.ruleForm.parentId = row.id;
		}
		state.dialog.title = '新增';
	}
	state.dialog.type = type;
	state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
	// 清空表单，此项需加表单验证才能使用
	nextTick(() => {
		menuDialogFormRef.value.resetFields();
	});
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
const onSubmit = async (formEl?: any) => {
	if (!formEl) return;
	await formEl.validate((valid?: any, fields?: any) => {
		if (valid) {
			if (state.dialog.type === 'edit') {
				const params = {
					id: state.ruleForm.id,
					name: state.ruleForm.name,
					parentId: state.ruleForm.parentId ? state.ruleForm.parentId : 0,
					orderNum: state.ruleForm.orderNum,
					path: state.ruleForm.path,
					component: state.ruleForm.component,
					menuType: state.ruleForm.menuType,
					perms: state.ruleForm.perms,
					icon: state.ruleForm.icon,
				};
				menuUpdate(params)
					.then((res) => {
						if (res.resultCode == 0) {
							ElMessage.success('编辑成功');
							closeDialog(); // 关闭弹窗
							emit('refresh');
							getMenuList();
							// setBackEndControlRefreshRoutes() // 刷新菜单，未进行后端接口测试
						} else {
							ElMessage.warning(res.resultDesc);
						}
					})
					.catch((err) => {
						ElMessage.error('编辑失败');
					});
			} else {
				const params = {
					name: state.ruleForm.name,
					parentId: state.ruleForm.parentId ? state.ruleForm.parentId : 0,
					orderNum: state.ruleForm.orderNum,
					path: state.ruleForm.path,
					component: state.ruleForm.component,
					menuType: state.ruleForm.menuType,
					perms: state.ruleForm.perms,
					icon: state.ruleForm.icon,
				};
				menuSave(params)
					.then((res) => {
						if (res.resultCode == 0) {
							ElMessage.success('新增成功');
							closeDialog(); // 关闭弹窗
							emit('refresh');
							getMenuList();
						} else {
							ElMessage.warning(res.resultDesc);
						}
					})
					.catch((err) => {
						ElMessage.error('新增失败');
					});
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};
// 页面加载时
onMounted(() => {
	// state.menuData = getMenuData(routesList.value);
	getMenuList();
});

// 暴露变量
defineExpose({
	openDialog,
});
</script>
