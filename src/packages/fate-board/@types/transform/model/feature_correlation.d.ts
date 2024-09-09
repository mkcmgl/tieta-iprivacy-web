export default function feature_correlation(modelData: object, role: string, partyId: string, component: string, comp_type: string, id: string): {
    id: string;
    tag: string;
    prop: {
        class: string;
    };
    children: {
        id: string;
        tag: import("vue").DefineComponent<object, object, any>;
        prop: {
            header: any;
            data: any[];
            localCorr: string[];
            remoteCorr: string[];
            localData: any;
            remoteData: any;
        };
    }[];
};
//# sourceMappingURL=feature_correlation.d.ts.map