export default function Loss(data: Array<any> | Array<any>[]): {
    id: string;
    tag: import("vue").DefineComponent<object, object, any>;
    prop: {
        title: string;
        data: {
            xAxis: {
                type: string;
                name: string;
                minInterval: number;
            };
            yAxis: {
                type: string;
                name: string;
            };
            series: {
                type: string;
                name: string;
                data: any[];
            }[];
            tooltip: {
                formatter: (parameters: any) => string;
            };
        };
        legend: number;
    };
};
//# sourceMappingURL=loss.d.ts.map