<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar mb20">
			<div class="page-title task-title" @click="closeDialog">
				<img src="@/assets/public/back.png" class="mr5" />
				新增可视化节点部署
			</div>
		</div>

		<el-form class="form-item" ref="deployForm" :rules="rules" :model="state.form" size="large" label-position="left" label-width="120px">
			<el-card class="mb20 box-detail" shadow="never">
				<div class="content">
					<div class="box-detail-title mb30">资源(k8s)配置</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="资源IP：" prop="k8sIp">
								<el-input v-model="state.form.k8sIp" placeholder="请输入k8s IP"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="资源port：" prop="k8sPort">
								<el-input v-model="state.form.k8sPort" placeholder="请输入k8s port"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="用户名：" prop="k8sUsername">
								<el-input v-model="state.form.k8sUsername" placeholder="请输入用户名"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="密码：" prop="k8sPassword">
								<el-input v-model="state.form.k8sPassword" placeholder="请输入密码"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item>
								<el-button type="primary" @click="k8sResourceValidateFun" size="large">k8s资源验证</el-button>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="集群标识：" prop="clusterName">
								<el-select @change="changeCluster" v-model="state.form.clusterName" placeholder="请选择集群标识">
									<el-option v-for="(item, index) in clusterList" :key="index" :label="item.clusterName" :value="item.clusterName"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="命名空间：" prop="evnId">
								<!-- <el-select @change="changeNameSpace" v-model="state.form.evnId" placeholder="请选择命名空间namespace">
									<el-option v-for="(item, index) in nameSpeace" :key="index" :label="item.evnId" :value="item.evnId"></el-option>
								</el-select> -->
								<el-input v-model="state.form.evnId" placeholder="请输入命名空间"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card class="mb20 box-detail" shadow="never">
				<div class="content">
					<div class="box-detail-title mb30">节点配置</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="节点名称：" prop="partyName">
								<el-input maxlength="32" v-model="state.form.partyName" placeholder="请输入6-32个字符"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="节点ID：" prop="partyId">
								<el-input disabled v-model="state.form.partyId" placeholder="请输入节点ID"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="仓库地址：" prop="partyImageRegistry">
								<el-input v-model="state.form.partyImageRegistry" placeholder="请输入镜像仓库地址"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="版本号：" prop="partyVersion">
								<el-input v-model="state.form.partyVersion" placeholder="请输入版本号"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="域名：" prop="partyUrl">
								<el-input v-model="state.form.partyUrl" placeholder="请输入域名"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card class="mb20 box-detail" shadow="never">
				<div class="content">
					<div class="box-detail-title mb30">组件配置</div>
					<div class="mb20 font-color33 font-weight700">数据库mysql</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="数据库IP：" prop="externalMysqlIp">
								<el-input v-model="state.form.externalMysqlIp" placeholder="请输入数据库IP"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="数据库port：" prop="externalMysqlPort">
								<el-input v-model="state.form.externalMysqlPort" placeholder="请输入数据库port"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="数据库名称：" prop="externalMysqlDatabase">
								<el-input v-model="state.form.externalMysqlDatabase" placeholder="请输入数据库名称"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="用户名：" prop="externalMysqlUser">
								<el-input v-model="state.form.externalMysqlUser" placeholder="请输入用户名"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="密码：" prop="externalMysqlPassword">
								<el-input v-model="state.form.externalMysqlPassword" placeholder="请输入密码"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<div class="mb20 font-color33 font-weight700">开放站点交互osx</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="资源cpu：" prop="osxResourcesCpu">
								<el-input v-model="state.form.osxResourcesCpu" placeholder="请输入资源cpu"></el-input>
								<span style="margin-left: 8px">m</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="资源内存：" prop="osxResourcesMemory">
								<el-input v-model="state.form.osxResourcesMemory" placeholder="请输入资源内存"></el-input>
								<span style="margin-left: 8px">Mi</span>
							</el-form-item>
						</el-col>
					</el-row>
					<div class="mb20 font-color33 font-weight700">python</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="日志等级：" prop="logLevel">
								<el-select v-model="state.form.logLevel" placeholder="请选择日志等级">
									<el-option v-for="(item, index) in levelList" :key="index" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="cpu核数：" prop="pythonResourcesCpu">
								<el-input v-model="state.form.pythonResourcesCpu" placeholder="请输入cpu核数"></el-input>
								<span style="margin-left: 8px">m</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="资源内存：" prop="pythonResourcesMemory">
								<el-input v-model="state.form.pythonResourcesMemory" placeholder="请输入资源内存"></el-input>
								<span style="margin-left: 8px">Mi</span>
							</el-form-item>
						</el-col>
					</el-row>
					<div class="mb20 font-color33 font-weight700">集群管理器</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="节点会话线程：" prop="sessionProcessorsPerNode">
								<el-input v-model="state.form.sessionProcessorsPerNode" placeholder="请输入节点会话线程"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="请求资源cpu：" prop="clusterResourcesCpu">
								<el-input v-model="state.form.clusterResourcesCpu" placeholder="请输入请求资源cpu"></el-input>
								<span style="margin-left: 8px">m</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="请求资源内存：" prop="clusterResourcesMemory">
								<el-input v-model="state.form.clusterResourcesMemory" placeholder="请输入资源内存"></el-input>
								<span style="margin-left: 8px">Mi</span>
							</el-form-item>
						</el-col>
					</el-row>
					<div class="mb20 font-color33 font-weight700">节点管理器</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="副本数：" prop="replicas">
								<el-input v-model="state.form.replicas" placeholder="请输入副本数"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="请求资源cpu：" prop="nodeResourcesCpu">
								<el-input v-model="state.form.nodeResourcesCpu" placeholder="请输入请求资源cpu"></el-input>
								<span style="margin-left: 8px">m</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="请求资源内存：" prop="nodeResourcesMemory">
								<el-input v-model="state.form.nodeResourcesMemory" placeholder="请输入资源内存"></el-input>
								<span style="margin-left: 8px">Mi</span>
							</el-form-item>
						</el-col>
					</el-row>
					<div class="mb20 font-color33 font-weight700">任务面板</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="用户名：" prop="fateboardUsername">
								<el-input v-model="state.form.fateboardUsername" placeholder="请输入用户名"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="密码：" prop="fateboardPassword">
								<el-input v-model="state.form.fateboardPassword" placeholder="请输入密码"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="资源cpu：" prop="fateboardResourcesCpu">
								<el-input v-model="state.form.fateboardResourcesCpu" placeholder="请输入资源cpu"></el-input>
								<span style="margin-left: 8px">m</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="资源内存：" prop="fateboardResourcesMemory">
								<el-input v-model="state.form.fateboardResourcesMemory" placeholder="请输入资源内存"></el-input>
								<span style="margin-left: 8px">Mi</span>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card class="mb20 box-detail" shadow="never">
				<div class="content">
					<div class="box-detail-title mb30">其它配置</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb30">
							<el-form-item label="客户端client：" prop="clientInclude">
								<el-select v-model="state.form.clientInclude" placeholder="请选择客户端client">
									<el-option label="是" :value="true"></el-option>
									<el-option label="否" :value="false"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
		</el-form>

		<div class="fotter mb20">
			<el-button @click="onCancel" type="info" plain size="large">取 消</el-button>
			<el-button type="primary" @click="onSubmit" size="large" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, getCurrentInstance, onMounted, watch } from 'vue';
import { descriptionItemProps, ElMessage, FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
import { addDeployNode, getNodeIdByName, k8sResourceValidate, getNamespaceList } from '@/api/deployNode';

const router = useRouter();

const fullscreenLoading = ref(false);

const deployForm = ref();

const rules = reactive<FormRules>({
	k8sIp: [
		{ required: true, trigger: 'blur', message: '请输入k8s IP' },
		{ pattern: /^(?!.*[\u4e00-\u9fa5]).*$/, message: '请输入正确的k8s ip', trigger: 'blur' },
	],
	k8sPort: [
		{ required: true, trigger: 'blur', message: '请输入k8s port' },
		{
			pattern: /^(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9]?[0-9]{1,4})$/,
			message: '请输入正确的k8s port',
			trigger: 'blur',
		},
	],
	k8sUsername: [
		{ required: true, trigger: 'blur', message: '请输入用户名' },
		{ pattern: /^(?!.*[\u4e00-\u9fa5]).*$/, message: '请输入正确的用户名', trigger: 'blur' },
	],
	k8sPassword: [
		{ required: true, trigger: 'blur', message: '请输入密码' },
		{ pattern: /^(?!.*[\u4e00-\u9fa5]).*$/, message: '请输入正确的密码', trigger: 'blur' },
	],
	evnId: [{ required: true, trigger: 'blur', message: '请输入命名空间namespace' }],
	partyName: [
		{ required: true, trigger: 'blur', message: '请输入节点名称' },
		{
			validator: (rule: any, value: any, callback: any) => {
				if (!/^(?!.*[\u4e00-\u9fa5]).{6,32}$/.test(value)) {
					callback(new Error('任务名称由长度为6-32个的非中文字符组成'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
	partyId: [{ required: true, trigger: 'blur', message: '请输入节点ID' }],
	partyImageRegistry: [
		{ required: true, trigger: 'blur', message: '请输入镜像仓库地址' },
		{ pattern: /^(?!.*[\u4e00-\u9fa5]).*$/, message: '请输入正确的镜像仓库地址', trigger: 'blur' },
	],
	partyVersion: [
		{ required: true, trigger: 'blur', message: '请输入版本号' },
		{ pattern: /^(?!.*[\u4e00-\u9fa5]).*$/, message: '请输入正确的版本号', trigger: 'blur' },
	],
	partyUrl: [
		{ required: true, trigger: 'blur', message: '请输入域名' },
		{ pattern: /^(?!.*[\u4e00-\u9fa5]).*$/, message: '请输入正确的域名', trigger: 'blur' },
	],
	osxResourcesCpu: [
		{ required: true, trigger: 'blur', message: '请输入资源cpu' },
		{ pattern: /^[0-9]\d*$/, message: '请输入正确的资源cpu', trigger: 'blur' },
	],
	osxResourcesMemory: [
		{ required: true, trigger: 'blur', message: '请输入资源内存' },
		{ pattern: /^[0-9]\d*$/, message: '请输入正确的资源内存', trigger: 'blur' },
	],
	logLevel: [{ required: true, trigger: 'blur', message: '请选择日志级别' }],
	pythonResourcesCpu: [
		{ required: true, trigger: 'blur', message: '请输入cpu核数' },
		{ pattern: /^[0-9]\d*$/, message: '请输入正确的cpu核数', trigger: 'blur' },
	],
	pythonResourcesMemory: [
		{ required: true, trigger: 'blur', message: '请输入资源内存' },
		{ pattern: /^[0-9]\d*$/, message: '请输入正确的资源内存', trigger: 'blur' },
	],
	sessionProcessorsPerNode: [
		{ required: true, trigger: 'blur', message: '请输入节点会话线程' },
		{ pattern: /^[0-9]\d*$/, message: '请输入正确的节点会话线程', trigger: 'blur' },
	],
	clusterResourcesCpu: [
		{ required: true, trigger: 'blur', message: '请输入请求资源cpu' },
		{ pattern: /^[0-9]\d*$/, message: '请输入正确的资源cpu', trigger: 'blur' },
	],
	clusterResourcesMemory: [
		{ required: true, trigger: 'blur', message: '请输入请求资源内存' },
		{ pattern: /^[0-9]\d*$/, message: '请输入正确的资源内存', trigger: 'blur' },
	],
	replicas: [
		{ required: true, trigger: 'blur', message: '请输入副本数量' },
		{ pattern: /^[0-9]\d*$/, message: '请输入正确的副本数量', trigger: 'blur' },
	],
	nodeResourcesCpu: [
		{ required: true, trigger: 'blur', message: '请输入请求资源cpu' },
		{ pattern: /^[0-9]\d*$/, message: '请输入正确的资源cpu', trigger: 'blur' },
	],
	nodeResourcesMemory: [
		{ required: true, trigger: 'blur', message: '请输入请求资源内存' },
		{ pattern: /^[0-9]\d*$/, message: '请输入正确的资源内存', trigger: 'blur' },
	],
	fateboardUsername: [
		{ required: true, trigger: 'blur', message: '请输入任务用户名' },
		{ pattern: /^(?!.*[\u4e00-\u9fa5]).*$/, message: '请输入正确的任务用户名', trigger: 'blur' },
	],
	fateboardPassword: [
		{ required: true, trigger: 'blur', message: '请输入任务密码' },
		{ pattern: /^(?!.*[\u4e00-\u9fa5]).*$/, message: '请输入正确的任务密码', trigger: 'blur' },
	],
	fateboardResourcesCpu: [
		{ required: true, trigger: 'blur', message: '请输入任务资源cpu' },
		{ pattern: /^[0-9]\d*$/, message: '请输入正确的任务资源cpu', trigger: 'blur' },
	],
	fateboardResourcesMemory: [
		{ required: true, trigger: 'blur', message: '请输入任务资源内存' },
		{ pattern: /^[0-9]\d*$/, message: '请输入正确的任务资源内存', trigger: 'blur' },
	],
	clientInclude: [{ required: true, trigger: 'blur', message: '请选择客户端client' }],
	externalMysqlIp: [
		{ required: true, trigger: 'blur', message: '请输入mysql地址' },
		{ pattern: /^(?!.*[\u4e00-\u9fa5]).*$/, message: '请输入正确的mysql地址', trigger: 'blur' },
	],
	externalMysqlPort: [
		{ required: true, trigger: 'blur', message: '请输入mysql端口' },
		{
			pattern: /^(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9]?[0-9]{1,4})$/,
			message: '请输入正确的mysql端口',
			trigger: 'blur',
		},
	],
	externalMysqlDatabase: [
		{ required: true, trigger: 'blur', message: '请输入mysql数据库名称' },
		{ pattern: /^(?!.*[\u4e00-\u9fa5]).*$/, message: '请输入正确的数据库名称', trigger: 'blur' },
	],
	externalMysqlUser: [
		{ required: true, trigger: 'blur', message: '请输入mysql用户名' },
		{ pattern: /^(?!.*[\u4e00-\u9fa5]).*$/, message: '请输入正确的mysql用户名', trigger: 'blur' },
	],
	externalMysqlPassword: [
		{ required: true, trigger: 'blur', message: '请输入mysql密码' },
		{ pattern: /^(?!.*[\u4e00-\u9fa5]).*$/, message: '请输入正确的mysql密码', trigger: 'blur' },
	],
	clusterName: [
		// { required: true, trigger: 'blur', message: '请选择集群标识' },
		{
			required: true,
			validator: (rule: any, value: any, callback: any) => {
				if (clusterList.value.length === 0) {
					callback(new Error('请进行k8s资源认证获取集群标识'));
				} else if (value === '') {
					callback(new Error('请选择集群标识'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
});

const clusterList = ref([] as any);

const nameSpeace = ref([] as any);

const levelList = ref([
	{ label: 'error', value: 'error' },
	{ label: 'info', value: 'info' },
	{ label: 'debug', value: 'debug' },
]);

const state = reactive({
	form: {
		k8sIp: '',
		k8sPort: '',
		clusterName: '',
		k8sUsername: '',
		k8sPassword: '',
		evnId: 'fate-',
		evnName: '',
		appDomain: '',
		domainName: '',
		partyName: 'fate-',
		partyId: '',
		partyImageRegistry: '',
		partyUrl: '',
		partyVersion: '',
		externalMysqlIp: '',
		externalMysqlPort: '',
		externalMysqlDatabase: '',
		externalMysqlUser: '',
		externalMysqlPassword: '',
		logLevel: '',
		sessionProcessorsPerNode: '',
		replicas: '',
		nodeResourcesCpu: '1000',
		nodeResourcesMemory: '2000',
		fateboardUsername: '',
		fateboardPassword: '',
		clientInclude: '',
		osxResourcesCpu: '4000',
		osxResourcesMemory: '8192',
		pythonResourcesCpu: '2000',
		pythonResourcesMemory: '4096',
		clusterResourcesCpu: '1000',
		clusterResourcesMemory: '2000',
		fateboardResourcesMemory: '8192',
		fateboardResourcesCpu: '4000',
	},
});

const openView = () => {
	getNodeIdByName({}).then((res) => {
		if (res.resultCode === 0) {
			state.form.partyId = res.data;
			state.form.partyName += res.data;
			state.form.evnId += res.data;
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};

const changeCluster = () => {
	// getNamespaceListFun();
};

//获取命名空间
// const getNamespaceListFun = () => {
// 	getNamespaceList({}).then((res) => {
// 		if (res.resultCode === 200) {
// 			nameSpeace.value = res.data;
// 		} else {
// 			ElMessage.error(res.resultDesc);
// 		}
// 	});
// };
// const changeNameSpace = () => {
// 	const speaceObj = nameSpeace.value.filter((obj: any) => {
// 		return obj.evnId === state.form.evnId;
// 	});
// 	state.form.evnName = speaceObj[0].evnName;
// 	state.form.appDomain = speaceObj[0].appDomain;
// 	state.form.domainName = speaceObj[0].domainName;
// };

// 验证k8s
const k8sResourceValidateFun = () => {
	k8sResourceValidate({
		k8sIp: state.form.k8sIp,
		k8sPort: state.form.k8sPort,
		k8sUsername: state.form.k8sUsername,
		k8sPassword: state.form.k8sPassword,
	}).then((res) => {
		if (res.resultCode === 0) {
			// ElMessage.success('k8s资源验证成功');
			clusterList.value = res.data;
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};

const onSubmit = () => {
	deployForm.value.validate((valid: any) => {
		if (valid) {
			fullscreenLoading.value = true;
			addDeployNode({
				...state.form,
			})
				.then((res) => {
					fullscreenLoading.value = false;
					if (res.resultCode === 0) {
						ElMessage.success('新增成功');
						closeDialog();
					} else {
						ElMessage.error(res.resultDesc);
					}
				})
				.catch(() => {
					fullscreenLoading.value = false;
				});
		}
	});
};

const onCancel = () => {
	closeDialog();
};

// 关闭弹窗
const closeDialog = () => {
	router.push('/deployNode');
};

onMounted(() => {
	openView();
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
.el-input,
.el-select,
.el-textarea {
	width: 70%;
}
</style>