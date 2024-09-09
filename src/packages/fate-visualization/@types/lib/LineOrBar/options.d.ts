type Val = string | number;
interface AxisOptions {
    name?: string;
    data?: Val[];
    min?: number;
    max?: number;
}
interface Series {
    type: string;
    data: Val[];
    label: unknown;
    xAxisIndex?: number;
    yAxisIndex?: number;
}
interface OptionsParameter {
    xAxis?: AxisOptions | AxisOptions[];
    yAxis?: AxisOptions | AxisOptions[];
    series: Series | Series[];
    zoomType?: string;
    legendCustomer?: boolean;
    color?: string[];
    tooltip: object;
}
export default function options({ tooltip, xAxis, yAxis, series, zoomType, legendCustomer, color, }: OptionsParameter): any;
export {};
//# sourceMappingURL=options.d.ts.map