declare const _default: {
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
export default _default;
//# sourceMappingURL=job.d.ts.map