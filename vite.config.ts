import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import eslintPlugin from 'vite-plugin-eslint';

const pathResolve = (dir: string) => {
	return resolve(__dirname, '.', dir);
};

const alias: Record<string, string> = {
	'@': pathResolve('./src/'),
	'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
	'~': pathResolve('./'),
};

const viteConfig = defineConfig((mode: ConfigEnv) => {
	const env = loadEnv(mode.mode, process.cwd());
	return {
		base: './',
		plugins: [
			vue(),
			vueSetupExtend(),
			eslintPlugin({
				include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue'],
			}),
		],
		root: process.cwd(),
		resolve: { alias },
		optimizeDeps: {
			include: ['element-plus/es/locale/lang/zh-cn', 'element-plus/es/locale/lang/en', 'element-plus/es/locale/lang/zh-tw'],
		},
		server: {
			host: '0.0.0.0',
			port: env.VITE_PORT as unknown as number,
			open: JSON.parse(env.VITE_OPEN),
			hmr: true,
			proxy: {
				// '/ct-iprivacy152/': {
				// 	target: 'https://dev.qualink.com/',
				// 	ws: true,
				// 	changeOrigin: true,
				// },
				'/ct-iprivacy75/':{
					target:'http://10.180.143.74:32181/',
					ws:true,
					changeOrigin:true,
				}
			},
		},
		build: {
			outDir: 'dist',
			chunkSizeWarningLimit: 1500,
			sourcemap: false,
			rollupOptions: {
				output: {
					entryFileNames: `static/[name].[hash].js`,
					chunkFileNames: `static/[name].[hash].js`,
					assetFileNames: `static/[name].[hash].[ext]`,
					compact: true,
					manualChunks: {
						vue: ['vue', 'vue-router', 'pinia'],
						// echarts: ['echarts'],
					},
				},
			},
		},
		css: {
			preprocessorOptions: {
				css: {
					charset: false,
				},
				scss: {
					additionalData: `@use "@/theme/element/index.scss" as *;`,
				},
			},
		},

		define: {
			__VUE_I18N_LEGACY_API__: JSON.stringify(false),
			__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
			__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
			__SYSTEM_VERSION__: JSON.stringify(process.env.npm_package_version),
			__SYSTEM_NAME__: JSON.stringify(process.env.npm_package_name),
		},
	};
});

export default viteConfig;
