import { PortInfo } from '.';
import { EventCallback, PlotCommon } from '../Plot';
interface PropOptions {
    name: string;
    width: number;
    height: number;
    txWidth: number;
    status: string;
    disable: boolean;
    stage: string;
    choose: boolean;
    relativeChoose: boolean;
    input: PortInfo[];
    output: PortInfo[];
}
interface EventOptions {
    overPort: EventCallback;
    outPort: EventCallback;
    choose: EventCallback;
    unchoose: EventCallback;
    connect: EventCallback;
    overStage: EventCallback;
    outStage: EventCallback;
    relative: EventCallback;
    unrelative: EventCallback;
}
interface MainBodyParameter {
    prop: PropOptions;
    attr: object;
    event: EventOptions;
}
export default function mainBody({ prop, attr, event }: MainBodyParameter): {
    id: string;
    tag: string;
    prop: PropOptions;
    attr: {
        class: string;
        overflow: string;
    } & object;
    event: {
        status: (eve: any, tag: PlotCommon) => void;
        click: (eve: any, tag: PlotCommon) => void;
        unchoose: (eve: any, tag: PlotCommon) => void;
        relative: (eve: any, tag: PlotCommon) => void;
        unrelative: (eve: any, tag: PlotCommon) => void;
    };
    children: object[];
};
export {};
//# sourceMappingURL=mainBody.d.ts.map