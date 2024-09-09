<template>
	<div class="system-user-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="850px">
			<el-form
				ref="userDialogFormRef"
				:model="state.ruleForm"
				:rules="rules"
				size="large"
				label-width="90px"
				label-position="left"
				v-loading="state.loading"
			>
				<el-row>
					<el-col class="mb30">
						<el-form-item label="账号" prop="loginName">
							<el-input
								v-model="state.ruleForm.loginName"
								placeholder="请输入登录账号，5-20字符"
								minlength="5"
								maxlength="20"
								autocomplete="off"
								clearable
							></el-input>
						</el-form-item>
					</el-col>
					<el-col class="mb30" v-if="state.dialog.type === 'add'">
						<el-form-item label="密码" prop="password">
							<el-input
								v-model="state.ruleForm.password"
								placeholder="请输入登录密码，8-20字符，需包含大小写字母和数字的组合"
								type="password"
								autocomplete="new-password"
								clearable
							></el-input>
						</el-form-item>
					</el-col>

					<el-col class="mb30">
						<el-form-item label="手机号" prop="phone">
							<el-input v-model="state.ruleForm.phone" placeholder="请输入手机号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col class="mb30">
						<el-form-item label="用户状态" prop="status">
							<el-switch v-model="state.ruleForm.status" inline-prompt active-value="0" inactive-value="1"></el-switch>
						</el-form-item>
					</el-col>

					<el-col class="mb30">
						<el-form-item label="角色" prop="roles">
							<el-select placeholder="请选择角色" multiple v-model="state.ruleForm.roles" class="w100">
								<el-option v-for="item in state.roleList" :key="item.id" :label="item.name" :value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="用户描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入用户描述" maxlength="150"></el-input>
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

<script setup lang="ts" name="systemUserDialog">
import { reactive, ref, getCurrentInstance } from 'vue';
import { addUser, editUser, getUserDetail } from '@/api/system/user';
import { getList } from '@/api/system/role';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { verifiyNumLetter } from '@/utils/toolsValidate';
const { proxy } = getCurrentInstance() as any;

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const userDialogFormRef = ref<FormInstance>();
const state = reactive({
	ruleForm: {
		id: '',
		loginName: '',
		phone: '',
		password: '',
		status: '0',
		roles: [],
		remark: '',
	},
	roleList: [] as any,
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
	},
	loading: false,
});
const checkPwd = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('请输入密码'));
	} else if (!verifiyNumLetter(value)) {
		callback(new Error('请输入大小写字母和数字组成的8-20位字符'));
	} else {
		callback();
	}
};
const rules = reactive<FormRules>({
	loginName: [
		{ required: true, message: '请输入账号，5-20字符', trigger: 'blur' },
		{ pattern: /^[A-Za-z0-9]{1,}$/, message: '账户名称只能包含数字，英文字母' },
		{ min: 5, max: 20, message: '账号长度应在5-20之间', trigger: 'blur' },
	],
	password: [{ required: true, validator: checkPwd, trigger: 'blur' }],
	phone: [
		{ required: true, message: '请输入手机号', trigger: 'blur' },
		{ pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
	],
	status: [{ required: true, message: '请选择状态', trigger: 'change' }],
	roles: [{ required: true, message: '请选择角色', trigger: 'change' }],
});
const getRoleList = () => {
	getList({
		status: '0',
	})
		.then((res) => {
			state.roleList = res.data;
		})
		.catch((err) => {
			console.log(err);
		});
};

const formReset = () => {
	state.ruleForm = {
		id: '',
		loginName: '',
		phone: '',
		password: '',
		status: '0',
		roles: [],
		remark: '',
	};
};

// 打开弹窗
const openDialog = (type: string, id: string) => {
	userDialogFormRef.value?.clearValidate();
	formReset();
	state.dialog.type = type;
	getRoleList();
	if (type === 'edit') {
		state.loading = true;
		state.dialog.title = '编辑用户';
		getUserDetail({
			userId: id,
		})
			.then((res) => {
				state.loading = false;
				if (res.resultCode === 0) {
					state.ruleForm = res.data;
				} else {
					ElMessage.warning(res.resultDesc);
				}
			})
			.catch((err) => {
				state.loading = false;
				console.log(err);
			});
	} else {
		state.dialog.title = '新增用户';
		// 清空表单，此项需加表单验证才能使用
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
// 提交
const onSubmit = () => {
	userDialogFormRef.value?.validate((valid) => {
		if (valid) {
			if (state.dialog.type === 'add') {
				let pwd = state.ruleForm.password;
				pwd = proxy.$md5(pwd);
				pwd = proxy.$md5(pwd + pwd.substr(0, 8));
				addUser({
					loginName: state.ruleForm.loginName,
					phone: state.ruleForm.phone,
					password: pwd,
					status: state.ruleForm.status,
					roles: state.ruleForm.roles,
					remark: state.ruleForm.remark,
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
					});
			} else {
				editUser({
					loginName: state.ruleForm.loginName,
					phone: state.ruleForm.phone,
					status: state.ruleForm.status,
					roles: state.ruleForm.roles,
					remark: state.ruleForm.remark,
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
					});
			}
		}
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.Hidden {
	display: none;
}
</style>
