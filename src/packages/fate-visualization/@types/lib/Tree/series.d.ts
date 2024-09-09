export default function TreeSeries(data: any): {
    series: {
        type: string;
        data: any[];
        initialTreeDepth: number;
        roam: boolean;
        left: string;
        right: string;
        top: string;
        bottom: string;
        symbol: string;
        symbolSize: number[];
        layout: string;
        orient: string;
        lineStyle: {
            color: string;
            width: number;
        };
        itemStyle: {
            normal: {
                color: string;
                borderColor: string;
            };
        };
        expandAndCollapse: boolean;
        label: {
            position: string;
            color: string;
            distance: number;
            rotate: number;
            verticalAlign: string;
            borderRadius: number;
            align: string;
            fontSize: number;
            borderWidth: number;
            padding: number[];
            width: number;
            height: number;
            lineHeight: number;
            rich: {};
        };
        leaves: {
            label: {
                position: string;
                color: string;
                distance: number;
                rotate: number;
                verticalAlign: string;
                borderRadius: number;
                fontSize: number;
                align: string;
                borderWidth: number;
                width: number;
                height: number;
                lineHeight: number;
                rich: {};
            };
        };
    };
} & {
    animationDuration: number;
    animationDurationUpdate: number;
};
//# sourceMappingURL=series.d.ts.map