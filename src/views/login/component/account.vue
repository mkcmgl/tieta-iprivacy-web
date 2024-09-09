<template>
	<el-form size="large" ref="accountFormRef" :model="state.ruleForm" :rules="rules" class="login-content-form">
		<el-form-item class="login-animation1" prop="userName">
			<el-input text placeholder="请输入账号" v-model="state.ruleForm.userName" clearable autocomplete="off" style="height: 42px">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-User /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2" prop="password">
			<el-input
				:type="state.isShowPassword ? 'text' : 'password'"
				show-password
				placeholder="请输入密码"
				v-model="state.ruleForm.password"
				autocomplete="off"
				style="height: 42px"
			>
				<template #prefix>
					<el-icon class="el-input__icon"><ele-Unlock /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation3" prop="code">
			<div class="captcha-container">
				<el-input text maxlength="6" placeholder="请输入验证码" v-model="state.ruleForm.code" clearable autocomplete="off" class="captcha-form">
					<template #prefix>
						<SvgIcon name="iconfont icon-anquan1" />
					</template>
				</el-input>
				<img :src="state.captchaCode" alt="图形验证码" @click="getCaptcha" class="captcha-img" />
			</div>
		</el-form-item>
		<el-form-item class="login-animation3">
			<div class="login-flex">
				<el-checkbox v-model="state.ruleForm.rememberMe">记住账号</el-checkbox>
			</div>
		</el-form-item>
		<el-form-item class="login-animation4">
			<el-button type="primary" class="login-content-submit" @click="onSignIn" :loading="accountLoading">
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
			<el-link type="default" :underline="false">其他方式登录</el-link>
			<el-link type="primary" :underline="false" class="ml15">4A用户</el-link>
		</el-form-item> -->
	</el-form>
</template>

<script setup lang="ts" name="loginAccount">
import { reactive, computed, ref, watch } from 'vue';
import { Cookie } from '@/utils/storage';
import { encrypt, decrypt } from '@/utils/jsencrypt';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { getCaptchaImage } from '@/api/login';

const rules = reactive<FormRules>({
	userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});

const accountFormRef = ref<FormInstance>();

// 定义变量内容
const emit = defineEmits(['login']);
const props = defineProps({
	accountLoading: {
		type: Boolean,
		default: false,
	},
	codeError: {
		type: Boolean,
		default: false,
	},
});
const route = useRoute();
const router = useRouter();
const state = reactive({
	isShowPassword: false,
	ruleForm: {
		userName: '',
		password: '',
		rememberMe: false,
		code: '',
		uuid: '',
	} as LoginType,
	captchaCode: '',
});

watch(
	() => props.codeError,
	() => {
		getCaptcha();
	},
	{
		deep: true,
	}
);

const getCookie = () => {
	const userName = Cookie.get('userName');
	const password = Cookie.get('password');
	const rememberMe = Cookie.get('rememberMe');
	state.ruleForm = {
		userName: userName === undefined ? state.ruleForm.userName : userName,
		password: password === undefined ? state.ruleForm.password : decrypt(password),
		rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
	};
};

getCookie();
// 登录
const onSignIn = (val: object) => {
	accountFormRef.value?.validate((valid) => {
		if (valid) {
			emit('login', state.ruleForm);
		}
	});
};
const goRegister = () => {
	router.push('/register');
};
const goForgotPwd = () => {
	router.push('/forgotPwd');
};

const getCaptcha = () => {
	getCaptchaImage()
		.then((res) => {
			if (res.resultCode === 0) {
				state.captchaCode = 'data:image/gif;base64,' + res.data.image;
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
	.login-content-password {
		display: inline-block;
		width: 20px;
		cursor: pointer;
		&:hover {
			color: #909399;
		}
	}
	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
	}

	.login-flex {
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

		.captcha-form {
			width: 60%;
		}

		.captcha-img {
			width: 35%;
			height: 38px;
			background-color: #b8b8b8;
		}
	}

	.login-register-flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}
}
</style>
