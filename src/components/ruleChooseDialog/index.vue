<template>
	<div class="rule-choose-dialog">
		<el-dialog v-model="state.dialogTableVisible" title="选择编码规则" width="1000">
			<div class="content">
				<div class="search-box clearfix">
					<div class="fl">
						<div class="search-name">编码规则名称</div>
						<el-input placeholder="请输入编码规则名称" v-model="state.codeRuleName" size="default"></el-input>
					</div>
					<div class="fl">
						<div class="search-name">编码规则编号</div>
						<el-input placeholder="请输入编码规则编号" v-model="state.codeRuleCode" size="default"></el-input>
					</div>
					<div class="fr">
						<el-button type="primary" size="default" @click="searchList">
							<span>搜索</span>
						</el-button>
						<el-button size="default" @click="clearForm">
							<span>重置</span>
						</el-button>
					</div>
				</div>
			</div>
			<el-table :data="state.tableData" v-loading="state.loading" border style="width: 100%">
				<el-table-column prop="ruleName" label="发码规则名称" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="ruleCode" label="发码规则编号" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="codeExample" label="编码示例" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="codeStructIllustrate" label="编码规则结构" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" align="center" width="210">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onChooseThisRule(scope.row.ruleId)" v-if="ruleId !== scope.row.ruleId"
							>选择此规则</el-button
						>
						<el-text size="small" type="danger" v-else>已选择此规则</el-text>
					</template>
				</el-table-column>
			</el-table>
			<Pagination :total="state.total" v-model:page="state.pageNum" v-model:limit="state.pageSize" :background="false" @pagination="getTableData" />
		</el-dialog>
	</div>
</template>
<script setup lang="ts" name="ruleChooseDialog">
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { getCustomCodePage } from '@/api/codeManagement/codingRule';
import { useRouter } from 'vue-router';

const state = reactive({
	dialogTableVisible: false,
	codeRuleName: '',
	codeRuleCode: '',
	pageSize: 10,
	pageNum: 1,
	total: 0,
	loading: false,
	tableData: [],
});

const router = useRouter();

const props = defineProps({
	ruleId: {
		type: String,
		default: '',
	},
});

// 初始化表格数据
const getTableData = () => {
	state.loading = true;
	getCustomCodePage({
		codeRuleName: state.codeRuleName,
		codeRuleCode: state.codeRuleCode,
		pageSize: state.pageSize,
		pageNum: state.pageNum,
	})
		.then((res) => {
			state.tableData = [];
			state.loading = false;
			if (res.resultCode == 0) {
				state.tableData = [];
				state.tableData = res.data.data;
				state.total = res.data.total;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err) => {
			state.loading = false;
			console.log(err);
		});
};

const searchList = () => {
	state.pageNum = 1;
	getTableData();
};

// 重置
const clearForm = () => {
	state.codeRuleName = '';
	state.codeRuleCode = '';
	state.pageSize = 5;
	state.pageNum = 1;
	getTableData();
};

// 打开弹窗
const openDialog = () => {
	getTableData();
	state.dialogTableVisible = true;
};

const onChooseThisRule = (ruleId: string) => {
	state.dialogTableVisible = false;
	router.push({
		path: '/codeManage/generate/add',
	});
	router.push({
		path: '/codeManage/generate/add',
		query: { ruleId },
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style scope lang="scss">
.rule-choose-dialog {
	.search-box .search-name {
		width: 90px;
	}
}
</style>
