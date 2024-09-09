/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { isBoolean, isNull, isObject, isUndefined } from 'lodash';
import toFile from '../toFile';
import JSYmal from 'js-yaml';
let service = undefined;
const maxReConnect = 5;
const reConnectMap = new Map();
export default function HTTPRequest(mockOrConfig, errorCode) {
    if (!service) {
        /**
         * create service instance
         */
        service = axios.create(isBoolean(mockOrConfig)
            ? {
                baseURL: mockOrConfig ? '/' : window.location.origin,
                withCredentials: !mockOrConfig,
                timeout: 20000,
            }
            : mockOrConfig);
        /**
         * request interceptor
         */
        service.interceptors.request.use((config) => {
            return config;
        }, (error) => {
            if (isBoolean(mockOrConfig) ? mockOrConfig : mockOrConfig.ConsolePrinting) {
                console.error(error);
            }
            return Promise.reject(error);
        });
        /**
         * response interceptor
         *
         * structure for response: {
         *  msg: string
         *  code: number
         *  data: unknown
         * }
         */
        service.interceptors.response.use((response) => {
            const rspHead = response.headers;
            const rspBody = response.data;
            const reqConfig = response.config;
            const bodyExplain = (body) => {
                if (body.code === 0 || body.code === 200) {
                    const data = isNull(body.data) ? true : (body.data || !!body.data);
                    return Promise.resolve(data);
                }
                else {
                    const check = errorCode[body.code] || errorCode['error'];
                    let maxTime = maxReConnect;
                    let operation = check;
                    let hintMsg;
                    if (isObject(check)) {
                        maxTime = !isUndefined(check.time) ? check.time : maxTime;
                        operation = operation.operation || (() => true);
                        hintMsg = check.message;
                    }
                    const message = () => {
                        // if (process.env.NODE_ENV === 'development' || hintMsg)
                        ElMessage({
                            type: 'error',
                            message: hintMsg || `code: ${body.code} - message: ${body.msg || String(body.data)}`,
                            showClose: true,
                            center: true
                        });
                        return Promise.reject(body);
                    };
                    const times = reConnectMap.get(reqConfig.url) || 0;
                    if (times < maxTime) {
                        reConnectMap.set(reqConfig.url, times + 1);
                        return Promise.resolve(operation(body, reqConfig, service)).then((res) => {
                            if (res === false)
                                return message();
                            else
                                return service(reqConfig);
                        });
                    }
                    else {
                        reConnectMap.delete(reqConfig.url);
                        return message();
                    }
                }
            };
            if (rspHead['content-disposition'] ||
                rspBody.toString().match(/blob/i)) {
                return new Promise((resolve) => {
                    const filename = rspHead['content-disposition']
                        ? rspHead['content-disposition'].split('=')[1]
                        : '';
                    const fileReader = new FileReader();
                    fileReader.addEventListener('loadend', function () {
                        let result;
                        if (filename.match(/json/i)) {
                            result = JSON.parse(fileReader.result);
                        }
                        else {
                            result = JSYmal.load(fileReader.result);
                        }
                        if (result.code !== undefined) {
                            resolve(bodyExplain(result));
                        }
                        else {
                            toFile([fileReader.result], filename);
                            resolve({ code: 0, data: '', msg: 'file download' });
                        }
                    });
                    fileReader.readAsText(rspBody);
                });
            }
            else {
                return bodyExplain(rspBody);
            }
        }, (error) => {
            if (isBoolean(mockOrConfig) ? mockOrConfig : mockOrConfig.ConsolePrinting) {
                console.error(error);
            }
            return Promise.reject(error);
        });
    }
    return service;
}
