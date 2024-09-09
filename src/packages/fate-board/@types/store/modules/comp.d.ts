declare const _default: {
    state: {
        information: {};
        parameters: {};
        model: {};
        metrics: {};
        hasLoaded: {};
    };
    mutations: {
        SET_INFORMATION(state: any, information: any): void;
        SET_PARAMETER(state: any, parameters: any): void;
        SET_MODEL(state: any, model: any): void;
        SET_METRIC(state: any, metrics: any): void;
        SET_HASLOADED(state: any, param: any): void;
    };
    actions: {
        chooseComp({ state, commit, dispatch }: any, comp?: any): Promise<boolean>;
        parameterRequest({ state, commit, dispatch }: any): Promise<any>;
        modelRequest({ state, commit, dispatch }: any): Promise<{} | undefined>;
        metricRequest({ state, commit, dispatch }: any): Promise<{} | undefined>;
        modelRefresh({ state }: any): void;
        setLoader({ state, commit }: any, instance: any): void;
        getLoaded({ state }: any): any;
        clearLoaded({ state }: any): void;
        dataOutput({ state, dispatch }: any): Promise<any>;
        getComponentName({ state }: any): any;
    };
};
export default _default;
//# sourceMappingURL=comp.d.ts.map