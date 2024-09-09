<template>
	<div class="enterprise-detail-container layout-padding" v-loading="fieldListLoading">
		<div class="title-bar">
			<div class="page-title">
				<img src="@/assets/public/back.png" class="mr5" @click="backList" />
				数据详情
			</div>
		</div>

		<el-card shadow="never" class="w100 box-detail mt20 mb20">
			<div class="box-detail-title mb30">数据详情</div>
			<el-form :model="dataDetailMsg" label-width="120px" label-position="left">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="节点名称：">
							<span>{{ dataDetailMsg.nodeName }}</span>
						</el-form-item>
						<el-form-item label="数据名称：">
							<span>{{ dataDetailMsg.name }}</span>
						</el-form-item>
						<el-form-item label="创建时间：">
							<span>{{ dataDetailMsg.createTime }}</span>
						</el-form-item>
						<el-form-item label="数据主键：">
							<span>{{ dataDetailMsg.keyName }}</span>
						</el-form-item>
						<div v-if="dataDetailMsg.typeId == '2'">
							<el-form-item label="数据库版本：">
								<span>{{ dataDetailMsg.upDatabaseHost }}</span>
							</el-form-item>
							<el-form-item label="主机端口号：">
								<span>{{ dataDetailMsg.upDatabasePort }}</span>
							</el-form-item>
							<el-form-item label="数据库密码：">
								<span>************</span>
							</el-form-item>
							<el-form-item label="数据库表：">
								<span>{{ dataDetailMsg.upDatabaseTable }}</span>
							</el-form-item>
						</div>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="数据ID:">
							<div :title="dataDetailMsg.id" class="long-list">{{ dataDetailMsg.id }}</div>
						</el-form-item>
						<el-form-item label="数据来源：">
							<span>{{ dataDetailMsg.typeId == '1' ? '文件上传' : '数据库导入' }}</span>
						</el-form-item>
						<el-form-item label="数据标签：">
							<div class="flex gap-2">
								<el-tag style="width: 60px" class="tag" v-for="tag in dataDetailMsg.label" :key="tag">
									<div class="tagContent" :title="tag">{{ tag }}</div>
								</el-tag>
							</div>
						</el-form-item>
						<div v-if="dataDetailMsg.typeId == '2'">
							<el-form-item label="数据库类型：">
								<span>{{ dataDetailMsg.upDatabaseType == '1' ? 'mysql' : '' }}</span>
							</el-form-item>
							<el-form-item label="主机IP/域名：">
								<span>{{ dataDetailMsg.upDatabaseHost }}</span>
							</el-form-item>
							<el-form-item label="数据库用户名：">
								<span>{{ dataDetailMsg.upDatabaseUsername }}</span>
							</el-form-item>
							<el-form-item label="数据库名：">
								<span>{{ dataDetailMsg.upDatabaseName }}</span>
							</el-form-item>
						</div>

						<el-form-item label="数据概述：">
							<span>{{ dataDetailMsg.description }}</span>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="数据表结构：">
							<el-table :data="dataDetailMsg.fieldList" border style="width: 100%; height: 320px">
								<el-table-column prop="name" label="字段名称" with="120" />
								<el-table-column prop="type" label="数据类型">
									<template #default="scope">
										<el-select disabled v-model="scope.row.type" placeholder="请选择状态" size="large" clearable>
											<el-option v-for="item in fieldTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
										</el-select>
									</template>
								</el-table-column>
								<el-table-column prop="description" label="描述" />
							</el-table>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="数据预览：">
							<ResourcePreviewTable :fieldListLoading="fieldListLoading" :data="dataList" style="width: 100%" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="projectManageDataDetail">
import { defineAsyncComponent, reactive, onMounted, onActivated, ref, toRefs, computed } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '@/stores/userInfo';
import { projectDataDetail, } from '@/api/dataManage';
const EditResourceTable = defineAsyncComponent(() => import('@/components/EditResourceTable/index.vue'));
const ResourcePreviewTable = defineAsyncComponent(() => import('@/components/ResourcePreviewTable/index.vue'));
const router = useRouter();
const route = useRoute();
const userInfos = useUserInfo();
const dataDetailMsg = ref(<DataDetailType>{});
const isEditPage = ref(false);
const fieldTypeList = [
	{
		value: 0,
		label: 'String',
	},
	{
		value: 1,
		label: 'Integer',
	},
	{
		value: 2,
		label: 'Double',
	},
	{
		value: 3,
		label: 'Long',
	},
	{
		value: 5,
		label: 'Boolean',
	},
];

onActivated(() => {
	getDataDetail();
});
const fromPath = ref('');
const fieldListLoading = ref(false);
const dataList = ref([]);
const fieldList = ref([]);
const getDataDetail = () => {
	dataList.value = [];
	dataDetailMsg.value = {};
	fieldList.value = [];
	if (route.query.id) {
		fieldListLoading.value = true;
		const data = { id: '', dataId: '' };
		projectDataDetail({id:route.query.id})
			.then((res) => {
				if (res.resultCode == 0) {
					dataDetailMsg.value = res.data;
					dataList.value = res.data.previewData;
					fieldList.value = res.data.fieldList;
					dataDetailMsg.value.label = res.data.label == '' ? '' : res.data.label.split(',');
				} else {
					ElMessage.error(res.resultDesc);
				}
			})
			.catch((e) => {
				ElMessage.error(e);
			})
			.finally(() => {
				fieldListLoading.value = false;
			});
	}
};

const backList = () => {
	// router.push({
	// 	path: '/dataManage',
	// });
	router.back();
};
</script>

<style scoped lang="scss">
.long-list {
	flex: 1;
	padding-right: 15px;
	word-break: break-word;
}
.w50 {
	width: 50%;
}
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #333;
	font-size: 22px;
	font-weight: 600;
}
.card-header-flex {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.long-list {
	flex: 1;
	padding-right: 15px;
	word-break: break-word;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.word-break {
	word-break: break-all;
}
.detail-text-width {
	width: calc(100% - 100px);
}
.w-100 {
	width: 100px;
}
.font-bold {
	font-weight: bold;
}
.tag {
	margin-right: 10px;
	.tagContent {
		width: 40px;
		/* word-break: break-all; */
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	::v-deep(.el-icon.el-tag__close) {
		margin-left: 0;
	}
}
</style>
