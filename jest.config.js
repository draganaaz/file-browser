module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // simulating css modules by returning empty object for react-quill
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
};
