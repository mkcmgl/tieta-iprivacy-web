import { EventCallback } from '../Plot';
interface PropOptions {
    height: number;
    duration?: number;
    status: string;
    disable: boolean;
}
interface EventOptions {
    retry: EventCallback;
}
interface SuffixParameter {
    prop: PropOptions;
    attr: object;
    event: EventOptions;
}
export default function suffix({ prop, attr, event }: SuffixParameter): any;
export {};
//# sourceMappingURL=suffix.d.ts.map