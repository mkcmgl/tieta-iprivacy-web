import { EventCallback, PlotCommon } from './Plot';
interface DataOptions {
    width?: number;
    height?: number;
    data?: object;
}
interface EventOptions {
    choose: EventCallback;
    retry: EventCallback;
}
interface DAGParameter {
    data: DataOptions;
    event: EventOptions;
}
export default class DAG {
    protected component: Map<string, PlotCommon>;
    protected linking: Map<string, PlotCommon>;
    protected tooltip?: PlotCommon;
    protected container: any;
    protected mark: any;
    protected resizeObserve: any;
    protected zoomInstance: any;
    protected zoomRelative: any;
    protected connection: any;
    containerWidth: number;
    containerHeight: number;
    containerTransition: any;
    zoomMin: number;
    zoomMax: number;
    event: EventOptions;
    parent: any;
    constructor({ data, event }: DAGParameter, parent: any);
    protected $parent(): void;
    protected $container(): void;
    protected $zoom(): void;
    zoomIn(times?: number): void;
    zoomOut(times?: number): void;
    fullScreen(): void;
    protected $init(data: any): void;
    protected unChoose(except?: PlotCommon): void;
    chooseWhole(): void;
    addComponent(prop: any): void;
    removeComponent(name: string): any;
    protected getConnection(prop: any): any;
    addLinking(prop: any): undefined;
    removeLinking(name: string): any;
    addTooltip(options: any): void;
    removeTooltip(): void;
    setStatus(name: string, status: string, duration: number): void;
    release(): void;
}
export {};
//# sourceMappingURL=DAGContainer.d.ts.map