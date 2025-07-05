module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'classes/**/*.ts',
    '!classes/**/*.test.ts',
    '!classes/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: [],
  verbose: true,
  clearMocks: true,
  collectCoverage: true, // Enable coverage for coverage runs
  watchPathIgnorePatterns: [
    'node_modules',
    'coverage',
    '.next',
    'out'
  ],
  testTimeout: 5000,
  maxWorkers: 1,
}; 