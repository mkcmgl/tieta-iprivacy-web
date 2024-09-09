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
								<span>{{ state.form?.name }}</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="创建者：">
								<span>{{ state.form?.createdBy }}</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="所属项目：">
								<span>{{ state.form?.projectName }}</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="任务发起节点：">
								<span>{{ node }}</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="结果保存格式：">
								<span>csv</span>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="任务描述：">
								<span>{{ state.form?.description }}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card class="w100 box-detail mt20 mb20" shadow="never">
				<div class="content">
					<div class="box-title mb30">调度信息</div>
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="超时时间：">
								<span>{{ state.form?.overTime }} 秒</span>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
			<el-card class="w100 box-detail mt20 mb20" shadow="never">
				<div class="content">
					<div class="box-title mb30">参与节点配置</div>
					<el-table :data="state.form.fieldEntityList" style="width: 100%">
						<el-table-column type="index" width="70" label="序号" />
						<el-table-column prop="nodeId" label="节点ID" show-overflow-tooltip></el-table-column>
						<el-table-column prop="nodeName" label="节点名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="dataName" label="数据名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="role" label="节点类型" show-overflow-tooltip>
							<template #default="scope">
								<span>{{ scope.row.role === 'guest' ? '发起方' : '协作方' }}</span>
							</template>
						</el-table-column>
						<!-- <el-table-column prop="sharding" label="是否分片" show-overflow-tooltip>
							<template #default="scope">
								<span>{{ scope.row.sharding === '1' ? '是' : '否' }}</span>
							</template>
						</el-table-column> -->
					</el-table>
				</div>
			</el-card>
			<el-card class="w100 box-detail mt20 mb20" shadow="never">
				<div class="content">
					<div class="box-title mb30">算法配置</div>
					<el-row :column="2">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="算法类型：">
								<span>{{ state.form?.algorithmType === '1' ? 'RSA' : 'ECDH' }}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-card>
		</el-form>
	</div>
</template>

<script setup lang="ts" name="privacyTaskDetail">
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { getPrivacyDetail } from '@/api/privacyIntersect';

const route = useRoute();
const router = useRouter();

const detailLoading = ref(false);

const state = reactive({
	form: {} as any,
});
const node = ref('');
const getPrivacyDetailFun = () => {
	detailLoading.value = true;
	getPrivacyDetail({
		taskId: route.query.taskId,
	})
		.then((res) => {
			detailLoading.value = false;
			if (res.resultCode === 0) {
				state.form = res.data;
				res.data.fieldEntityList.forEach((item: any) => {
					if (item.role === 'guest') {
						node.value = item.nodeName;
					}
				});
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch(() => {
			detailLoading.value = false;
		});
};

//返回上一级
const closeDialog = () => {
	router.push('/privacyIntersect');
};

onMounted(() => {
	getPrivacyDetailFun();
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