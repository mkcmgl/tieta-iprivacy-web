<template>
	<div class="individual-center-container layout-padding">
		<div class="title-bar mb20">
			<div class="page-title task-title">
				<img src="@/assets/public/back.png" class="mr5" @click="backList" />模型训练面板</div>
		</div>
	<div class="f-detail-all">
		
		<section class="f-detail-info">
			<section style="height: 25%; background-color: white; border-bottom: 1px solid gray;padding: 10px">
			<div class="f-graphic-title">任务详情</div>
			<el-form title="任务详情" style="padding: 0 0 0 10px;">
				<el-form-item label="所属任务">{{ state.jobId }}</el-form-item>
				<el-form-item label="执行状态">
					
						<el-tag  :type="state.status">{{ state.status }}</el-tag>
					
				</el-form-item>
			</el-form>
			</section>
			<section style="height: 25%; background-color: white; border-bottom: 1px solid gray; padding-top: 10px">
				<el-form style="padding: 10px 0 0 20px;">
				<el-form-item label="角色">{{ state.role }}</el-form-item>
				<el-form-item>
					<el-button type="text" style="color: #409eff" @click="downloadDag"
						>DAG文件<el-icon><Download /></el-icon
					></el-button>
				</el-form-item>
				</el-form>
				
			</section>
			<section style="height: 50%; background-color: white; padding: 10px">
				<el-form style="padding: 10px 0 0 10px;">
				<el-form-item label="开始时间">{{ toDate(state.start_time) }}</el-form-item>
				<el-form-item label="结束时间">{{ toDate(state.start_time) }}</el-form-item>
				<el-form-item label="任务时长">{{ toTime(state.duration) }}</el-form-item>
                <el-form-item>
					<el-button type="info" @click="logDetailDialog" style="width: 100%" :disabled="btnDisable">任务日志</el-button>
				</el-form-item>
			</el-form>
			</section>
		</section>
		<section class="f-graphic">
			<article class="f-graphic-title">任务输出</article>
			<article class="f-graphic-subtitle">
				任务执行状态图
				<span>点击组件可查看详情</span>
			</article>
			<section class="f-graphic-dag">
				<FDag v-loading="dagLoading" :data="dataWithPorts" @loaded="loaded" @choose="choose" @retry="retry" />
			</section>
		</section>
		<section class="f-detail-info">
			<section style="height: 95%; background-color: white">
				<Parameter ref="parameter" />
				<section class="f-detail-parameter-btn">
					<el-button type="primary" :disabled="btnDisable" @click="detailDialog">查看输出</el-button>
				</section>
			</section>
		</section>

		<OutputDialog ref="outputDialogRef" @refresh="componentChoose" />
		<OutputLogDialog ref="outputLogDialogRef" />
	</div>
</div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, reactive } from 'vue';
import { fateBoardProgress, fateBoardDagDownload, rerunJob, fateBoardParameters, fateBoardPortData } from '@/api/fateboard';
import DialogRetry from './DialogRetry';
import Parameter from './parameters/Parameter.vue';
import { useRoute } from 'vue-router';
import { toDate, toTime } from '@/packages/fate-tools/lib/toDate';
import dagExplaination from '@/packages/fate-board/src/utils/dagExplaination';
import component from '@/packages/fate-visualization/lib/DAGGraphic/component';
import OutputDialog from './output/outputData.vue';
import OutputLogDialog from './output/outputLog.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import portConfigurationExplain from '@/utils/portCongifurationExplain';
import { cloneDeep } from 'lodash';
import { useRouter } from 'vue-router';

const emits = defineEmits(['retry', 'choose']);
const outputDialogRef = ref();
const outputLogDialogRef = ref();
// 定义变量内容
const btnDisable = ref(true);
const state = reactive({
	loading: false,
	partyId: '',
	jobId: '',
	role: '',
	status: '',
	component_name: '',
	component_id: '',
	start_time: 0,
	end_time: 0,
	duration: 0,
	details: {},
	dataset: {},
	dag: {},
});
const parameter = ref();
const detailDialog = () => {
	outputDialogRef.value.openDialog(history.state.party_id, history.state.job_id, history.state.role, state.component_name, history.state.nodeId);
};
const logDetailDialog = () => {
	outputLogDialogRef.value.openDialog(history.state.party_id, history.state.job_id, history.state.role, state.component_name, history.state.nodeId);
};
const router = useRouter()
const backList = () => {
	router.go(-1)
}
const componentChoose = async (comp?: any) => {
	await parameter.value.getParameter(comp);
	btnDisable.value = false;
};
const dataWithPorts = ref({});
const dagLoading = ref(true);

const loaded = () => {
	dagLoading.value = false;
};

const choose = async (comp: any) => {
	btnDisable.value = false;
	state.component_name = comp.name;

	emits('choose', comp);
	await parameter.value.getParameter(comp, history.state.job_id, history.state.party_id, history.state.role, history.state.nodeId);
};

const retry = async (comp: any) => {

	ElMessageBox.confirm(`任务将从结束处继续，更新作业状态可能需要几秒钟时间.`, `重试`, {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			rerunJob({ job_id: history.state.job_id, component_name: comp.name }, history.state.nodeId).then((res) => {
				if (res.code === 0) {
					ElMessage.success('任务重启成功');
				} else {
					ElMessage.error(res.msg);
				}
			});
		})
		.catch(() => {});
};

onMounted(() => {
	state.jobId = history.state.job_id;
	state.status = history.state.status;
	state.role = history.state.role;
	state.start_time = history.state.start_time;
	state.end_time = history.state.end_time;
	getBoardTaskInfo();
});
//下载dag文件
const downloadDag = async () => {
	// try {
	// 	if ('showSaveFilePicker' in window) {
	// 		const handle = await window.showSaveFilePicker({
	// 			suggestedName: history.state.job_id + '.yaml',
	// 		});
	// 		const file = await handle.getFile();
	// 		state.loading = true;
	// 		fateBoardDagDownload(
	// 			{
	// 				job_id: history.state.job_id,
	// 				party_id: history.state.party_id,
	// 				role: history.state.role,
	// 			},
	// 			history.state.nodeId
	// 		)
	// 			.then(async (res) => {
	// 				const writableStream = await handle.createWritable();
	// 				// writableStream.write(new Blob([res]));
	// 				writableStream.write(new Blob([JSON.stringify(res)]));

	// 				await writableStream.close();
	// 				ElMessage.success('下载成功');
	// 				state.loading = false;
	// 			})
	// 			.catch((err: any) => {
	// 				state.loading = false;
	// 			});
	// 	} else {
	// 		throw new Error('浏览器不支持 File System Access API');
	// 	}
	// } catch (error) {
	// 	console.error('写入文件失败:', error);
	// }
	state.loading = true;
			fateBoardDagDownload(
				{
					job_id: history.state.job_id,
					party_id: history.state.party_id,
					role: history.state.role,
				},
				history.state.nodeId
			)
		.then((res: any) => {
			state.loading = false;
			const blob = new Blob([res]);
			const downloadElement = document.createElement('a');
			const href = window.URL.createObjectURL(blob);
			downloadElement.href = href;
			downloadElement.download = history.state.job_id + '.yaml';
			document.body.appendChild(downloadElement);
			downloadElement.click();
			document.body.removeChild(downloadElement);
			window.URL.revokeObjectURL(href);
			ElMessage.success('下载成功');
		})
		.catch((err) => {
			state.loading = false;
			console.error(err);
		});
};

//获取面板参数详情
const getBoardTaskInfo = () => {
	fateBoardProgress(history.state.job_id, history.state.role, history.state.party_id, history.state.nodeId).then(async(res) => {
		if(res.resultCode === 0) {

		
		state.duration = res.data.duration;
		dataWithPorts.value = res.data.dependency_data;
		(state.details = res.data.summary_date.job), (state.dataset = res.data.summary_date.dataset);

		const origin: any = cloneDeep(res.data.dependency_data);

		for (const key in origin.component_list) {
			const each = origin.component_list[key];
			each.name = each.component_name;
			each.duration = each.time;

			const type = origin.component_module[each.name];
			let resp = await fateBoardPortData(type, history.state.nodeId);
			let portsConfig = portConfigurationExplain(resp.data);

			const stage = origin.component_stage ? origin.component_stage[each.name] : 'default';

			const ports: any = {};
			for (const key in portsConfig) {
				if (Array.isArray(portsConfig[key])) {
					ports[key] = [];
					for (const eachPort of portsConfig[key]) {
						if (
							eachPort.roles.some((item: string) => item === history.state.role) &&
							(eachPort.stages.some((item: any) => item === stage) ||
								eachPort.stages.some((item: any) => item === 'default') ||
								eachPort.stages.length === 0 ||
								!eachPort.stages[0])
						) {
							ports[key].push(eachPort);
						}
					}
				} else {
					ports[key] = portsConfig[key];
				}
				if (Array.isArray(ports[key])) {
					ports[key] = ports[key].sort((ap: any, bp: any) => {
						return ap.type.match(/model/i) ? 1 : ap.type.match(/validate/i) ? 1 : bp.type.match(/validate/i) ? -1 : 0;
					});
				}
			}
			Object.assign(each, ports);
			// });
		}
		dataWithPorts.value = origin;
	}else{
			ElMessage.error(res.resultDesc)
		}
	});
};
</script>

<style lang="scss" scoped>
@use 'sass:math';
@import '@/style/index.scss';
.f-detail-all {
	display: flex;
	
	flex-direction: row;
	justify-content: space-between;
	.f-detail-info {
		width: 20%;
		padding: 5px;
		padding-bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
}
.f-graphic-title {
	@include title-4-size();
	font-weight: bold;
	margin-bottom: 20px;
	@include flex-freeze();
	padding: 10px;
}
.f-graphic-text {
	font-weight: 400;
	padding: 5px 15px 5px 15px;
}
.f-graphic {
	width: 57%;
	background-color: $default-white;
	@include flex-col();
	justify-content: flex-start;
	align-items: flex-start;
    margin-top: 5px;
	padding: 10px;
	.f-graphic-subtitle {
		@include text-size();
		padding: 5px 10px 5px 10px;
		font-weight: bold;
		margin-bottom: $pale;
		color: var(--el-color-info-light-3);
		@include flex-freeze();

		& > span {
			padding-left: $pale;
			@include text-size-small();
			color: var(--el-color-info);
		}
	}

	.f-graphic-dag {
		position: relative;
		width: 100%;
		max-height: 800px;
		min-height: 800px;
		flex: 1 1 100%;
		border-radius: math.div($pale, 4);
		background-color: $default-white;
	}
}
.f-detail-parameter-btn {
	width: 100%;
	flex: 1 1 5%;
	padding-top: $pale;

	.el-button {
		width: 100%;
	}
}
</style>
