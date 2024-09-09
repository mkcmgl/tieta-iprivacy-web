<template>
	<div :class="{ hidden: hidden }" class="pagination-container">
		<el-pagination
			:background="background"
			v-model:current-page="currentPage"
			v-model:page-size="pageSize"
			:layout="layout"
			:page-sizes="pageSizes"
			:total="total"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		/>
	</div>
</template>

<script setup lang="ts" name="pagination">
import { computed } from 'vue';

const props = defineProps({
	total: {
		required: true,
		type: Number,
		default: 0,
	},
	page: {
		type: Number,
		default: 1,
	},
	limit: {
		type: Number,
		default: 20,
	},
	pageSizes: {
		type: Array,
		default() {
			return [5, 10, 20, 30, 50];
		},
	},
	layout: {
		type: String,
		default: 'total, sizes, prev, pager, next, jumper',
	},
	background: {
		type: Boolean,
		default: true,
	},
	hidden: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['update:page', 'update:limit', 'pagination']);

const currentPage = computed({
	get: () => props.page,
	set: (value) => {
		emit('update:page', value);
	},
});

const pageSize = computed({
	get() {
		return props.limit;
	},
	set(val) {
		emit('update:limit', val);
	},
});

function handleSizeChange(val: number) {
	if (currentPage.value * val > props.total) {
		currentPage.value = 1;
	}
	emit('pagination', { page: currentPage, limit: val });
}

function handleCurrentChange(val: number) {
	emit('pagination', { page: val, limit: props.limit });
}
</script>

<style scoped>
.pagination-container {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	background: #fff;
	padding: 20px 16px;
}

.pagination-container.hidden {
	display: none;
}
</style>
