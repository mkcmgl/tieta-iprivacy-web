<template>
	<div class="inference-service-detail layout-padding" v-loading="state.loading">
		<div class="title-bar">
			<div class="page-title">推理服务</div>
		</div>

		<el-card shadow="never" class="w100 box-detail mt20 mb20">
			<div>
				<div class="box-detail-title">基本信息</div>
				<el-form :model="state.form" label-width="90px" label-position="left">
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="服务实例ID">
								<span>{{ serviceId }}</span>
							</el-form-item>
							<el-form-item label="模型来源">
								<span>{{ state.form.modelName }}</span>
							</el-form-item>
							<el-form-item label="结束时间">
								<span>{{ state.form.endTime }}</span>
							</el-form-item>
							<el-form-item label="任务状态">
								<div>
									<span
										class="mr2"
										:class="{
											'round-blue': state.form.status == 'running',
											'round-green': state.form.status == 'success',
											'round-red': state.form.status == 'canceled' || state.form.status == 'failed',
										}"
									></span>
									<span>{{ statusMap[state.form.status] }}</span>
								</div>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="所属项目">
								<span>{{ state.form.projectName }}</span>
							</el-form-item>
							<el-form-item label="开始时间">
								<span>{{ state.form.startTime }}</span>
							</el-form-item>
							<el-form-item label="服务描述">
								<span>{{ state.form.description }}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<div class="mt30">
				<div class="box-detail-title">参与节点配置</div>
				<el-form :model="state.form" label-width="90px" label-position="left">
					<div class="mb20 font-color33">发起方</div>
					<el-row :gutter="20" v-for="item in state.form.hostList" :key="item.id">
						<el-col :span="12">
							<el-form-item label="节点">
								<span>{{ item.nodeName }}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="数据">
								<span>{{ item.dataId }}</span>
							</el-form-item>
						</el-col>
					</el-row>
					<div class="mb20 mt20 font-color33">协作方</div>
					<el-row :gutter="20" v-for="item in state.form.guestList" :key="item.id">
						<el-col :span="12">
							<el-form-item label="节点">
								<span>{{ item.nodeName }}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="数据">
								<span>{{ item.dataId }}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-card>
	</div>
</template>
<script lang="ts" setup name="inferenceServiceDetail">
import { reactive, onMounted } from 'vue';
import { getOfflineServiceDetail } from '@/api/inferenceService';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

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
});

const statusMap = {
	running: '推理中',
	canceled: '推理失败',
	failed: '推理失败',
	success: '推理成功',
} as any;

const router = useRouter();

let serviceId = router.currentRoute.value.query.id;

const getDetail = () => {
	state.loading = true;
	getOfflineServiceDetail({ serviceId })
		.then((res) => {
			state.loading = false;
			if (res.resultCode === 0) {
				Object.assign(state.form, res.data);
				state.form.fieldList.forEach((item: any) => {
					if (item.role === 'host') {
						state.form.hostList.push(item);
					} else {
						state.form.guestList.push(item);
					}
				});
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			state.loading = false;
			console.error(err);
		});
};

onMounted(() => {
	getDetail();
});
</script>
