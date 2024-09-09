export declare enum CompStatus {
    UNRUN = "UNRUN|WAITING|PASS",
    RUNNING = "RUNNING",
    FAIL = "FAIL|ERROR|CANCELED|TIMEOUT",
    SUCCESS = "SUCCESS|COMPLETE"
}
export default function runningStatus(status: string): "running" | "unrun" | "fail" | "success" | undefined;
//# sourceMappingURL=runningStatus.d.ts.map