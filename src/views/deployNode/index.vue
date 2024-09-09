<template>
	<div class="system-user-container layout-padding">
		<div class="title-bar">
			<div class="page-title">可视化部署节点</div>
		</div>

		<el-card shadow="never" class="mt20 mb20 title-search">
			<template #header>
				<el-input
					clearable
					v-model="params.taskName"
					style="width: 240px"
					size="large"
					placeholder="请输入节点名称"
					@keyup.enter="searchList"
					@clear="getTableData"
				>
					<template #suffix>
						<el-icon class="el-input__icon" style="cursor: pointer" @click="searchList">
							<el-icon>
								<ele-Search />
							</el-icon>
						</el-icon>
					</template>
				</el-input>
			</template>

			<el-row :gutter="30" v-loading="list.loading">
				<el-col :span="6" class="mb20">
					<div class="add-deploy-node" @click="addDeploy">
						<el-icon class="mr5">
							<ele-Plus />
						</el-icon>
						<span>部署节点</span>
					</div>
				</el-col>
				<el-col :span="6" class="mb20" v-for="(item, index) in list.tableData" :key="index">
					<div class="content-deploy-node">
						<div class="deploy-node-item">
							<div class="item-name mb10">{{ item.partyName }}</div>
							<div class="mb5 itme-id">{{ item.partyId }}</div>

							<div class="item-time mb5">
								<el-icon class="mr5">
									<ele-Clock />
								</el-icon>
								<span>{{ item.createTime }}</span>
							</div>
							<div class="itme-id">
								<span
									class="mr2"
									:class="{
										'round-red': item.status == '0',
										'round-blue': item.status == '1',
										'round-green': item.status == '2',
									}"
								></span>
								<span>{{ auditStateList[item.status] }}</span>
								<span class="restart" v-if="item.status !== '2'" @click="restartResourceFun(item)">重新部署</span>
							</div>
						</div>
						<div class="deploy-node-btn">
							<div class="btn-item" @click="jump(item)">节点详情</div>
							<div class="item-2">|</div>
							<div class="btn-item">节点监控</div>
						</div>
					</div>
				</el-col>
			</el-row>
			<Pagination :total="list.total" v-model:page="list.pageNum" v-model:limit="list.pageSize" @pagination="getTableData" />
		</el-card>
	</div>
</template>

<script setup lang="ts" name="privacyIntersect">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { getDeployNodeList, restartResource, getDeployNodeDetail } from '@/api/deployNode';
const router = useRouter();

const params = reactive({
	taskName: '',
});

const auditStateList = ['部署异常', '已保存', '已部署'];

// 列表数据
const list = reactive({
	loading: false,
	pageNum: 1,
	pageSize: 10,
	total: 0,
	tableData: [] as any,
});

const addDeploy = () => {
	router.push('/deployNode/addDeployNode');
};

const restartResourceFun = (row: any) => {
	getDeployNodeDetail({
		partyId: row.partyId,
	}).then((res) => {
		if (res.resultCode === 0) {
			restartResource({ ...res.data }).then((res) => {
				if (res.resultCode === 0) {
					ElMessage.success('重新部署成功');
				} else {
					ElMessage.error(res.resultDesc);
				}
				getTableData();
			});
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};

const searchList = () => {
	getTableData();
};

const jump = (row: any) => {
	router.push({
		path: '/deployNode/deployDetail',
		query: {
			id: row.partyId,
		},
	});
};

// 获取列表
const getTableData = () => {
	list.loading = true;
	getDeployNodeList({
		pageSize: list.pageSize,
		pageNum: list.pageNum,
		partyName: params.taskName,
		onlineStatus: '',
	})
		.then((res) => {
			list.loading = false;
			if (res.resultCode === 0) {
				list.tableData = res.data.data;
				list.total = res.data.total;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch(() => {
			list.loading = false;
		});
};

// 页面加载时
onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss">
.restart {
	position: absolute;
	top: 20px;
	right: 20px;
	color: #547cd9;
	cursor: pointer;
	font-size: 14px;
}
.add-deploy-node {
	height: 200px;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f2f2f2;
	font-size: 20px;
	font-weight: bold;
	cursor: pointer;
}
.content-deploy-node {
	height: 200px;
	background-color: #f2f2f2;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.deploy-node-item {
		padding: 20px;
		position: relative;
		.itme-id {
			word-wrap: break-word;
		}
		.item-name {
			font-size: 18px;
			font-weight: bold;
		}
		.item-time {
			display: flex;
			align-items: center;
		}
	}
}
.deploy-node-btn {
	border-top: 1px solid #81a5c7;
	display: flex;
	align-items: center;
	height: 50px;
	.btn-item {
		width: 49%;
		display: flex;
		justify-content: center;
		cursor: pointer;
		&:hover {
			color: #547cd9;
		}
	}
	.item-2 {
		flex: 1;
	}
}
</style>
