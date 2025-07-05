module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/tests/**/*.test.ts', '**/*.test.ts'],
  testPathIgnorePatterns: [
    'node_modules',
    'coverage',
    '.next',
    'out'
  ],
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
  collectCoverage: false,
  watchPathIgnorePatterns: [
    'node_modules',
    'coverage',
    '.next',
    'out'
  ],
  testTimeout: 5000,
  maxWorkers: 1,
}; 