<template>
	<div :style="{ width: areaWidth }" class="region-select">
		<el-select
			v-model="state.province"
			placeholder="省"
			size="large"
			style="width: 30%"
			:disabled="isdisabled"
			@change="
                (val: string) => {
                    change(val, 1)
                }
            "
			:clearable="isclearable"
		>
			<el-option v-for="item in state.provinceList" :key="item.zoneId" :label="item.zoneName" :value="item.zoneId"> </el-option>
		</el-select>
		<el-select
			v-model="state.city"
			placeholder="市"
			size="large"
			style="width: 30%"
			:disabled="isdisabled || !state.province"
			@change="
                (val: string) => {
                    change(val, 2)
                }
            "
			:clearable="isclearable"
		>
			<el-option v-for="item in state.cityList" :key="item.zoneId" :label="item.zoneName" :value="item.zoneId"> </el-option>
		</el-select>
		<el-select
			v-model="state.areaCode"
			placeholder="区/县"
			size="large"
			style="width: 30%"
			:disabled="isdisabled || !state.city"
			:clearable="isclearable"
		>
			<el-option v-for="item in state.areaList" :key="item.zoneId" :label="item.zoneName" :value="item.zoneId"> </el-option>
		</el-select>
	</div>
</template>
<script setup lang="ts" name="areaPicker">
import { getZoneInfo } from '@/api/public';
import { ElMessage } from 'element-plus';
import { ref, reactive, watch, onMounted } from 'vue';

const props = defineProps({
	// 地区代码
	code: {
		type: String,
		default: '',
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
	// 盒子宽度
	areaWidth: {
		type: String,
		default: '90%',
	},
});

const emit = defineEmits(['updateAreaCode']);

const state = reactive<AreaPickerType>({
	province: '',
	city: '',
	areaCode: '',
	provinceList: [],
	cityList: [],
	areaList: [],
});

const getAddressInfo = (code: string, level: number) => {
	getZoneInfo({
		parentId: code,
	})
		.then((res) => {
			if (res.resultCode == '0') {
				switch (level) {
					case 0:
						state.provinceList = res.data;
						break;
					case 1:
						state.cityList = res.data;
						break;
					case 2:
						state.areaList = res.data;
						break;
					default:
						break;
				}
			} else {
				ElMessage.warning(res.resultDesc);
			}
		})
		.catch((err) => {
			console.error(err);
		});
};

const show = () => {
	if (props.code) {
		let arr = [],
			length = props.code.length;
		while (length > 0) {
			arr.push(props.code.slice(length - 2, length));
			length = length - 2;
		}
		state.province = arr[2] + '0000';
		state.city = arr[2] + arr[1] + '00';
		state.areaCode = props.code;
		getAddressInfo(state.province, 1);
		getAddressInfo(state.city, 2);
	}
};

watch(
	() => {
		state.areaCode;
	},
	() => {
		let code = {
			province: state.province,
			city: state.city,
			area: state.areaCode,
		};
		emit('updateAreaCode', code);
	},
	{
		deep: true,
	}
);

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

const change = (code: string, level: number) => {
	switch (level) {
		case 1:
			state.city = '';
			state.areaCode = '';
			break;
		case 2:
			state.areaCode = '';
			break;
		default:
			break;
	}
	getAddressInfo(code, level);
};

onMounted(() => {
	getAddressInfo('', 0);
});
</script>
<style scoped>
.region-select {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
