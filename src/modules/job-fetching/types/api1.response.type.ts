export type Api1ResponseType = {
  metadata: {
    requestId: string;
    timestamp: string;
  };
  jobs: Array<{
    jobId: string;
    title: string;
    details: {
      location: string;
      type: string;
      salaryRange: string;
    };
    company: {
      name: string;
      industry: string;
    };
    skills: string[];
    postedDate: string;
  }>;
};
