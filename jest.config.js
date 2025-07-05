module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/classes'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'classes/**/*.ts',
    '!classes/**/*.test.ts',
    '!classes/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: [],
}; 