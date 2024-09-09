export default function gaugeSeries(): {
    series: {
        type: string;
        center: string[];
        startAngle: number;
        endAngle: number;
        min: number;
        max: number;
        radius: string;
        splitNumber: number;
        itemStyle: {
            color: string;
        };
        progress: {
            show: boolean;
            width: number;
        };
        axisLine: {
            lineStyle: {
                width: number;
            };
        };
        axisTick: {
            distance: number;
            splitNumber: number;
            lineStyle: {
                width: number;
                color: string;
            };
        };
        splitLine: {
            distance: number;
            length: number;
            lineStyle: {
                width: number;
                color: string;
            };
        };
        axisLabel: {
            distance: number;
            color: string;
            fontSize: number;
        };
        pointer: {
            show: boolean;
        };
        anchor: {
            show: boolean;
        };
        title: {
            show: boolean;
        };
        detail: {
            valueAnimation: boolean;
            width: string;
            lineHeight: number;
            fontSize: number;
            offsetCenter: (string | number)[];
            fontWeight: string;
            formatter: string;
            color: string;
        };
    };
} & {
    animationDuration: number;
    animationDurationUpdate: number;
};
//# sourceMappingURL=series.d.ts.map