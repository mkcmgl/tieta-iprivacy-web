<template>
	<div class="sso-container"></div>
</template>
<script setup lang="ts" name="ssoIndex">
import { NextLoading } from '@/utils/loading';
import { useRouter } from 'vue-router';
import { ssoLogin } from '@/api/sso';
import { defineAsyncComponent, onMounted, reactive, computed, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';
import { initFrontEndControlRoutes } from '@/router/frontEnd';
import { Session, tokenName } from '@/utils/storage';

const router = useRouter();

let ticket = router.currentRoute.value.query.ticket;

const signInSuccess = (isNoPower: boolean | undefined) => {
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

const login = () => {
	if (ticket) {
		NextLoading.start();
		ssoLogin({
			ticket,
		})
			.then(async (res) => {
				if (res.resultCode === 0) {
					Session.set(tokenName, res.data.token);
					const isNoPower = await initFrontEndControlRoutes();
					signInSuccess(isNoPower);
					NextLoading.done(600);
				} else {
					ElMessage.warning(res.resultDesc);
					router.push('/login');
					NextLoading.done(600);
				}
			})
			.catch((err) => {
				console.error(err);
				NextLoading.done(600);
			});
	}
};

// 页面加载时
onMounted(() => {
	login();
});
</script>
