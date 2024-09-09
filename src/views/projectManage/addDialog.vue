<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :close-on-click-modal="false" :before-close="onCancel">
			<el-form
				ref="roleDialogFormRef"
				v-loading="loadingForm"
				:model="state.ruleForm"
				:rules="rules"
				size="large"
				label-position="left"
				label-width="120px"
			>
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="项目名称" prop="name">
							<el-input v-model="state.ruleForm.name" placeholder="请输入项目名称" maxlength="30" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb22">
						<el-form-item label="项目场景" prop="useScene" class="leftFormTip danRadio">
							<!-- <el-select :disabled="isEditPage" v-model="state.ruleForm.typeId" clearable placeholder="请选择数据格式" style="width: 100%">
								<el-option v-for="item in dataModel" :key="item.id" :label="item.dictValue" :value="item.id" />
							</el-select> -->
							<el-radio-group :disabled="state.disableFalg" v-model="state.ruleForm.useScene" class="ml-4">
								<el-radio value="1" size="large">多方安全计算</el-radio>
								<el-radio value="2" size="large">联邦建模</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<el-form-item label="项目描述">
							<el-input
								v-model="state.ruleForm.description"
								type="textarea"
								placeholder="请输入项目描述,300字内"
								maxlength="300"
								show-word-limit
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30">
						<span class="title-weight">协作机构</span>

						<div class="mb30">
							<div class="mt20 align-center">
								<span>发起机构</span>
								<el-tooltip class="box-item" effect="dark" content="发起创建项目的机构" placement="right">
									<el-icon class="mg-l-10">
										<QuestionFilled />
									</el-icon>
								</el-tooltip>
							</div>
							<div class="mt20 ml20">
								<span>{{ enterpriseName }}</span>
							</div>
							<el-form-item label="参与节点" prop="nodeId" class="mt10" v-if="!state.disableFalg">
								<el-select v-model="state.ruleForm.nodeId" clearable placeholder="请选择参与当前项目节点" style="width: 100%">
									<el-option v-for="item in nodeListOptions" :key="item.nodeId" :label="item.nodeName" :value="item.nodeId" />
								</el-select>
							</el-form-item>
						</div>

						<el-form-item label="协作机构" prop="partnerIds" class="el-form-flex-column">
							<el-table :data="state.ruleForm.partnerIds" border style="width: 70%">
								<el-table-column label="机构名称">
									<template #default="scope">
										<el-form-item label-width="10px">
											<el-select
												:disabled="state.disableFalg"
												v-model="scope.row.organizeId"
												filterable
												clearable
												@change="handleSelectChange"
												reserve-keyword
												placeholder="请输入机构名称"
												:loading="loading"
												style="width: 240px"
											>
												<el-option
													ref="optionsRef"
													style="color: #606266"
													v-for="item in options"
													:key="item.ORGANIZEID"
													:label="item.ORGANIZENAME"
													:value="item.ORGANIZEID"
												/>
											</el-select>
										</el-form-item>
									</template>
								</el-table-column>
								<el-table-column label="操作" width="100">
									<template #default="scope">
										<el-button
											size="small"
											text
											:disabled="state.disableFalg"
											type="primary"
											@click="onProjectDel(scope.row, scope.$index)"
											v-auth="'api:role:delete'"
											:icon="Delete"
											>删除
										</el-button>
									</template>
								</el-table-column>
							</el-table>
							<el-button size="large" :icon="Plus" style="width: 70%; margin-top: 10px" @click="addTable" v-if="!state.disableFalg">
								添加协作机构
							</el-button>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb30"></el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" type="info" plain size="large">取 消</el-button>
					<el-button type="primary" v-loading="state.ruleForm.loading" @click="onSubmit" size="large">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="addProjectDialog">
import { reactive, ref, nextTick, watch, onMounted, onUpdated, computed } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { ElTree } from 'element-plus';
import { UploadFilled, Plus, Delete } from '@element-plus/icons-vue';
import { QuestionFilled } from '@element-plus/icons-vue';
// import { ProjectModelList, RowRoleType, TreeType, PartnerIdList } from '@/types/views';
import {
	addProject,
	editProject,
	projectAuditList,
	getOrganizeListData,
	projectDetailEdit,
	getNodeList,
	getNodeListEffective,
} from '@/api/projectManage';
import { useUserInfo } from '@/stores/userInfo';
import { useOrganizeDetail } from '@/stores/organizeDetail';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const userInfos = useUserInfo();
// 定义变量内容
const roleDialogFormRef = ref<FormInstance>();
const optionsRef = ref();
const matchedOptions = ref<TestListItem[]>([]);
const menu = ref<InstanceType<typeof ElTree>>();
const organizeDetail = useOrganizeDetail();
const state = reactive({
	ruleForm: {
		id: '',
		name: '',
		description: '',
		useScene: '1',
		nodeId: '',
		partnerIds: [{}],
		loading: false,
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
	disableFalg: false,
});
const loading = ref(false);
const loadingForm = ref(false);
const nodeListOptions = ref<NodeState[]>([]);

const tableData = ref([{}]);

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
const partnerIds = (rule: any, value: any, callback: any) => {
	if (!value[0].organizeId) {
		callback(new Error('至少需要一个协作机构'));
	} else {
		callback();
	}
};
const rules = reactive<FormRules>({
	name: [
		{ required: true, message: '请输入项目名称', trigger: 'blur' },
		{ required: true, validator: equalToEmpty, trigger: 'blur' },
		// { required: true, validator: dataName, trigger: 'blur' },
		{ min: 6, max: 32, message: '6-32字符', trigger: 'blur' },
	],
	useScene: [{ required: true, message: '请选择数据使用场景', trigger: 'change' }],
	partnerIds: [{ required: true, validator: partnerIds, trigger: 'blur' }],
	nodeId: [{ required: true, message: '请选择参与当前项目节点', trigger: 'blur' }],
});
const formReset = () => {
	state.ruleForm = {
		id: '',
		name: '',
		nodeId: '',
		useScene: '1',
		description: '',
		partnerIds: [{}],
		loading: false,
	};
	roleDialogFormRef.value?.resetFields();
};
const enterpriseName = computed(() => {
	if (state.disableFalg) {
		return enterpriseNameEdit.value;
	} else {
		return userInfos.userInfos.enterpriseName;
	}
});
// 打开弹窗
const enterpriseNameEdit = ref('');
const openDialog = (type: string, row: ProjectStateType) => {
	roleDialogFormRef.value?.clearValidate();

	state.dialog.type = type;
	if (type === 'edit') {
		enterpriseNameEdit.value = row.enterpriseName;
		state.disableFalg = true;
		loadingForm.value = true;
		projectDetailEdit({ projectId: row.id })
			.then((res) => {
				if (res.resultCode === 0) {
					state.ruleForm = res.data;
					const partnerList = res.data.projectPartnerList.filter((item: { enterpriseId: any }) => item.enterpriseId !== res.data.enterpriseId);

					const list = partnerList.map((item: any) => {
						return {
							partnerId: item.partnerId,
							organizeId: item.enterpriseName,
							organizeName: item.enterpriseName,
						};
					});
					state.ruleForm.partnerIds = list;
					options.value = list;
				} else {
					ElMessage.error(res.resultDesc);
				}
			})
			.catch((err: any) => {
				ElMessage.error(...err);
			})
			.finally(() => {
				loadingForm.value = false;
			});

		// state.ruleForm = JSON.parse(JSON.stringify(row));
		state.dialog.title = '编辑项目';
	} else {
		state.dialog.title = '创建项目';
		loadingForm.value = true;
		Promise.all([
			getNodeListEffective()
				.then((res) => {
					if (res.resultCode === 0) {
						nodeListOptions.value = res.data;
					} else {
						ElMessage.error(res.resultDesc);
					}
				})
				.catch((err: any) => {
					ElMessage.error(...err);
				}),
			getListDataOrigin(),
		]).then(() => {
			loadingForm.value = false;
		});

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
	state.disableFalg = false;
};
// 提交
const onProjectDel = (e: any, index: number) => {
	if (state.ruleForm.partnerIds.length == 1) {
		ElMessage.warning('至少需要一个协作机构');
	} else {
		state.ruleForm.partnerIds.splice(index, 1);
	}
};
const partnerIdList = ref<string[]>([]);
const nodeListObj = ref(<NodeState>{});
const onSubmit = () => {
	roleDialogFormRef.value?.validate((valid) => {
		if (valid) {
			state.ruleForm.loading = true;
			if (state.dialog.type === 'add') {
				partnerIdList.value = [];
				matchedOptions.value = [];
				state.ruleForm.partnerIds.forEach((partner: any) => {
					// 在options中查找匹配的ORGANIZEID
					const matchedOption = options.value.find((option: any) => option.ORGANIZEID === partner.organizeId);
					// 如果找到了匹配的项，则将其添加到matchedOptions数组中
					if (matchedOption) {
						matchedOptions.value?.push(matchedOption);
					}
				});
				matchedOptions.value.forEach((item: any) => {
					partnerIdList.value.push({ enterpriseId: item.ORGANIZEID, enterpriseName: item.ORGANIZENAME });
				});
				nodeListObj.value = nodeListOptions.value.find((item) => item.nodeId == state.ruleForm.nodeId) as NodeState;
				addProject({
					name: state.ruleForm.name,
					description: state.ruleForm.description,
					projectPartnerList: partnerIdList.value,
					nodeId: state.ruleForm.nodeId,
					useScene: state.ruleForm.useScene,
					nodeUnionId: nodeListObj.value.id,
					auditStatus: nodeListObj.value.auditStatus,
				})
					.then((res: any) => {
						// console.log(`output->res`, res);
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
						state.ruleForm.partnerIds = [];
						state.ruleForm.loading = false;
					});
			} else {
				// console.log("state.ruleForm", state.ruleForm)
				editProject({
					id: state.ruleForm.id,
					name: state.ruleForm.name,
					description: state.ruleForm.description,
				})
					.then((res) => {
						if (res.resultCode === 0) {
							closeDialog();
							ElMessage.success('编辑成功');
							emit('refresh');
						} else {
							ElMessage.error(res.resultDesc);
						}
					})
					.catch((err) => {
						ElMessage.error(err);
						closeDialog();
					})
					.finally(() => {
						state.disableFalg = false;
						state.ruleForm.loading = false;
					});
			}
		}
	});
};

interface ListItem {
	organizeId: string;
	organizeName: string;
	ORGANIZENAME: string;
	ORGANIZEID: string;
}
interface TestListItem {
	ORGANIZENAME: string;
	ORGANIZEID: string;
}
const options = ref<ListItem[]>([]);
const value = ref<string[]>([]);

onMounted(() => {});

onUpdated(() => {});
const getListDataOrigin = (query?: any) => {
	loading.value = true;
	getOrganizeListData({ organizeName: query, pageNum: '1', pageSize: '1000' })
		.then((res: any) => {
			if (res.resultCode === 0) {
				options.value = res.data;
				loading.value = false;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err: any) => {
			ElMessage.error(...err);
		})
		.finally(() => {
			loading.value = false;
		});
};
const remoteMethod = (query: string) => {
	if (query) {
		loading.value = true;
		getListDataOrigin(query);
	} else {
		options.value = [];
	}
};
const handleSelectChange = (val: any) => {
	let count = <any>[];

	state.ruleForm.partnerIds.forEach((partner: any, index: any) => {
		if (partner.organizeId == val) {
			count.push(index);
		}
	});
	if (count.length > 1) {
		ElMessage.warning('机构重复');
		state.ruleForm.partnerIds.splice(count[1], 1);
	}
	// getOrganizeList({organizeName:})
};

const addTable = () => {
	state.ruleForm.partnerIds.push(<any>[]);
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
    padding: 5px;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  }
}

.dataKey {
  display: flex;
  justify-content: end;
  width: 100%;

  a {
    color: #2d8cf0;
  }
}

.itemTipXing:before {
  content: "*";
  margin-right: 4px;
  color: var(--el-color-danger);
}

.el-form-flex-column {
  flex-direction: column;
}
.title-weight {
  font-size: 18px;
  font-weight: 800;
}
.align-center {
  display: flex;
  align-items: center;
}
.w50 {
  width: 50%;
}
</style>
