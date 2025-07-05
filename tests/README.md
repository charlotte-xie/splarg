# Tests

This directory contains all test files for the Splarg game project.

## Structure

- `Player.test.ts` - Tests for the Player class functionality including wear/remove behavior, inventory management, and outfit system

## Running Tests

### Quick Commands

```bash
# Run tests once
pnpm test

# Run tests in watch mode (auto-runs on file changes)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run tests with coverage in watch mode
pnpm test:watch:coverage
```

### Auto-Running in Cursor/VS Code

The project is configured for automatic test running in Cursor/VS Code:

1. **Install Jest Extension**: Install the "Jest" extension by Orta
2. **Auto-Run**: Tests will automatically run when you save test files
3. **Inline Results**: Pass/fail indicators appear next to test code
4. **Coverage**: Coverage information is shown inline

### Configuration

- **Jest Config**: `jest.config.js` (main config for fast auto-runs)
- **Coverage Config**: `jest.coverage.config.js` (config with coverage enabled)
- **VS Code Settings**: `.vscode/settings.json` (auto-run configuration)

## Test Coverage

Current coverage: ~69% overall
- **Player.ts**: 74% statements, 61% branches, 62% functions
- **Item.ts**: 60% statements, 57% branches, 50% functions

## Adding New Tests

1. Create new test files in the `tests/` directory
2. Use the `.test.ts` extension
3. Import classes from `../classes/`
4. Follow the existing test patterns using Jest and TypeScript

## Test Patterns

- Use `describe()` blocks to group related tests
- Use `test()` or `it()` for individual test cases
- Use `beforeEach()` for setup
- Use `expect()` for assertions
- Test both success and failure cases
- Test edge cases and error conditions 