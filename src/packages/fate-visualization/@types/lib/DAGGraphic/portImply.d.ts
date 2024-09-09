export type PortInfo = {
    name: string;
    tooltip: string;
    type: string;
    mult?: boolean;
};
/**
 * 解析组件类型
 * @param compType 组件类型
 * @returns 返回端口信息配置
 */
export default function explainPort(compType: string): {
    dataInput: PortInfo[];
    dataOutpu: PortInfo[];
    modelInput: PortInfo[];
    modelOutput: PortInfo[];
    input: PortInfo[];
    output: PortInfo[];
};
//# sourceMappingURL=portImply.d.ts.map