export default function hetero_feature_binning(modelData: object, role: string, partyId: string, component: string, comp_type: string, id: string): {
    id: string;
    tag: string;
    prop: {
        class: string;
    };
    children: {
        id: string;
        tag: import("vue").DefineComponent<object, object, any>;
        prop: {
            header: any[];
            data: any;
            class: string;
        };
    }[];
};
//# sourceMappingURL=hetero_feature_binning.d.ts.map