<template>
	<div class="enterprise-detail-container layout-padding" v-loading="loading">
		<div class="title-bar">
			<div class="page-title">
				<img src="@/assets/public/back.png" class="mr5" @click="backList" />
				项目详情
			</div>
		</div>
		<div class="box-detail w100 home-card-center mt20 mb15">
			<div>
				<div class="flex mb20" style="justify-content: space-between; align-items: center">
					<span class="box-detail-title" style="margin-bottom: 0">基本信息</span>
					<div v-if="partnerAudit.auditState == '0'">
						<el-button type="info" size="large" @click="audit(partnerAudit.partnerId)">协作审核</el-button>
					</div>
				</div>

				<el-card class="w100" shadow="never">
					<el-row style="margin-bottom: 22px !important">
						<el-col :span="12">
							<div class="itembox">
								<span class="label">项目名称</span>
								<div class="content">{{ projectDetailMsg.name }}</div>
							</div>
						</el-col>

						<el-col :span="12">
							<div class="itembox">
								<span class="label">项目ID</span>
								<div class="content">{{ projectDetailMsg.id }}</div>
							</div>
						</el-col>
					</el-row>

					<el-row style="margin-bottom: 22px !important">
						<el-col :span="12">
							<div class="itembox">
								<span class="label">项目描述</span>
								<div class="content">{{ projectDetailMsg.description }}</div>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="itembox">
								<span class="label">创建时间</span>
								<div class="content">{{ projectDetailMsg.createTime }}</div>
							</div>
						</el-col>
					</el-row>
				</el-card>
			</div>
		</div>
		<div class="box-detail w100 home-card-center mb15">
			<div>
				<div class="box-detail-title">协同信息</div>
				<el-card class="w100" shadow="never">
					<el-tabs type="border-card" v-model="state.activeName" @tab-click="handleTabClick">
						<el-tab-pane v-for="(item, index) in projectPartnerList" :key="index" :name="item.partnerId">
							<template #label>
								<span class="custom-tabs-label">
									<span>{{ state.initiatedEnterpriseId == item.enterpriseId ? '发起机构' : '协作机构' }} </span>
								</span>
							</template>
							<div class="flex mb20">
								<div>{{ item.enterpriseName }}</div>
								<div v-if="state.initiatedEnterpriseId != item.enterpriseId" class="ml20">
									<span>审核意见：{{ item.auditState }}</span>
								</div>
							</div>

							<div class="mgb20">
								<el-button type="primary" class="mb20" v-if="item.enterpriseId == enterpriseId" @click="onOpenAddData('add', item, projectDetailMsg)"
									>添加数据到此项目
								</el-button>
							</div>

							<div>
								<el-table :data="item.dataList">
									<el-table-column label="数据集ID" prop="id" show-overflow-tooltip></el-table-column>
									<el-table-column label="数据名称" prop="name" show-overflow-tooltip></el-table-column>
									<el-table-column label="数据条数" prop="rows" show-overflow-tooltip></el-table-column>
									<el-table-column label="数据格式">
										<template #default="scope">
											<span>{{ scope.row.dataType == '1' ? 'csv' : 'mysql' }}</span>
										</template>
									</el-table-column>
									<el-table-column label="节点ID" prop="nodeId" show-overflow-tooltip></el-table-column>
									<el-table-column label="数据namespace" prop="namespace" width="150"></el-table-column>
									<!-- <el-table-column label="审核状态" v-if="item.enterpriseId == enterpriseId" >
										<template #default="scope">
											{{scope.auditState=='1'?'已授权':scope.auditState=='2'?'授权驳回':'未授权'}}
										</template>
									</el-table-column> -->
									<el-table-column label="操作" width="100">
										<template #default="scope">
											<el-button size="small" text type="primary" v-auth="'api:role:update'" @click="viewData(scope.row)"> 查看 </el-button>
											<el-button
												size="small"
												text
												type="primary"
												v-if="item.enterpriseId == enterpriseId"
												@click="onRowDel(scope.row, scope.$index, item.partnerId)"
												v-auth="'api:role:delete'"
												>删除
											</el-button>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</el-tab-pane>
					</el-tabs>
				</el-card>
			</div>
		</div>

		<AddDataDialog ref="addDataDialogRef" @refresh="getNodeDetail" />
		<el-dialog title="审核" ref="auditDialogRef" @open="handleOpen" v-model="state.auditDialogShow" @close="closeAuditDialog">
			<div class="dialog-body mb20">
				<el-form ref="auditDialogFormRef" :model="state.auditForm" :rules="rules" size="large" label-position="left" label-width="100px">
					<el-form-item label="审批状态" prop="auditState">
						<el-radio-group v-model="state.auditForm.auditState" @change="handleChange">
							<el-radio label="1">通过</el-radio>
							<el-radio label="2">驳回</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="授权节点" prop="nodeId" v-if="state.auditForm.auditState == '1'">
						<el-select
							:loading="openDialogLoading"
							v-model="state.auditForm.nodeId"
							clearable
							placeholder="请选择参与当前项目节点"
							style="width: 100%"
						>
							<el-option v-for="item in nodeListOptions" :key="item.id" :label="item.nodeName" :value="item.nodeId" />
						</el-select>
					</el-form-item>
					<el-form-item label="驳回意见" prop="auditOpinion" v-else>
						<el-input type="textarea" show-word-limit maxlength="200" v-model="state.auditForm.auditOpinion" placeholder="请输入驳回意见"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div class="dialog-footer pb20" style="display: flex; justify-content: end">
				<el-button size="large" @click="closeAuditDialog" type="info" plain>取消</el-button>
				<el-button type="primary" size="large" v-loading="loading" @click="submitAudit">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="projectDetail">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs, computed, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserInfo } from '@/stores/userInfo';
import { projectDetail, auditProject, deleteProjectData, projectPartnerData, editProject, getNodeList } from '@/api/projectManage';
// import {PartnerAudit, ProjectDetailType, ProjectPartnerListObject} from '@/types/views';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
// 引入组件
const AddDataDialog = defineAsyncComponent(() => import('@/views/projectManage/dialog.vue'));
const state = reactive({
	auditDialogShow: false,
	auditForm: {
		auditState: '1',
		auditOpinion: '',
		nodeId: '',
	},
	initiatedEnterpriseId: '',
	activeName: '',
	auditPartnerId: '',
	showAuditOpinion: false,
	active: 'first',
	editing: false,
	editingDescription: false,
	inputProjectName: '',
	inputProjectDescription: '',
});
const loading = ref(false);
const router = useRouter();
const route = useRoute();
const userInfos = useUserInfo();
const projectDetailMsg = ref(<ProjectDetailType>{});
const partnerAudit = ref(<PartnerAudit>{});
const projectPartnerList = ref<ProjectPartnerList>([]);
const dataList = ref(<any>[]);
const auditDialogFormRef = ref<FormInstance>();
const addDataDialogRef = ref();
const auditDialogRef = ref();
const inputRef = ref();
const inputDescriptionRef = ref();
const projectFormRef = ref<FormInstance>();

const enterpriseId = computed(() => {
	return userInfos.userInfos.enterpriseId;
});
onMounted(() => {
	getNodeDetail();
});
watch(
	() => state.editing,
	(newVal) => {
		if (newVal) {
			// 当进入编辑模式时，让输入框获取焦点
			nextTick(() => {
				if (inputRef.value) {
					inputRef.value.focus();
				}
			});
		}
	},
	{ immediate: false, deep: false }
);
watch(
	() => state.editingDescription,
	(newVal) => {
		if (newVal) {
			// 当进入编辑模式时，让输入框获取焦点
			nextTick(() => {
				if (inputDescriptionRef.value) {
					inputDescriptionRef.value.focus();
				}
			});
		}
	},
	{ immediate: false, deep: false }
);
const validate = () => {
	const errors: any[] = [];
	// 校验项目名称
	rules2.name.forEach((rule) => {
		if (rule.required) {
			// 对于每个校验规则，执行校验
			if (rule.validator) {
				rule.validator(rule, state.inputProjectName, (err: { message: any }) => {
					if (err) {
						errors.push(err.message);
					}
				});
			}
		}
	});

	// 如果存在错误，显示错误信息或执行其他操作
	if (errors.length > 0) {
		// 例如，你可以通过 Element UI 的消息提示显示错误信息
		ElMessage.error(errors.join('\n'));
		return false; // 校验失败
	}
	return true; // 校验成功
};
const nodeListOptions = ref<NodeState[]>([]);
const openDialogLoading = ref(false);
const nodeListObj = ref(<NodeState>{});
const handleOpen = () => {
	openDialogLoading.value = true;
	getNodeList({ pageNum: '1', pageSize: '1000' })
		.then((res) => {
			if (res.resultCode === 0) {
				nodeListOptions.value = res.data.data;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err) => {
			ElMessage.error(err);
		})
		.finally(() => {
			openDialogLoading.value = false;
		});
};
const onSubmit = (type: string) => {
	if (type == 'name' && validate()) {
		projectDetailMsg.value.name = state.inputProjectName;
		edit();
	} else if (type == 'description') {
		projectDetailMsg.value.description = state.inputProjectDescription;
		edit();
	}
};
const edit = () => {
	editProject({
		id: projectDetailMsg.value.id,
		name: projectDetailMsg.value.name,
		description: projectDetailMsg.value.description,
	})
		.then((res) => {
			if (res.resultCode === 0) {
				ElMessage.success('修改成功');
				getNodeDetail();
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err) => {
			ElMessage.error(err);
		})
		.finally(() => {
			state.editing = false;
			state.editingDescription = false;
			state.inputProjectName = '';
			state.inputProjectDescription = '';
		});
};

const onCancel = () => {
	state.editing = false;
	state.editingDescription = false;
	state.inputProjectName = '';
	state.inputProjectDescription = '';
};
const onEdit = (type: string, editing: boolean) => {
	if (type == 'name') {
		state.editing = editing;
		if (editing) {
			// 如果进入编辑模式，并且输入框存在，则获取焦点
			nextTick(() => {
				if (inputRef.value) {
					inputRef.value.focus();
				}
			});
		}
	} else {
		state.editingDescription = editing;
		if (editing) {
			// 如果进入编辑模式，并且输入框存在，则获取焦点
			nextTick(() => {
				if (inputDescriptionRef.value) {
					inputDescriptionRef.value.focus();
				}
			});
		}
	}
};
const handleChange = (val: any) => {
	formReset();
	state.auditForm.auditState = val;
};
const equalToEmpty = (rule: any, value: any, callback: any) => {
	if (/^\s+$/gi.test(value)) {
		callback(new Error('不能全输入空格'));
	} else {
		callback();
	}
};
const dataName = (rule: any, value: any, callback: any) => {
	if (!/^[0-9a-zA-Z_]{6,32}$/.test(value)) {
		callback(new Error('6-32个字符，可由英文字母、数字、‘_’组成'));
	} else {
		callback();
	}
};
const rules = reactive<FormRules>({
	auditState: [{ required: true, message: '请选择审批状态' }],
	auditOpinion: [
		{ required: true, message: '请输入驳回意见', trigger: 'blur' },
		{ required: true, validator: equalToEmpty, trigger: 'blur' },
	],
	nodeId: [{ required: true, message: '请选择参与当前项目节点', trigger: 'blur' }],
});
const rules2 = reactive({
	name: [
		{ required: true, message: '请输入项目名称', trigger: 'blur' },
		{ required: true, validator: equalToEmpty, trigger: 'blur' },
		{ required: true, validator: dataName, trigger: 'blur' },
	],
});
const partner = ref(<ProjectPartnerList>[]);
const partnerDataList = ref({});
const useSceneData = ref();
const getNodeDetail = () => {
	loading.value = true;
	projectDetail({ projectId: route.query.projectId })
		.then((res) => {
			if (res.resultCode === 0) {
				projectDetailMsg.value = res.data;
				useSceneData.value = res.data.useScene;
				partnerAudit.value = res.data.partnerAudit;
				projectPartnerList.value = res.data.projectPartnerList;
				state.initiatedEnterpriseId = res.data.enterpriseId;

				//获取当前登录企业的partnerId
				partner.value = res.data.projectPartnerList.filter((item: ProjectPartnerListObject) => item.enterpriseId === enterpriseId.value);
				partnerDataList.value = partner.value[0].dataList;
				state.activeName = partner.value[0].partnerId;
				getDataDetail(state.activeName);
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
const getDataDetail = (eId: String) => {
	dataList.value = [];
	projectPartnerData({
		id: route.query.projectId,
		partnerId: eId,
	})
		.then((res) => {
			if (res.resultCode === 0) {
				dataList.value = res.data;
			} else {
				ElMessage.error(res.resultDesc);
			}
		})
		.catch((err: any) => {
			ElMessage.error(...err);
		});
};

const handleTabClick = (tab: object) => {
	// getDataDetail(tab.props.name);
};
// const auditDialogShow = false;
const onRowDel = (e: any, index: any, partnerId: String) => {
	// console.log(`output->e,index`, e, index);
	ElMessageBox.confirm('删除后将无法恢复，请谨慎操作？', '确定要删除吗？', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
		buttonSize: 'default',
	}).then(() => {
		deleteProjectData({ dataId: e.id })
			.then((res) => {
				if (res.resultCode === 0) {
					ElMessage.success('删除成功');
					getDataDetail(partnerId);
					getNodeDetail();
				} else {
					ElMessage.error(res.resultDesc);
				}
			})
			.catch((err) => {
				ElMessage.error(err);
			});
	});
};
const viewData = (e: any) => {
	router.push({
		path: '/projectManage/dataDetail',
		query: {
			id: e.id,
		},
	});
};
// 打开新增角色弹窗
const onOpenAddData = (type: string, item: any, row: Object) => {
	if (item.auditState == '审核通过') {
		addDataDialogRef.value.openDialog(type, row, dataList.value, useSceneData.value);
	} else {
		ElMessage.warning('未审核通过');
	}
};
const audit = (partnerId: string) => {
	auditDialogFormRef.value?.clearValidate();
	state.auditDialogShow = true;
	state.auditPartnerId = partnerId;
};
const closeAuditDialog = () => {
	state.auditDialogShow = false;
	formReset();
};

const submitAudit = () => {
	auditDialogFormRef.value?.validate((valid) => {
		if (valid) {
			loading.value = true;

			if (state.auditForm.nodeId) {
				nodeListObj.value = nodeListOptions.value.find((item) => item.nodeId == state.auditForm.nodeId) as NodeState;
			}
			auditProject({
				partnerId: state.auditPartnerId,
				auditState: state.auditForm.auditState,
				auditOpinion: state.auditForm.auditState == '1' ? '同意' : state.auditForm.auditOpinion,
				nodeId: state.auditForm.nodeId,
				nodeUnionId: nodeListObj.value.id,
				auditStatus: nodeListObj.value.auditStatus,
			})
				.then((res) => {
					if (res.resultCode === 0) {
						// console.log('auditProject', res);
						state.auditPartnerId = '';
						closeAuditDialog();
						ElMessage.success('审核成功');
						getNodeDetail();
					} else {
						ElMessage.error(res.resultDesc);
					}
				})
				.catch((err) => {
					ElMessage.error(err);
					closeAuditDialog();
				})
				.finally(() => {
					loading.value = false;
				});
		}
	});
};

const backList = () => {
	router.back();
};

const formReset = () => {
	state.auditForm = {
		auditState: '1',
		auditOpinion: '',
		nodeId: '',
	};
	auditDialogFormRef.value?.resetFields();
};
</script>

<style scoped lang="scss">
.itembox {
  display: flex;
  align-items: center;

  .label {
    min-width: 60px;
    margin-right: 20px;
    text-align: right;
  }

  .content {
    font-weight: 500;
  }
}
.edit-container {
  .edit-icon {
    position: relative;

    :deep(i) {
      position: absolute;
      top: 1px;
      left: 2px;
      color: #333;
      transition: all .3s ease;
    }
  }

  &:hover {
    transition: all .3s ease;

    :deep(i) {
      color: var(--el-color-primary);
      transition: all .3s ease;
    }
  }

  .long-list {
    flex: 1;
    padding-right: 15px;
    word-break: break-word;
  }

  ::v-deep .el-input--large {
    width: auto;

    .el-input__wrapper {
      position: relative;
      bottom: 11px;
      display: inline-flex;

/* flex-grow: 1; */
      justify-content: center;
      align-items: center;
      padding: 1px 11px;
      background-image: none;
      box-shadow: none;
      transform: translateZ(0);
      transition: var(--el-transition-box-shadow);
      cursor: text;

      .is-focus {
        border: none;
      }
    }
  }
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}

.demo-tabs .custom-tabs-label span {
  margin-left: 4px;
  vertical-align: middle;
}
.w50 {
  width: 50%;
}
</style>
