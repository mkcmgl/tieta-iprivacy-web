declare const header: (edit: any, cancel: any, retry: any) => ({
    type: string;
    prop: string;
    label: string;
    width: number;
    showOverflowTooltip: boolean;
    onClick: ({ row }: any) => void;
    sortable?: undefined;
    minWidth?: undefined;
    onEdit?: undefined;
    fixed?: undefined;
    operations?: undefined;
} | {
    prop: string;
    label: string;
    width: number;
    showOverflowTooltip: boolean;
    type?: undefined;
    onClick?: undefined;
    sortable?: undefined;
    minWidth?: undefined;
    onEdit?: undefined;
    fixed?: undefined;
    operations?: undefined;
} | {
    prop: string;
    label: string;
    width: number;
    sortable: string;
    showOverflowTooltip: boolean;
    type?: undefined;
    onClick?: undefined;
    minWidth?: undefined;
    onEdit?: undefined;
    fixed?: undefined;
    operations?: undefined;
} | {
    type: string;
    prop: string;
    label: string;
    width: number;
    showOverflowTooltip: boolean;
    onClick?: undefined;
    sortable?: undefined;
    minWidth?: undefined;
    onEdit?: undefined;
    fixed?: undefined;
    operations?: undefined;
} | {
    type: string;
    prop: string;
    label: string;
    minWidth: number;
    onEdit: (content: string, scope: any) => void;
    width?: undefined;
    showOverflowTooltip?: undefined;
    onClick?: undefined;
    sortable?: undefined;
    fixed?: undefined;
    operations?: undefined;
} | {
    type: string;
    prop: string;
    label: string;
    width: number;
    fixed: string;
    operations: (scope: any) => {
        label: string;
        onClick: ({ row }: any) => void;
    }[] | undefined;
    showOverflowTooltip?: undefined;
    onClick?: undefined;
    sortable?: undefined;
    minWidth?: undefined;
    onEdit?: undefined;
})[];
export default header;
//# sourceMappingURL=ColHeader.d.ts.map