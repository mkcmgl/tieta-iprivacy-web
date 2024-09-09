declare const _default: {
    getRunningJobs: {
        url: string;
        method: string;
    };
    /**
     * job_id: string
     */
    killJob: {
        url: string;
        method: string;
    };
    /**
     * job_id: string
     */
    retryJob: {
        url: string;
        method: string;
    };
    queryJobsTotal: {
        url: string;
        method: string;
    };
    /**
     * pageNum,
     * pageSize,
     * // limitation: {
     *  jobId
     *  partyId
     *  fDescription
     *  partner
     *  note
     *  role
     * },
     * // sortPara (后续扩展)
     */
    queryJobs: {
        url: string;
        method: string;
    };
    jobDownload: {
        url: string;
        method: string;
        responseType: string;
    };
    getComponentPara: {
        url: string;
        method: string;
    };
    /**
     * parameter: {
     *  job_id: string,
     *  role: role,
     *  party_id: partyId,
     *  notes: notes
     * }
     */
    noteUpdate: {
        url: string;
        method: string;
    };
};
export default _default;
//# sourceMappingURL=job.d.ts.map