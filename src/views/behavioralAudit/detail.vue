<template>
	<div class="inference-service-detail layout-padding" v-loading="state.loading">
		<div class="title-bar mb20">
			<div class="page-title"><img src="@/assets/public/back.png" class="mr10" @click="backList" />追溯详情</div>
		</div>

		<el-card shadow="never" class="w100 box-detail mt20 mb20">
			<div class="header-btn">
				<el-button type="primary" @click="exportDetail"
					><img src="@/assets/behaviorAudit/daochu.png" style="width: 14px" class="mr5" />导出</el-button
				>
			</div>
			<div>
				<!-- <el-timeline style="width: 100%"> -->
				<div>
					<!-- <el-timeline-item v-for="(item, index) in activities" :key="index" placement="left" :type="item.result == 1 ? 'success' : 'danger'"> -->
					<div v-for="(item, index) in activities" :key="index">
						<div class="item-line"></div>
						<div style="display: flex; width: 100%; flex-direction: column">
							<div style="display: flex; flex-direction: row" @click="searchDetail(item)">
								<!-- <div style="width: 80%">
									<span style="float: left">{{ item.typeDesc }}</span>
									<span style="float: right">{{ item.addTime }}</span>
								</div>
								<div class="ml30" @click="item.showDetail = !item.showDetail">
									<el-icon v-if="!item.showDetail"><ArrowRightBold /></el-icon>
									<el-icon v-else><ArrowDownBold /></el-icon>
								</div> -->
								<div class="item-time">
									<span>{{ item.addTime.split(' ')[0] }}</span>
									<span style="float: right">{{ item.addTime.split(' ')[1] }}</span>
								</div>

								<div style="width: 8%; justify-content: center; display: flex">
									<img :src="iconList[index % 9]" style="width: 60px; height: 60px" />
								</div>
								<div class="item-header">
									<span>{{ item.typeDesc }}</span>
									<div class="ml30">
										<img src="@/assets/behaviorAudit/bottom.png" v-if="!item.showDetail" style="width: 9px" />
										<img src="@/assets/behaviorAudit/top.png" v-else style="width: 9px" />
									</div>
								</div>
							</div>

							<div class="item-detail" v-if="item.showDetail">
								<div class="card-trigle"></div>
								<div class="card-trigle-inside"></div>

								<el-card class="item-card">
									<el-form v-model="item.details" width="90%" label-width="100" label-position="left" v-if="state.type == 0">
										<el-row :gutter="20">
											<el-col :span="12"
												><el-form-item label="节点ID" prop="id">{{ item.details.id }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="节点名称" prop="name">{{ item.details.name }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="区块链hash" prop="blockHash">{{ item.details.blockHash }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="区块高度" prop="blockHeight">{{ item.details.blockHeight }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="操作用户" prop="addUserName">{{ item.details.addUserName }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="所属机构" prop="enterpriseName">{{ item.details.enterpriseName }}</el-form-item></el-col
											>
											<el-col :span="24"
												><el-form-item v-if="item.typeDesc == '更新成功'" label="更新内容" prop="updateContent"
													>{{ item.details.updateContent }}
													<el-button type="text" size="small" style="float: right" @click="copyText(item.details.updateContent)">复制</el-button>
												</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="操作时间" prop="certTime">{{ item.details.certTime }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="结果" prop="result">{{ item.details.result == 1 ? '成功' : '失败' }}</el-form-item></el-col
											>
										</el-row>
									</el-form>
									<el-form v-model="item.details" width="90%" label-width="100" label-position="left" v-if="state.type == 1">
										<el-row :gutter="20">
											<el-col :span="12"
												><el-form-item label="数据ID" prop="id">{{ item.details.id }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="数据名称" prop="name">{{ item.details.name }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="区块链hash" prop="blockHash">{{ item.details.blockHash }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="区块高度" prop="blockHeight">{{ item.details.blockHeight }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="操作用户" prop="addUserName">{{ item.details.addUserName }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="所属机构" prop="enterpriseName">{{ item.details.enterpriseName }}</el-form-item></el-col
											>
											<el-col :span="24"
												><el-form-item v-if="item.typeDesc == '编辑成功'" label="编辑内容" prop="updateContent"
													>{{ item.details.updateContent }}
													<el-button type="text" size="small" style="float: right" @click="copyText(item.details.updateContent)">复制</el-button>
												</el-form-item></el-col
											>
											<el-col :span="24"
												><el-form-item v-if="item.typeDesc == '数据登记成功'" label="登记内容" prop="registerContent"
													>{{ item.details.registerContent }}
													<el-button type="text" size="small" style="float: right" @click="copyText(item.details.updateContent)">复制</el-button>
												</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="操作时间" prop="certTime">{{ item.details.certTime }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="结果" prop="result">{{ item.details.result == 1 ? '成功' : '失败' }}</el-form-item></el-col
											>
										</el-row>
									</el-form>
									<el-form v-model="item.details" width="90%" label-width="100" label-position="left" v-if="state.type == 2">
										<el-row :gutter="20">
											<el-col :span="12"
												><el-form-item label="项目ID" prop="id">{{ item.details.id }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="项目名称" prop="name">{{ item.details.name }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="区块链hash" prop="blockHash">{{ item.details.blockHash }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="区块高度" prop="blockHeight">{{ item.details.blockHeight }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="操作用户" prop="addUserName">{{ item.details.addUserName }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="所属机构" prop="enterpriseName">{{ item.details.enterpriseName }}</el-form-item></el-col
											>
											<el-col :span="24"
												><el-form-item v-if="item.typeDesc == '编辑成功'" label="编辑内容" prop="updateContent"
													>{{ item.details.updateContent }}
													<el-button type="text" size="small" style="float: right" @click="copyText(item.details.updateContent)">复制</el-button>
												</el-form-item></el-col
											>
											<el-col :span="24"
												><el-form-item v-if="item.typeDesc == '数据登记成功'" label="登记内容" prop="registerContent"
													>{{ item.details.registerContent }}
													<el-button type="text" size="small" style="float: right" @click="copyText(item.details.updateContent)">复制</el-button>
												</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="操作时间" prop="certTime">{{ item.details.certTime }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="结果" prop="result">{{ item.details.result == 1 ? '成功' : '失败' }}</el-form-item></el-col
											>
										</el-row>
									</el-form>
								</el-card>
							</div>
						</div>
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>
<script lang="ts" setup name="inferenceServiceDetail">
import { reactive, onMounted, ref } from 'vue';
import {
	getNodeBehaviorList,
	getDataBehaviorList,
	getProjectBehaviorList,
	getNodeBehaviorDetail,
	exportNodeList,
	getDataBehaviorDetail,
	exportDataList,
	getProjectBehaviorDetail,
	exportProjectList,
} from '@/api/behavioralAudit';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import commonFunction from '@/utils/commonFunction';
import startIcon0 from '@/assets/behaviorAudit/start0.png';
import startIcon1 from '@/assets/behaviorAudit/start1.png';
import startIcon2 from '@/assets/behaviorAudit/start2.png';
import startIcon3 from '@/assets/behaviorAudit/start3.png';
import startIcon4 from '@/assets/behaviorAudit/start4.png';
import startIcon5 from '@/assets/behaviorAudit/start5.png';
import startIcon6 from '@/assets/behaviorAudit/start6.png';
import startIcon7 from '@/assets/behaviorAudit/start7.png';
import startIcon8 from '@/assets/behaviorAudit/start8.png';
const { copyText } = commonFunction();
const state = reactive({
	loading: false,
	form: {
		serviceId: '',
		modelName: '',
		endTime: '',
		status: '',
		startTime: '',
		description: '',
		projectName: '',
		hostList: [] as any,
		guestList: [] as any,
		fieldList: [],
	},
	type: 0,
});
const iconList = [startIcon0, startIcon1, startIcon2, startIcon3, startIcon4, startIcon5, startIcon6, startIcon7, startIcon8];
const activeName = ref('');
const activities = ref([] as any);

const route = useRoute();
const router = useRouter();
const backList = () => {
	router.back();
};

onMounted(() => {
	state.type = route.query.type;
	if (route.query.type == 0) {
		getNodeBehaviorList({
			id: route.query.id,
		}).then((res) => {
			if (res.resultCode === 0) {
				activities.value = res.data;
			} else {
				ElMessage.error(res.resultDesc);
			}
		});
	} else if (route.query.type == 1) {
		getDataBehaviorList({ id: route.query.id }).then((res) => {
			if (res.resultCode === 0) {
				activities.value = res.data;
			} else {
				ElMessage.error(res.resultDesc);
			}
		});
	} else {
		getProjectBehaviorList({
			id: route.query.id,
		}).then((res) => {
			if (res.resultCode === 0) {
				activities.value = res.data;
			} else {
				ElMessage.error(res.resultDesc);
			}
		});
	}
	activities.value.forEach((element: any) => {
		element.showDetail = false;
	});
});
const exportDetail = () => {
	if (route.query.type == 0) {
		exportNodeList({
			id: route.query.id,
		}).then((res) => {
			if (res.resultCode === 0) {
				const blob = new Blob([JSON.stringify(res.data)]);
				const downloadElement = document.createElement('a');
				const href = window.URL.createObjectURL(blob);
				downloadElement.href = href;
				downloadElement.download = route.query.id + '.json';
				document.body.appendChild(downloadElement);
				downloadElement.click();
				document.body.removeChild(downloadElement);
				window.URL.revokeObjectURL(href);
				ElMessage.success('下载成功');
			} else {
				ElMessage.error(res.resultDesc);
			}
		});
	} else if (route.query.type == 1) {
		exportDataList({ id: route.query.id }).then((res) => {
			if (res.resultCode === 0) {
				const blob = new Blob([JSON.stringify(res.data)]);
				const downloadElement = document.createElement('a');
				const href = window.URL.createObjectURL(blob);
				downloadElement.href = href;
				downloadElement.download = route.query.id + '.json';
				document.body.appendChild(downloadElement);
				downloadElement.click();
				document.body.removeChild(downloadElement);
				window.URL.revokeObjectURL(href);
				ElMessage.success('下载成功');
			} else {
				ElMessage.error(res.resultDesc);
			}
		});
	} else {
		exportProjectList({
			id: route.query.id,
		}).then((res) => {
			if (res.resultCode === 0) {
				const blob = new Blob([JSON.stringify(res.data)]);
				const downloadElement = document.createElement('a');
				const href = window.URL.createObjectURL(blob);
				downloadElement.href = href;
				downloadElement.download = route.query.id + '.json';
				document.body.appendChild(downloadElement);
				downloadElement.click();
				document.body.removeChild(downloadElement);
				window.URL.revokeObjectURL(href);
				ElMessage.success('下载成功');
			} else {
				ElMessage.error(res.resultDesc);
			}
		});
	}
};

// 注册成功： typeValue ： 1；
// 节点关机： typeValue ： 7；
// 编辑成功： typeValue ： 2；
// 添加数据成功： typeValue ： 4；
// 系统重启成功： typeValue ： 1；

const searchDetail = (item: any) => {
	if (item.showDetail) {
		item.showDetail = !item.showDetail;
		return;
	}
	if (route.query.type == 0) {
		getNodeBehaviorDetail({
			id: item.id,
		}).then((res) => {
			if (res.resultCode === 0) {
				item.details = res.data;
				// console.log(item.details);
				item.showDetail = !item.showDetail;
			} else {
				ElMessage.error(res.resultDesc);
			}
		});
	} else if (route.query.type == 1) {
		getDataBehaviorDetail({ id: item.id }).then((res) => {
			if (res.resultCode === 0) {
				item.details = res.data;
				item.showDetail = !item.showDetail;
			} else {
				ElMessage.error(res.resultDesc);
			}
		});
	} else {
		getProjectBehaviorDetail({
			id: item.id,
		}).then((res) => {
			if (res.resultCode === 0) {
				item.details = res.data;
				item.showDetail = !item.showDetail;
			} else {
				ElMessage.error(res.resultDesc);
			}
		});
	}
};
</script>
<style scoped>
.header-btn {
	/* width: 100%; */
	/* display: flex; */
	position: absolute;
	top: 20px;
	right: 70px;
	/* justify-content: end; */
}
.details {
	width: 100%;
	background: rgb(75, 46, 46);
}
.item-time {
	width: 10%;
	display: flex;
	flex-direction: column;
	line-height: 30px;
	font-size: 14px;
	color: #999999;
	font-weight: 400;
	text-align: end;
	padding-right: 15px;
}
.item-line {
	margin-left: 14%;
	border-left: 1.5px solid #e3e3e3;
	/* background-color: aqua; */
	height: 30px;
}
.item-header {
	/* margin-left: 15px; */
	width: 60%;
	height: 60px;
	background-color: #f9f9fb;
	border-radius: 6px;
	line-height: 60px;
	font-size: 16px;
	font-weight: bold;
	padding-left: 15px;
	display: flex;
	justify-content: space-between;
	padding-right: 15px;
}
.item-detail {
	margin-left: 14%;
	border-left: 1.5px solid #e3e3e3;
}
.item-card {
	width: 90%;
	margin-left: 4%;
	min-height: 100px;
	background: #fff9f9;
	border-radius: 6px 6px 6px 6px;
	border: 1px solid #f5a1a1;
	font-size: 14px;
}
.item-card::before {
	content: '';
	position: relative;
	top: -25px;
	left: 4%;
	border: 9px solid transparent;
	border-bottom-color: #f5a1a1;
}
.card-trigle {
	content: '';
	position: relative;
	top: 16px;
	left: 7.7%;
	width: 15px;
	border: 8px solid transparent;
	border-bottom-color: #f5a1a1;
	z-index: 9;
}
.card-trigle-inside{
	content: '';
    position: relative;
    top: 1px;
    left: 7.7%;
    width: 15px;
    border: 8px solid transparent;
    border-bottom-color: #fff9f9;
    z-index: 9;
}
/deep/.el-collapse-item__header {
	border: none;
	/* position: absolute; */
	/* height: 20px; */
	background: transparent;
}
/deep/.el-collapse-item__header svg {
	position: absolute;
	bottom: 15px;
}
/deep/.el-form-item__label::before {
	content: '·';
	width: 4px;
	height: 4px;
	margin-right: 10px;
	color: #f5a1a1;
	font-weight: 700;
}
</style>
