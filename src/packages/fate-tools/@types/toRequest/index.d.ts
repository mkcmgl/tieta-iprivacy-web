import { ErrorCode } from './service';
interface APIConfiguration {
    [APIName: string]: {
        url: string;
        method: string;
    };
}
/**
 * API initing
 * @param APIs APIConfiguration | api configuration
 * @param mock boolean | is mock
 * @param codes object | error code
 * @returns apis
 */
export default function HTTPInit(APIs: APIConfiguration, mock: boolean, codes: ErrorCode): any;
export {};
