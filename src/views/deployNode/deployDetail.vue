<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar mb20">
			<div class="page-title task-title" @click="closeDialog">
				<img src="@/assets/public/back.png" class="mr5" />
				{{ activeName }}
			</div>
		</div>
		<el-tabs type="border-card" v-model="activeName">
			<el-tab-pane class="box-detail" label="可视化节点详情" name="可视化节点详情">
				<el-form
					class="form-item"
					ref="deployForm"
					v-loading="fullscreenLoading"
					:model="state.form"
					size="large"
					label-position="left"
					label-width="120px"
				>
					<div class="content tab-pane">
						<div class="box-detail-title mb30">资源(k8s)配置</div>
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="资源IP：">
									<span>{{ state.form.k8sIp }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="资源port：">
									<span>{{ state.form.k8sPort }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="用户名：">
									<span>{{ state.form.k8sUsername }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="密码：">
									<span id="mySpan">{{ state.form.k8sPassword }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="集群标识：">
									<span>{{ state.form.clusterName }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="命名空间：">
									<span>{{ state.form.evnId }}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<div class="box-detail-title mb30">节点配置</div>
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="节点名称：">
									<span>{{ state.form.partyName }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="节点ID：">
									<span>{{ state.form.partyId }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="仓库地址：">
									<span>{{ state.form.partyImageRegistry }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="版本号：">
									<span>{{ state.form.partyVersion }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="域名：">
									<span>{{ state.form.partyUrl }}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<div class="box-detail-title mb30">组件配置</div>
						<div class="mb20 font-color33 font-weight700">数据库mysql</div>
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="数据库IP：">
									<span>{{ state.form.externalMysqlIp }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="数据库port：">
									<span>{{ state.form.externalMysqlPort }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="数据库名称：">
									<span>{{ state.form.externalMysqlDatabase }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="用户名：">
									<span>{{ state.form.externalMysqlUser }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="密码：">
									<span id="mySpan">{{ state.form.externalMysqlPassword }}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<div class="mb20 font-color33 font-weight700">开放站点交互osx</div>
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="资源cpu：">
									<span>{{ state.form.osxResourcesCpu }}</span>
									<span style="margin-left: 8px">m</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="资源内存：">
									<span>{{ state.form.osxResourcesMemory }}</span>
									<span style="margin-left: 8px">Mi</span>
								</el-form-item>
							</el-col>
						</el-row>
						<div class="mb20 font-color33 font-weight700">python</div>
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="日志等级：">
									<span>{{ state.form.logLevel }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="cpu核数：">
									<span>{{ state.form.pythonResourcesCpu }}</span>
									<span style="margin-left: 8px">m</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="资源内存：">
									<span>{{ state.form.pythonResourcesMemory }}</span>
									<span style="margin-left: 8px">Mi</span>
								</el-form-item>
							</el-col>
						</el-row>
						<div class="mb20 font-color33 font-weight700">集群管理器</div>
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="节点会话线程：">
									<span>{{ state.form.sessionProcessorsPerNode }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="请求资源cpu：">
									<span>{{ state.form.clusterResourcesCpu }}</span>
									<span style="margin-left: 8px">m</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="请求资源内存：">
									<span>{{ state.form.clusterResourcesMemory }}</span>
									<span style="margin-left: 8px">Mi</span>
								</el-form-item>
							</el-col>
						</el-row>
						<div class="mb20 font-color33 font-weight700">节点管理器</div>
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="副本数：">
									<span>{{ state.form.replicas }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="请求资源cpu：">
									<span>{{ state.form.nodeResourcesCpu }}</span>
									<span style="margin-left: 8px">m</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="请求资源内存：">
									<span>{{ state.form.nodeResourcesMemory }}</span>
									<span style="margin-left: 8px">Mi</span>
								</el-form-item>
							</el-col>
						</el-row>
						<div class="mb20 font-color33 font-weight700">任务面板</div>
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="用户名：">
									<span>{{ state.form.fateboardUsername }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="密码：">
									<span id="mySpan">{{ state.form.fateboardPassword }}</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="资源cpu：">
									<span>{{ state.form.fateboardResourcesCpu }}</span>
									<span style="margin-left: 8px">m</span>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="资源内存：">
									<span>{{ state.form.fateboardResourcesMemory }}</span>
									<span style="margin-left: 8px">Mi</span>
								</el-form-item>
							</el-col>
						</el-row>
						<div class="box-detail-title mb30">其它配置</div>
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
								<el-form-item label="客户端client：" prop="client">
									<span v-if="state.form.clientInclude">是</span>
									<span v-else>否</span>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-form>
			</el-tab-pane>
			<el-tab-pane class="box-detail" label="任务日志" name="任务日志">
				<div class="content tab-pane">
					<div class="box-detail-title mb30">日志信息</div>
					<!-- <p class="ml30" v-html="log" style="white-space: pre-line"></p> -->
					<json-viewer :value="log" sort> </json-viewer>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import { getDeployNodeDetail } from '@/api/deployNode';

const router = useRouter();
const route = useRoute();

const activeName = ref('可视化节点详情');

const fullscreenLoading = ref(false);

const deployForm = ref();

const log = ref({});

const state = reactive({
	form: {} as any,
});

const getDeployNodeDetailFun = () => {
	fullscreenLoading.value = true;
	getDeployNodeDetail({
		partyId: route.query.id,
	})
		.then((res) => {
			fullscreenLoading.value = false;
			if (res.resultCode === 0) {
				state.form = res.data;
				log.value = res.data.logList;
				// 假设你有一个id为'mySpan'的span标签
				var span = document.querySelectorAll('#mySpan') as any;

				// 将文本内容替换为等量的星号
				span.forEach((element: any) => {
					element.textContent = '*'.repeat(element.textContent.length);
				});
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch(() => {
			fullscreenLoading.value = false;
		});
};

// 关闭弹窗
const closeDialog = () => {
	router.push('/deployNode');
};

onMounted(() => {
	getDeployNodeDetailFun();
});
</script>

<style scoped lang="scss">
.font-weight700 {
	font-weight: 700;
}
.fotter {
	margin: 0 auto;
}
.task-title {
	cursor: pointer;
}

.tab-pane {
	padding: 15px !important;
}
</style>