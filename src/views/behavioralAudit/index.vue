<template>
	<div class="behavior-audit layout-padding">
		<div class="title-bar">
			<div class="page-title">行为溯源</div>
		</div>
		<div class="tabs-top-header mt20">
			<div class="tabs-btn">
				<div
					class="tabs-title"
					v-for="(item, index) in state.tabsList"
					:key="index"
					:class="{ active: state.activeTopMenuIndex === index }"
					@click="changeTopMenu(index)"
				>
					{{ item.name }}
				</div>
			</div>
		</div>
		<el-card shadow="never" class="mb20 title-search">
			<template #header>
				<div class="tabs-header">
					<div class="tabs-btn">
						<div
							class="tabs-title"
							v-for="(item, index) in state.tabsList[state.activeTopMenuIndex].menuList"
							:key="index"
							:class="{ active: state.activeMenuIndex === index }"
							@click="changeMenu(index)"
						>
							{{ item }}
						</div>
					</div>
					<div>
						<el-input
							@keyup.enter="searchList"
							:placeholder="'请输入' + state.tabsList[state.activeTopMenuIndex].name + '名称'"
							v-model="state.customName"
							size="large"
						>
							<template #suffix>
								<el-icon class="el-input__icon" style="cursor: pointer" @click="searchList">
									<el-icon>
										<ele-Search />
									</el-icon>
								</el-icon> </template
						></el-input>
					</div>
				</div>
			</template>

			<el-table :data="state.tableData" v-loading="state.loading" style="width: 100%" width="100%">
				<el-table-column
					v-for="(column, index) in state.tabsList[state.activeTopMenuIndex].tableColumns"
					:key="index"
					:label="column.label"
					:prop="column.prop"
				></el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="scope">
						<el-button size="small" text type="info" @click="onOpenInference(scope.row.id)">追溯</el-button>
					</template>
				</el-table-column>
			</el-table>

			<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" @pagination="getTableData" />
		</el-card>

		<!-- <InferenceServiceDialog ref="inferenceServiceDialogRef" @refresh="getTableData()" /> -->
	</div>
</template>
<script setup lang="ts" name="behavioralAudit">
import { reactive, onMounted, defineAsyncComponent, ref } from 'vue';
import { getNodePage, getDataPage,getProjectPage } from '@/api/behavioralAudit';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { ITEM_RENDER_EVT } from 'element-plus/es/components/virtual-list/src/defaults';

// 引入组件
// const InferenceServiceDialog = defineAsyncComponent(() => import('@/views/behavioralAudit/dialog.vue'));

const inferenceServiceDialogRef = ref();

const state = reactive({
	modelName: '',
	customName: '',
	modelId: '' as any,
	activeMenuIndex: 0,
	activeTopMenuIndex: 0,
	// tabList: ['节点', '数据', '项目', '隐私计算任务', '推理服务'],
	tabsList: [
		{
			id: 0,
			name: '节点',
			menuList: ['现有节点列表', '已删除节点列表'],
			tableColumns: [
				{ label: '节点ID', prop: 'nodeId' },
				{ label: '节点名称', prop: 'nodeName' },
				{ label: '区块高度', prop: 'blockHeight' },
				{ label: '哈希值', prop: 'blockHash' },
				{ label: '最后一次操作', prop: 'lastBehaviorDes' },
				{ label: '存证时间', prop: 'certTime' },
			],
		},
		{
			id: 1,
			name: '数据',
			menuList: ['现有数据列表', '已删除数据列表'],
			tableColumns: [
				{ label: '数据ID', prop: 'id' },
				{ label: '数据名称', prop: 'name' },
				{ label: '区块高度', prop: 'blockHeight' },
				{ label: '哈希值', prop: 'blockHash' },
				{ label: '最后一次操作', prop: 'lastBehaviorDes' },
				{ label: '存证时间', prop: 'certTime' },
			],
		},
		{
			id: 2,
			name: '项目',
			menuList: ['现有项目列表'],
			tableColumns: [
				{ label: '项目ID', prop: 'id' },
				{ label: '项目名称', prop: 'name' },
				{ label: '区块高度', prop: 'blockHeight' },
				{ label: '哈希值', prop: 'blockHash' },
				{ label: '最后一次操作', prop: 'lastBehaviorDes' },
				{ label: '存证时间', prop: 'certTime' },
			],
		},
	],
	// menuList: ['现有节点列表', '已删除节点列表'],
	loading: false,
	pageNum: 1,
	pageSize: 10,
	total: 0,
	tableData: [],
	serviceTableData: [],
});

const statusMap = {
	running: '推理中',
	canceled: '推理失败',
	failed: '推理失败',
	success: '推理成功',
} as any;

const router = useRouter();

const changeMenu = (index: number, modelId?: string) => {
	state.activeMenuIndex = index;
	state.pageNum = 1;
	state.pageSize = 10;
	state.total = 0;
	state.modelId = modelId;
	getTableData();
};
const changeTopMenu = (index: number) => {
	state.activeTopMenuIndex = index;
	state.activeMenuIndex = 0;
	state.pageNum = 1;
	state.pageSize = 10;
	state.total = 0;
	getTableData();
};

const searchList = () => {
	state.pageNum = 1;
	getTableData();
};
// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	if (state.activeTopMenuIndex == 0) {
		getNodePage({
			pageSize: state.pageSize,
			pageNum: state.pageNum,
			isDel: state.activeMenuIndex.toString(),
			keyword:state.customName
		})
			.then((res) => {
				
				state.tableData = [];
				state.loading = false;
				if (res.resultCode === 0) {
					state.tableData = res.data.data;
					state.total = res.data.total;
				} else {
					ElMessage.warning(res.resultDesc);
				}
			})
			.catch((err) => {
				state.loading = false;
				console.error(err);
			});
	} else if (state.activeTopMenuIndex == 1) {
		getDataPage({
			pageSize: state.pageSize,
			pageNum: state.pageNum,
			isDel: state.activeMenuIndex.toString(),
			keyword:state.customName
		})
			.then((res) => {
				state.tableData = [];
				state.loading = false;
				if (res.resultCode === 0) {
					state.tableData = res.data.data;
					state.total = res.data.total;
				} else {
					ElMessage.warning(res.resultDesc);
				}
			})
			.catch((err) => {
				state.loading = false;
				console.error(err);
			});
	}else if(state.activeTopMenuIndex == 2) {
		getProjectPage({
			pageSize: state.pageSize,
			pageNum: state.pageNum,
			isDel: state.activeMenuIndex.toString(),
			keyword:state.customName
		})
			.then((res) => {
				state.tableData = [];
				state.loading = false;
				if (res.resultCode === 0) {
					state.tableData = res.data.data;
					state.total = res.data.total;
				} else {
					ElMessage.warning(res.resultDesc);
				}
			})
			.catch((err) => {
				state.loading = false;
				console.error(err);
			});
	}
};

const onOpenInference = (id: string) => {
	router.push({
		path: '/behavioralAudit/detail',
		query: { id:id,type:state.activeTopMenuIndex },
	});
};



onMounted(() => {
	getTableData();
});
</script>
<style scope lang="scss">
.behavior-audit {
	.tabs-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 40px;

		.tabs-btn {
			display: flex;
			gap: 20px;
			width: 250px;
			cursor: pointer;
			.tabs-title {
				font-size: 14px;
				font-weight: 600;
				&:hover {
					color: #eb4b4b;
				}
			}
		}

		.active {
			color: #eb4b4b;
		}
	}
	.tabs-top-header {
		width: 80%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 30px;

		.tabs-btn {
			display: flex;
			gap: 20px;
			width: 450px;
			cursor: pointer;
			.tabs-title {
				font-size: 14px;
				font-weight: 600;
				&:hover {
					color: #eb4b4b;
				}
			}
		}

		.active {
			color: #eb4b4b;
		}
	}
}
</style>
