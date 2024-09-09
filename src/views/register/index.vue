<template>
	<div class="register-page">
		<div class="register-container">
			<div class="register-title mb50">
				<img :src="logoMini" />
				<span class="ml19">链原生隐私计算平台</span>
			</div>
			<div class="register-form-container">
				<div class="register-left"></div>
				<div class="register-form">
					<div class="register-form-title mb30">您好！欢迎注册</div>
					<div class="register-form-btngroup mb20">
						<el-text type="primary">账号注册</el-text>
						<div>
							<el-text>已有账号，</el-text>
							<el-link type="primary" :underline="false" @click="goLogin">去登录></el-link>
						</div>
					</div>
					<el-form :model="state.registerForm" size="large" ref="registerRef" :rules="rules" label-width="0px" label-position="left">
						<el-form-item prop="loginName">
							<el-input v-model="state.registerForm.loginName" maxlength="20" placeholder="请输入账号，5-20字符" autocomplete="off">
								<template #prefix>
									<el-icon class="el-input__icon"><ele-User /></el-icon>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="password">
							<el-input
								v-model="state.registerForm.password"
								type="password"
								maxlength="20"
								placeholder="请输入登录密码，8-20字符，需包含大小写字母和数字的组合"
								autocomplete="new-password"
							>
								<template #prefix>
									<el-icon class="el-input__icon"><ele-Unlock /></el-icon>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="rePassword">
							<el-input v-model="state.registerForm.rePassword" type="password" maxlength="20" placeholder="请确认登录密码">
								<template #prefix>
									<el-icon class="el-input__icon"><ele-Unlock /></el-icon>
								</template>
							</el-input>
						</el-form-item>

						<el-form-item prop="phone">
							<el-input v-model="state.registerForm.phone" maxlength="11" placeholder="请确认手机号">
								<template #prefix>
									<el-icon class="el-input__icon"><ele-Iphone /></el-icon>
								</template>
							</el-input>
						</el-form-item>
						<!-- 图形验证码 -->
						<el-form-item prop="captcha">
							<div class="captcha-container">
								<el-input v-model="state.registerForm.captcha" maxlength="45" class="captcha-form" placeholder="请输入验证码">
									<template #prefix>
										<SvgIcon name="iconfont icon-anquan1" />
									</template>
								</el-input>
								<img :src="state.captchaCode" alt="图形验证码" @click="getCaptcha" class="captcha-img" />
							</div>
						</el-form-item>
						<!-- 短信验证码 -->
						<!-- <el-form-item prop="smsCode">
							<div class="register-smsCode">
								<el-input v-model="state.registerForm.smsCode" class="smsCode-input" maxlength="6" placeholder="请输入短信验证码">
									<template #prefix>
										<el-icon class="el-input__icon"><ele-ChatDotRound /></el-icon>
									</template>
								</el-input>
								<el-button class="smsCode-btn" type="primary" plain @click="getsmsCode" :disabled="!state.canUpClick">{{ state.text }}</el-button>
							</div>
						</el-form-item> -->
					</el-form>
					<!-- <div class="pt20">点击"注册"按钮，即代表您已阅读并同意《》和《》</div> -->
					<el-button size="large" type="primary" class="mt20 w100" @click="setRegister">注册</el-button>
				</div>
			</div>
			<!-- <div class="mt50" style="text-align: center">服务协议</div> -->
		</div>
	</div>
</template>
<script setup lang="ts" name="registerIndex">
import { reactive, ref, getCurrentInstance } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { sendSmsCode } from '@/api/public/index';
import { register } from '@/api/register/index';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { verifiyNumLetter } from '@/utils/toolsValidate';
import logoMini from '@/assets/login/ct-logo.png';
import { getCaptchaImage } from '@/api/login';

const { proxy } = getCurrentInstance() as any;

const state = reactive({
	registerForm: {
		loginName: '',
		phone: '',
		// smsCode: '',
		email: '',
		password: '',
		rePassword: '',
		captcha: '',
	},
	text: '获取验证码',
	upTotalTime: 60,
	canUpClick: true,
	captchaCode: '',
	uuid: '',
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
const checkRePwd = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('请确认密码'));
	} else if (value !== state.registerForm.password) {
		callback(new Error('两次输入密码不同'));
	} else {
		callback();
	}
};
const registerRef = ref<FormInstance>();
const rules = reactive<FormRules>({
	loginName: [
		{ required: true, message: '请输入账号，5-20字符', trigger: 'blur' },
		{ pattern: /^[A-Za-z0-9]{1,}$/, message: '账户名称只能包含数字，英文字母' },
		{ min: 5, max: 20, message: '账号长度应在5-20之间', trigger: 'blur' },
	],
	phone: [
		{ required: true, message: '请输入手机号', trigger: 'blur' },
		{ pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
	],
	smsCode: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }],
	password: [{ required: true, validator: checkPwd, trigger: 'blur' }],
	rePassword: [{ required: true, validator: checkRePwd, trigger: 'change' }],
});
const route = useRoute();
const router = useRouter();

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
	if (!reg.test(state.registerForm.phone)) {
		ElMessage.warning('请输入正确的手机号');
		return false;
	}
	if (!state.registerForm.captcha) {
		ElMessage.warning('请输入验证码');
		return false;
	}
	sendSmsCode({
		uuid: state.uuid,
		phone: state.registerForm.phone,
		captcha: state.registerForm.captcha,
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

const setRegister = () => {
	registerRef.value?.validate((valid) => {
		if (valid) {
			let pwd = state.registerForm.password;
			pwd = proxy.$md5(pwd);
			pwd = proxy.$md5(pwd + pwd.substr(0, 8));
			register({
				loginName: state.registerForm.loginName,
				phone: state.registerForm.phone,
				// smsCode: state.registerForm.smsCode,
				password: pwd,
				confirmPassword: pwd,
			})
				.then((res) => {
					if (res.resultCode === 0) {
						ElMessage.success('注册成功');
						goLogin();
					} else {
						ElMessage.warning(res.resultDesc);
					}
				})
				.catch((err) => console.log(err));
		}
	});
};

const goLogin = () => {
	router.replace('/login');
};

const getCaptcha = () => {
	getCaptchaImage()
		.then((res) => {
			if (res.resultCode === 0) {
				state.captchaCode = 'data:image/gif;base64,' + res.data.image;
				state.uuid = res.data.uuid;
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			console.error(err);
		});
};

getCaptcha();
</script>
<style scoped lang="scss">
.register-page {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background: url('@/assets/register/register-bg.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	overflow: scroll;

	.register-container {
		width: 60%;
		min-height: 755px;

		.register-title {
			text-align: center;
			font-size: 30px;
			color: #333333;

			img {
				width: 200px;
				height: 65px;
			}
		}

		.register-form-container {
			display: flex;
			justify-content: center;
			align-items: stretch;
			width: 100%;
			background-color: #ffffff;

			.register-left {
				width: 50%;
				background: url('@/assets/register/register.png');
				background-repeat: no-repeat;
				background-size: 100% 100%;
			}

			.register-form {
				width: 50%;
				padding: 40px 50px;

				.register-form-title {
					font-size: 22px;
					color: #333333;
					text-align: center;
				}

				.register-form-btngroup {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.captcha-container {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 100%;

					.captcha-form {
						width: 60%;
					}

					.captcha-img {
						width: 35%;
						height: 38px;
						background-color: #b8b8b8;
					}
				}

				.register-smsCode {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 100%;

					.smsCode-input {
						width: 60%;
					}

					.smsCode-btn {
						width: 35%;
					}
				}
			}
		}
	}
}
</style>
