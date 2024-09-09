getDataType
<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="600px" :close-on-click-modal="false">
			<el-form ref="roleDialogFormRef" v-loading="formLoading" :model="state.ruleForm" :rules="rules" size="large" label-position="left" label-width="120px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
						<el-form-item label="节点名称" prop="nodeId" class="leftFormTip">
							<el-select
								:loading="selectLoading"
								:disabled="isEditPage"
								v-model="state.ruleForm.nodeId"
								clearable
								placeholder="请选择节点名称"
								style="width: 100%"
							>
								<el-option v-for="item in nodeListOptions" :key="item.id" :label="item.nodeName" :value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
						<el-form-item label="数据名称" prop="name" class="leftFormTip">
							<el-input :disabled="isEditPage" v-model="state.ruleForm.name" placeholder="请输入数据名称" clearable></el-input>
							<!-- <span style="margin-top: 10px; line-height: 1.6; font-size: 14px; color: #b8b8b8"> 6-32个字符，只能由英文字母、数字及!"'”组成 </span> -->
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
						<el-form-item label="数据使用场景" prop="useScene" class="leftFormTip danRadio">
							<!-- <el-select :disabled="isEditPage" v-model="state.ruleForm.typeId" clearable placeholder="请选择数据格式" style="width: 100%">
								<el-option v-for="item in dataModel" :key="item.id" :label="item.dictValue" :value="item.id" />
							</el-select> -->
							<el-radio-group :disabled="isEditPage" v-model="state.ruleForm.useScene" class="ml-4">
								<el-radio value="1" size="large">多方安全计算</el-radio>
								<el-radio value="2" size="large">联邦建模</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
						<el-form-item label="数据来源" prop="typeId" class="leftFormTip danRadio">
							<!-- <el-select :disabled="isEditPage" v-model="state.ruleForm.typeId" clearable placeholder="请选择数据格式" style="width: 100%">
								<el-option v-for="item in dataModel" :key="item.id" :label="item.dictValue" :value="item.id" />
							</el-select> -->
							<el-radio-group :disabled="isEditPage" v-model="state.ruleForm.typeId" class="ml-4" @change="handleChange">
								<el-radio value="1" size="large">文件上传</el-radio>
								<el-radio value="2" size="large">数据库导入</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-form
						ref="dataRadioFormRef"
						:model="state.ruleForm"
						:rules="dataRules"
						size="large"
						label-position="left"
						label-width="120px"
						style="width: 100%"
					>
						<el-col v-if="state.ruleForm.typeId == '1'" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
							<el-form-item prop="fileId">
								<el-upload
									class="upload-demo"
									:file-list="state.ruleForm.fileList"
									:on-remove="handleDelete"
									:on-success="handleSuccess"
									:before-upload="handleBeforeUpload"
									:on-error="handleUploadError"
									:on-exceed="handleExceed"
									drag
									:limit="1"
									:action="_ACTIONURL_"
									multiple
									v-if="!isEditPage"
								>
									<el-icon class="el-icon--upload" style="color: #5079d9"><upload-filled /></el-icon>
									<div class="el-upload__text">点击或拖拽数据文件到此处</div>
									<template #tip>
										<div class="el-upload__tip" style="line-height: 20px; color: #b8b8b8">
											1.只能上传.csv文件，且不超过1MB<br />2.请确保上传的资源文件编码为UTF8
										</div>
									</template>
								</el-upload>
							</el-form-item>
						</el-col>
						<el-col v-else :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
							<el-form-item label="数据库类型" prop="upDatabaseType" class="leftFormTip">
								<el-select
									:disabled="isEditPage"
									v-model="state.ruleForm.upDatabaseType"
									clearable
									placeholder="请选择数据库类型"
									style="width: 100%"
								>
									<el-option v-for="item in dataModel" :key="item.id" :label="item.dictValue" :value="item.id" />
								</el-select>
							</el-form-item>
							<el-form-item label="数据库版本" prop="upDatabaseVersion" class="leftFormTip">
								<el-input :disabled="isEditPage" v-model="state.ruleForm.upDatabaseVersion" placeholder="请输入数据库版本" clearable></el-input>
							</el-form-item>
							<el-form-item label="主机IP/域名" prop="upDatabaseHost" class="leftFormTip">
								<el-input :disabled="isEditPage" v-model="state.ruleForm.upDatabaseHost" placeholder="请输入主机IP/域名" clearable></el-input>
							</el-form-item>
							<el-form-item label="主机端口号" prop="upDatabasePort" class="leftFormTip">
								<el-input :disabled="isEditPage" v-model="state.ruleForm.upDatabasePort" placeholder="请输入主机端口号" clearable></el-input>
							</el-form-item>

							<el-form-item label="用户名" prop="upDatabaseUsername" class="leftFormTip">
								<el-input :disabled="isEditPage" v-model="state.ruleForm.upDatabaseUsername" placeholder="请输入数据库用户名" clearable></el-input>
							</el-form-item>
							<el-form-item label="密码" prop="upDatabasePassword" class="leftFormTip">
								<!-- <el-col :span="16"> -->
								<el-input
									style="flex: 0.8"
									type="passWord"
									:disabled="isEditPage"
									v-model="state.ruleForm.upDatabasePassword"
									placeholder="请输入数据库密码"
									clearable
								></el-input>
								<div style="flex: 0.1"></div>
								<el-button :disabled="isEditPage" :loading="checkLinkLoading" style="flex: 0.1" plain type="primary" @click="checkLink"
									>检测链接</el-button
								>
								<!-- </el-col> -->
							</el-form-item>
							<el-form-item label="数据库名称" prop="upDatabaseName" class="leftFormTip">
								<el-input :disabled="isEditPage" v-model="state.ruleForm.upDatabaseName" placeholder="请输入数据库名称" clearable></el-input>
							</el-form-item>
							<el-form-item label="数据库表" prop="upDatabaseTable" class="leftFormTip">
								<el-input :disabled="isEditPage" v-model="state.ruleForm.upDatabaseTable" placeholder="请输入数据库表" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-form>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
						<el-form-item label="数据标签" class="leftFormTip">
							<div class="flex gap-2">
								<el-tag
									style="width: 60px"
									class="tag"
									v-for="tag in state.ruleForm.label"
									:key="tag"
									closable
									:disable-transitions="false"
									@close="handleClose(tag)"
								>
									<div class="tagContent" :title="tag">{{ tag }}</div>
								</el-tag>
								<el-input
									style="width: 70px"
									v-if="inputVisible"
									ref="InputRef"
									v-model="inputValue"
									class="w-20"
									size="large"
									@keyup.enter="handleInputConfirm"
									@blur="handleInputConfirm"
								/>
								<el-button style="height: 32px" v-else class="button-new-tag" type="primary" plain size="large" @click="showInput">
									+添加标签</el-button
								>
							</div>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
						<el-form-item label="主键" class="leftFormTip" prop="keyName">
							<el-input :disabled="isEditPage" v-model="state.ruleForm.keyName" placeholder="请输入数据主键" maxlength="300"></el-input>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
						<el-form-item label="数据描述" class="leftFormTip">
							<el-input
								v-model="state.ruleForm.description"
								type="textarea"
								placeholder="请输入数据描述,300字内"
								maxlength="300"
								show-word-limit
							></el-input>
						</el-form-item>
					</el-col>

					<el-col v-if="isEditPage" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
						<el-row :gutter="20" class="data-container">
							<el-col :span="24">
								<!-- <EditResourceTable border height="500" :data="fieldList" :is-edit-page="isEditPage" @change="handleResourceChange" /> -->
								<el-table :data="fieldList" class="table-list" v-loading="fieldListLoading">
									<el-table-column align="center" label="字段名称" prop="name" />
									<el-table-column align="center" label="数据类型" prop="type">
										<template #default="scope">
											<el-select v-model="scope.row.type" size="mini" placeholder="请选择">
												<el-option v-for="item in fieldTypeList" :key="item.value" :label="item.label" :value="item.label" />
											</el-select>
										</template>
									</el-table-column>
									<el-table-column align="center" label="描述" prop="fieldDesc">
										<template #default="scope">
											<el-input v-model="scope.row.description" size="mini" :maxlength="12" placeholder="请输入描述" show-word-limit />
										</template>
									</el-table-column>
								</el-table>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" type="info" plain size="large">取 消</el-button>

					<el-button :loading="handleLoading" type="primary" @click="onSubmit" size="large">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="addDataManageDialog">
import { reactive, ref, nextTick, getCurrentInstance, onUpdated, defineAsyncComponent } from 'vue';
import { getMenuTree } from '@/api/menu';
import { setRole, updateRole } from '@/api/system/role';
import { ElMessage, FormInstance, FormRules, ElMessageBox, ElLoading } from 'element-plus';
import { ElTree } from 'element-plus';
import { deepClone } from '@/utils/other';
import { dataDetail, dataFilePreview, getDataType, nodeList, nodeListEffective, saveData, editData, checkLinkConnectTables } from '@/api/dataManage';
const { proxy } = getCurrentInstance() as any;
import { UploadFilled } from '@element-plus/icons-vue';
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
import type { ElInput, UploadProps, UploadUserFile } from 'element-plus';
// import { DataModelList, NodeOptionsListType, RowRoleType, TreeType } from '@/types/views';
import { setDataUploadUrl } from '@/utils/PlatformName.ts';
const EditResourceTable = defineAsyncComponent(() => import('@/components/EditResourceTable/index.vue'));
const ResourcePreviewTable = defineAsyncComponent(() => import('@/components/ResourcePreviewTable/index.vue'));
// import ResourcePreviewTable from '@/components/ResourcePreviewTable'
// 定义变量内容
const roleDialogFormRef = ref<FormInstance>();
const dataRadioFormRef = ref<FormInstance>();
const menu = ref<InstanceType<typeof ElTree>>();
const fieldListLoading = ref(false);
const isEditPage = ref(false);
const selectLoading = ref(false);
const formLoading = ref(false);
const dataList = ref([]);
const fieldList = ref([]);
const _ACTIONURL_ = setDataUploadUrl();
const radio1 = ref('1');
const fieldTypeList = ref([
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
]);
const handleLoading = ref(false);
const checkLinkLoading = ref(false);
const state = reactive({
	ruleForm: {
		id: '',
		description: '',
		nodeId: '',
		name: '',
		roleKey: '',
		useScene: '1',
		typeId: '1',
		fileList: [],
		keys: [] as string[],
		sort: 0, // 排序
		loading: false,
		remark: '' as string | null, // 角色描述
		fileId: '',
		upDatabaseType: '',
		upDatabaseHost: '',
		upDatabasePort: '',
		upDatabaseName: '',
		upDatabaseVersion: '',
		upDatabaseUsername: '',
		upDatabasePassword: '',
		upDatabaseTable: '',
		label: [] as string[],
		keyName: '',
	},
	menuData: [] as TreeType[],
	menuProps: {
		children: 'children',
		label: 'name',
	},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
	},
});

const inputValue = ref('');
const dynamicTags = ref(['Tag 1', 'Tag 2', 'Tag 3']);
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();

const handleClose = (tag: string) => {
	state.ruleForm.label.splice(state.ruleForm.label.indexOf(tag), 1);
};

const showInput = () => {
	inputVisible.value = true;
	nextTick(() => {
		InputRef.value!.input!.focus();
	});
};
//一个空格也不允许 @input
// const handleInput = (event: any) => {
// 	inputValue.value = event.replace(/\s/g, '');
// };
const handleInputConfirm = () => {
	if (inputValue.value) {
		if (state.ruleForm.label.length < 1) {
			if (/^\s+$/gi.test(inputValue.value)) {
				ElMessage.warning(`不能全输入空格`);
			} else {
				state.ruleForm.label?.push(inputValue.value);
			}
		} else {
			ElMessage.warning(`标签个数不能超过1个`);
		}
	}
	inputVisible.value = false;
	inputValue.value = '';
};

const tableData = ref([
	{
		data: '2016-05-03',
		msg: 'Tom',
		dataType: 'No. 189, Grove St, Los Angeles',
	},
]);
const value = ref('');
const nodeListOptions = ref(<NodeOptionsListType>[]);
const nodeListObj = ref(<NodeState>{});
const fileList = ref<UploadUserFile[]>([]);

const handleRemove: UploadProps['onRemove'] = (file: any, uploadFiles: any) => {
	console.log(file, uploadFiles);
};

const handlePreview: UploadProps['onPreview'] = (uploadFile: any) => {
	console.log(uploadFile);
};

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile: { name: any }, uploadFiles: any) => {
	return ElMessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
		() => true,
		() => false
	);
};

const equalToEmpty = (rule: any, value: any, callback: any) => {
	if (/^\s+$/gi.test(value)) {
		callback(new Error('不能全输入空格'));
	} else {
		callback();
	}
};

const dataName = (rule: any, value: any, callback: any) => {
	if (!/^(?=.*[a-zA-Z])(?=.*[\d_-])[a-zA-Z\d_-]{6,32}$/.test(value)) {
		callback(new Error('6-32个字符，只能由英文字母、数字及‘_’‘-’组成'));
	} else {
		callback();
	}
};
const labelLength = (rule: any, value: any, callback: any) => {
	if (value.length > 5) {
		callback(new Error('标签个数不能超过5个'));
	} else {
		callback();
	}
};
const rules = reactive<FormRules>({
	nodeId: [{ required: true, message: '请选择节点名称' }],
	name: [
		{ required: true, message: '请输入数据名称', trigger: 'blur' },
		{ required: true, validator: equalToEmpty, trigger: 'blur' },
		// { required: true, validator: dataName, trigger: 'blur' },
		{ min: 6, max: 32, message: '6-32字符', trigger: 'blur' },
	],
	useScene: [{ required: true, message: '请选择数据使用场景', trigger: 'change' }],
	typeId: [{ required: true, message: '请选择数据来源', trigger: 'change' }],
	fileId: [{ required: true, message: '请上传文件', trigger: 'change' }],
	label: [
		{ required: true, message: '请添加数据标签', trigger: 'blur' },
		{ required: true, validator: labelLength, trigger: 'blur' },
	],
	keyName: [{ required: true, message: '请输入数据主键', trigger: 'blur' }],
});
const dataRules = reactive<FormRules>({
	upDatabaseType: [{ required: true, message: '请选择数据库类型', trigger: 'change' }],
	upDatabaseVersion: [{ required: true, message: '请输入数据库版本', trigger: 'blur' }],
	upDatabaseHost: [{ required: true, message: '请输入主机IP/域名', trigger: 'blur' }],
	upDatabasePort: [{ required: true, message: '请输入主机端口号', trigger: 'blur' }],
	upDatabaseUsername: [{ required: true, message: '请输入数据库用户名', trigger: 'blur' }],
	upDatabasePassword: [{ required: true, message: '请输入数据库密码', trigger: 'blur' }],
	upDatabaseName: [{ required: true, message: '请输入数据库名称', trigger: 'blur' }],
	upDatabaseTable: [{ required: true, message: '请输入数据库表名', trigger: 'blur' }],

	typeId: [{ required: true, message: '请选择数据来源', trigger: 'change' }],
	fileId: [{ required: true, message: '请上传文件', trigger: 'change' }],
});
const formReset = () => {
	state.ruleForm = {
		id: '',
		nodeId: '',
		description: '',
		useScene: '1',
		typeId: '1',
		name: '', //
		fileList: [],
		roleKey: '',
		keys: [] as string[],
		sort: 1,
		loading: false,
		remark: '',
		fileId: '', //
		upDatabaseType: '',
		upDatabaseHost: '',
		upDatabasePort: '',
		upDatabaseName: '',
		upDatabaseVersion: '',
		upDatabaseUsername: '',
		upDatabasePassword: '',
		upDatabaseTable: '',
		label: [] as string[],
		keyName: '',
	};
	fieldList.value = [];
	roleDialogFormRef.value?.resetFields();
};

const dataModel = [{ dictValue: 'mysql', id: '1' }];

// const getDataTypeList = () => {
// 	getDataType({ code: 'dataModel' }).then((res: { data: { id: string; dictValue: string }[] }) => {
// 		dataModel.value = res.data;
// 		console.log(`output->dataModel`, dataModel.value);
// 	});
// };
const getNodeList = () => {
	selectLoading.value = true;
	nodeListEffective()
		.then((res: any) => {
			if (res.resultCode === 0) {
				nodeListOptions.value = res.data;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err: any) => {
			ElMessage.error(...err);
		})
		.finally(() => {
			selectLoading.value = false;
		});
};

const getDataDetail = (id: string) => {
	fieldListLoading.value = true;
	formLoading.value = true;
	dataDetail({ dataId: id })
		.then((res: any) => {
			if (res.resultCode === 0) {
				state.ruleForm = res.data;
				dataList.value = res.data.previewData;
				fieldList.value = res.data.fieldList;
				state.ruleForm.label = res.data.label ? res.data.label?.split(',') : [];
				// fieldListLoading.value = true;
				// dataFilePreview({ fileId: dataDetailMsg.value.fileId }).then((res: any) => {
				// 	console.log(`output->res`, res);
				// 	dataList.value = res.data.dataList;
				// 	fieldList.value = res.data.fieldList;
				// 	console.log(`output->fileList.value`, dataList.value, fieldList.value);
				// 	fieldListLoading.value = false;
				// });
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err: any) => {
			ElMessage.error(...err);
		})
		.finally(() => {
			fieldListLoading.value = false;
			formLoading.value = false;
		});
};
// 打开弹窗
const openDialog = (type: string, row: RowRoleType) => {
	roleDialogFormRef.value?.clearValidate();
	dataRadioFormRef.value?.clearValidate();
	inputVisible.value = false;
	inputValue.value = '';
	state.dialog.type = type;
	getNodeList();
	if (type === 'edit') {
		getDataDetail(row.id);

		state.dialog.title = '编辑数据';
		isEditPage.value = true;
	} else {
		isEditPage.value = false;
		state.dialog.title = '添加数据';
		// 清空表单，此项需加表单验证才能使用
		nextTick(() => {
			formReset();
		});
	}
	state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
	formReset();
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};

// const myValidateField = (fieldName:any) => {
// 	 return new Promise((resolve, reject) => {
//       dataRadioFormRef.value?.validateField(fieldName, (valid, message) => {
//         if (!valid) {
//           reject(new Error(message)); // 验证失败时拒绝Promise
//         } else {
//           resolve(); // 验证成功时解决Promise
//         }
//       });
//     });
// };
const myValidateField = async () => {
	const promises = [
		dataRadioFormRef.value?.validateField('upDatabaseType'),
		dataRadioFormRef.value?.validateField('upDatabaseVersion'),
		dataRadioFormRef.value?.validateField('upDatabaseHost'),
		dataRadioFormRef.value?.validateField('upDatabasePort'),
		dataRadioFormRef.value?.validateField('upDatabaseUsername'),
		dataRadioFormRef.value?.validateField('upDatabasePassword'),
	];
	const results = await Promise.all(promises);
	// 检查是否有任何验证失败
	for (const result of results) {
		if (result !== true) {
			return false;
		}
	}
	return true;
};
const checkLink = async () => {
	const valid = await myValidateField();
	if (valid) {
		checkLinkLoading.value = true;
		checkLinkConnectTables({
			upDatabaseType: state.ruleForm.upDatabaseType,
			upDatabaseVersion: state.ruleForm.upDatabaseVersion,
			upDatabaseHost: state.ruleForm.upDatabaseHost,
			upDatabasePort: state.ruleForm.upDatabasePort,
			upDatabaseName: state.ruleForm.upDatabaseName,
			upDatabaseUsername: state.ruleForm.upDatabaseUsername,
			upDatabasePassword: state.ruleForm.upDatabasePassword,
		})
			.then((res: any) => {
				if (res.resultCode === 0) {
					ElMessage.success('链接成功');
				} else {
					ElMessage.error(`链接失败`);
					return false;
				}
			})
			.catch((e) => {
				ElMessage.error(`链接失败${e}`);
			})
			.finally(() => {
				checkLinkLoading.value = false;
			});
	}
};

// 提交
const onSubmit = () => {
	roleDialogFormRef.value?.validate((valid: any) => {
		if (valid) {
			dataRadioFormRef.value?.validate((validTwo: any) => {
				if (validTwo) {
					handleLoading.value = true;
					if (state.dialog.type === 'add') {
						nodeListObj.value = nodeListOptions.value.find((item) => item.nodeId == state.ruleForm.nodeId) as NodeState;
						saveData({
							name: state.ruleForm.name,
							nodeId: state.ruleForm.nodeId,
							description: state.ruleForm.description,
							typeId: state.ruleForm.typeId,
							fileId: state.ruleForm.fileId,
							fieldList: state.ruleForm.fileList,
							useScene: state.ruleForm.useScene,
							upDatabaseType: state.ruleForm.upDatabaseType,
							upDatabaseVersion: state.ruleForm.upDatabaseVersion,
							upDatabaseHost: state.ruleForm.upDatabaseHost,
							upDatabasePort: state.ruleForm.upDatabasePort,
							upDatabaseName: state.ruleForm.upDatabaseName,
							upDatabaseUsername: state.ruleForm.upDatabaseUsername,
							upDatabasePassword: state.ruleForm.upDatabasePassword,
							upDatabaseTable: state.ruleForm.upDatabaseTable,
							label: state.ruleForm.label.join(','),
							keyName: state.ruleForm.keyName,
							auditStatus: nodeListObj.value.auditStatus,
						})
							.then((res: any) => {
								if (res.resultCode === 0) {
									closeDialog();
									ElMessage.success('新增成功');
									emit('refresh');
								} else {
									ElMessage.error(res.resultDesc);
								}
							})
							.catch((err: any) => {
								ElMessage.error(err);
								closeDialog();
							})
							.finally(() => {
								handleLoading.value = false;
							});
					} else {
						editData({
							id: state.ruleForm.id,
							name: state.ruleForm.name,
							description: state.ruleForm.description,
							fieldList: fieldList.value,
							label: state.ruleForm.label.join(','),
						})
							.then((res: any) => {
								if (res.resultCode === 0) {
									closeDialog();
									ElMessage.success('编辑成功');
									emit('refresh');
								} else {
									ElMessage.error(res.resultDesc);
								}
							})
							.catch((err: any) => {
								ElMessage.error(err);
								closeDialog();
							})
							.finally(() => {
								handleLoading.value = false;
							});
					}
				}
			});
		}
	});
};
const handleBeforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
	const isExcel = /\.(csv)$/.test(rawFile.name);
	if (!isExcel) {
		ElMessage.error('上传文件只能是 .csv 格式!');
		return false;
	}
	const isLt = rawFile.size / 1024 / 1024 < 1;
	if (!isLt) {
		ElMessage.error(`上传文件大小不能超过 1 MB!`);
		return false;
	}

	state.ruleForm.loading = ElLoading.service({
		text: '正在上传文件',
	});
};
const onAddDataTable = () => {
	tableData.value.push(<any>[]);
};
const dataRadioFormReset = () => {
	state.ruleForm.upDatabaseType = '';
	state.ruleForm.upDatabaseHost = '';
	state.ruleForm.upDatabasePort = '';
	state.ruleForm.upDatabaseName = '';
	state.ruleForm.upDatabaseVersion = '';
	state.ruleForm.upDatabaseUsername = '';
	state.ruleForm.upDatabasePassword = '';
	state.ruleForm.upDatabaseTable = '';
	(state.ruleForm.fileList = []), (fieldList.value = []);
};

const handleChange = (val: any) => {
	// roleDialogFormRef.value?.resetFields();
	dataRadioFormRef.value?.resetFields();
	dataRadioFormReset();
	state.ruleForm.typeId = val;
};
const handleDelete = (file: any) => {
	state.ruleForm.fileId = '';
};
const handleSuccess = (file: any) => {
	state.ruleForm.fileId = file.data.id;
	// state.ruleForm.fileList.push(file.data);
	// dataFilePreviewList();
	state.ruleForm.loading?.close();
};
const handleUploadError: UploadProps['onError'] = () => {
	ElMessage.warning('上传文件失败，请重试');
	state.ruleForm.loading?.close();
};
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
	ElMessage.warning('上传文件数量超出限制');
};

const dataFilePreviewList = () => {
	fieldListLoading.value = true;
	dataFilePreview({ fileId: state.ruleForm.fileId }).then((res: any) => {
		dataList.value = res.data.dataList;
		fieldList.value = res.data.fieldList;
		fieldListLoading.value = false;
	});
};
const handleResourceChange = (data: any) => {
	fieldList.value = data;
	//   this.dataForm.fieldList = this.formatParams()
};
// 暴露变量

defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.system-role-dialog-container {
	.menu-data-tree {
		width: 100%;
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
.dataKey {
	display: flex;
	width: 100%;
	justify-content: end;
	.span-blue {
		color: #2d8cf0;
		margin-right: 10px;
	}
}
.upload-text {
	::v-deep(.el-upload-list) {
		display: none;
	}
}
.upload-demo {
	width: 100%;
	margin-top: 20px;
}

.leftFormTip {
	::v-deep(.el-form-item__label) {
		font-weight: bold;
	}
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
