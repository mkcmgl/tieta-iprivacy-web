declare const _default: {
    auth: {
        state: {
            username: string;
        };
        mutations: {
            SET_USERNAME: (state: any, username: string) => void;
            SET_AUTH: (state: any, authOption?: any) => void;
        };
        actions: {
            signIn({ commit, dispatch }: any, ingridient: {
                username: string;
                password: string;
            }): Promise<any>;
            signOut({ commit }: any): Promise<any>;
            signInForMultPage({ commit, dispatch }: any): Promise<boolean>;
        };
    };
    assets: {
        state: {
            status: undefined;
            role: undefined;
            ports: {};
        };
        mutations: {
            SET_STATUS(state: any, status: string[]): void;
            SET_ROLE(state: any, role: string[]): void;
            SET_PORT(state: any, port: object): void;
            GET_PORT(state: any, name: string): any;
        };
        actions: {
            GET_JOB_FIELDS({ commit, state }: any): Promise<void>;
            portConfig({ commit }: any, name: string): Promise<any>;
        };
    };
    job: {
        state: {
            jobId: string;
            role: string;
            partyId: string;
            pageSize: number;
            currentPage: number;
            details: {};
            dataset: {};
            dag: {};
            _ws_: undefined;
            _rerun_: boolean;
            _blank_: boolean;
        };
        mutations: {
            SET_JOBID(state: any, jobId: string): void;
            SET_JOB_ROLE(state: any, role: string): void;
            SET_PARTYID(state: any, partyId: string): void;
            SET_PAGESIZE(state: any, pageSize: number): void;
            SET_CURRENTPAGE(state: any, currentPage: number): void;
            SET_DAG(state: any, dag: object): void;
            SET_DETAILS(state: any, details: object): void;
            SET_DATASET(state: any, dataset: object): void;
            SET_WS(state: any, ws: any): void;
        };
        actions: {
            JOB_INFORMATION({ state, commit }: any): Promise<boolean>;
            retryJob({ state }: any, info: any): Promise<any>;
            killJob({ state }: any, info: any): Promise<any>;
            SET_BASIC({ state, commit, dispatch }: any, INFO: any): void;
            GET_JOBID({ state }: any): any;
            GET_JOB_ROLE({ state }: any): any;
            GET_PARTYID({ state }: any): any;
        };
    };
    crumb: {
        state: {
            crumbs: never[];
            record: undefined;
        };
        mutations: {
            PUSH_CRUMB(state: any, crumb: import("./crumb").RouterRecord): void;
            POP_CRUMB(state: any, stop?: string): any;
            POP_TO_ONE(state: any): any;
            SET_RECORD(state: any, route?: any): void;
        };
        actions: {
            toSignIn(): void;
            toRunning(): void;
            toHistory(): void;
            toDetail({ commit, dispatch }: any, information: any): Promise<void>;
            toDashboard({ commit, dispatch }: any, information: any): Promise<void>;
            setRouteRecord({ state, commit }: any, route: any): void;
            toRecord({ state, commit, dispatch }: any): void;
        };
    };
    comp: {
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
};
export default _default;
//# sourceMappingURL=index.d.ts.map