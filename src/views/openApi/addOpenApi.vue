<template>
	<div class="system-user-dialog-container">
		<el-dialog :close-on-click-modal="false" title="新增申请" v-model="isShowDialog" width="750px">
			<el-form ref="applyForm" :model="state.form" :rules="rules" size="large" label-position="left" label-width="110px">
				<el-row class="box-detail">
					<!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="组织名称" prop="nonEnterpriseName">
							<el-input maxlength="50" v-model="state.form.nonEnterpriseName" placeholder="请输入50个字符以内的名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="组织编码" prop="nonEnterpriseCode">
							<el-input v-model="state.form.nonEnterpriseCode" placeholder="请输入组织编码" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="手机号" prop="phoneNum">
							<el-input v-model="state.form.phoneNum" placeholder="请输入手机号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="节点" prop="nodeId">
							<el-select v-model="state.form.nodeId" placeholder="请选择节点">
								<el-option v-for="(item, index) in nodeList" :key="index" :label="item.nodeName" :value="item.nodeId"></el-option>
							</el-select>
						</el-form-item>
					</el-col> -->
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="自定义名称" prop="customName">
							<el-input v-model="state.form.customName" placeholder="企业名称-项目名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="使用场景">
							<template #label>
								<span class="desc-before">使用场景</span>
							</template>
							<el-input v-model="state.form.useScene" placeholder="请输入使用场景" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-alert type="info" :closable="false">
							<template #title>
								<div class="tips-title">
									<el-icon>
										<ele-InfoFilled />
									</el-icon>
									<span>使用提示</span>
								</div>
							</template>
							<template #default>
								<div>
									<div class="mb4">场景一数据脱敏服务，通过敏感数据脱敏，可用于数据共享时，共享脱敏处理数据的场景</div>
									<div class="mb4">场景二数据水印服务，可用于保护数据权属、数据溯源的场景</div>
									<div>场景三联邦建模服务，可用于多方数据不出域的情况下实现安全计算的场景</div>
								</div>
							</template>
						</el-alert>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="large" type="info" plain>取 消</el-button>
					<el-button type="primary" size="large" @click="onSubmit" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemUserDialog">
import { reactive, ref } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { addApply, getNodeList } from '@/api/openApi';

const emit = defineEmits(['refresh']);

const applyForm = ref();

const rules = reactive<FormRules>({
	nonEnterpriseName: [{ required: true, trigger: 'blur', message: '请输入组织名称' }],
	nonEnterpriseCode: [
		{ required: true, trigger: 'blur', message: '请输入组织编码' },
		{ pattern: /^(?!.*[\u4e00-\u9fa5]).*$/, message: '仅限于大小写字母和数字', trigger: 'blur' },

		// {
		// 	validator: (rule: any, value: any, callback: any) => {
		// 		if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/.test(value)) {
		// 			callback(new Error('组织编码由大写字母、小写字母和数字组成'));
		// 		} else {
		// 			callback();
		// 		}
		// 	},
		// 	trigger: 'blur',
		// },
	],
	customName: [{ required: true, trigger: 'blur', message: '请输入自定义名称' }],
	phoneNum: [
		{ required: true, trigger: 'blur', message: '请输入手机号' },
		{ pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
	],
	nodeId: [{ required: true, trigger: 'blur', message: '请选择节点' }],
});

const isShowDialog = ref(false);
const fullscreenLoading = ref(false);

const state = reactive({
	form: {
		// nonEnterpriseName: '',
		// nonEnterpriseCode: '',
		customName: '',
		useScene: '',
		// phoneNum: '',
		// nodeId: '',
	},
});

const nodeList = ref([] as any);

// 打开弹窗
const openDialog = (type: string, id: string) => {
	applyForm.value?.clearValidate();
	formReset();
	// getNodeListFun();
	isShowDialog.value = true;
};
//重置字段
const formReset = () => {
	state.form = {
		// nonEnterpriseName: '',
		// nonEnterpriseCode: '',
		customName: '',
		useScene: '',
		// phoneNum: '',
		// nodeId: '',
	};
};

// 获取节点列表
const getNodeListFun = () => {
	getNodeList({}).then((res) => {
		if (res.resultCode === 0) {
			nodeList.value = res.data;
		} else {
			ElMessage.error(res.resultDesc);
		}
	});
};

// 关闭弹窗
const closeDialog = () => {
	isShowDialog.value = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};

// 提交
const onSubmit = () => {
	applyForm.value.validate((valid: boolean) => {
		if (valid) {
			fullscreenLoading.value = true;
			addApply({
				customName: state.form.customName,
				useScene: state.form.useScene,
				// phoneNum: state.form.phoneNum,
				// nodeId: state.form.nodeId,
				// nonEnterpriseName: state.form.nonEnterpriseName,
				// nonEnterpriseCode: state.form.nonEnterpriseCode,
				// roles:''
			})
				.then((res) => {
					fullscreenLoading.value = false;
					if (res.resultCode === 0) {
						ElMessage.success('申请成功');
						closeDialog();
						emit('refresh');
					} else {
						ElMessage.error(res.resultDesc);
					}
				})
				.catch(() => {
					fullscreenLoading.value = false;
				});
		}
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.tips-title {
	display: flex;
	align-items: center;
	gap: 15px;
}
.el-select {
	width: 100%;
}
.flex-row-item {
	width: 100%;
	display: flex;
	gap: 10px;
}
.desc-before::before {
	content: '*';
	color: #fff;
	margin-right: 4px;
	background-color: #fff;
}
</style>
