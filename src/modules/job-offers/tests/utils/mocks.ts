export const getMockJobOfferRepository = (mockedJobOffer: any) => ({
  create: jest.fn().mockResolvedValue(mockedJobOffer),

  paginate: jest.fn().mockResolvedValue({
    rows: [mockedJobOffer],
    total: 1,
    currentPage: 1,
    perPage: 10,
  }),

  findByPkOrFail: jest.fn().mockResolvedValue(mockedJobOffer),

  update: jest.fn().mockResolvedValue(mockedJobOffer),

  delete: jest.fn().mockResolvedValue(mockedJobOffer),
});

export const getMockJobOffersService = (mockedJobOffer: any) => ({
  create: jest.fn().mockResolvedValue(mockedJobOffer),

  paginateJobOffers: jest.fn().mockResolvedValue({
    jobOffers: [mockedJobOffer],
    total: 1,
    currentPage: 1,
    perPage: 10,
  }),

  findOne: jest.fn().mockResolvedValue(mockedJobOffer),

  update: jest.fn().mockResolvedValue(mockedJobOffer),

  remove: jest.fn().mockResolvedValue(null),
});
