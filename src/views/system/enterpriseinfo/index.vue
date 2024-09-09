<template>
	<div class="enterprise-detail-container layout-padding">
		<div class="title-bar">
			<div class="page-title">企业信息</div>
			<el-button v-if="state.form.auditState == 2" type="primary" size="large" @click="edit">
				<el-icon>
					<ele-Edit />
				</el-icon>
				编辑
			</el-button>
		</div>

		<el-card shadow="never" class="w100 box-detail mt20 mb20">
			<el-row v-if="state.form.orgRegisterState == 0">
				<el-col :span="24" class="flexbox">
					<div style="margin: 50px 0">请提交企业信息进行实名认证</div>
					<el-button size="large" class="button mb30" type="info" plain @click="toRegister">实名认证</el-button>
				</el-col>
			</el-row>
			<el-row v-else>
				<el-col :span="24">
					<div class="box-detail-title mb30">基本信息</div>
					<el-form :model="state.form" label-width="150px" label-position="left">
						<el-form-item label="审核状态">
							<span>{{ auditStateList[state.form.auditState as number] }}</span>
						</el-form-item>
						<el-form-item label="审核意见" v-if="state.form.auditState != 0">
							<span>{{ state.form.auditOpinion }}</span>
						</el-form-item>
						<el-form-item label="审核时间" v-if="state.form.auditState != 0">
							<span>{{ state.form.auditTime }}</span>
						</el-form-item>

						<el-form-item label="认证类型">
							<span>{{ organizeTypeList[parseInt(state.form.organizeType)] }}</span>
						</el-form-item>
						<el-form-item label="企业/机构名称">
							<span>{{ state.form.organizeName }}</span>
						</el-form-item>

						<el-form-item label="所属公司" v-if="state.form.organizeType == '0'">
							<span>{{ state.form.company }}</span>
						</el-form-item>

						<el-form-item label="企业营业执照" v-if="state.form.organizeType == '1'">
							<el-image
								style="width: 210px; height: 130px; background-color: #eeeeee"
								v-if="state.form.organizeLicenseUrl"
								:src="state.form.organizeLicenseUrl"
								:zoom-rate="1.2"
								:preview-src-list="[state.form.organizeLicenseUrl]"
								fit="contain"
							/>
						</el-form-item>

						<el-form-item label="企业地址" v-if="state.form.organizeType == '1'">
							<span>{{ state.form.zoneNameAll }}</span>
						</el-form-item>

						<el-form-item label="详细地址" v-if="state.form.organizeType == '1'">
							<span>{{ state.form.addr }}</span>
						</el-form-item>

						<div v-if="state.form.organizeType == '1'">
							<div class="box-detail-title mt30 mb30">联系人信息</div>
							<el-form-item label="联系人姓名">
								<span>{{ state.form.contacts }}</span>
							</el-form-item>
							<el-form-item label="手机号">
								<span>{{ state.form.phone }}</span>
							</el-form-item>
							<el-form-item label="客户端IP">
								<span>{{ state.form.clientAddress }}</span>
							</el-form-item>
							<el-form-item label="客户端port">
								<span>{{ state.form.clientPort }}</span>
							</el-form-item>
						</div>
					</el-form>
				</el-col>
			</el-row>
		</el-card>
	</div>
</template>
<script lang="ts" setup name="systemEnterpriseInfo">
import { ref, reactive, onMounted, nextTick, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getOrganizeDetail } from '@/api/system/enterpriseinfo';
import { downloadImg } from '@/api/public';

const router = useRouter();
const state = reactive({
	isOnceMore: false,
	form: {
		orgRegisterState: null,
		auditState: null as number | null,
		auditOpinion: '',
		organizeName: '',
		organizeType: '',
		organizeLicenseUrl: '',
		zoneNameAll: '',
		addr: '',
		contacts: '',
		phone: '',
		auditTime: '',
		company: '',
		clientAddress: '',
		clientPort: '',
	},
	dialogFormVisible: false,
	formLabelWidth: '100px',
	dialogForm: {
		auditState: null,
		auditOpinion: '',
	},
});

const organizeTypeList = ['铁塔用户认证', '企业实名认证'];

const auditStateList = ['待审核', '审核通过', '驳回'];

const getDetail = () => {
	getOrganizeDetail({})
		.then((res) => {
			if (res.resultCode == 0) {
				state.form = res.data;
				if (state.form.auditState != 1 && state.form.orgRegisterState != 0) {
					ElMessage.warning('企业信息审核未完成');
				}
				let file = JSON.parse(state.form.organizeLicenseUrl);
				preview(file);
			} else {
				ElMessage.error(res.resultDesc);
			}
			state.isOnceMore = true;
		})
		.catch((err) => {});
};
const preview = (file: any) => {
	downloadImg({ ...file })
		.then((res) => {
			const blob = new Blob([res as any]);
			state.form.organizeLicenseUrl = window.URL.createObjectURL(blob);
		})
		.catch((err) => {
			console.error(err);
		});
};
const toRegister = () => {
	router.push({
		path: '/system/enterpriseinfo/add',
		query: {
			type: 'add',
		},
	});
};
const edit = () => {
	router.push({
		path: '/system/enterpriseinfo/add',
		query: {
			type: 'edit',
		},
	});
};

// 页面加载时
onMounted(() => {
	getDetail();
});
onActivated(() => {
	if (state.isOnceMore) {
		getDetail();
	}
});
</script>
<style scoped lang="scss">
.auditbox {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20px;
}
.lamp-tips {
	padding-right: 10px;
	font-weight: 600;
	width: 42px;
	vertical-align: bottom;
	margin-left: 5px;
}
.lamp-tips-red {
	color: #ea0004;
}
.lamp-tips-green {
	color: #31b840;
}
.lamp-tips-blue {
	color: #2186fb;
}
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.flexbox {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
