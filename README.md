# Splarg

A steampunk-themed game built with Next.js, React, and TypeScript.

## Features

- **Inventory System**: Manage items with stacking and wear locations
- **Outfit System**: Save and wear complete outfits
- **Multi-layer Clothing**: Support for inner/outer layers and multiple body locations
- **Player Stats**: Health, experience, leveling system

## Development

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode (auto-runs on file changes)
pnpm test:watch
```

### Testing

The project uses Jest for testing with auto-running capabilities in Cursor/VS Code:

- **Test Directory**: `tests/` - All test files are organized here
- **Auto-Run**: Tests automatically run when you save files (with Jest extension)
- **Coverage**: Run `pnpm test:coverage` for detailed coverage reports
- **Watch Mode**: Run `pnpm test:watch` for continuous testing

#### Test Commands

```bash
pnpm test              # Run tests once
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage
pnpm test:watch:coverage # Run tests with coverage in watch mode
```

#### Cursor/VS Code Setup

1. Install the "Jest" extension by Orta
2. Tests will automatically run when you save files
3. Inline pass/fail indicators appear next to test code
4. Coverage information is shown inline

## Project Structure

```
splarg/
├── classes/           # Game logic classes
│   ├── Player.ts     # Player class with inventory/outfit system
│   ├── Item.ts       # Item system with wear locations
│   └── ...
├── components/        # React components
├── tests/            # Test files
│   ├── Player.test.ts # Player class tests
│   └── README.md     # Test documentation
├── jest.config.js    # Jest configuration
├── jest.coverage.config.js # Jest config for coverage
└── .vscode/          # VS Code/Cursor settings
    └── settings.json # Auto-run configuration
```

## Game Classes

### Player
- Inventory management with stacking
- Wear/remove items with multi-location support
- Outfit saving and wearing
- Stats and leveling system

### Item
- Wear location system (inner/outer layers)
- Multi-body part support
- Stackable and non-stackable items
- Item types with properties

## Contributing

1. Write tests for new features
2. Follow the existing test patterns
3. Ensure all tests pass before submitting
4. Use the auto-running test setup for development

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd splarg
```

2. Install dependencies:
```bash
pnpm install
```

## Development

Start the Next.js development server:
```bash
pnpm dev
```

Build and export the static site:
```bash
pnpm build
pnpm export
```

## Deploy to GitHub Pages

1. Make sure your changes are committed and pushed to GitHub.
2. Deploy with:
```bash
pnpm deploy
```
This will build, export, and publish the `out/` directory to the `gh-pages` branch.

## Scripts

- `pnpm start` - Start the application
- `pnpm dev` - Start the development server
- `pnpm test` - Run tests

## Project Structure

```
splarg/
├── package.json
├── pnpm-workspace.yaml
├── README.md
└── .gitignore
```

## License

ISC 