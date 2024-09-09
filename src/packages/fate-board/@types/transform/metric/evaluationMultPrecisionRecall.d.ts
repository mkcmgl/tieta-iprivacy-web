export default function ExpPR(role: string, partyId: string, component: string, comp_type: string, id: string): {
    lineChart: (namespace?: string) => any;
    lineExplain: ({ p: precision, r: recall, cuts, threshold }: any, namespace: string, component: string) => void;
};
//# sourceMappingURL=evaluationMultPrecisionRecall.d.ts.map