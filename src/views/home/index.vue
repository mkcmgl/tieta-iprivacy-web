<template>
	<div class="home-container layout-pd">
		<div v-auth="'api:gather:get'">
			<div class="title-bar">
				<div class="page-title" style="font-weight: bold">概览</div>
			</div>
			<el-row :gutter="15" class="home-card-header mb15 mt20">
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<div class="bg">
						<!-- <img src="@/assets/home/header1.png" /> -->

						<div class="title">欢迎使用产品服务</div>
						<div class="text">
							中国铁塔链原生隐私计算平台集成了区块链和隐私计算技术，提供联邦建模、协同计算、匿踪查询、隐私求交等功能，支撑数据安全存储、精准确权、可信流通，具有数据确权、加密、脱敏、水印等能力，帮助企业激活数据要素价值，加快价值释放。
						</div>
						<div class="text" style="margin-top: 20px">
							<el-button type="primary" class="bg-btn">产品介绍</el-button>
						</div>
					</div>
				</el-col>
			</el-row>
			<el-row :gutter="15" class="home-card-header mb15">
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<div class="bg-column" style="height: 182px">
						<span class="bg-title">资源总览</span>
						<div class="bg-list">
							<div class="bg-list-item">
								<img src="@/assets/home/jds.png" />
								<div class="bg-list-item-text">
									<span class="bg-list-t1">节点数</span>
									<span class="bg-list-t2">{{ state.nodeNum }}</span>
								</div>
							</div>
							<div class="bg-list-item">
								<img src="@/assets/home/xms.png" />
								<div class="bg-list-item-text">
									<span class="bg-list-t1">项目数</span>
									<span class="bg-list-t2">{{ state.projectNum }}</span>
								</div>
							</div>
							<div class="bg-list-item">
								<img src="@/assets/home/rws.png" />
								<div class="bg-list-item-text">
									<span class="bg-list-t1">任务数</span>
									<span class="bg-list-t2">{{ state.taskNum }}</span>
								</div>
							</div>
							<div class="bg-list-item">
								<img src="@/assets/home/mxs.png" />
								<div class="bg-list-item-text">
									<span class="bg-list-t1">模型数</span>
									<span class="bg-list-t2">{{ state.modelNum }}</span>
								</div>
							</div>
							<div class="bg-list-item">
								<img src="@/assets/home/tlfw.png" />
								<div class="bg-list-item-text">
									<span class="bg-list-t1">推理服务</span>
									<span class="bg-list-t2">{{ state.reasonNum }}</span>
								</div>
							</div>
						</div>
					</div>
				</el-col>
			</el-row>
			<el-row :gutter="15" class="home-card-header mb15">
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<div class="bg-column" style="height: 282px">
						<span class="bg-title">创建指引</span>
						<div class="bg-guide">
							<div class="bg-guide-item1">
								<img src="@/assets/home/01.png" />
								<span class="bg-item1-text1">节点注册</span>
								<span class="bg-item1-text2">节点注册</span>
								<span class="bg-item1-btn">
									<el-button type="text" @click="goDetail('nodeManage')">查看详情</el-button>
									|
									<el-button type="text" style="margin-left: 0" @click="goDetail('nodeManage')">立即使用</el-button>
								</span>
							</div>
							<div class="bg-guide-item2"></div>
							<div class="bg-guide-item1">
								<img src="@/assets/home/02.png" />
								<span class="bg-item1-text1">数据注册</span>
								<span class="bg-item1-text2">数据注册</span>
								<span class="bg-item1-btn">
									<el-button type="text" @click="goDetail('dataManage')">查看详情</el-button>
									|
									<el-button type="text" style="margin-left: 0" @click="goDetail('dataManage')">立即使用</el-button>
								</span>
							</div>
							<div class="bg-guide-item2"></div>
							<div class="bg-guide-item1">
								<img src="@/assets/home/03.png" />
								<span class="bg-item1-text1">创建项目</span>
								<span class="bg-item1-text2">创建项目实现节点和数据授权</span>
								<span class="bg-item1-btn">
									<el-button type="text" @click="goDetail('projectManage')">查看详情</el-button>
									|
									<el-button type="text" style="margin-left: 0" @click="goDetail('projectManage')">立即使用</el-button>
								</span>
							</div>
							<div class="bg-guide-item2"></div>
							<div class="bg-guide-item1">
								<img src="@/assets/home/04.png" />
								<span class="bg-item1-text1">创建隐私计算任务</span>
								<span class="bg-item1-text2">创建任务实现协同计算和联邦建模</span>
								<span class="bg-item1-btn">
									<el-button type="text" @click="goDetail('flTask')">查看详情</el-button>
									|
									<el-button type="text" style="margin-left: 0" @click="goDetail('flTask')">立即使用</el-button>
								</span>
							</div>
						</div>
					</div>
				</el-col>
			</el-row>
			<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="20%">
				<el-radio-group v-model="state.dialog.path" style="display: flex; flex-direction: column">
					<el-radio value="collaborationComputing">协同计算</el-radio>
					<el-radio value="privacyIntersect">隐私求交</el-radio>
					<el-radio value="hiddenSearch">匿踪查询</el-radio>
					<el-radio value="federatedModel" style="margin-right: 32px">联邦建模</el-radio>
				</el-radio-group>
				<template #footer>
					<span class="dialog-footer" style="display: flex; justify-content: center">
						<el-button type="primary" @click="goDetail(state.dialog.path)" size="default">确 定</el-button>
						<el-button @click="state.dialog.isShowDialog = false" size="default">取 消</el-button>
					</span>
				</template>
			</el-dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="home">
import { reactive, onMounted, ref, watch, nextTick, onActivated, markRaw, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useUserInfo } from '@/stores/userInfo';
import { formatDate } from '@/utils/formatTime';
import { getResourceOverview } from '@/api/home';
import { ElMessage, stepProps } from 'element-plus';
import { auth } from '@/utils/authFunction.ts';

const router = useRouter();
const state = reactive({
	userName: '',
	nodeNum: 0,
	modelNum: 0,
	projectNum: 0,
	reasonNum: 0,
	taskNum: 0,
	dialog: {
		title: '选择任务类型',
		isShowDialog: false,
		path: '',
	},
});

const toLink = (url?: string) => {
	router.push({
		path: url,
		query: {},
	});
};
const goDetail = (path: string) => {
	if (path != 'flTask') {
		router.push(path);
	} else {
		state.dialog.isShowDialog = true;
	}
};
const getOverview = () => {
	getResourceOverview().then((res) => {
		if (res.resultCode === 0) {
			state.nodeNum = res.data.nodeNum;
			state.modelNum = res.data.modelNum;
			state.projectNum = res.data.projectNum;
			state.reasonNum = res.data.reasonNum;
			state.taskNum = res.data.taskNum;
			console.log(res.data, state.reasonNum);
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};
// 页面加载时
onActivated(() => {
	const stores = useUserInfo();
	state.userName = stores.userInfos.userName;
});
onMounted(() => {
	if (auth) {
		getOverview();
	}
});
</script>

<style scoped lang="scss">
$homeNavLengh: 8;
.home-container {
	overflow: hidden;
	// .page-title {
	// 	font-size: 20px;
	// }
	.home-card-header {
		// display: inline-flex;
		// flex-direction: row;
		// height: 226px;

		.bg {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 100%;
			height: 100%;
			padding: 38px 3.61% 37px 3.61%;
			background: url('@/assets/home/banner.png');
			background-repeat: no-repeat;
			background-size: 100% 100%;

			.title {
				width: 50%;
				margin-bottom: 10px;
				font-size: 20px;
				font-weight: 600;
			}
			.text {
				width: 50%;
				color: #333;
				font-size: 16px;
				font-weight: 400;
				line-height: 26px;
				word-break: break-all;
			}
			.bg-btn {
				background: linear-gradient(136deg, #fb431f 0%, #e23d34 100%);
				border-radius: 4px 4px 4px 4px;
			}
		}
		.bg-column {
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 100%;

			// justify-content: space-between;
			padding: 16px 1.45%;

			// background: url('@/assets/home/header.png');
			background: #fff;
			background-repeat: no-repeat;
			background-size: 100% 100%;

			.bg-title {
				float: left;
				height: 15px;
				padding-left: 4px;
				font-size: 16px;
				line-height: 15px;
				border-left: 4px solid #d70c19;
			}
			.bg-list {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				margin-top: 30px;
				.bg-list-item {
					display: flex;
					flex-direction: row;
					justify-content: center;
					width: 20%;
					height: 60px;
				}
				.bg-list-item + .bg-list-item {
					border-left: 1px solid #dcdee2;
				}
				.bg-list-item-text {
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					margin-left: 20px;
				}
				.bg-list-t1 {
					color: #333;
					font-size: 16px;
					font-style: normal;
					font-weight: 400;
					text-align: left;
					text-transform: none;
				}
				.bg-list-t2 {
					color: #333;
					font-size: 28px;
					font-style: normal;
					font-weight: bold;
					text-align: left;
					text-transform: none;
				}
			}
			.bg-guide {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				height: 202px;
				padding: 0 8.3% 40px 8.3%;
				.bg-guide-item1 {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					width: 10%;
					height: 200px;
					text-align: center;
				}
				.bg-guide-item2 {
					width: 204px;
					height: 0;
					margin-top: 5%;
					border: 1px dashed #707070;
					opacity: 0.25;
				}
				.bg-item1-text1 {
					margin-right: -100%;
					margin-left: -100%;
					color: #333;
					font-size: 18px;
					font-weight: bold;
					text-align: center;
					white-space: nowrap;
				}
				.bg-item1-text2 {
					margin-right: -100%;
					margin-left: -100%;
					color: #999;
					font-size: 14px;

					// max-width: 210px;
					font-weight: 400;
					text-align: center;
					white-space: nowrap;
				}
				.bg-item1-btn {
					margin-right: -100%;
					margin-left: -100%;
					color: #d70c19;
					text-align: center;
					white-space: nowrap;
				}
			}
		}
	}
}
</style>
