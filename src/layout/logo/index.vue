<template>
	<div class="layout-logo" v-if="setShowLogo">
		<img :src="logoMini" class="layout-logo-medium-img" />
		<span>{{ themeConfig.globalTitle }}</span>
	</div>
	<div class="layout-logo-size" v-else>
		<img :src="logoMini" class="layout-logo-size-img" />
	</div>
</template>

<script setup lang="ts" name="layoutLogo">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '@/stores/themeConfig';
import logoMini from '@/assets/login/ct-logo.png';
import { useRoute, useRouter } from 'vue-router';

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

const router = useRouter();

// 设置 logo 的显示。classic 经典布局默认显示 logo
const setShowLogo = computed(() => {
	let { isCollapse, layout } = themeConfig.value;
	return !isCollapse || layout === 'classic' || document.body.clientWidth < 1000;
});
// logo 点击实现菜单展开/收起
const onThemeConfigChange = () => {
	if (themeConfig.value.layout === 'transverse') return false;
	themeConfig.value.isCollapse = !themeConfig.value.isCollapse;
};

// 点击logo返回首页
const returnIndex = () => {
	router.push('/home');
};
</script>

<style scoped lang="scss">
.layout-logo {
	height: 64px;
	display: flex;
	align-items: center;
	// justify-content: center;
	box-shadow: rgb(0 21 41 / 2%) 0px 1px 4px;
	color: var(--next-bg-topBarColor);
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;
	overflow: hidden;
	margin-right: 15px;
	padding-left: 18px;
	span {
		white-space: nowrap;
		display: inline-block;
	}
	&:hover {
		span {
			color: var(--color-primary-light-2);
		}
	}
	&-medium-img {
		width: 130px;
		margin-right: 12px;
	}
}
.layout-logo-size {
	width: 100%;
	height: 50px;
	display: flex;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;
	&-img {
		width: 20px;
		margin: auto;
	}
	&:hover {
		img {
			animation: logoAnimation 0.3s ease-in-out;
		}
	}
}
</style>
