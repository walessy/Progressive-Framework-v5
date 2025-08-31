// tests/setup.js
// Jest setup file for integration tests

// Global test timeout
jest.setTimeout(30000);

// Setup before all tests
beforeAll(() => {
  console.log('Setting up integration tests...');
});

// Cleanup after all tests  
afterAll(() => {
  console.log('Cleaning up integration tests...');
});

// Mock console methods if needed
// global.console = {
//   log: jest.fn(),
//   error: jest.fn(),
//   warn: jest.fn(),
// };
