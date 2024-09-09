import Cookies from 'js-cookie';

export const tokenName = import.meta.env.VITE_TOKEN_NAME;

/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 */
export const Local = {
	// 查看 v2.4.3版本更新日志
	setKey(key: string) {
		// @ts-ignore
		return `${__SYSTEM_NAME__}:${key}`;
	},
	// 设置永久缓存
	set<T>(key: string, val: T) {
		window.localStorage.setItem(Local.setKey(key), JSON.stringify(val));
	},
	// 获取永久缓存
	get(key: string) {
		let json = <string>window.localStorage.getItem(Local.setKey(key));
		return JSON.parse(json);
	},
	// 移除永久缓存
	remove(key: string) {
		window.localStorage.removeItem(Local.setKey(key));
	},
	// 移除全部永久缓存
	clear() {
		window.localStorage.clear();
	},
};

/**
 * window.sessionStorage 浏览器临时缓存
 * @method set 设置临时缓存
 * @method get 获取临时缓存
 * @method remove 移除临时缓存
 * @method clear 移除全部临时缓存
 */
export const Session = {
	// 设置临时缓存
	set<T>(key: string, val: T) {
		if (key === tokenName) return Cookies.set(key, val);
		// if (key === tokenName) return Cookies.set(key, val, { sameSite: 'None', Secure: true });
		if (key === 'userID') return Cookies.set(key, val);
		window.sessionStorage.setItem(Local.setKey(key), JSON.stringify(val));
	},
	setSessionToken<T>(key: string, val: T) {
		window.sessionStorage.setItem(Local.setKey(key), JSON.stringify(val));
	},
	// 获取临时缓存
	get(key: string) {
		if (key === tokenName) {
			if (Cookies.get(key)) {
				return Cookies.get(key);
			} else {
				let json = <string>window.sessionStorage.getItem(Local.setKey(key));
				return JSON.parse(json);
			}
		}
		return Cookies.get(key);
		if (key === 'userID') return Cookies.get(key);
		let json = <string>window.sessionStorage.getItem(Local.setKey(key));
		return JSON.parse(json);
	},
	// 移除临时缓存
	remove(key: string) {
		if (key === tokenName) return Cookies.remove(key);
		if (key === 'userID') return Cookies.remove(key);
		window.sessionStorage.removeItem(Local.setKey(key));
	},
	// 移除全部临时缓存
	clear() {
		Cookies.remove(tokenName);
		// Cookies.remove(tokenName, { sameSite: 'None', Secure: true });
		Cookies.remove('userID');
		window.sessionStorage.clear();
	},
};

export const Cookie = {
	set<T>(key: string, val: T, options: any) {
		// @ts-ignore
		return Cookies.set(key, val, Object.assign({ path: `/${__SYSTEM_NAME__}` }, options));
	},
	get(key: string) {
		return Cookies.get(key);
	},
	remove(key: string) {
		// @ts-ignore
		Cookies.remove(key, { path: __SYSTEM_NAME__ });
	},
};
