import { EventCallback, PlotCommon } from '../Plot';
import PortPlot from './PortPlot';
interface PropOptions {
    name: string;
    type: string;
    direction: string;
    tooltip: string;
    multiply: boolean;
    status: string;
    disable: boolean;
    width: number;
    height: number;
    cursor: number;
    total: number;
}
interface EventOptions {
    overPort: EventCallback;
    connect: EventCallback;
    outPort: EventCallback;
}
interface PortParameter {
    prop: PropOptions;
    attr: object;
    event: EventOptions;
}
export default function portSVG({ prop, attr, event }: PortParameter): {
    id: string;
    creator: (options: any) => PortPlot<object, object, object, object>;
    tag: string;
    prop: PropOptions;
    attr: {
        class: string;
        x: (d: PropOptions) => number;
        y: (d: PropOptions) => any;
    } & object;
    event: {
        mouseover: (eve: any, tag: PlotCommon) => void;
        mouseout: (eve: any, tag: PlotCommon) => void;
        click: (eve: any, plot: PlotCommon) => void;
    };
    children: ({
        id: string;
        tag: string;
        prop: PropOptions;
        attr: {
            class: string;
            fill: (d: PropOptions) => any;
        } & {
            width: number;
            height: number;
            rx: number;
        };
        children?: undefined;
    } | {
        id: string;
        tag: string;
        prop: PropOptions;
        attr: {
            class: string;
            display: (d: PropOptions) => "normal" | "none";
        };
        children: any[];
    })[];
};
export {};
//# sourceMappingURL=portSvg.d.ts.map