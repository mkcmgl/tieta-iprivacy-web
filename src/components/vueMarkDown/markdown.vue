<template>
	<div>
		<el-row :gutter="20" style="min-width: 800px">
			<el-col :span="18" class="md-container">
				<div class="markdown-content">
					<div class="markdown-body">
						<div ref="preview" v-html="renderHtml"></div>
					</div>
				</div>
			</el-col>
			<el-col :span="6" class="md-container">
				<div id="anchorBox">
					<tree-node :node="state.catalogueList"></tree-node>
				</div>
			</el-col>
		</el-row>
	</div>
</template>
<script setup lang="ts" name="markDown">
import 'github-markdown-css/github-markdown.css';
import markdownIt from 'markdown-it';
import markdownItTocAndAnchor from 'markdown-it-toc-and-anchor';
import { computed, defineAsyncComponent, onMounted, reactive, ref } from 'vue';
const treeNode = defineAsyncComponent(() => import('@/components/vueMarkDown/treeNode.vue'));

const state = reactive({
	catalogueList: [] as any,
	level: 3,
});

let md = new markdownIt();

md.use(markdownItTocAndAnchor, {
	anchorLink: false,
	tocCallback: (tocMarkdown: any, tocArray: any, tocHtml: any) => {
		if (tocArray.length !== 0) {
			let oldList: any = [];
			let newList = [];
			let head = {
				anchor: '',
				content: '',
				level: 0,
				child: [],
			};

			for (let i = 0; i < tocArray.length; i++) {
				tocArray[i].child = [];
				oldList.push(tocArray[i]);
			}

			newList.push(head);

			for (let i = 0; i < oldList.length; i++) {
				newList[oldList[i].level - 1].child.push(oldList[i]);
				newList[oldList[i].level] = oldList[i];
			}

			state.catalogueList = head;
		}
	},
});

const anchor = (anchorName: string) => {
	console.log(anchorName, 'anchorName');
	let anchorElement = document.getElementById(anchorName);
	if (anchorElement) {
		anchorElement.scrollIntoView();
	}
};

const props = defineProps({
	mdHtml: {
		type: String,
		default: '',
	},
});

const preview = ref();

const renderHtml = computed(() => {
	return md.render(props.mdHtml);
});
</script>
<style lang="scss" scoped>
.markdown-body {
	box-sizing: border-box;
	min-width: 200px;
	max-width: 900px;
	margin: 0 auto;
	padding: 0px 45px 45px 45px;
}

body {
	scroll-behavior: smooth;
}

ol {
	counter-reset: list-item;
}
li {
	display: block;
	counter-increment: list-item;
}
li:before {
	content: counters(list-item, '.') ' ';
}

#anchorBox {
	padding: 30px 0px;

	div {
		cursor: pointer;
	}
}

.md-container {
	height: calc(100vh - 174px);
	overflow: scroll;
}
</style>
