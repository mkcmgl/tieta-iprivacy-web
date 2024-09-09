export interface RouterRecord {
    name: string;
    path: string;
    [key: string]: keyof any;
}
declare const _default: {
    state: {
        crumbs: never[];
        record: undefined;
    };
    mutations: {
        PUSH_CRUMB(state: any, crumb: RouterRecord): void;
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
export default _default;
//# sourceMappingURL=crumb.d.ts.map