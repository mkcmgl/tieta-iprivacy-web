import config from './configuration';
export default function setLocal(key, item, expire) {
    if (expire && expire > 0) {
        const date = new Date().getTime() + expire;
        item += `${config.ExpireMark}${date}`;
    }
    localStorage.setItem(key, item);
}
