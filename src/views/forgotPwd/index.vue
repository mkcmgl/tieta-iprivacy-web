<template>
	<div class="forgot-page">
		<div class="forgot-container">
			<div class="forgot-caption mb50">
				<img :src="logoMini" />
				<span class="ml19">链原生隐私计算平台</span>
			</div>
			<el-card>
				<template #header>
					<div class="forgot-header">
						<el-button type="text" class="forgot-back" @click="goLogin">
							<el-icon class="el-input__icon"><ele-Back /></el-icon>
							<div class="ml5">返回去登录</div>
						</el-button>
						<div class="forgot-title">忘记密码</div>
					</div>
				</template>
				<div class="forgot-form-container">
					<div class="forgot-form w100">
						<el-form
							:model="state.forgotForm"
							ref="forgotFormRef"
							:rules="rules"
							label-width="80px"
							label-position="top"
							:inline="false"
							size="large"
						>
							<div>
								<el-form-item prop="phone">
									<el-input v-model="state.forgotForm.phone" placeholder="请输入手机号" autocomplete="off"></el-input>
								</el-form-item>
								<!-- <el-form-item prop="smsCode">
									<div class="forgot-smsCode">
										<el-input v-model="state.forgotForm.smsCode" class="smsCode-input" placeholder="请输入验证码" maxlength="6"></el-input>
										<el-button type="primary" class="smsCode-btn" @click="getsmsCode" plain :disabled="!state.canUpClick">{{ state.text }}</el-button>
									</div>
								</el-form-item> -->
								<el-form-item prop="password">
									<el-input
										v-model="state.forgotForm.password"
										placeholder="请输入新密码"
										type="password"
										autocomplete="new-password"
										clearable
									></el-input>
								</el-form-item>
								<el-form-item prop="rePassword">
									<el-input
										v-model="state.forgotForm.rePassword"
										placeholder="请确认新密码"
										type="password"
										autocomplete="new-password"
										clearable
									></el-input>
								</el-form-item>

								<el-form-item>
									<el-button type="primary" @click="submit" :loading="loading" class="w100">确认</el-button>
								</el-form-item>
							</div>
						</el-form>
					</div>
				</div>
			</el-card>
		</div>
	</div>
</template>
<script setup lang="ts" name="forgotPwdIndex">
import { reactive, ref, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { verifiyNumLetter } from '@/utils/toolsValidate';
import { sendSmsCodeByPhone } from '@/api/public/index';
import { ElMessage } from 'element-plus';
import logoMini from '@/assets/login/ct-logo.png';
import { forgetPassword } from '@/api/public';

const forgotFormRef = ref<FormInstance>();

const { proxy } = getCurrentInstance() as any;

const state = reactive({
	forgotForm: {
		password: '',
		rePassword: '',
		phone: '',
		// smsCode: '',
	},
	text: '获取短信验证码',
	upTotalTime: 60,
	canUpClick: true,
});
const loading = ref(false);
const checkPwd = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('请输入密码'));
	} else if (!verifiyNumLetter(value)) {
		callback(new Error('请输入大小写字母和数字组成的8-20位字符'));
	} else {
		callback();
	}
};
const checkRePwd = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('请确认密码'));
	} else if (value !== state.forgotForm.password) {
		callback(new Error('两次输入密码不同'));
	} else {
		callback();
	}
};
const rules = reactive<FormRules>({
	password: [{ validator: checkPwd, trigger: 'blur' }],
	rePassword: [{ validator: checkRePwd, trigger: 'change' }],
	phone: [
		{ required: true, message: '请输入手机号', trigger: 'blur' },
		{ pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
	],
	smsCode: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }],
});

const router = useRouter();

const goLogin = () => {
	router.replace('/login');
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
	let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
	if (!reg.test(state.forgotForm.phone)) {
		ElMessage.warning('请输入正确的手机号');
		return false;
	}
	sendSmsCodeByPhone({
		phone: state.forgotForm.phone,
	})
		.then((res) => {
			if (res.resultCode === 0) {
				lockSendButton();
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

const submit = () => {
	forgotFormRef.value?.validate((valid) => {
		if (valid) {
			let pwd = state.forgotForm.password;
			pwd = proxy.$md5(pwd);
			pwd = proxy.$md5(pwd + pwd.substr(0, 8));
			forgetPassword({
				phone: state.forgotForm.phone,
				newPassword: pwd,
				// smsCode: state.forgotForm.smsCode,
			})
				.then((res) => {
					if (res.resultCode === 0) {
						ElMessage.success('修改成功');
					} else {
						ElMessage.warning(res.resultDesc);
					}
				})
				.catch((err) => {
					console.error(err);
				});
		}
	});
};
</script>
<style scoped lang="scss">
.forgot-page {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	min-height: 450px;
	background: url('@/assets/register/register-bg.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	color: #333333;

	.forgot-container {
		min-width: 30%;
		min-height: 30%;
		margin: 0 auto;

		.forgot-caption {
			display: flex;
			justify-content: center;
			align-items: baseline;

			span {
				font-size: 30px;
			}
		}

		.forgot-header {
			position: relative;
			padding: 22px 0px;

			.forgot-back {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				width: 110px;
				color: #da202c;
				font-size: 16px;
				cursor: pointer;
			}

			.forgot-title {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				color: #333333;
				font-size: 20px;
			}
		}

		.forgot-form-container {
			display: flex;
			justify-content: center;
			align-items: center;

			.forgot-form {
				:deep(.el-button--default) {
					width: 100%;
				}

				.forgot-smsCode {
					display: flex;
					justify-content: space-between;
					align-items: center;
					width: 100%;

					.smsCode-input {
						width: 60%;
					}
					.smsCode-btn {
						width: 35%;
					}
				}

				.center {
					width: 100%;
					text-align: center;
				}
			}

			.forgot-form-title {
				color: #666666;
				font-size: 20px;
				margin-bottom: 30px;
			}
		}
	}
}
</style>
