<template>
	<div class="w100">
		<el-row v-if="rules.length > 0" class="mb20">
			<el-col :span="24">{{ state.code }}</el-col>
		</el-row>
		<el-row>
			<el-col :span="24">
				<el-table :data="state.data" border style="width: 100%" v-if="state.columns.length != 0">
					<el-table-column
						v-for="(item, index) in state.columns"
						:key="'value' + index"
						:prop="item.key"
						:label="item.title"
						align="center"
						show-overflow-tooltip
					></el-table-column>
				</el-table>
			</el-col>
		</el-row>
	</div>
</template>
<script setup lang="ts" name="ruleTable">
import { reactive, watch } from 'vue';
import { formatDateJava } from '@/utils/formatTime';

const state = reactive({
	codeRules: [] as unknown as any,
	columns: [] as Array<RuleColumnsType>,
	data: [] as unknown as any,
	code: '',
});

const props = defineProps({
	rules: {
		type: Array,
		default: () => {
			return [];
		},
	},
});

const emit = defineEmits(['setCode']);

const initGrid = () => {
	let dataForCreateColumns = [];
	let codeTemp = '';
	let data = {} as any;
	let index = 0;

	for (let item of state.codeRules) {
		let valueKey = 'value' + index;
		dataForCreateColumns.push({
			title: '码段' + (index + 1) + '(' + getTypeStr(item.type) + (item.length || item.maxLength ? item.length || item.maxLength + '位' : '') + ')',
			valueKey: valueKey,
		});
		let value = getValue(item);
		data[valueKey] = value;
		codeTemp = codeTemp + value;
		index++;
	}
	let columnsTemp = [];
	for (let item of dataForCreateColumns) {
		columnsTemp.push({
			title: item.title,
			tooltip: true,
			key: item.valueKey,
			maxWidth: 1000,
			minWidth: 150,
		});
	}
	state.columns = columnsTemp;
	state.data = [data];
	state.code = codeTemp;
	emit('setCode', state.code);
};

const getTypeStr = (typeCode: number) => {
	switch (typeCode) {
		case 1:
			return '固定字符串';
		case 3:
			return '时间戳';
		case 8:
			return '随机字符串';
		case 4:
			return '自增序列号';
		case 7:
			return '动态字符串(发码时填写)';
		case 9:
			return '校验位';
		default:
			return '';
	}
};

const getValue = (item: any) => {
	switch (item.type) {
		case 1:
			return item.value ? item.value : '';
		case 3:
			return item.dateFormateType ? formatDateJava(new Date(), item.dateFormateType) : '';
		case 8:
			return item.length && item.checkRule ? getRandomStr(item.length, item.checkRule) : '';
		case 4:
			return item.length ? getRandomStr(item.length, 1) : '';
		case 7:
			return item.value ? item.value : item.maxLength ? getRandomStr(item.maxLength, 7) : '';
		case 9:
			return item.value ? item.value : item.length ? getRandomStr(item.length, 7) : '';
		default:
			return '';
	}
};

const getRandomStr = (length: number, type: number) => {
	const char0 = '1234567890';
	const char1 = 'abcdefghijklmnopqrstuvwxyz';
	const char2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const char3 = '~!@#$%^&*()_+`-=,./<>?;:"[{]}"';
	var chars = '';

	if ((type & 1) === 1) {
		chars = chars + char0;
	}
	if ((type & 2) === 2) {
		chars = chars + char1;
	}
	if ((type & 4) === 4) {
		chars = chars + char2;
	}
	if ((type & 8) === 8) {
		chars = chars + char3;
	}
	const maxPos = chars.length;
	let str = '';
	for (let i = 0; i < length; i++) {
		str += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return str;
};

watch(
	() => props.rules,
	() => {
		state.codeRules = props.rules;
		initGrid();
	},
	{
		deep: true,
		immediate: true,
	}
);
</script>
<style scoped lang="scss">
:deep(.el-table--enable-row-transition .el-table__body td.el-table__cell) {
	height: 40px;
}
</style>
