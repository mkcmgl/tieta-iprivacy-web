<template>
	<div class="layout-navbars-breadcrumb-user pr15" :style="{ flex: layoutUserFlexNum }">
		<el-dropdown class="pl8 pr8" :show-timeout="70" :hide-timeout="50" @command="onHandleCommandClick">
			<span class="layout-navbars-breadcrumb-user-link">
				<img :src="userLogo" style="width: 30px; height: 30px" class="mr10" alt="用户" />

				{{ userInfos.userName === '' ? 'common' : userInfos.userName }}
				<el-icon class="el-icon--right">
					<ele-ArrowDown />
				</el-icon>
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="individualCenter">个人中心</el-dropdown-item>
				</el-dropdown-menu>
				<el-dropdown-menu>
					<el-dropdown-item command="logOut">退出登录</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>

<script setup lang="ts" name="layoutBreadcrumbUser">
import { computed, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '@/stores/userInfo';
import { useThemeConfig } from '@/stores/themeConfig';
import { Session, Local } from '@/utils/storage';
import screenfull from 'screenfull';
import { logout } from '@/api/login';
import userLogo from '@/assets/user/user.png';

// 定义变量内容
const router = useRouter();
const stores = useUserInfo();
const storesThemeConfig = useThemeConfig();
const { userInfos } = storeToRefs(stores);
const { themeConfig } = storeToRefs(storesThemeConfig);
const state = reactive({
	isScreenfull: false,
	disabledSize: 'default',
});

// 设置分割样式
const layoutUserFlexNum = computed(() => {
	let num: string | number = '';
	const { layout, isClassicSplitMenu } = themeConfig.value;
	const layoutArr: string[] = ['defaults', 'columns'];
	if (layoutArr.includes(layout) || (layout === 'classic' && !isClassicSplitMenu)) num = '1';
	else num = '';
	return num;
});

const userLogout = () => {
	ElMessageBox({
		closeOnClickModal: false,
		closeOnPressEscape: false,
		title: '提示',
		message: '此操作将退出登录, 是否继续?',
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		buttonSize: 'large',
		beforeClose: (action, instance, done) => {
			if (action === 'confirm') {
				instance.confirmButtonLoading = true;
				instance.confirmButtonText = '退出中';
				logout()
					.then((res) => {
						done();
						setTimeout(() => {
							instance.confirmButtonLoading = false;
						}, 300);
					})
					.catch((err) => console.error(err));
			} else {
				done();
			}
		},
	})
		.then(async () => {
			// 清除缓存/token等
			Session.clear();
			// 使用 reload 时，不需要调用 resetRoute() 重置路由
			window.location.reload();
		})
		.catch(() => {});
};

// 下拉菜单点击时
const onHandleCommandClick = (path: string) => {
	if (path === 'logOut') {
		userLogout();
	} else if (path === 'individualCenter') {
		router.push({
			path: `/${path}`,
		});
	}
};
// 初始化组件大小/i18n
const initI18nOrSize = (value: string, attr: string) => {
	state[attr] = Session.get('themeConfig')[value];
};

// 页面加载时
onMounted(() => {
	if (Session.get('themeConfig')) {
		initI18nOrSize('globalComponentSize', 'disabledSize');
	}
});
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	&-link {
		height: 100%;
		display: flex;
		align-items: center;
		white-space: nowrap;
		&-photo {
			width: 25px;
			height: 25px;
			border-radius: 100%;
		}
	}
	&-icon {
		padding: 0 10px;
		cursor: pointer;
		color: var(--next-bg-topBarColor);
		height: 50px;
		line-height: 50px;
		display: flex;
		align-items: center;
		&:hover {
			background: var(--next-color-user-hover);
			i {
				display: inline-block;
				animation: logoAnimation 0.3s ease-in-out;
			}
		}
	}
	:deep(.el-dropdown) {
		color: var(--next-bg-topBarColor);
	}
	:deep(.el-badge) {
		height: 40px;
		line-height: 40px;
		display: flex;
		align-items: center;
	}
	:deep(.el-badge__content.is-fixed) {
		top: 12px;
	}
}
</style>
