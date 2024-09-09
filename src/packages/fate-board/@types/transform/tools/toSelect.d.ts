export default function toSelect(id: string, options: any, ext?: object): {
    id: string;
    tag: any;
    prop: {
        options: any;
        name: string;
        class: string;
        modelValue: any;
        labelClassName: string;
    } & object;
    event: {
        change(value: any, ast: any): void;
    };
};
//# sourceMappingURL=toSelect.d.ts.map