declare const _default: {
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
export default _default;
//# sourceMappingURL=auth.d.ts.map