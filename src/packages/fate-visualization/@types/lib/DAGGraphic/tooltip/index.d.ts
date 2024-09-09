import { EventCallback, PlotCommon } from '../Plot';
interface PropOptions {
    content: string;
    x: number;
    y: number;
    max: number;
    width: number;
    height: number;
    offset: number;
    direction?: string;
    title?: string;
}
interface EventOptions {
    tooltipOver: EventCallback;
}
interface TooltipParameter {
    prop: PropOptions;
    attr?: object;
    event?: EventOptions;
}
export default function tooltip({ prop, event }: TooltipParameter, parent: any): PlotCommon;
export {};
//# sourceMappingURL=index.d.ts.map