<style scoped></style>
<template>
	<div class="component-upload-image">
		<div class="image-box">
			<div class="el-upload-list--picture-card" v-if="state.fileList.length != 0">
				<div class="el-upload-list__item" v-for="(item, index) in state.fileList" :key="index">
					<img :src="item.preview" class="el-upload-list__item-thumbnail" />
					<span class="el-upload-list__item-actions">
						<span class="el-upload-list__item-delete icon" @click="handlePictureCardPreview(index)">
							<ele-ZoomIn></ele-ZoomIn>
						</span>
						<span class="el-upload-list__item-delete icon" @click="handleRemove(index)">
							<ele-Delete></ele-Delete>
						</span>
					</span>
				</div>
			</div>

			<el-upload
				ref="imgUpload"
				:action="state.fileUploadUrl"
				list-type="picture-card"
				:accept="accept"
				:limit="limit"
				:on-success="handleUploadSuccess"
				:on-error="handleUploadError"
				:before-upload="handleBeforeUpload"
				:headers="headers"
				:with-credentials="true"
				:show-file-list="false"
				:on-exceed="handleExceed"
				v-if="state.fileList.length < limit"
			>
				<ele-Plus style="width: 30px; height: 30px"></ele-Plus>
			</el-upload>
		</div>
		<el-dialog v-model="dialogVisible" title="预览" append-to-body>
			<img style="width: 100%" :src="dialogImageUrl" alt="Preview Image" />
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue';
import { ElLoading, ElMessage, UploadFile, UploadInstance, UploadProps } from 'element-plus';
import { setAjaxUrl } from '@/utils/PlatformName';
import { Session, tokenName } from '@/utils/storage';
import { downloadImg } from '@/api/public';
import { json } from 'd3';

const state = reactive<ImageloadType>({
	fileList: [],
	fileUploadUrl: setAjaxUrl(),
	loading: '',
});

const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const imgUpload = ref<UploadInstance>();

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
	value: {
		type: Array<FileListType>,
		default: () => {
			return [];
		},
	},
});

watch(
	() => props.value,
	() => {
		props.value.forEach((item: any) => {
			let file = JSON.stringify(item);
			file = JSON.parse(file);
			state.fileList.push(file);
			preview(file as unknown as object);
		});
	},
	{
		deep: true,
		immediate: true,
	}
);

const emit = defineEmits(['getImageList']);

const handleUploadSuccess: UploadProps['onSuccess'] = (response, uploadFile, uploadFiles) => {
	if (response.resultCode == 0) {
		state.fileList.push({
			name: response.data.objectName,
			url: JSON.stringify(response.data),
			preview: '',
		});
		preview(response.data);
		emit('getImageList', state.fileList);
	} else {
		ElMessage.warning(response.resultDesc);
	}
	let uid = uploadFile.uid;
	let idx = uploadFiles.findIndex((item) => item.uid === uid) as unknown as number;
	uploadFiles.splice(idx, 1);
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

const handlePictureCardPreview = (index: number) => {
	dialogImageUrl.value = state.fileList[index].preview;
	dialogVisible.value = true;
};

const handleRemove = (index: number) => {
	state.fileList.splice(index, 1);
	emit('getImageList', state.fileList);
};

const preview = (fileInfo: object) => {
	downloadImg({ ...fileInfo })
		.then((res) => {
			const blob = new Blob([res as any]);
			state.fileList[state.fileList.length - 1].preview = window.URL.createObjectURL(blob);
			state.loading?.close();
		})
		.catch((err) => {
			console.error(err);
			state.loading?.close();
		});
};
</script>
<style scoped lang="scss">
.component-upload-image {
	.image-box {
		position: relative;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	:deep(.el-upload-list--picture-card .el-upload-list__item) {
		margin-bottom: 0px;
	}

	.icon {
		width: 20px;
		height: 30px;
		color: white;
	}
}
</style>
