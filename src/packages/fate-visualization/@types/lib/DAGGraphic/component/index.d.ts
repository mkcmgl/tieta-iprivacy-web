import { EventCallback, PlotCommon } from '../Plot';
export interface PortInfo {
    name: string;
    type: string;
    tooltip: string;
    multiply: boolean;
    direction: string;
}
interface PropOptions {
    name: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    txWidth: number;
    status: string;
    disable: boolean;
    stage: string;
    lock: boolean;
    relativeChoose: boolean;
    choose: boolean;
    duration?: number;
    input: PortInfo[];
    output: PortInfo[];
}
interface EventOptions {
    retry: EventCallback;
    choose: EventCallback;
    unchoose: EventCallback;
    overPort: EventCallback;
}
interface MainBodyParameter {
    prop: PropOptions;
    attr: object;
    event: EventOptions;
}
export default function component({ prop, attr, event }: MainBodyParameter, parent: PlotCommon | undefined | unknown): PlotCommon;
export {};
//# sourceMappingURL=index.d.ts.map