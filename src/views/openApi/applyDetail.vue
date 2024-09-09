<template>
	<div class="inference-service-detail layout-padding" v-loading="state.loading">
		<div class="title-bar mb20">
			<div class="page-title task-title" @click="closeDialog">
				<img src="@/assets/public/back.png" class="mr5" />
				openApi认证申请详情
			</div>
		</div>
		<el-card shadow="never" class="w100 box-detail mb20">
			<div>
				<div class="box-detail-title">申请信息</div>
				<el-form :model="state.form" label-width="100px" label-position="left">
					<el-row :gutter="20">
						<el-col :span="12" class="mb20">
							<el-form-item label="申请ID：">
								<span>{{ state.form.id }}</span>
							</el-form-item>
						</el-col>
						<!-- <el-col :span="12" class="mb20">
							<el-form-item label="组织编码：">
								<span>{{ state.form.nonEnterpriseCode }}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item label="组织名称：">
								<span>{{ state.form.nonEnterpriseName }}</span>
							</el-form-item>
						</el-col> -->
						<el-col :span="12" class="mb20">
							<el-form-item label="自定义名称：">
								<span>{{ state.form.customName }}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item label="应用场景：">
								<span>{{ state.form.useScene }}</span>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<div class="mt30">
				<div class="box-detail-title">openApi信息</div>
				<el-form :model="state.form" label-width="90px" label-position="left">
					<el-row :gutter="20">
						<el-col :span="12" class="mb20">
							<el-form-item label="审核状态：">
								<span
									class="mr2"
									:class="{
										'round-blue': state.form.auditState == '0',
										'round-green': state.form.auditState == '1',
										'round-red': state.form.auditState == '2',
									}"
								></span>
								<span>{{ auditStateList[state.form.auditState] }}</span>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20" v-if="state.form.auditState == '2'">
							<el-form-item label="驳回原因：">
								<span>{{ state.form.auditOpinion }}</span>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item label="操作手册：">
								<div class="download-btn">
									<el-icon color="#EB4B4B" class="mr3">
										<ele-Download />
									</el-icon>
									<el-text type="primary">下载</el-text>
								</div>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item label="access_key：">
								<div v-if="state.form.auditState !== '0'">
									<span>{{ state.form.accessKey }}</span>
									<el-tooltip placement="right" content="复制">
										<el-icon color="#EB4B4B" class="copy-document" @click="copy(state.form.accessKey)">
											<ele-CopyDocument />
										</el-icon>
									</el-tooltip>
								</div>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item label="secret_key：">
								<div v-if="state.form.auditState !== '0'">
									<span>{{ state.form.secretKey }}</span>
									<el-tooltip placement="right" content="复制">
										<el-icon color="#EB4B4B" class="copy-document" @click="copy(state.form.secretKey)">
											<ele-CopyDocument />
										</el-icon>
									</el-tooltip>
								</div>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="applydetail">
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { getApplyDetail, getApplyManual } from '@/api/openApi';
import commonFunction from '@/utils/commonFunction';

const { copyText } = commonFunction();
const route = useRoute();
const router = useRouter();

const state = reactive({
	loading: false,
	form: {} as any,
});

const id = ref('');

const auditStateList = ['待审核', '审核通过', '审核驳回'];

const copy = (value: string) => {
	copyText(JSON.stringify(value));
};

const detail = () => {
	state.loading = true;
	getApplyDetail({
		id: id.value,
	})
		.then((res) => {
			state.loading = false;
			if (res.resultCode === 0) {
				state.form = res.data;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch(() => {
			state.loading = false;
		});
};

const closeDialog = () => {
	router.push('/openApi/apply');
};

onMounted(() => {
	id.value = route.query.id;
	detail();
});
</script>

<style scoped lang='scss'>
.download-btn {
	display: flex;
	align-items: center;
	cursor: pointer;
}
.copy-document {
	margin-left: 10px;
	font-size: 18px;
	cursor: pointer;
}
.task-title {
	cursor: pointer;
}
</style>