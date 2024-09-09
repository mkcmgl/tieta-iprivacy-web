<template>
	<div class="individual-center-container layout-padding">
		<div class="title-bar mb20">
			<div class="page-title task-title">
				<img src="@/assets/public/back.png" class="mr5" @click="backList" />联邦建模</div>
		</div>
<el-form :model="state.ruleForm" label-width="90px" label-position="left" size="large">
		<el-card shadow="never" class="w100 box-detail">
			<div class="box-detail-title">基本信息</div>
			
				<el-row :gutter="20">
					<el-col :span="12"
						><el-form-item label="任务名称:">
							<span>{{ state.ruleForm.name }}</span>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="创建者:">
							<span>{{ state.ruleForm.organizeName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="任务id:">
							<span>{{ state.ruleForm.taskId }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="所属项目:">
							<span class="mr10">{{ state.ruleForm.projectName }}</span>
						</el-form-item></el-col
					>
					<el-col :span="12">
						<el-form-item label="算法类型:">
							<span>{{ state.ruleForm.fedType }}</span>
						</el-form-item></el-col
					>
					<el-col :span="12">
						<el-form-item label="创建时间:">
							<span>{{ state.ruleForm.createTime }}</span>
						</el-form-item></el-col
					>
					<el-col :span="24">
						<el-form-item label="任务描述:">
							<span>{{ state.ruleForm.description }}</span>
						</el-form-item></el-col
					>
				</el-row>
			
		</el-card>

		<el-card shadow="never" class="w100 box-detail mt20">
			<div class="box-detail-title">参与节点配置</div>
			<!-- <el-row :gutter="20" v-for="(item,index) in state.ruleForm.fieldEntityList" :key="index">
					<el-col :span="12"
						><el-form-item label="节点:">
							<span>{{ item.nodeName }}</span>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="数据:">
							<span>{{ item.dataName }}</span>
						</el-form-item>
					</el-col>
					
				</el-row> -->
				<el-table :data="state.ruleForm.fieldEntityList">
					<el-table-column label="节点" prop="nodeName"></el-table-column>
					<el-table-column label="节点ID" prop="nodeId"></el-table-column>
					<el-table-column label="数据" prop="dataName" width="200px"></el-table-column>
					<el-table-column label="数据ID" prop="dataId" width="300px"></el-table-column>
					<el-table-column label="namespace" prop="dataNamespace"></el-table-column>
				</el-table>
		</el-card>

		<el-card shadow="never" class="w100 box-detail mt20">
			<div class="box-detail-title">DAG配置</div>
			<el-row :gutter="20">
					<el-col :span="24"
						>
						<!-- {{ state.ruleForm.dagContent }} -->
						<json-viewer :value="state.ruleForm.dagContent" copyable boxed sort></json-viewer>
					</el-col>
					
				</el-row>
		</el-card>

		</el-form>
	</div>
</template>

<script setup lang="ts" name="systemUserDialog">
import { reactive, ref, onMounted } from 'vue';
import { getFlTaskDetail } from '@/api/flTask';
import { FormInstance } from 'element-plus';
import { useRoute,useRouter } from 'vue-router';

// 定义变量内容
const userDialogFormRef = ref<FormInstance>();
const route = useRoute();
const router = useRouter();
const state = reactive({
	loading: false,
	ruleForm: {
		taskId: '',
		name: '',
		projectId: '',
		projectName: '',
		description: '',
		organizeName: '',
		fedType: '',
		dagContent: '',
		createTime: '',
		fieldEntityList: [],
	},
	dialog: {
		isShowDialog: false,
	},
});

const statusList = ['启用', '停用'];

const backList = () => {
	router.go(-1)
}
// 获取详情数据
const getFlDetail = () => {
	state.loading = true;
	getFlTaskDetail({
		taskId: route.query.id
	}).then((res) =>{
		state.ruleForm = res.data;
        state.ruleForm.dagContent = JSON.parse(state.ruleForm.dagContent)
	})
	
};
// 页面加载时
onMounted(() => {
	getFlDetail();
});
</script>
<style lang="scss" scoped>
.Hidden {
	display: none;
}
.task-title {
	cursor: pointer;
}
</style>
