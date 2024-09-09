// 设置文件上传接口的url
export function setAjaxUrl() {
    let locationObj = window.location;
    let urlStr = locationObj.protocol + '//' + locationObj.host + import.meta.env.VITE_API_URL;
    return urlStr + '/api/system/file/upload'
}

export function setDataUploadUrl() {
    let locationObj = window.location;
    let urlStr = locationObj.protocol + '//' + locationObj.host + import.meta.env.VITE_API_URL;
    return urlStr + 'api/privacy/data/upload'
}
