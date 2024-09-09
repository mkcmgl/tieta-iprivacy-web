import { AxiosInstance, CreateAxiosDefaults } from 'axios';
export interface BasicConfigForParameter extends CreateAxiosDefaults<unknown> {
    ConsolePrinting?: boolean;
}
export interface BasicResponseData {
    code: number;
    msg: string;
    data: unknown;
}
type CodeCheck = (response: BasicResponseData, reqConfig: any, service: any) => unknown;
export interface ErrorCode {
    [code: number | string]: CodeCheck | {
        operation: CodeCheck;
        time?: number;
        message?: string;
    };
}
/**
 * Create or Get service instance from axios
 * @returns axios service instance
 */
export default function HTTPRequest(mockOrConfig: boolean, errorCode: ErrorCode): AxiosInstance;
export default function HTTPRequest<B extends BasicConfigForParameter>(mockOrConfig: B, errorCode: ErrorCode): AxiosInstance;
export {};
