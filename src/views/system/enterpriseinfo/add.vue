<template>
	<div class="enterprise-detail-container layout-padding">
		<div class="title-bar">
			<div class="page-title">企业信息</div>
			<el-button class="button" type="primary" size="large" @click="toCheck" :loading="state.checkloading">
				<SvgIcon name="iconfont icon-shenhe1" />
				提交审核
			</el-button>
		</div>

		<el-card shadow="never" class="w100 box-detail mt20 mb20">
			<div class="box-detail-title mb30">基本信息</div>
			<el-form ref="organizeForm" :model="state.form" :rules="rules" size="large" label-width="150px" label-position="left">
				<el-row>
					<el-col :span="24">
						<el-form-item label="认证类型" prop="organizeType">
							<el-select :transfer="true" v-model="state.form.organizeType" style="width: 350px" placeholder="请选择认证类型" @change="onChangeType">
								<el-option v-for="items in state.organizeTypeList" :value="items.value" :label="items.label" :key="items.value"></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="企业/机构名称" prop="organizeName">
							<el-input
								v-model="state.form.organizeName"
								:maxlength="64"
								placeholder="请输入企业/机构名称"
								style="width: 350px"
								@input="state.form.organizeName = state.form.organizeName.replace(/\s+/g, '')"
							/>
						</el-form-item>

						<el-form-item label="所属公司" prop="company" v-if="state.form.organizeType == '0'">
							<el-input
								v-model="state.form.company"
								:maxlength="64"
								placeholder="请输入所属公司"
								style="width: 350px"
								@input="state.form.company = state.form.company.replace(/\s+/g, '')"
							/>
						</el-form-item>

						<el-form-item label="企业营业执照" prop="organizeLicenseUrl" style="min-width: 790px" v-if="state.form.organizeType == '1'">
							<div class="yyzz_imgupload_box">
								<image-upload @getImageList="getImageList($event)" accept=".jpg,.jpeg,.png" :fileSize="5" :value="state.imgList"></image-upload>
							</div>
							<div class="yyzz_note">
								1.支持的图片格式包括JPG、JPEG和PNG<br />

								2.图片不得超过5M<br />

								3.上传的图片需清晰完整<br />
							</div>
						</el-form-item>
						<el-form-item label="企业地址" prop="area" v-if="state.form.organizeType == '1'">
							<div style="width: 350px">
								<area-picker :areaWidth="'100%'" :code="state.form.area" @updateAreaCode="updateAreaCode($event)"></area-picker>
							</div>
						</el-form-item>
						<el-form-item label="详细地址" prop="addr" v-if="state.form.organizeType == '1'">
							<div style="width: 350px">
								<el-input
									v-model="state.form.addr"
									:maxlength="64"
									placeholder="请输入详细地址"
									style="width: 350px"
									@input="state.form.addr = state.form.addr.replace(/\s+/g, '')"
								/>
							</div>
						</el-form-item>
						<div v-if="state.form.organizeType == '1'">
							<div class="box-detail-title mt30 mb30">联系人信息</div>
							<el-form-item label="联系人姓名" prop="contacts">
								<el-input
									v-model="state.form.contacts"
									:maxlength="64"
									placeholder="请输入联系人姓名"
									style="width: 350px"
									@input="state.form.contacts = state.form.contacts.replace(/\s+/g, '')"
								/>
							</el-form-item>
							<el-form-item label="手机号" prop="phone">
								<el-input
									v-model="state.form.phone"
									:maxlength="11"
									placeholder="请输入手机号"
									style="width: 350px"
									@input="state.form.phone = state.form.phone.replace(/\s+/g, '')"
								/>
							</el-form-item>
							<el-form-item label="客户端IP" prop="clientAddress">
								<el-input
									v-model="state.form.clientAddress"
									:maxlength="64"
									placeholder="请输入客户端IP"
									style="width: 350px"
									@input="state.form.clientAddress = state.form.clientAddress.replace(/\s+/g, '')"
								/>
							</el-form-item>
							<el-form-item label="客户端port" prop="clientPort">
								<el-input
									v-model="state.form.clientPort"
									:maxlength="64"
									placeholder="请输入客户端port"
									style="width: 350px"
									@input="state.form.clientPort = state.form.clientPort.replace(/\s+/g, '')"
								/>
							</el-form-item>
						</div>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
	</div>
</template>
<script lang="ts" setup name="systemEnterpriseInfo">
import { defineAsyncComponent, ref, reactive, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, FormRules, FormInstance } from 'element-plus';
import { organizeAdd, getOrganizeDetail, organizeUpdate } from '@/api/system/enterpriseinfo';
import { setAjaxUrl } from '@/utils/PlatformName';
import { downloadImg } from '@/api/public';
const areaPicker = defineAsyncComponent(() => import('@/components/areaPicker/index.vue'));
const imageUpload = defineAsyncComponent(() => import('@/components/ImageUpload/index.vue'));

const router = useRouter();
let type = router.currentRoute.value.query.type;
const state = reactive({
	checkloading: false,
	url: setAjaxUrl(),
	form: {
		organizeName: '',
		organizeType: '1',
		organizeLicenseUrl: '',
		province: '',
		city: '',
		area: '',
		addr: '',
		contacts: '',
		phone: '',
		company: '',
		clientAddress: '',
		clientPort: '',
	},
	organizeTypeList: [
		{ label: '铁塔用户认证', value: '0' },
		{ label: '企业实名认证', value: '1' },
	],
	imgList: [] as Array<FileListType>,
});
const organizeForm = ref<FormInstance>();
const rules = reactive<FormRules>({
	organizeType: [{ required: true, message: '请选择认证类型', trigger: 'change' }],
	organizeName: [
		{ required: true, message: '请输入企业名称', trigger: 'blur' },
		{ min: 1, max: 64, message: '企业名称长度必须在1-64之间', trigger: 'blur' },
	],
	company: [
		{ required: true, message: '请输入所属公司', trigger: 'blur' },
		{ min: 1, max: 64, message: '所属公司长度必须在1-64之间', trigger: 'blur' },
	],
	organizeLicenseUrl: [{ required: true, message: '请上传企业营业执照', trigger: 'blur' }],
	area: [{ required: true, message: '请选择所在地区', trigger: 'change' }],
	addr: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
	contacts: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
	phone: [
		{ required: true, message: '请输入手机号', trigger: 'blur' },
		{ pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
	],
	clientAddress: [{ required: true, message: '请输入客户端IP', trigger: 'blur' }],
	clientPort: [{ required: true, message: '请输入客户端port', trigger: 'blur' }],
});

const getDetail = () => {
	getOrganizeDetail({})
		.then((res) => {
			if (res.resultCode == 0) {
				state.form = res.data;
				let file = JSON.parse(state.form.organizeLicenseUrl);
				state.imgList.push(file);
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
			state.imgList.push({
				url: window.URL.createObjectURL(blob),
			});
		})
		.catch((err) => {
			console.error(err);
		});
};

const toCheck = () => {
	organizeForm.value?.validate((valid) => {
		if (valid) {
			state.checkloading = true;
			if (type == 'add') {
				organizeAdd({
					...state.form,
				})
					.then((res) => {
						if (res.resultCode == 0) {
							state.checkloading = false;
							ElMessage({
								type: 'success',
								message: '提交成功',
							});
							router.push({
								path: '/system/enterpriseinfo',
								query: {},
							});
						} else {
							state.checkloading = false;
							ElMessage.error(res.resultDesc);
						}
					})
					.catch((err) => {
						state.checkloading = false;
					});
			} else if (type == 'edit') {
				organizeUpdate({
					...state.form,
				})
					.then((res) => {
						if (res.resultCode == 0) {
							state.checkloading = false;
							ElMessage({
								type: 'success',
								message: '编辑成功',
							});
							router.push({
								path: '/system/enterpriseinfo',
								query: {},
							});
						} else {
							state.checkloading = false;
							ElMessage.error(res.resultDesc);
						}
					})
					.catch((err) => {
						state.checkloading = false;
					});
			}
		}
	});
};

const updateAreaCode = (code: AreaCodeType) => {
	state.form.province = code.province;
	state.form.city = code.city;
	state.form.area = code.area;
};

const getImageList = (file: Array<FileListType>) => {
	if (file.length == 0) {
		state.form.organizeLicenseUrl = '';
	} else {
		state.form.organizeLicenseUrl = file[0].url as unknown as string;
	}
};

const onChangeType = () => {
	state.form = Object.assign(state.form, {
		organizeName: '',
		organizeLicenseUrl: '',
		province: '',
		city: '',
		area: '',
		addr: '',
		contacts: '',
		phone: '',
		company: '',
	});
};

// 页面加载时
onMounted(() => {
	if (type == 'edit') {
		getDetail();
	}
});
</script>
<style scoped lang="scss">
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

.yyzz_note {
	display: inline-block;
	font-size: 14px;
	line-height: 2;
	vertical-align: middle;
	margin-left: 20px;
}
</style>
