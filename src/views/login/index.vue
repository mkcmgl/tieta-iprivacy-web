<template>
	<div class="login-container">
		<div class="login-box">
			<div class="login-form">
				<img :src="logoMini" class="login-logo mb16" />
				<div class="login-title mb50">{{ themeConfig.globalTitle }}</div>
				<div class="login-choose">
					<div class="tag pb8" :class="{ 'is-active': state.tabsActiveName === 'password' }" @click="changeType('password')">账号登录</div>
					<!-- <div class="tag ml40 pb8" :class="{ 'is-active': state.tabsActiveName === 'auth_code' }" @click="changeType('auth_code')">手机号登录</div> -->
				</div>
				<Account
					:accountLoading="state.accountLoading"
					@login="onLogin"
					:codeError="state.codeErrorTime"
					v-if="state.tabsActiveName === 'password'"
				/>
				<!-- <Mobile :mobileLoading="state.mobileLoading" @login="onLogin" v-if="state.tabsActiveName === 'auth_code'" /> -->
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="loginIndex">
import { onMounted, reactive, getCurrentInstance, defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '@/stores/themeConfig';
import { NextLoading } from '@/utils/loading';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { initFrontEndControlRoutes } from '@/router/frontEnd';
import { Session, Cookie, tokenName } from '@/utils/storage';
import { login, ssoLogin } from '@/api/login';
import { encrypt } from '@/utils/jsencrypt';
import { ElLoading } from 'element-plus';
import logoMini from '@/assets/login/ct-logo.png';

// 引入组件
const Account = defineAsyncComponent(() => import('@/views/login/component/account.vue'));
const Mobile = defineAsyncComponent(() => import('@/views/login/component/mobile.vue'));

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { proxy } = getCurrentInstance() as any;
const route = useRoute();
const router = useRouter();

let code = router.currentRoute.value.query.code;

const state = reactive({
	tabsActiveName: 'password',
	isShowPassword: false,
	accountLoading: false,
	mobileLoading: false,
	loginForm: {
		userName: '',
		password: '',
		rememberMe: false,
	},
	codeErrorTime: new Date(),
});

const changeType = (type: string) => {
	state.tabsActiveName = type;
};

const randomString = () => {
	let len = 8;
	let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	let maxPos = $chars.length;
	let pwd = '';
	for (let i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
};

// 登录
const onLogin = (val: LoginType) => {
	let pwd = '';
	if (val.rememberMe) {
		Cookie.set('userName', val.userName, { expires: 30 });
		Cookie.set('password', encrypt(val.password), { expires: 30 });
		Cookie.set('rememberMe', val.rememberMe, { expires: 30 });
	} else {
		Cookie.remove('userName');
		Cookie.remove('password');
		Cookie.remove('rememberMe');
	}
	if (state.tabsActiveName == 'password') {
		pwd = proxy.$md5(val.password);
		pwd = proxy.$md5(pwd + pwd.substr(0, 8));
		if (!val.userName) {
			ElMessage.warning('请输入用户名');
			return false;
		}
		if (!val.password) {
			ElMessage.warning('请输入密码');
			return false;
		}
		state.accountLoading = true;
	} else if (state.tabsActiveName == 'auth_code') {
		if (!val.userName) {
			ElMessage.warning('请输入手机号');
			return false;
		}
		if (!val.code) {
			ElMessage.warning('请输入验证码');
			return false;
		}
		state.mobileLoading = true;
	}
	let randomStr = randomString();
	login({
		tenantId: '1000',
		loginName: val.userName,
		password: val.password ? proxy.$md5(pwd + randomStr) : val.password,
		random: randomStr,
		captcha: val.code,
		uuid: val.uuid,
		smsCode: val.code ? val.code : '',
		loginType: state.tabsActiveName,
	})
		.then(async (res) => {
			state.accountLoading = false;
			state.mobileLoading = false;

			if (res.resultCode == 0) {
				Session.set(tokenName, res.data.token);
				const isNoPower = await initFrontEndControlRoutes();
				signInSuccess(isNoPower);
			} else {
				state.codeErrorTime = new Date();
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			state.accountLoading = false;
			state.mobileLoading = false;
		});
};

const signInSuccess = (isNoPower: boolean | undefined) => {
	state.accountLoading = false;
	state.mobileLoading = false;
	if (isNoPower) {
		router.push('/401');
	} else {
		// 登录成功，跳到转首页
		// 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
		router.push('/home');
		// 添加 loading，防止第一次进入界面时出现短暂空白
		NextLoading.start();
	}
};

// 单点登录
const sso = () => {
	const loading = ElLoading.service({
		lock: true,
	});
	ssoLogin({
		code,
	})
		.then(async (res) => {
			loading.close();
			Session.set(tokenName, res.data.token);
			const isNoPower = await initFrontEndControlRoutes();
			signInSuccess(isNoPower);
		})
		.catch((err) => {
			loading.close();
			console.error(err);
		});
};

// 页面加载时
onMounted(() => {
	NextLoading.done();
	if (code) {
		sso();
	}
});
</script>

<style scoped lang="scss">
.login-container {
	position: relative;
	width: 100%;
	height: 100%;
	min-width: 1600px;
	overflow: hidden;
	background: url('@/assets/login/background.png');
	background-repeat: no-repeat;
	background-size: 100% 100%;

	.login-box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 37%;
		height: 100%;
		background-color: rgba($color: #ffffff, $alpha: 0.6);

		.login-form {
			width: 50%;

			.login-logo {
				width: 200px;
				height: 65px;
			}

			.login-title {
				font-size: 30px;
				color: #333333;
			}

			.login-choose {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				font-size: 18px;
				color: #333333;

				.tag {
					cursor: pointer;
				}

				.is-active {
					position: relative;
					color: #eb4b4b;

					&::after {
						content: '';
						position: absolute;
						top: 33px;
						left: 0px;
						right: 0px;
						height: 2px;
						width: 52px;
						margin: auto;

						background-color: #eb4b4b;
					}
				}
			}
		}
	}
}
</style>
