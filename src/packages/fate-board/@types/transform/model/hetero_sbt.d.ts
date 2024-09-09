export default function Hetero_sbt(modelData: object, role: string, partyId: string, component: string, comp_type: string, id: string): {
    id: string;
    tag: string;
    prop: {
        class: string;
    };
    children: ({
        id: string;
        tag: import("vue").DefineComponent<object, object, any>;
        prop: {
            title: string;
            data: {
                gain: {
                    header: ({
                        label: string;
                        prop: string;
                        width: string;
                        type?: undefined;
                    } | {
                        type: string;
                        label: string;
                        prop: string;
                        width?: undefined;
                    })[];
                    data: any;
                };
                split: {
                    header: ({
                        label: string;
                        prop: string;
                        width: string;
                        type?: undefined;
                    } | {
                        type: string;
                        label: string;
                        prop: string;
                        width?: undefined;
                    })[];
                    data: any;
                };
            };
        };
    } | {
        id: string;
        tag: import("vue").DefineComponent<object, object, any>;
        prop: {
            options: any;
        };
    })[];
};
//# sourceMappingURL=hetero_sbt.d.ts.map