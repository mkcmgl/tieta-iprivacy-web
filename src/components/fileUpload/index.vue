<template>
	<div class="file-upload-container">
		<div class="file-upload-box" v-if="state.fileList.length < limit">
			<el-upload
				:action="state.fileUploadUrl"
				:accept="accept"
				:limit="limit"
				:show-file-list="false"
				:on-success="handleUploadSuccess"
				:on-error="handleUploadError"
				:before-upload="handleBeforeUpload"
				:headers="headers"
				:with-credentials="true"
				:on-exceed="handleExceed"
				style="width: 350px"
			>
				<el-button plain size="default">文件上传</el-button>
			</el-upload>
		</div>
		<div v-if="showFileList || state.fileList.length != 0">
			<div v-for="(item, index) in state.fileList" :key="index" class="file-upload-list__item-info">
				<ele-Document class="file-icon-left" />
				<div class="file-name">{{ item.name }}</div>
				<ele-Close v-if="!isShowDownload" class="file-icon-right" @click="handleUploadRemove(index)" />
				<div v-else class="ml20 file-upload" @click="downLoad(item.url, item.name)">下载</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts" name="fileUpload">
import { reactive, watch } from 'vue';
import { Session, tokenName } from '@/utils/storage';
import type { UploadProps } from 'element-plus';
import { ElMessage, ElLoading } from 'element-plus';
import { setAjaxUrl } from '@/utils/PlatformName';

const state = reactive<FileUploadType>({
	fileList: [],
	fileUploadUrl: setAjaxUrl(),
	loading: '',
});

const props = defineProps({
	accept: {
		type: String,
		default: '',
	},
	limit: {
		type: Number,
		default: 1,
	},
	headers: {
		type: Object,
		default: () => {
			return {
				Authorization: Session.get(tokenName),
			};
		},
	},
	// 大小限制(MB)
	fileSize: {
		type: Number,
		default: 10,
	},
	showFileList: {
		type: Boolean,
		default: false,
	},
	value: {
		type: Array<FileListType>,
		default: () => {
			return [];
		},
	},
	isShowDownload: {
		type: Boolean,
		default: false,
	},
});

watch(
	() => props.value,
	() => {
		state.fileList = props.value;
	},
	{
		deep: true,
		immediate: true,
	}
);

const emit = defineEmits(['getFileList']);

const handleUploadSuccess: UploadProps['onSuccess'] = (response, uploadFile, uploadFiles) => {
	if (response.resultCode == 0) {
		state.fileList.push({
			name: response.data.data.fileName,
			url: response.data.url,
		});
		emit('getFileList', state.fileList);
	} else {
		ElMessage.warning(response.resultDesc);
	}

	state.loading?.close();
};

const handleUploadError: UploadProps['onError'] = () => {
	ElMessage.warning('上传文件失败，请重试');
	state.loading.close();
};

const handleBeforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
	if (props.fileSize) {
		const isLt = rawFile.size / 1024 / 1024 < props.fileSize;
		if (!isLt) {
			ElMessage.warning(`上传文件大小不能超过 ${props.fileSize} MB!`);
			return false;
		}
	}
	state.loading = ElLoading.service({
		text: '正在上传文件',
	});
};

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
	ElMessage.warning('上传文件数量超出限制');
};

const handleUploadRemove = (index: number) => {
	state.fileList.splice(index, 1);
	emit('getFileList', state.fileList);
};

const downLoad = (url: string, name: string) => {
	const a = document.createElement('a');
	a.style.display = 'none';
	a.setAttribute('target', '_blank');
	name && a.setAttribute('download', name);
	a.href = url;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};
</script>
<style scoped lang="scss">
.file-upload-container {
	.file-upload-list__item-info {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 350px;
		margin: 0px 0px 0px 4px;

		.file-icon-left {
			width: 15px;
			height: 15px;
			margin-right: 10px;
			--color: inherit;
		}

		.file-icon-right {
			width: 15px;
			height: 15px;
			margin-left: 10px;
			--color: inherit;
		}

		.file-name {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			width: calc(100% - 44px);
			cursor: default;
		}

		.file-upload {
			width: 40px;
			color: var(--el-color-primary);
			cursor: pointer;
		}

		&:hover {
			color: var(--el-color-primary);
		}
	}
}
</style>
