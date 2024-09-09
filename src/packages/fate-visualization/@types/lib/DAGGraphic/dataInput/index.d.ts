import { EventCallback, PlotCommon } from '../Plot';
interface PropOptions {
    name: string;
    type: string;
    relativeChoose: boolean;
    x: number;
    y: number;
    tooltip: string;
}
interface EventOptions {
    overInput: EventCallback;
    outInput: EventCallback;
    connect: EventCallback;
    relative: EventCallback;
    unrelative: EventCallback;
}
interface StartInputParameter {
    prop: PropOptions;
    attr: object;
    event: EventOptions;
}
export default function startInput({ prop, attr, event }: StartInputParameter, parent: PlotCommon | undefined | unknown): PlotCommon;
export {};
//# sourceMappingURL=index.d.ts.map