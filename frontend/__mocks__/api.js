// __mocks__/api.js
const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
  create: () => mockAxios,
};

export default mockAxios;
