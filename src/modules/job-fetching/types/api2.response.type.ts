export type Api2ResponseType = {
  status: string;
  data: {
    jobsList: {
      [jobId: string]: {
        position: string;
        location: {
          city: string;
          state: string;
          remote: boolean;
        };
        compensation: {
          min: number;
          max: number;
          currency: string;
        };
        employer: {
          companyName: string;
          website: string;
        };
        requirements: {
          experience: number;
          technologies: string[];
        };
        datePosted: string;
      };
    };
  };
};
