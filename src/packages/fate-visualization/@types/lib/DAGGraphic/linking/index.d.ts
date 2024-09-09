import { EventCallback, PlotCommon } from '../Plot';
interface PropOptions {
    name?: string;
    from: number[];
    end: number[];
    choose: boolean;
    relativeChoose: boolean;
}
interface EventOptions {
    chooseLink: EventCallback;
    unchooseLink: EventCallback;
    delete: EventCallback;
    relative: EventCallback;
    unrelative: EventCallback;
}
interface LinkingParameter {
    prop: PropOptions;
    attr: object;
    event: EventOptions;
}
export default function linking({ prop, attr, event }: LinkingParameter, parent: PlotCommon | undefined | unknown): PlotCommon;
export {};
//# sourceMappingURL=index.d.ts.map