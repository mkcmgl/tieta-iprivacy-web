<template>
	<div class="w100">
		<el-row>
			<el-col :span="24" class="rule-table-edit">
				<table border="0" cellspacing="0" cellpadding="0" class="w100">
					<thead>
						<tr>
							<th class="is-center is-leaf table__cell" v-for="(item, index) in state.columns" :key="index">{{ item.title }}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="tc table__cell" v-for="(item, index) in state.formItem.items" :key="index">
								<el-input size="defaule" type="primary" v-if="item.type === 1" v-model="item.value" :disabled="true"></el-input>
								<el-input
									size="defaule"
									type="primary"
									v-if="item.type === 3"
									:model-value="formatDateJava(new Date(), item.dateFormateType) + '(时间戳, 仅做展示)'"
									:disabled="true"
								></el-input>
								<el-input
									size="defaule"
									type="primary"
									v-if="item.type === 8"
									:model-value="getRandomStr(item.length, item.checkRule) + '(随机字符串, 仅做展示)'"
									:disabled="true"
								></el-input>
								<el-input
									size="defaule"
									type="primary"
									v-if="item.type === 4"
									:model-value="getRandomStr(item.length, 1) + '(自增序列号, 仅做展示)'"
									:disabled="true"
								></el-input>
								<el-input
									size="defaule"
									type="primary"
									v-if="item.type === 7"
									v-model="item.value"
									:maxlength="item.maxLength"
									:disabled="false"
									:placeholder="'请输入' + item.minLength + '-' + item.maxLength + '位自定义码段'"
									@blur="refreshItem(item)"
								></el-input>
							</td>
						</tr>
					</tbody>
				</table>
			</el-col>
		</el-row>
	</div>
</template>
<script setup lang="ts" name="ruleTableEdit">
import { reactive, watch } from 'vue';
import { formatDateJava } from '@/utils/formatTime';
import { cloneDeep } from 'lodash';

const state = reactive({
	codePrefix: '',
	codeRules: [] as unknown as any,
	columns: [] as Array<RuleColumnsType>,
	data: [] as unknown as any,
	formItem: {
		items: [],
	} as unknown as any,
	customCodeDemoItem: [] as unknown as any,
});

const props = defineProps({
	// 是否展示编码示例
	showCode: {
		type: Boolean,
		default: true,
	},
	rules: {
		type: Array,
		default: () => {
			return [];
		},
	},
});

const emit = defineEmits(['refresh']);

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
			type: item.type,
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
			align: 'center',
			tooltip: true,
			key: item.valueKey,
			maxWidth: 1000,
			minWidth: 150,
			type: item.type,
		});
	}
	state.columns = columnsTemp;
	state.data = [data];
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
			return item.value ? item.value : item.maxLength ? getRandomStr(item.maxLength, 15) : '';
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

const refreshItem = (item: any) => {
	let temp = cloneDeep(item);
	state.customCodeDemoItem[temp.sortId - 1] = temp;
	emit('refresh', state.customCodeDemoItem);
};

watch(
	() => props.rules,
	() => {
		state.codeRules = props.rules;
		state.codeRules.forEach((item: any) => {
			state.formItem.items[item.sortId - 1] = {
				extId: item.extId,
				sortId: item.sortId,
				extKey: item.extKey,
				type: item.type,
				length: item.length,
				maxLength: item.maxLength,
				minLength: item.minLength,
				dateFormateType: item.dateFormateType,
				checkRule: item.checkRule,
				value: item.value ? item.value : '',
			};
		});
		state.customCodeDemoItem = cloneDeep(state.formItem.items);
		initGrid();
	},
	{
		deep: true,
		immediate: true,
	}
);
</script>
<style scoped lang="scss">
.rule-table-edit {
	table {
		border: var(--el-border-color) solid 1px;
	}
	thead {
		color: var(--el-table-header-text-color);
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
		z-index: 1;
	}

	.table__cell.is-leaf {
		border-bottom: var(--el-border-color) solid 1px;
	}

	.table__cell {
		height: 40px;
		padding: 8px 16px;
		color: #515a6e;
		font-size: 13px;
		border-right: var(--el-border-color) solid 1px;
	}
}
</style>
