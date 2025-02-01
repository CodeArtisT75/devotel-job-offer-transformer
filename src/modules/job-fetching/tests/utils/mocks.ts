export const getMockApi1ProviderService = () => ({
  fetchJobs: jest.fn(),
  transformJobs: jest.fn(),
  getProviderName: jest.fn(),
});

export const getMockApi2ProviderService = () => ({
  fetchJobs: jest.fn(),
  transformJobs: jest.fn(),
  getProviderName: jest.fn(),
});

export const getMockJobFetchingService = () => ({
  fetchAndStoreJobs: jest.fn(),
});

export const getMockLoggerService = () => ({
  info: jest.fn(),
  error: jest.fn(),
});

export const getMockJobOffersService = () => ({
  createIfJobIdNotExists: jest.fn(),
});

export const getMockJobFetchBatchRepository = () => ({
  create: jest.fn(),
  update: jest.fn(),
});

export const getMockFailedImportedJobRepository = () => ({
  create: jest.fn(),
});

export const getMockSchedulerRegistry = () => ({
  addCronJob: jest.fn(),
});
