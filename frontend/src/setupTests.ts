const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  key: jest.fn(),
  length: 0,
};

global.localStorage = localStorageMock as any;

process.env.REACT_APP_BACK_HOST = 'http://localhost';
