export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg|css|less|scss)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
