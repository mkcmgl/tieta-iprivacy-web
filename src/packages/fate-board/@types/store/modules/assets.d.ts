declare const _default: {
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
export default _default;
//# sourceMappingURL=assets.d.ts.map