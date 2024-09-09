<template>
	<div>
		<!-- 显示当前节点的内容 -->
		<div @click.self="treeNodeClick(node.anchor)" class="pb8">{{ node.content }}</div>
		<!-- 递归显示子节点 -->
		<div v-if="node.child">
			<tree-node v-for="item in node.child" :key="item.id" :node="item" @click.self="treeNodeClick(item.anchor)" class="ml20"></tree-node>
		</div>
	</div>
</template>
<script setup lang="ts" name="treeNode">
const props = defineProps({
	node: {
		type: Object,
		required: true,
	},
});
const treeNodeClick = (anchor: string) => {
	let anchorElement = document.getElementById(anchor);
	if (anchorElement) {
		anchorElement.scrollIntoView();
	}
};
</script>
