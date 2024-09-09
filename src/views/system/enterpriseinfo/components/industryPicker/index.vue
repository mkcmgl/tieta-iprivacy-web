<template>
	<div :style="{ width: industryWidth }" class="industry-select">
		<el-select
			v-model="state.industryCategory"
			placeholder="行业门类"
			size="default"
			style="width: 49%"
			:disabled="isdisabled"
			@change="change($event, 1)"
			:clearable="isclearable"
		>
			<el-option v-for="item in state.industryCategoryList" :value="item.code" :label="item.name" :key="item.code"> </el-option>
		</el-select>
		<el-select
			v-model="state.industrySpecific"
			placeholder="行业大类"
			size="default"
			style="width: 49%"
			:disabled="isdisabled || !state.industryCategory"
			:clearable="isclearable"
		>
			<el-option v-for="item in state.industrySpecificList" :value="item.code" :label="item.name" :key="item.code"> </el-option>
		</el-select>
	</div>
</template>
<script setup lang="ts" name="industryPicker">
import { getIndustryCategoryNew } from '@/api/public';
import { reactive, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';

const state = reactive({
	industryCategory: '',
	industryCategoryList: [],
	industrySpecific: '',
	industrySpecificList: [],
});

const props = defineProps({
	// 行业代码
	code: {
		type: Array<string>,
		default: () => {
			return [];
		},
	},
	// 是否禁用
	isdisabled: {
		type: Boolean,
		default: false,
	},
	// 是否支持清空
	isclearable: {
		type: Boolean,
		default: true,
	},
	industryWidth: {
		type: String,
		default: '90%',
	},
});

const emit = defineEmits(['updateIndustryCode']);

const getIndustryInfo = (parentCode: string, level: number) => {
	getIndustryCategoryNew({
		parentCode: parentCode,
	})
		.then((res) => {
			if (res.resultCode == '0') {
				switch (level) {
					case 0:
						state.industryCategoryList = res.data;
						break;

					case 1:
						state.industrySpecificList = res.data;
						break;
					default:
						break;
				}
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

const show = () => {
	if (props.code.length != 0) {
		state.industryCategory = props.code[0];
		state.industrySpecific = props.code[1];
		getIndustryInfo(props.code[0], 1);
	}
};

watch(
	() => {
		props.code;
	},
	() => {
		show();
	},
	{
		deep: true,
		immediate: true,
	}
);

watch(
	() => {
		state.industrySpecific;
	},
	() => {
		let code = {
			industryCategory: state.industryCategory,
			industrySpecific: state.industrySpecific,
		};
		emit('updateIndustryCode', code);
	},
	{
		deep: true,
	}
);

const change = (code: string, level: number) => {
	state.industrySpecific = '';
	getIndustryInfo(code, level);
};

onMounted(() => {
	getIndustryInfo('', 0);
});
</script>
<style lang="scss" scoped>
.industry-select {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
