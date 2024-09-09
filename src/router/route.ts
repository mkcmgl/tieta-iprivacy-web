import { RouteRecordRaw } from 'vue-router';

/**
 * 建议：路由 path 路径与文件夹名称相同，找文件可浏览器地址找，方便定位文件位置
 *
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink: 链接地址不为空 2、isIframe:false`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

// 扩展 RouteMeta 接口
declare module 'vue-router' {
	interface RouteMeta {
		title?: string;
		isLink?: string;
		isHide?: boolean;
		isKeepAlive?: boolean;
		isAffix?: boolean;
		isIframe?: boolean;
		roles?: string[];
		icon?: string;
	}
}

/**
 * 定义动态路由
 * 前端添加路由，请在顶级节点的 `children 数组` 里添加
 * @description 未开启 isRequestRoutes 为 true 时使用（前端控制路由），开启时第一个顶级 children 的路由将被替换成接口请求回来的路由数据
 * @description 各字段请查看 `@/views/system/menu/component/addMenu.vue 下的 ruleForm`
 * @returns 返回路由菜单数据
 */
export const dynamicRoutes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: '/',
		component: () => import('@/layout/index.vue'),
		redirect: '/home',
		meta: {
			isKeepAlive: true,
		},
		children: [
			{
				path: '/home',
				name: 'home',
				component: () => import('@/views/home/index.vue'),
				meta: {
					title: '概览',
					isLink: '',
					isHide: true,
					isKeepAlive: true,
					isAffix: true,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-shouye',
				},
			},
			{
				path: '/individualCenter',
				name: 'individualCenter',
				component: () => import('@/views/individualCenter/index.vue'),
				meta: {
					title: '个人中心',
					isLink: '',
					isHide: true,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-shouye',
				},
			},
			{
				path: '/system',
				name: 'system',
				component: () => import('@/layout/routerView/parent.vue'),
				redirect: '/system/menu',
				meta: {
					title: '系统设置',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					{
						path: '/system/menu',
						name: 'systemMenu',
						component: () => import('@/views/system/menu/index.vue'),
						meta: {
							title: '资源管理',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
					},
					{
						path: '/system/role',
						name: 'systemRole',
						component: () => import('@/views/system/role/index.vue'),
						meta: {
							title: '角色管理',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'ele-ColdDrink',
						},
					},
					{
						path: '/system/user',
						name: 'systemUser',
						component: () => import('@/views/system/user/index.vue'),
						meta: {
							title: '用户管理',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-',
						},
					},
					{
						path: '/system/enterprise',
						name: 'systemEnterprise',
						component: () => import('@/views/system/enterprise/index.vue'),
						meta: {
							title: '企业管理',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-shuxingtu',
						},
						children: [
							{
								path: '/system/enterprise/detail',
								name: 'systemEnterpriseDetail',
								component: () => import('@/views/system/enterprise/detail.vue'),
								meta: {
									title: '企业管理详情',
									isLink: '',
									isHide: true,
									isKeepAlive: false,
									isAffix: false,
									isIframe: false,
									roles: ['admin'],
									icon: 'iconfont icon-ico',
								},
							},
						],
					},
					{
						path: '/system/enterpriseinfo',
						name: 'systemEnterpriseInfo',
						component: () => import('@/views/system/enterpriseinfo/index.vue'),
						meta: {
							title: '机构信息',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-shuxingtu',
						},
						children: [
							{
								path: '/system/enterpriseinfo/add',
								name: 'systemEnterpriseAdd',
								component: () => import('@/views/system/enterpriseinfo/add.vue'),
								meta: {
									title: '机构信息',
									isLink: '',
									isHide: true,
									isKeepAlive: false,
									isAffix: false,
									isIframe: false,
									roles: ['admin'],
									icon: 'iconfont icon-ico',
								},
							},
						],
					},
				],
			},
			{
				path: '/dict',
				name: 'dict',
				component: () => import('@/layout/routerView/parent.vue'),
				redirect: '/dict/management',
				meta: {
					title: '字典管理',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-ico',
				},
				children: [
					{
						path: '/dict/management',
						name: 'dictManage',
						component: () => import('@/views/dict/dict/index.vue'),
						meta: {
							title: '字典管理',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-code',
						},
						children: [
							{
								path: '/dict/management/maintain',
								name: 'dictMaintainAdd',
								component: () => import('@/views/dict/dict/maintain.vue'),
								meta: {
									title: '维护字典项',
									isLink: '',
									isHide: false,
									isKeepAlive: false,
									isAffix: false,
									isIframe: false,
									roles: ['admin'],
									icon: 'iconfont icon-ico',
								},
							},
						],
					},
				],
			},
			{
				path: '/dataManage',
				name: 'dataManage',
				component: () => import('@/views/dataManage/index.vue'),
				meta: {
					title: '数据管理',
					isLink: '',
					isHide: true,
					isKeepAlive: true,
					isAffix: true,
					isIframe: false,
					roles: ['admin','common'],
					icon: 'iconfont icon-chanpin1',
				},
				children: [
					{
						path: '/dataManage/detail',
						name: 'dataManageDetail',
						component: () => import('@/views/dataManage/detail.vue'),
						meta: {
							title: '数据详情',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin','common'],
							icon: 'iconfont icon-lvzhou_renzhengfangshi_yijianrenzheng',
						},
					},
				],
			},
			{
				path: '/nodeManage',
				name: 'nodeManage',
				component: () => import('@/views/nodeManage/index.vue'),
				meta: {
					title: '节点管理',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin','common'],
					icon: 'iconfont icon-shouye',
				},
				children: [
					{
						path: '/nodeManage/detail',
						name: 'nodeManageDetail',
						component: () => import('@/views/nodeManage/nodeDetail.vue'),
						meta: {
							title: '节点详情',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin','common'],
							icon: 'iconfont icon-lvzhou_renzhengfangshi_yijianrenzheng',
						},
					},
				],
			},
			{
				path: '/projectManage',
				name: 'projectManage',
				component: () => import('@/views/projectManage/index.vue'),
				meta: {
					title: '项目管理',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin','common'],
					icon: 'iconfont icon-shouye',
				},
				children: [
					{
						path: '/projectManage/detail',
						name: 'projectManageDetail',
						component: () => import('@/views/projectManage/projectDetail.vue'),
						meta: {
							title: '项目详情',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin','common'],
							icon: 'iconfont icon-lvzhou_renzhengfangshi_yijianrenzheng',
						},
					},
					{
						path: '/projectManage/dataDetail',
						name: 'projectManageDataDetail',
						component: () => import('@/views/projectManage/projectDataDetail.vue'),
						meta: {
							title: '数据详情',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin','common'],
							icon: 'iconfont icon-lvzhou_renzhengfangshi_yijianrenzheng',
						},
					},
				],
			},
			{
				path: '/certificatesManage',
				name: 'certificatesManage',
				component: () => import('@/views/certificatesManage/index.vue'),
				meta: {
					title: '证书管理',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-shouye',
				},
			},
			{
				path: '/nodeManageServer',
				name: 'nodeManageServer',
				component: () => import('@/views/nodeManageServer/index.vue'),
				meta: {
					title: '隐私计算节点管理',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-shouye',
				},
			},
			{
				path: '/collaborationComputing',
				name: 'collaborationComputing',
				component: () => import('@/views/collaborationComputing/index.vue'),
				meta: {
					title: '协同计算',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'ele-SetUp',
				},
				children: [
					{
						path: '/collaborationComputing/addCollaborationTask',
						name: 'addCollaborationTask',
						component: () => import('@/views/collaborationComputing/addCollaborationTask.vue'),
						meta: {
							title: '新增任务',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-code',
						},
					},
					{
						path: '/collaborationComputing/collaborationTaskDetail',
						name: 'taskDetail',
						component: () => import('@/views/collaborationComputing/collaborationTaskDetail.vue'),
						meta: {
							title: '任务详情',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-code',
						},
					},
					{
						path: '/collaborationComputing/collaborationHistoryDetail',
						name: 'historyDetail',
						component: () => import('@/views/collaborationComputing/collaborationHistoryDetail.vue'),
						meta: {
							title: '任务实例详情',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-code',
						},
					}
				]
			},
			{
				path: '/privacyIntersect',
				name: 'privacyIntersect',
				component: () => import('@/views/privacyIntersect/index.vue'),
				meta: {
					title: '隐私求交',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-shouye',
				},
				children: [
					{
						path: '/privacyIntersect/addEditorPrivacy',
						name: 'addEditorPrivacy',
						component: () => import('@/views/privacyIntersect/addEditorPrivacy.vue'),
						meta: {
							title: '新增任务',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-shouye',
						},
					},
					{
						path: '/privacyIntersect/privacyTaskDetail',
						name: 'privacyTaskDetail',
						component: () => import('@/views/privacyIntersect/privacyTaskDetail.vue'),
						meta: {
							title: '任务详情',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-shouye',
						},
					},
					{
						path: '/privacyIntersect/privacyHistoryDetail',
						name: 'privacyHistoryDetail',
						component: () => import('@/views/privacyIntersect/privacyHistoryDetail.vue'),
						meta: {
							title: '任务实例详情',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-shouye',
						},
					}
				]
			},
			{
				path: '/hiddenSearch',
				name: 'hiddenSearch',
				component: () => import('@/views/hiddenSearch/index.vue'),
				meta: {
					title: '匿踪查询',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'ele-SetUp',
				},
				children: [
					{
						path: '/hiddenSearch/addHiddenTask',
						name: 'addHiddenTask',
						component: () => import('@/views/hiddenSearch/addHiddenTask.vue'),
						meta: {
							title: '新增任务',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-code',
						},
					},
					{
						path: '/hiddenSearch/hiddenTaskDetail',
						name: 'hiddenTaskDetail',
						component: () => import('@/views/hiddenSearch/hiddenTaskDetail.vue'),
						meta: {
							title: '任务详情',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-code',
						},
					},
					{
						path: '/hiddenSearch/hiddenHistoryDetail',
						name: 'hiddenHistoryDetail',
						component: () => import('@/views/hiddenSearch/hiddenHistoryDetail.vue'),
						meta: {
							title: '任务详情',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-code',
						},
					},
				]
			},
			{
				path: '/federatedModel',
				name: 'federatedModel',
				component: () => import('@/layout/routerView/parent.vue'),
				redirect: '/federatedModel/list',
				meta: {
					title: '联邦建模',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-ico',
				},
				children: [
					{
						path: '/federatedModel/list',
						name: 'federatedModelList',
						component: () => import('@/views/federatedModel/index.vue'),
						meta: {
							title: '联邦建模',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-code',
						},
					},
					// children: [
					{
						path: '/federatedModel/detail',
						name: 'federatedModelDetail',
						component: () => import('@/views/federatedModel/detail.vue'),
						meta: {
							title: '联邦建模详情页',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-ico',
						},
					},
					{
						path: '/federatedModel/panel',
						name: 'federatedModelPanel',
						component: () => import('@/views/federatedModel/panel.vue'),
						meta: {
							title: '联邦建模面板',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-ico',
						},
					},
					// ],
				],
			},
			{
				path: '/inferenceService',
				name: 'inferenceService',
				component: () => import('@/views/inferenceService/index.vue'),
				meta: {
					title: '推理服务',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'ele-SetUp',
				},
				children: [
					{
						path: '/inferenceService/detail',
						name: 'inferenceServiceDetail',
						component: () => import('@/views/inferenceService/detail.vue'),
						meta: {
							title: '推理服务详情',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-code',
						},
					},
				]
			},
			
			{
				path: '/traceabilityAudit',
				name: 'traceabilityAudit',
				component: () => import('@/layout/routerView/parent.vue'),
				redirect: '/taskTraceability',
				meta: {
					title: '溯源审计',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					{
						path: '/taskTraceability',
						name: 'taskTraceability',
						component: () => import('@/views/taskTraceability/index.vue'),
						meta: {
							title: '任务溯源',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-menu-2',
						},
						children: [
							{
								path: '/taskTraceability/detail',
								name: 'taskTraceabilityDetail',
								component: () => import('@/views/taskTraceability/detail.vue'),
								meta: {
									title: '任务溯源详情',
									isLink: '',
									isHide: true,
									isKeepAlive: false,
									isAffix: false,
									isIframe: false,
									roles: ['admin'],
									icon: 'iconfont icon-ico',
								},
							},
						],
					},
					{
						path: '/behavioralAudit',
						name: 'behavioralAudit',
						component: () => import('@/views/behavioralAudit/index.vue'),
						meta: {
							title: '行为审计',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-shuxingtu',
						},
						children: [
							{
								path: '/behavioralAudit/detail',
								name: 'behavioralAuditDetail',
								component: () => import('@/views/behavioralAudit/detail.vue'),
								meta: {
									title: '行为审计详情',
									isLink: '',
									isHide: true,
									isKeepAlive: false,
									isAffix: false,
									isIframe: false,
									roles: ['admin'],
									icon: 'iconfont icon-ico',
								},
							},
						],
					}
				],
			},
			{
				path: '/dataDesensitization',
				name: 'dataDesensitization',
				component: () => import('@/layout/routerView/parent.vue'),
				meta: {
					title: '数据脱敏',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'ele-SetUp',
				},
				children: [
					{
						path: '/dataDesensitization/task',
						name: 'task',
						component: () => import('@/views/dataDesensitization/task.vue'),
						meta: {
							title: '数据任务',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-code',
						},
					},
					{
						path: '/dataDesensitization/tactics',
						name: 'tactics',
						component: () => import('@/views/dataDesensitization/tactics.vue'),
						meta: {
							title: '数据策略',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-code',
						},
					}
				]
			},
			{
				path: '/dataEncryption',
				name: 'dataEncryption',
				component: () => import('@/layout/routerView/parent.vue'),
				meta: {
					title: '数据加密',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'ele-SetUp',
				},
				children: [
					{
						path: '/dataEncryption/task',
						name: 'encryptionTask',
						component: () => import('@/views/dataEncryption/task.vue'),
						meta: {
							title: '加密任务',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-code',
						},
						
					},
					{
						path: '/dataEncryption/tactics',
						name: 'encryptionTacticsk',
						component: () => import('@/views/dataEncryption/tactics.vue'),
						meta: {
							title: '加密策略',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-code',
						},
						
					},
				]
			},
			{
				path: '/dataWatermark',
				name: 'dataWatermark',
				component: () => import('@/views/dataWatermark/index.vue'),
				meta: {
					title: '数据水印',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'ele-SetUp',
				},
			
			},
			{
				path: '/openApi/apply',
				name: 'apply',
				component: () => import('@/views/openApi/apply.vue'),
				meta: {
					title: 'openApi认证申请',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'ele-SetUp',
				},
				children: [
					{
						path: '/openApi/applyDetail',
						name: 'applyDetail',
						component: () => import('@/views/openApi/applyDetail.vue'),
						meta: {
							title: 'openApi认证详情',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-code',
						},
					},
				]
			},
			{
				path: '/openApi/examine',
				name: 'examine',
				component: () => import('@/views/openApi/examine.vue'),
				meta: {
					title: 'openApi认证审核',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'ele-SetUp',
				},
			
			},
			{
				path: '/deployNode',
				name: 'deployNode',
				component: () => import('@/views/deployNode/index.vue'),
				meta: {
					title: '可视化部署节点',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'ele-SetUp',
				},
				children: [
					{
						path: '/deployNode/addDeployNode',
						name: 'addDeployNode',
						component: () => import('@/views/deployNode/addDeployNode.vue'),
						meta: {
							title: '新增可视化节点部署',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-code',
						},
						
					},
					{
						path: '/deployNode/deployDetail',
						name: 'deployDetail',
						component: () => import('@/views/deployNode/deployDetail.vue'),
						meta: {
							title: '可视化节点部署详情',
							isLink: '',
							isHide: false,
							isKeepAlive: false,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-code',
						},
						
					},
				]
			
			},
			
		],
	},
];

/**
 * 定义404、401界面
 * @link 参考：https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#netlify
 */
export const notFoundAndNoPower = [
	{
		path: '/:path(.*)*',
		name: 'notFound',
		component: () => import('@/views/error/404.vue'),
		meta: {
			title: '找不到此页面',
			isHide: true,
		},
	},
	{
		path: '/401',
		name: 'noPower',
		component: () => import('@/views/error/401.vue'),
		meta: {
			title: '没有权限',
			isHide: true,
		},
	},
];

/**
 * 定义静态路由（默认路由）
 * 此路由不要动，前端添加路由的话，请在 `dynamicRoutes 数组` 中添加
 * @description 前端控制直接改 dynamicRoutes 中的路由，后端控制不需要修改，请求接口路由数据时，会覆盖 dynamicRoutes 第一个顶级 children 的内容（全屏，不包含 layout 中的路由出口）
 * @returns 返回路由菜单数据
 */
export const staticRoutes: Array<RouteRecordRaw> = [
	{
		path: '/ssoLoading',
		name: 'ssoIndex',
		component: () => import('@/views/sso/index.vue'),
		meta: {
			title: '单点登录',
		},
	},
	{
		path: '/ssoLogin',
		name: 'ssoLoginIndex',
		component: () => import('@/views/login/ssoIndex.vue'),
		meta: {
			title: '单点登录',
		},
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/login/index.vue'),
		meta: {
			title: '登录',
		},
	},
	{
		path: '/register',
		name: 'registerIndex',
		component: () => import('@/views/register/index.vue'),
		meta: {
			title: '注册',
		},
	},
	{
		path: '/forgotPwd',
		name: 'forgotPwdIndex',
		component: () => import('@/views/forgotPwd/index.vue'),
		meta: {
			title: '忘记密码',
		},
	},
];
