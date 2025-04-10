export default {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
        '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
        '^@/services/api$': '<rootDir>/__mocks__/api.js',
        '^../services/api$': '<rootDir>/__mocks__/api.js',
        '^../src/services/api$': '<rootDir>/__mocks__/api.js',
        '^src/services/api$': '<rootDir>/__mocks__/api.js',
        '^services/api$': '<rootDir>/__mocks__/api.js',
      }
      ,
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Corrigiremos isso abaixo
  };
  