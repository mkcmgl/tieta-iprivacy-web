<template>
	<div class="enterprise-detail-container layout-padding" v-loading="state.submitloading">
		<div class="title-bar">
			<div class="page-title">
				<img src="@/assets/public/back.png" class="mr5" @click="backList" />
				企业管理
			</div>
			<el-button size="large" v-if="state.form.auditState == 0" class="button" type="primary" @click="save">
				<SvgIcon name="iconfont icon-shenhe1" />
				审核
			</el-button>
		</div>

		<el-card shadow="never" class="w100 box-detail mt20 mb20">
			<div class="box-detail-title mb30">基本信息</div>
			<el-form :model="state.form" label-width="150px" label-position="left" :rule="rules">
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
					<span>{{ state.form.provinceName + '-' + state.form.cityName + '-' + state.form.areaName }}</span>
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
		</el-card>

		<el-dialog v-model="state.dialogFormVisible" title="审核">
			<el-form ref="auditDialogFormRef" :model="state.dialogForm">
				<el-form-item label="审核结果" :label-width="state.formLabelWidth" prop="auditState">
					<el-radio-group v-model="state.dialogForm.auditState">
						<el-radio :label="1">通过</el-radio>
						<el-radio :label="2">驳回</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="审核意见" :label-width="state.formLabelWidth" prop="auditOpinion">
					<el-input v-model="state.dialogForm.auditOpinion" :rows="5" maxlength="100" type="textarea" />
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button size="large" type="info" plain @click="closeDialog">取 消</el-button>
					<el-button size="large" type="primary" :loading="state.submitloading" @click="auditSubmit"> 确 定 </el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script lang="ts" setup name="systemEnterpriseDetail">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage,FormRules } from 'element-plus';
import { getOrganizeDetail, auditOrganize } from '@/api/system/enterprise';
import other from '@/utils/other';
import { downloadImg } from '@/api/public';

const router = useRouter();
let organizeId = router.currentRoute.value.query.organizeId;
const auditDialogFormRef = ref();
const state = reactive({
	submitloading: false,
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
		provinceName: '',
		cityName: '',
		areaName: '',
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
const rules = reactive<FormRules>({
	auditState: [{ required: true, trigger: 'blur', message: '请选择审核意见' }],
	auditOpinion: [{ required: true, trigger: 'blur', message: '请输入驳回原因' }],
});
const organizeTypeList = ['铁塔用户认证', '企业实名认证'];

const auditStateList = ['待审核', '审核通过', '驳回'];

const getDetail = () => {
	getOrganizeDetail({
		organizeId,
	})
		.then((res) => {
			if (res.resultCode == 0) {
				state.form = res.data;
				let file = JSON.parse(state.form.organizeLicenseUrl);
				preview(file);
			} else {
				ElMessage.error(res.resultDesc);
			}
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

const backList = () => {
	router.push({
		path: '/system/enterprise',
	});
};

const save = () => {
	state.dialogFormVisible = true;
};
const auditSubmit = other.debounce(() => {
	state.submitloading = true;
	auditOrganize({
		organizeId,
		...state.dialogForm,
	})
		.then((res) => {
			if (res.resultCode == 0) {
				state.submitloading = false;
				ElMessage({
					type: 'success',
					message: '审核成功',
				});
				closeDialog();
				router.push({
					path: '/system/enterprise',
					query: {},
				});
			} else {
				state.submitloading = false;
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err) => {
			state.submitloading = false;
		});
}, 3000);
// 关闭弹窗
const closeDialog = () => {
	state.dialogFormVisible = false;
	// 清空表单，此项需加表单验证才能使用
	nextTick(() => {
		auditDialogFormRef.value.resetFields();
	});
};

// 页面加载时
onMounted(() => {
	getDetail();
});
</script>
<style scoped lang="scss">
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
