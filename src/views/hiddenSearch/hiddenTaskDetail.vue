<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar mb20">
			<div class="page-title task-title" @click="closeDialog">
				<img src="@/assets/public/back.png" class="mr5" />
				任务详情
			</div>
		</div>
		<el-form label-width="120px" label-position="left" v-loading="detailLoading">
			<el-card class="w100 box-detail mb20" shadow="never">
				<div class="content">
					<div class="box-title mb30">基本信息</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="任务名称：">
								<span>PSI测试任务</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="创建者：">
								<span>PSI测试任务</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="所属项目：">
								<span>所属项目：</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="客户端：">
								<span>所属项目：</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="服务端：">
								<span>所属项目：</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="描述：">
								<span>所属项目：</span>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card class="w100 box-detail mb20" shadow="never">
				<div class="content">
					<div class="box-title mb30">调度信息</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="超时时间：">
								<span>所属项目：</span>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card class="w100 box-detail mb20" shadow="never">
				<div class="content">
					<div class="box-title mb30">参与节点配置</div>
					<el-table :data="state.tableData" style="width: 100%">
						<el-table-column type="index" width="70" label="序号" />
						<el-table-column prop="name" label="节点名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="data" label="数据名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="field" label="查询字段" show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
			</el-card>
			<el-card class="w100 box-detail mb20" shadow="never">
				<div class="content">
					<div class="box-title mb30">统计函数配置</div>
					<el-row :column="2">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="数据安全等级：">
								<span>所属项目：</span>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
		</el-form>
	</div>
</template>

<script setup lang="ts" name="hiddenTaskDetail">
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { getHiddenTaskDetail } from '@/api/hiddenSearch';

const route = useRoute();
const router = useRouter();

const detailLoading = ref(false);

const state = reactive({
	tableData: [
		{
			name: 'node01',
			data: '',
			field: 'name、task-id',
		},
		{
			name: 'node02',
			data: '测试数据1',
			field: '',
		},
	],
});

const getHiddenTaskDetailFun = () => {
	detailLoading.value = true;
	getHiddenTaskDetail({})
		.then((res) => {
			if (res.resultCode === 0) {
				detailLoading.value = false;
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch(() => {
			detailLoading.value = false;
		});
};

//返回上一级
const closeDialog = () => {
	router.push('/hiddenSearch');
};
onMounted(() => {
	getHiddenTaskDetailFun();
});
</script>

<style scoped lang="scss">
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