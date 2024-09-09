<template>
	<el-form size="large" ref="mobileFormRef" :model="state.ruleForm" :rules="rules" class="login-content-form">
		<el-form-item class="login-animation1" prop="userName">
			<el-input text placeholder="请输入手机号" v-model="state.ruleForm.userName" clearable autocomplete="off">
				<template #prefix>
					<i class="iconfont icon-phone el-input__icon"></i>
				</template>
			</el-input>
		</el-form-item>

		<el-form-item class="login-animation2" prop="captcha">
			<div class="captcha-container">
				<el-input text maxlength="6" placeholder="请输入验证码" v-model="state.ruleForm.captcha" clearable autocomplete="off" class="captcha-form">
					<template #prefix>
						<SvgIcon name="iconfont icon-anquan1" />
					</template>
				</el-input>
				<img :src="state.ruleForm.captchaCode" alt="图形验证码" @click="getCaptcha" class="captcha-img" />
			</div>
		</el-form-item>

		<el-form-item class="login-animation2" prop="code">
			<div class="captcha-container">
				<el-input text maxlength="6" placeholder="请输入验证码" v-model="state.ruleForm.code" class="captcha-form" clearable autocomplete="off">
					<template #prefix>
						<el-icon class="el-input__icon"><ele-ChatDotRound /></el-icon>
					</template>
				</el-input>
				<el-button type="primary" class="login-content-code" @click="getsmsCode" plain :disabled="!state.canUpClick" style="width: 35%">{{
					state.text
				}}</el-button>
			</div>
		</el-form-item>
		<el-form-item class="login-animation3">
			<div class="login-flex">
				<el-checkbox v-model="state.ruleForm.rememberMe">记住账号</el-checkbox>
			</div>
		</el-form-item>
		<el-form-item class="login-animation4">
			<el-button type="primary" class="login-content-submit" :loading="mobileLoading" @click="onSignIn">
				<span>登 录</span>
			</el-button>
		</el-form-item>
		<el-form-item class="login-animation5">
			<div class="login-register-flex">
				<el-link :underline="false" @click="goRegister" style="--el-link-text-color: #999999; --el-link-hover-text-color: #999999"
					>注册新用户></el-link
				>
				<el-link :underline="false" @click="goForgotPwd" style="--el-link-text-color: #999999; --el-link-hover-text-color: #999999">忘记密码</el-link>
			</div>
		</el-form-item>
		<!-- <el-form-item class="login-animation6">
			<div>
				<el-link type="default" :underline="false">其他方式登录</el-link>
				<el-link type="primary" :underline="false" class="ml15">4A用户</el-link>
			</div>
		</el-form-item> -->
	</el-form>
</template>

<script setup lang="ts" name="loginMobile">
import { reactive, ref } from 'vue';
import { sendSmsCode } from '@/api/public/index';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
import { getCaptchaImage } from '@/api/login';

const rules = reactive<FormRules>({
	userName: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
	captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
	code: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }],
});

const mobileFormRef = ref<FormInstance>();

const router = useRouter();

// 定义变量内容
const emit = defineEmits(['login']);
const props = defineProps({
	mobileLoading: {
		type: Boolean,
		default: false,
	},
});
const state = reactive({
	ruleForm: {
		userName: '',
		captcha: '',
		code: '',
		rememberMe: false,
		captchaCode: '',
		uuid: '',
	},
	text: '获取验证码',
	upTotalTime: 60,
	canUpClick: true,
});

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
	if (!reg.test(state.ruleForm.userName)) {
		ElMessage.warning('请输入正确的手机号');
		return false;
	}
	if (!state.ruleForm.captcha) {
		ElMessage.warning('请输入验证码');
		return false;
	}
	sendSmsCode({
		uuid: state.ruleForm.uuid,
		captcha: state.ruleForm.captcha,
		phone: state.ruleForm.userName,
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

const onSignIn = () => {
	mobileFormRef.value?.validate((valid) => {
		if (valid) {
			emit('login', state.ruleForm);
		}
	});
};

const getCaptcha = () => {
	getCaptchaImage()
		.then((res) => {
			if (res.resultCode === 0) {
				state.ruleForm.captchaCode = 'data:image/gif;base64,' + res.data.image;
				state.ruleForm.uuid = res.data.uuid;
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			console.error(err);
		});
};

getCaptcha();

const goRegister = () => {
	router.push('/register');
};
const goForgotPwd = () => {
	router.push('/forgotPwd');
};
</script>

<style scoped lang="scss">
.login-content-form {
	margin-top: 20px;
	// @for $i from 1 through 10 {
	// 	.login-animation#{$i} {
	// 		opacity: 0;
	// 		animation-name: error-num;
	// 		animation-duration: 0.5s;
	// 		animation-fill-mode: forwards;
	// 		animation-delay: calc($i/10) + s;
	// 	}
	// }
	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
	}
	.login-msg {
		color: var(--el-text-color-placeholder);
	}

	.login-register-flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.captcha-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 42px;

		.captcha-form {
			width: 60%;
		}

		.captcha-img {
			width: 35%;
			height: 38px;
			background-color: #b8b8b8;
		}
	}
}
</style>
