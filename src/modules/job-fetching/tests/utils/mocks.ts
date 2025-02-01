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

export const getMockLoggerService = () => ({
  info: jest.fn(),
  error: jest.fn(),
});

export const getMockJobOffersService = () => ({
  createIfJobIdNotExists: jest.fn(),
});
