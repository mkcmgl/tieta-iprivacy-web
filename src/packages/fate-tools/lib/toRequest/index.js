import HTTPRequest from './service';
/**
 * API initing
 * @param APIs APIConfiguration | api configuration
 * @param mock boolean | is mock
 * @param codes object | error code
 * @returns apis
 */
export default function HTTPInit(APIs, mock, codes) {
    const service = HTTPRequest(mock, codes);
    const apis = {};
    for (const APIId in APIs) {
        const configuration = APIs[APIId];
        const request = (parameter) => {
            return service(Object.assign({ [configuration.method.match(/get/i) ? 'params' : 'data']: parameter }, configuration));
        };
        apis[APIId] = request;
    }
    return apis;
}
