<template>
	<div class="change-password-dialog-container">
		<el-dialog title="修改密码" v-model="state.dialog.isShowDialog" width="850px">
			<div class="mb25" v-if="state.dialog.type === 'userCenter'">使用手机号{{ state.dialog.phone }} 验证</div>
			<el-form ref="changePwdFormRef" :model="state.form" :rules="rules" label-position="left" label-width="120px" size="large">
				<!-- <el-form-item label="请输入验证码" prop="smsCode" v-if="state.dialog.type === 'userCenter'">
					<div class="change-password-smsCode">
						<el-input v-model="state.form.smsCode" class="smsCode-input" placeholder="请输入验证码" maxlength="6" autocomplete="off"></el-input>
						<el-button class="smsCode-btn" @click="getsmsCode" plain :disabled="!state.canUpClick">{{ state.text }}</el-button>
					</div>
				</el-form-item> -->
				<el-form-item label="请输入新密码" prop="newPassword">
					<el-input v-model="state.form.newPassword" placeholder="请输入新密码" type="password" autocomplete="new-password" clearable></el-input>
				</el-form-item>
				<el-form-item label="请确认新密码" prop="confirmPassword">
					<el-input v-model="state.form.confirmPassword" placeholder="请确认新密码" type="password" clearable></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" type="info" size="large" plain>取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="large">确定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script setup lang="ts" name="changePasswordDialog">
import { reactive, ref, getCurrentInstance } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { verifiyNumLetter } from '@/utils/toolsValidate';
import { changePassword } from '@/api/public';
import { changePasswordByUser, sendSmsCodeByUser } from '@/api/individualCenter';
const { proxy } = getCurrentInstance() as any;

const state = reactive({
	form: {
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
		// smsCode: '',
	},
	dialog: {
		isShowDialog: false,
		id: '' as unknown,
		phone: '',
		type: '', // 用户管理修改密码：userManage 个人中心修改密码：userCenter
	},
	text: '获取短信验证码',
	upTotalTime: 60,
	canUpClick: true,
	loading: false,
});

const changePwdFormRef = ref<FormInstance>();

const checkPwd = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('请输入密码'));
	} else if (!verifiyNumLetter(value)) {
		callback(new Error('请输入大小写字母和数字组成的8-20位字符'));
	} else {
		callback();
	}
};

const checkConfirmPassword = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('请确认密码'));
	} else if (value !== state.form.newPassword) {
		callback(new Error('确认密码不正确，请检查后重新输入'));
	} else {
		callback();
	}
};

const rules = reactive<FormRules>({
	newPassword: [{ validator: checkPwd, trigger: 'blur' }],
	confirmPassword: [{ validator: checkConfirmPassword, trigger: 'blur' }],
});

const openDialog = (id: number, type: string = 'userManage', phone: string) => {
	changePwdFormRef.value?.clearValidate();
	state.form = {
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
		// smsCode: '',
	};
	state.dialog.id = id ? id : '';
	state.dialog.type = type;
	state.dialog.phone = phone;
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

const lockSendButton = () => {
	state.canUpClick = false;
	state.text = state.upTotalTime + 's后重新发送';
	let in_clock = setInterval(() => {
		state.upTotalTime--;
		state.text = state.upTotalTime + 's后重新发送';
		if (state.upTotalTime < 0) {
			window.clearInterval(in_clock);
			state.text = '获取短信验证码';
			state.upTotalTime = 60;
			state.canUpClick = true;
		}
	}, 1000);
};

const getsmsCode = () => {
	sendSmsCodeByUser()
		.then((res) => {
			ElMessage.success(`已发送验证码至${state.dialog.phone}，请注意查收`);
			lockSendButton();
		})
		.catch((err) => {
			console.log(err);
		});
};

const setPwd = (pwd: string) => {
	let password = pwd;
	password = proxy.$md5(password);
	password = proxy.$md5(password + password.substr(0, 8));
	return password;
};

// 提交
const onSubmit = () => {
	changePwdFormRef.value?.validate((valid) => {
		if (valid) {
			state.loading = true;
			if (state.dialog.type === 'userCenter') {
				changePasswordByUser({
					newPassword: setPwd(state.form.newPassword),
					confirmPassword: setPwd(state.form.newPassword),
					// smsCode: state.form.smsCode,
				})
					.then((res) => {
						state.loading = false;
						if (res.resultCode === 0) {
							closeDialog();
							ElMessage.success('修改成功');
							window.location.reload();
						} else {
							ElMessage.warning(res.resultDesc);
						}
					})
					.catch((err) => {
						state.loading = false;
						console.log(err);
					});
			} else {
				changePassword({
					oldPassword: setPwd(state.form.oldPassword),
					newPassword: setPwd(state.form.newPassword),
					confirmPassword: setPwd(state.form.newPassword),
					userId: state.dialog.id,
					checkOld: '1',
				})
					.then((res) => {
						state.loading = false;
						if (res.resultCode === 0) {
							closeDialog();
							ElMessage.success('修改成功');
							window.location.reload();
						} else {
							ElMessage.warning(res.resultDesc);
						}
					})
					.catch((err) => {
						state.loading = false;
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
.change-password-smsCode {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;

	.smsCode-input {
		width: 60%;
	}
	.smsCode-btn {
		width: 36%;
	}
}
</style>
