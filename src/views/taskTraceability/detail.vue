<template>
	<div class="inference-service-detail layout-padding" v-loading="state.loading">
		<div class="title-bar mb20">
			<div class="page-title"><img src="@/assets/public/back.png" class="mr10" @click="backList" />追溯详情</div>
		</div>

		<el-card shadow="never" class="w100 box-detail mt20 mb20">
			<div class="header-btn">
				<el-button type="primary" @click="exportDetail"
					><img src="@/assets/behaviorAudit/daochu.png" class="mr5" style="width: 14px" />导出</el-button
				>
			</div>
			<div>
				<!-- <el-timeline style="width: 100%"> -->
				<div>
					<!-- <el-timeline-item v-for="(item, index) in activities" :key="index" placement="left" :type="item.status" :icon="startIcon"> -->
					<div v-for="(item, index) in activities" :key="index">
						<div class="item-line"></div>
						<div style="display: flex; width: 100%; flex-direction: column">
							<div style="display: flex; flex-direction: row" @click="item.showDetail = !item.showDetail">
								<div class="item-time">
									<span>{{ item.componentStartTime.split(' ')[0] }}</span>
									<span style="float: right">{{ item.componentStartTime.split(' ')[1] }}</span>
								</div>

								<div style="width: 8%; justify-content: center; display: flex">
									<img :src="item.icon" style="width: 60px; height: 60px" />
								</div>
								<div class="item-header">
									<span>{{ item.componentName }}</span>
									<div class="ml30">
										<img src="@/assets/behaviorAudit/bottom.png" v-if="!item.showDetail" style="width: 9px" />
										<img src="@/assets/behaviorAudit/top.png" v-else style="width: 9px" />
									</div>
								</div>
							</div>

							<div class="item-detail mt20" v-if="item.showDetail">
								<div class="card-trigle"></div>
								<div class="card-trigle-inside"></div>
								<el-card class="item-card">
									<el-form
										width="90%"
										label-width="110"
										label-position="left"
										v-if="item.type == 'startInfo' || item.type == 'initInfo' || item.type == 'hostInfo' || item.type == 'guestInfo'"
									>
										<el-row :gutter="20">
											<el-col :span="12" v-if="item.type == 'startInfo'"
												><el-form-item label="任务实例名称" prop="recordName">{{ item.recordName }}</el-form-item></el-col
											>
											<el-col :span="12" v-if="item.type == 'initInfo'">
												<el-form-item label="节点名称" prop="nodeName">{{ item.nodeName }}</el-form-item></el-col
											>
											<el-col :span="12" v-if="item.type == 'hostInfo' || item.type == 'guestInfo'">
												<el-form-item label="数据名称" prop="dataName">{{ item.dataName }}</el-form-item></el-col
											>
											<el-col :span="12" v-if="item.type == 'startInfo'"
												><el-form-item label="任务实例ID" prop="recordId" v-if="item.type == 'startInfo'">{{ item.recordId }}</el-form-item></el-col
											>
											<el-col :span="12" v-if="item.type == 'initInfo'">
												<el-form-item label="节点ID" prop="nodeId" v-if="item.type == 'initInfo'">{{ item.nodeId }}</el-form-item></el-col
											>
											<el-col :span="12" v-if="item.type == 'hostInfo' || item.type == 'guestInfo'">
												<el-form-item label="数据id" prop="dataId">{{ item.dataId }}</el-form-item></el-col
											>
											<el-col :span="12" v-if="item.type == 'startInfo'"
												><el-form-item label="区块哈希值" prop="blockHash">{{ item.blockHash }}</el-form-item></el-col
											>
											<el-col :span="12" v-if="item.type == 'initInfo'">
												<el-form-item label="节点IP" prop="nodeIp" v-if="item.type == 'initInfo'">{{ item.nodeIp }}</el-form-item></el-col
											>
											<el-col :span="12" v-if="item.type == 'hostInfo' || item.type == 'guestInfo'">
												<el-form-item label="name" prop="tableName">{{ item.tableName }}</el-form-item></el-col
											>
											<el-col :span="12" v-if="item.type == 'startInfo'"
												><el-form-item label="区块高度" prop="hashHeight">{{ item.hashHeight }}</el-form-item></el-col
											><el-col :span="12" v-if="item.type == 'initInfo'">
												<el-form-item label="节点端口号" prop="nodePort">{{ item.nodePort }}</el-form-item></el-col
											>
											<el-col :span="12" v-if="item.type == 'hostInfo' || item.type == 'guestInfo'">
												<el-form-item label="namespace" prop="dataNamespace">{{ item.dataNamespace }}</el-form-item></el-col
											>
											<el-col :span="12" v-if="item.type == 'startInfo'"
												><el-form-item label="所属任务" prop="name">{{ item.name }}</el-form-item></el-col
											>
											<el-col :span="12"
												><el-form-item label="开始时间" prop="recordCreateTime">{{ item.componentStartTime }}</el-form-item></el-col
											>
											<el-col :span="12" v-if="item.type == 'startInfo'"
												><el-form-item label="发起方" prop="recordCreateBy">{{ item.recordCreateBy }}</el-form-item></el-col
											>
											<!-- <el-col :span="12" v-if="item.type == 'startInfo'"
												><el-form-item label="所属机构" prop="enterpriseName">{{ item.enterpriseName }}</el-form-item></el-col
											> -->
											<!-- <el-col :span="12" v-if="item.type == 'startInfo'"
												><el-form-item label="协作方" prop="addUserName">{{ item.addUserName }}</el-form-item></el-col
											> -->
											<el-col :span="12"
												><el-form-item label="结果" prop="status">{{ item.status }}</el-form-item></el-col
											>
										</el-row>
									</el-form>
									<el-form width="90%" label-width="100" label-position="left" v-else-if="item.params">
										<el-row :gutter="20">
											<el-col :span="12" v-for="(param, i) in item.params" :key="i"
												><el-form-item :label="i">{{ param }}</el-form-item></el-col
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
import { reactive, onMounted, ref, ImgHTMLAttributes } from 'vue';
import { getCalculateDetail, exportCalculate } from '@/api/taskTraceability';
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

import { bottom } from '@antv/x6/lib/registry/port-layout/line';

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
	infosList: {
		startInfo: '任务启动',
		initInfo: '计算环境初始化',
		hostInfo: '发起节点本地数据准备',
		guestInfo: '参与节点本地数据准备',
	},

	// {name:'startInfo',label:'任务启动'},
	// {name:'initInfo',label:'计算环境初始化'},
	// {name:'hostInfo',label:'发起节点本地数据准备'},
	// {name:'guestInfo',label:'参与节点本地数据准备'},
});
const iconList = [
	startIcon4,startIcon5,startIcon6,startIcon7,startIcon8
]
const activeName = ref('');
const activities = ref([] as any);

const route = useRoute();
const router = useRouter();
const backList = () => {
	router.back();
};

onMounted(() => {
	state.type = route.query.type;
	//隐私求交溯源 1
	//联邦建模溯源 0
	getCalculateDetail({
		recordId: route.query.id,
		taskType: route.query.type.toString(),
	}).then((res) => {
		if (res.resultCode === 0) {
			activities.value = [];
			handelData(res.data);
		} else {
			ElMessage.error(res.resultDesc);
		}
	});

	activities.value.forEach((element: any) => {
		element.showDetail = false;
	});
});
const handelData = (data: any) => {
	let startStatus = data.startInfo.recordStatus == 'success' ? '成功' : '失败';
	activities.value.push({
		componentName: state.infosList['startInfo'] + startStatus,
		...data.startInfo,
		status: data.startInfo.recordStatus,
		componentStartTime: data.startInfo.recordCreateTime,
		type: 'startInfo',
		icon: startIcon0
	});
	let initStatus = data.startInfo.recordStatus == 'success' ? '成功' : '失败';
	activities.value.push({
		componentName: state.infosList['initInfo'] + initStatus,
		...data.initInfo,
		status: data.initInfo.dataStatus,
		componentStartTime: data.initInfo.dataStartTime,
		type: 'initInfo',
		icon:startIcon1
	});
	let hostStatus = data.startInfo.recordStatus == 'success' ? '成功' : '失败';
	activities.value.push({
		componentName: state.infosList['hostInfo'] + hostStatus,
		...data.hostInfo,
		status: data.hostInfo.dataStatus,
		componentStartTime: data.hostInfo.dataStartTime,
		type: 'hostInfo',
		icon: startIcon2
	});
	let guestStatus = data.startInfo.recordStatus == 'success' ? '成功' : '失败';
	activities.value.push({
		componentName: state.infosList['guestInfo'] + guestStatus,
		...data.guestInfo,
		status: data.guestInfo.dataStatus,
		componentStartTime: data.guestInfo.dataStartTime,
		type: 'guestInfo',
		icon: startIcon3
	});
	let start_task = ['reader_0'];
	getTasks(data.componentInfos, start_task);
};
function getTasks(componentInfos: any, start_task: string[]): any {
	if (start_task.length == 0) {
		return;
	}
	let tasks = [] as any;
	start_task.filter((task: string) => {
		let arr = [] as any;
		componentInfos.forEach((componentInfo: any) => {
			if (componentInfo.dependentTaskName.indexOf(task) != -1) {
				arr.push(componentInfo);
			}
		});
		if (arr.length == 0) {
			return;
		}
		arr.filter((item: any) => {
			activities.value.push({
				...item,
				status: item.componentStatus,
				icon: iconList[(activities.value.length - 4)%5]
			});
			tasks.push(item.taskName);
		});
	});

	return getTasks(componentInfos, tasks);
}
const exportDetail = () => {
	exportCalculate({
		recordId: route.query.id,
		taskType: route.query.type.toString(),
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
};
const handleIcon = (index:number) => {
	
}
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
/* .item-card::after {
    content: '';
    position: relative;
    top: -25px;
    left: 20px;

    border: 8px solid transparent;
    border-bottom-color: transparent;
  } */
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
