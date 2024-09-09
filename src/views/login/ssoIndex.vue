<template>
	<div></div>
</template>
<script setup lang="ts" name="ssoLoginIndex">
import { reactive, computed, onMounted } from 'vue';
import { Local } from '@/utils/storage';
import { encrypt, decrypt } from '@/utils/jsencrypt';
import { useRoute, useRouter } from 'vue-router';
import { NextLoading } from '@/utils/loading';
import { initFrontEndControlRoutes } from '@/router/frontEnd';
import { ElMessage } from 'element-plus';
import { Session, tokenName } from '@/utils/storage';
import { getIAMConfig, ssoLogin } from '@/api/ssoLogin';

const route = useRoute();
const router = useRouter();

let code = router.currentRoute.value.query.code;

const init = () => {
	let redirect_url = '';

	if (!code) {
		getIAMConfig({})
			.then((res) => {
				if (res.resultCode === 0) {
					redirect_url = res.data;
					window.location.href = redirect_url;
				} else {
					ElMessage.warning(res.resultDesc);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		ssoLogin({
			code,
		})
			.then(async (res) => {
				if (res.resultCode === 0) {
					Session.set(tokenName, res.data.token);
					const isNoPower = await initFrontEndControlRoutes();
					signInSuccess(isNoPower);
				} else {
					ElMessage.warning(res.resultDesc);
					router.replace('/login');
				}
			})
			.catch((err) => {
				router.replace('/login');
				console.error(err);
			});
	}
};

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

// 页面加载时
onMounted(() => {
	NextLoading.done();

	init();
});
</script>
<style scoped lang="scss"></style>
