<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar mb20">
			<div class="page-title task-title" @click="closeDialog">
				<img src="@/assets/public/back.png" class="mr5" />
				{{ activeName }}
			</div>
		</div>
		<el-tabs type="border-card" v-model="activeName" @tab-change="tabClick">
			<el-tab-pane class="box-detail" label="任务实例详情" name="任务实例详情">
				<el-form label-width="120px" label-position="left">
					<div class="content tab-pane" v-loading="detailLoading">
						<div class="box-title mb30">基本信息</div>
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="任务实例名称：">
									<span>电商企业共享</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="创建者：">
									<span>电商企业共享</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="任务实例id：">
									<span>电商企业共享</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="所属任务：">
									<span>电商企业共享</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="超时时间：">
									<span>电商企业共享</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="数据安全等级：">
									<span>电商企业共享</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="开始时间：">
									<span>电商企业共享</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="结束时间：">
									<span>电商企业共享</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="结束时间：">
									<div class="status-box">
										<div>
											<span class="status-green"></span>
											执行成功
										</div>
										<el-link v-if="'执行成功'" :underline="false" size="small" type="primary" @click="downloadHiddenResultFun">下载结果</el-link>
										<el-link v-if="'执行成功'" :underline="false" size="small" type="primary" @click="getHiddenResultFun">查看结果</el-link>
									</div>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="描述：">
									<span>电商企业共享</span>
								</el-form-item>
							</el-col>
						</el-row>
						<div class="box-title mt20 mb30">参与节点配置</div>
						<el-divider content-position="left"> <span style="color: #5079d9">客户端</span> </el-divider>
						<el-row>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="节点：">
									<span>电商企业共享</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-divider content-position="left"> <span style="color: #5079d9">服务端</span> </el-divider>
						<el-row>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="节点：">
									<span>电商企业共享</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="数据：">
									<span>电商企业共享</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-divider content-position="left"> <span style="color: #5079d9">字段配置</span> </el-divider>
						<el-row>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
								<el-form-item label="字段名称：">
									<span>电商企业共享</span>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-form>
			</el-tab-pane>
			<el-tab-pane class="box-detail" label="任务日志" name="任务日志">
				<div class="content tab-pane" v-loading="logLoading">
					<div class="box-title mb30">日志信息</div>
					<!-- <p class="ml30" v-html="log" style="white-space: pre-line"></p> -->
					<json-viewer :value="log" sort preview-mode> </json-viewer>
				</div>
			</el-tab-pane>
		</el-tabs>
		<!-- //查看结果弹窗 -->
		<resultView ref="resultViewRef" />
	</div>
</template>

<script setup lang="ts" name="hiddenHistoryDetail">
import { defineAsyncComponent, reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { getHiddenHistoryTaskDetail, getHiddenTaskLog, downloadHiddenResult, getHiddenResult } from '@/api/hiddenSearch';

const route = useRoute();
const router = useRouter();

const resultView = defineAsyncComponent(() => import('@/views/hiddenSearch/resultViewDialog.vue'));
const resultViewRef = ref();

const log = ref('');
onMounted(() => {
	console.log(route.query);
});

const activeName = ref('任务实例详情');
const detailLoading = ref(false);
const logLoading = ref(false);
const state = reactive({
	tableData: [
		{
			name: 'node01',
			data: '测试数据1',
			field: 'name',
			go: '12',
		},
		{
			name: 'node02',
			data: '测试数据2',
			field: 'task-id',
			go: '11',
		},
	],
});

const tabClick = () => {
	if (activeName.value === '任务实例详情') {
		getHiddenHistoryTaskDetailFun();
	} else {
		getHiddenTaskLogFun();
	}
};

const getHiddenHistoryTaskDetailFun = () => {
	detailLoading.value = true;
	getHiddenHistoryTaskDetail({})
		.then((res) => {
			detailLoading.value = false;
			if (res.resultCode === 0) {
				console.log(res);
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch(() => {
			detailLoading.value = false;
		});
};

const getHiddenTaskLogFun = () => {
	logLoading.value = true;
	getHiddenTaskLog({})
		.then((res) => {
			logLoading.value = false;
			if (res.resultCode === 0) {
				console.log(res);
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch(() => {
			logLoading.value = false;
		});
};

// 结果下载
const downloadHiddenResultFun = () => {
	downloadHiddenResult({}).then((res: any) => {
		const blob = new Blob([res], { type: 'text/plain' });
		const downloadElement = document.createElement('a');
		const href = window.URL.createObjectURL(blob);
		downloadElement.href = href;
		downloadElement.download = 'hidden.txt';
		document.body.appendChild(downloadElement);
		downloadElement.click();
		document.body.removeChild(downloadElement);
		window.URL.revokeObjectURL(href);
	});
};
// 结果查看
const getHiddenResultFun = () => {
	resultViewRef.value?.openDialog();
	getHiddenResult({}).then((res) => {});
};

//返回上一级
const closeDialog = () => {
	router.push('/hiddenSearch');
};
onMounted(() => {
	getHiddenHistoryTaskDetailFun();
	var a = [
		{
			group: 'favdxnzt1243p4xn1g3p2271vx8zgsy&k7mpamphg9m7hgm6seun4nvp5?v',
			ins_id: 'edtx3czjnakevtpn76rs1v6hs2zm8e98qzhmpcnrs6sasfbzy7ivse94hmvf8p”,',
			ins_name: '1281598662785 电商企业名单共',
			level: 'info',
			ms: 'node0l start to process PsI-Ecc init message',
			time: '2024-04-12T08:26:42+88:00',
		},
		{
			group: 'favdxnzt1243p4xn1g3p2271vx8zgsy&k7mpamphg9m7hgm6seun4nvp5?v',
			ins_id: 'edtx3czjnakevtpn76rs1v6hs2zm8e98qzhmpcnrs6sasfbzy7ivse94hmvf8p”,',
			ins_name: '1281598662785 电商企业名单共',
			level: 'info',
			ms: 'node0l start to process PsI-Ecc init message',
			time: '2024-04-12T08:26:42+88:00',
		},
		{
			group: 'favdxnzt1243p4xn1g3p2271vx8zgsy&k7mpamphg9m7hgm6seun4nvp5?v',
			ins_id: 'edtx3czjnakevtpn76rs1v6hs2zm8e98qzhmpcnrs6sasfbzy7ivse94hmvf8p”,',
			ins_name: '1281598662785 电商企业名单共',
			level: 'info',
			ms: 'node0l start to process PsI-Ecc init message',
			time: '2024-04-12T08:26:42+88:00',
		},
		{
			group: 'favdxnzt1243p4xn1g3p2271vx8zgsy&k7mpamphg9m7hgm6seun4nvp5?v',
			ins_id: 'edtx3czjnakevtpn76rs1v6hs2zm8e98qzhmpcnrs6sasfbzy7ivse94hmvf8p”,',
			ins_name: '1281598662785 电商企业名单共',
			level: 'info',
			ms: 'node0l start to process PsI-Ecc init message',
			time: '2024-04-12T08:26:42+88:00',
		},
		{
			group: 'favdxnzt1243p4xn1g3p2271vx8zgsy&k7mpamphg9m7hgm6seun4nvp5?v',
			ins_id: 'edtx3czjnakevtpn76rs1v6hs2zm8e98qzhmpcnrs6sasfbzy7ivse94hmvf8p”,',
			ins_name: '1281598662785 电商企业名单共',
			level: 'info',
			ms: 'node0l start to process PsI-Ecc init message',
			time: '2024-04-12T08:26:42+88:00',
		},
		{
			group: 'favdxnzt1243p4xn1g3p2271vx8zgsy&k7mpamphg9m7hgm6seun4nvp5?v',
			ins_id: 'edtx3czjnakevtpn76rs1v6hs2zm8e98qzhmpcnrs6sasfbzy7ivse94hmvf8p”,',
			ins_name: '1281598662785 电商企业名单共',
			level: 'info',
			ms: 'node0l start to process PsI-Ecc init message',
			time: '2024-04-12T08:26:42+88:00',
		},
		{
			group: 'favdxnzt1243p4xn1g3p2271vx8zgsy&k7mpamphg9m7hgm6seun4nvp5?v',
			ins_id: 'edtx3czjnakevtpn76rs1v6hs2zm8e98qzhmpcnrs6sasfbzy7ivse94hmvf8p”,',
			ins_name: '1281598662785 电商企业名单共',
			level: 'info',
			ms: 'node0l start to process PsI-Ecc init message',
			time: '2024-04-12T08:26:42+88:00',
		},
	] as any;
	log.value = JSON.parse(JSON.stringify(a));
});
</script>

<style scoped lang="scss">
.align-center {
	display: flex;
	align-items: center;
}
.status-box {
	display: flex;
	align-items: center;
	gap: 10px;
	.status-green {
		display: inline-block;
		vertical-align: middle;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: #00b42a;
	}
	.status-red {
		display: inline-block;
		vertical-align: middle;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: #00b42a;
	}
}
.flex-row-item {
	display: flex;
	margin-left: 30px;
	.item-label {
		// color: #999999;
		text-align: left;
		font-size: 14px;
		width: 120px;
		font-weight: 400;
	}
	.item-contont {
		flex: 1;
		font-size: 14px;
		// color: #333333;
		text-align: left;
	}
}
.m10 {
	margin: 0 0 10px 0;
}
.tab-pane {
	padding: 15px;
}
.goback {
	vertical-align: middle;
}
.task-title {
	cursor: pointer;
}
.box-title {
	font-weight: 700;
	margin-left: 10px;
	font-size: 16px;
	margin-bottom: 20px;

	&::before {
		content: '';
		display: inline-block;
		position: relative;
		top: 3px;
		right: 10px;
		width: 5px;
		height: 18px;
		background-color: #eb4b4b;
		border-radius: 5px;
	}
}
</style>