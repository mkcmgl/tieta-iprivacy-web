import { PlotCommon } from '../Plot';
interface PropOptions {
    height: number;
    lock: boolean;
}
interface PrefixParameter {
    prop: PropOptions;
    attr: object;
}
export default function prefix({ prop, attr }: PrefixParameter): {
    id: string;
    tag: string;
    prop: PropOptions;
    attr: {
        height: (d: PropOptions) => number;
        opacity: number;
        overflow: string;
    } & object & {
        width: number;
        height: number;
    };
    event: {
        lock: (event: any, tag: PlotCommon) => void;
    };
    children: {
        id: string;
        tag: any;
        prop: PropOptions;
        attr: {
            display: (d: PropOptions) => "normal" | "none";
            y: (d: PropOptions) => number;
        };
    }[];
};
export {};
//# sourceMappingURL=prefix.d.ts.map