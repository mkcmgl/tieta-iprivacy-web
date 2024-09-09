<template>
	<div>
		<el-table :data="data" class="table-list" v-bind="$attrs" v-loading="fieldListLoading">
			<el-table-column align="center" label="字段名称" prop="name" />
			<el-table-column align="center" label="数据类型" prop="type">
				<template #default="scope">
					<el-select v-model="scope.row.type" size="mini" placeholder="请选择" :disabled="!isEditable">
						<el-option v-for="item in fieldTypeList" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</template>
			</el-table-column>
			<el-table-column align="center" label="描述" prop="fieldDesc">
				<template #default="scope">
					<el-input
						v-model="scope.row.description"
						:disabled="!isEditable"
						size="mini"
						:maxlength="12"
						:placeholder="placeholderIsEditable"
						show-word-limit
					/>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
//import { updateDataResourceField } from '@/api/resource';

export default {
	name: 'EditResourceTable',
	props: {
		data: {
			type: Array,
			default: () => {
				return [];
			},
			required: true,
		},
		isEditable: {
			// if not editable, parent component must set it false
			type: Boolean,
			default: true,
		},
		isEditPage: {
			// if is not edit page, don not call updateDataResourceField Api
			type: Boolean,
			default: false,
		},
		fieldListLoading: {
			// if is not edit page, don not call updateDataResourceField Api
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			tableLoading: false,
			fieldTypeList: [
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
			],
		};
	},
	computed: {
		placeholderIsEditable() {
			return isEditable ? '请输入描述' : data.description;
		},
	},
	methods: {
		handleChange(row) {
			console.log(`output->`, row);
			const fieldType =
				typeof row.fieldType === 'number' ? this.fieldTypeList.find((item) => item.value === row.fieldType)?.label : row.fieldType;
			row.fieldType = fieldType;
			if (this.isEditPage) {
				// this.updateDataResourceField(row)
				this.$emit('change', this.data);
				return;
			} else {
				this.$emit('change', this.data);
			}
		},
		// updateDataResourceField(row) {
		// 	const { fieldId, fieldName, fieldType, description = '' } = row;
		// 	const data = {
		// 		fieldId,
		// 		fieldName,
		// 		fieldType,
		// 		description,
		// 	};
		// 	updateDataResourceField(data).then((res) => {
		// 		if (res.code === 0) {
		// 			this.$message({
		// 				message: '设置成功',
		// 				type: 'success',
		// 			});
		// 		}
		// 	});
		// },
	},
};
</script>
